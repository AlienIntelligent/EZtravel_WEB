using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezTravel.DTO.Places;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using ezTravel.Services.Ranking;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ezTravel.Services.Activities;

public class ActivityService : IActivityService
{
    private readonly IUnitOfWork _uow;
    private readonly ISearchRankingService _rankingService;
    private readonly ILogger<ActivityService> _logger;

    public ActivityService(IUnitOfWork uow, ISearchRankingService rankingService, ILogger<ActivityService> logger)
    {
        _uow = uow;
        _rankingService = rankingService;
        _logger = logger;
    }

    public async Task<IEnumerable<ActivityDto>> SearchActivitiesAsync(ActivitySearchRequest request)
    {
        var query = _uow.DichVus.GetQueryable()
            .Include(a => a.MaDiaDiemNavigation)
            .Where(a => a.TrangThai != "DELETED" && a.LoaiDichVu == "HOAT_DONG");

        if (!string.IsNullOrEmpty(request.Keyword))
        {
            query = query.Where(a => a.TenDichVu.Contains(request.Keyword) ||
                                     (a.MoTa != null && a.MoTa.Contains(request.Keyword)));
        }

        if (request.MaDiaDiem.HasValue)
        {
            query = query.Where(a => a.MaDiaDiem == request.MaDiaDiem.Value);
        }

        if (request.GiaToiDa.HasValue)
        {
            query = query.Where(a => a.GiaTu <= request.GiaToiDa.Value);
        }

        if (request.MaNhaCungCap.HasValue)
        {
            query = query.Where(a => a.MaNhaCungCap == request.MaNhaCungCap.Value);
        }

        var list = await query.ToListAsync();

        var providerIds = list.Select(a => a.MaNhaCungCap).Distinct().ToList();
        var providerScores = await _rankingService.GetProviderPriorityScoresAsync(providerIds, applySearchBoost: true);
        var providers = await _uow.NhaCungCaps.GetQueryable()
            .Where(p => providerIds.Contains(p.MaNhaCungCap))
            .ToListAsync();

        var rankedList = list.Select(a =>
        {
            double reviewScore = (double)a.DanhGiaTrungBinh * 20.0;
            double popularityScore = Math.Min(100.0, (a.LuotXem * 0.1) + (a.TongDanhGia * 2.0));
            double relevanceScore = 100.0;
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                bool inName = a.TenDichVu.Contains(request.Keyword, StringComparison.OrdinalIgnoreCase);
                relevanceScore = inName ? 100.0 : 50.0;
            }

            providerScores.TryGetValue(a.MaNhaCungCap, out double packagePriorityScore);

            double finalScore = _rankingService.CalculateSearchScore(reviewScore, popularityScore, relevanceScore, packagePriorityScore);

            var provider = providers.FirstOrDefault(p => p.MaNhaCungCap == a.MaNhaCungCap);
            double coeff = packagePriorityScore / 50.0;
            if (coeff > 2.0) coeff = 2.0;

            // Debug logging (Requirement: ProviderId, PackageId, PackagePriority, FinalSearchScore)
            _logger.LogDebug("Ranking Diagnostic - ProviderId: {ProviderId}, PackageId: {PackageId}, PackagePriority: {PackagePriority}, FinalSearchScore: {FinalSearchScore}",
                a.MaNhaCungCap, provider?.MaGoiNccHienTai, coeff, finalScore);

            return new
            {
                Dto = new ActivityDto
                {
                    Id = a.MaDichVu,
                    MaDiaDiem = a.MaDiaDiem,
                    TenDiaDiem = a.MaDiaDiemNavigation?.TenDiaDiem,
                    TenHoatDong = a.TenDichVu,
                    MoTa = a.MoTa,
                    Gia = a.GiaTu,
                    ThoiLuong = "",
                    AnhDaiDien = a.Thumbnail,
                    RatingAvg = (double)a.DanhGiaTrungBinh,
                    TotalReviews = a.TongDanhGia
                },
                Score = finalScore
            };
        })
        .OrderByDescending(x => x.Score)
        .Skip((request.Page - 1) * request.PageSize)
        .Take(request.PageSize)
        .Select(x => x.Dto)
        .ToList();

        return rankedList;
    }

    public async Task<ActivityDetailDto?> GetActivityByIdAsync(int id, int? currentUserId = null)
    {
        var a = await _uow.DichVus.GetQueryable()
            .Include(x => x.MaDiaDiemNavigation)
            .FirstOrDefaultAsync(x => x.MaDichVu == id && x.TrangThai != "DELETED" && x.LoaiDichVu == "HOAT_DONG");

        if (a == null) return null;

        if (currentUserId.HasValue)
        {
            var provider = await _uow.NhaCungCaps.GetQueryable()
                .FirstOrDefaultAsync(ncc => ncc.MaNguoiDung == currentUserId.Value);

            if (provider != null && a.MaNhaCungCap != provider.MaNhaCungCap)
            {
                return null;
            }
        }

        return new ActivityDetailDto
        {
            Id = a.MaDichVu,
            MaDiaDiem = a.MaDiaDiem,
            TenDiaDiem = a.MaDiaDiemNavigation.TenDiaDiem,
            TenHoatDong = a.TenDichVu,
            MoTa = a.MoTa,
            Gia = a.GiaTu,
            ThoiLuong = "",
            AnhDaiDien = a.Thumbnail,
            RatingAvg = (double)a.DanhGiaTrungBinh,
            TotalReviews = a.TongDanhGia,
            NgayTao = a.NgayTao
        };
    }

    public async Task<ActivityDto> CreateActivityAsync(ActivityCreateRequest request, int? currentUserId = null)
    {
        int? providerId = null;
        if (currentUserId.HasValue)
        {
            var provider = await _uow.NhaCungCaps.GetQueryable()
                .FirstOrDefaultAsync(ncc => ncc.MaNguoiDung == currentUserId.Value);
            providerId = provider?.MaNhaCungCap;
        }

        var entity = new DichVu
        {
            MaDiaDiem = request.MaDiaDiem,
            TenDichVu = request.TenHoatDong,
            LoaiDichVu = "HOAT_DONG",
            Slug = Guid.NewGuid().ToString(),
            MoTa = request.MoTa,
            GiaTu = request.Gia,
            Thumbnail = request.AnhDaiDien,
            DanhGiaTrungBinh = 5.0m,
            TongDanhGia = 0,
            TrangThai = "ACTIVE",
            NgayTao = DateTime.UtcNow,
            MaNhaCungCap = providerId ?? 1
        };

        await _uow.DichVus.AddAsync(entity);
        await _uow.SaveChangesAsync();

        var diaDiem = await _uow.DiaDiems.GetByIdAsync(entity.MaDiaDiem);

        return new ActivityDto
        {
            Id = entity.MaDichVu,
            MaDiaDiem = entity.MaDiaDiem,
            TenDiaDiem = diaDiem?.TenDiaDiem,
            TenHoatDong = entity.TenDichVu,
            MoTa = entity.MoTa,
            Gia = entity.GiaTu,
            ThoiLuong = "",
            AnhDaiDien = entity.Thumbnail,
            RatingAvg = (double)entity.DanhGiaTrungBinh,
            TotalReviews = entity.TongDanhGia
        };
    }

    public async Task<ActivityDto?> UpdateActivityAsync(int id, ActivityUpdateRequest request, int? currentUserId = null)
    {
        var entity = await _uow.DichVus.GetQueryable()
            .FirstOrDefaultAsync(a => a.MaDichVu == id && a.TrangThai != "DELETED" && a.LoaiDichVu == "HOAT_DONG");

        if (entity == null) return null;

        if (currentUserId.HasValue)
        {
            var provider = await _uow.NhaCungCaps.GetQueryable()
                .FirstOrDefaultAsync(ncc => ncc.MaNguoiDung == currentUserId.Value);

            if (provider != null && entity.MaNhaCungCap != provider.MaNhaCungCap)
            {
                return null;
            }
        }

        entity.MaDiaDiem = request.MaDiaDiem;
        entity.TenDichVu = request.TenHoatDong;
        entity.MoTa = request.MoTa;
        entity.GiaTu = request.Gia;
        if (!string.IsNullOrEmpty(request.AnhDaiDien))
        {
            entity.Thumbnail = request.AnhDaiDien;
        }

        _uow.DichVus.Update(entity);
        await _uow.SaveChangesAsync();

        var diaDiem = await _uow.DiaDiems.GetByIdAsync(entity.MaDiaDiem);

        return new ActivityDto
        {
            Id = entity.MaDichVu,
            MaDiaDiem = entity.MaDiaDiem,
            TenDiaDiem = diaDiem?.TenDiaDiem,
            TenHoatDong = entity.TenDichVu,
            MoTa = entity.MoTa,
            Gia = entity.GiaTu,
            ThoiLuong = "",
            AnhDaiDien = entity.Thumbnail,
            RatingAvg = (double)entity.DanhGiaTrungBinh,
            TotalReviews = entity.TongDanhGia
        };
    }

    public async Task<bool> DeleteActivityAsync(int id, int? currentUserId = null)
    {
        var entity = await _uow.DichVus.GetByIdAsync(id);
        if (entity == null || entity.TrangThai == "DELETED" || entity.LoaiDichVu != "HOAT_DONG") return false;

        if (currentUserId.HasValue)
        {
            var provider = await _uow.NhaCungCaps.GetQueryable()
                .FirstOrDefaultAsync(ncc => ncc.MaNguoiDung == currentUserId.Value);

            if (provider != null && entity.MaNhaCungCap != provider.MaNhaCungCap)
            {
                return false;
            }
        }

        entity.TrangThai = "DELETED";
        _uow.DichVus.Update(entity);
        return await _uow.SaveChangesAsync() > 0;
    }
}
