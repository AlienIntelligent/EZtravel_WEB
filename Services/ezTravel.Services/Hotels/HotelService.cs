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

namespace ezTravel.Services.Hotels;

public class HotelService : IHotelService
{
    private readonly IUnitOfWork _uow;
    private readonly ISearchRankingService _rankingService;
    private readonly ILogger<HotelService> _logger;

    public HotelService(IUnitOfWork uow, ISearchRankingService rankingService, ILogger<HotelService> logger)
    {
        _uow = uow;
        _rankingService = rankingService;
        _logger = logger;
    }

    public async Task<IEnumerable<HotelDto>> SearchHotelsAsync(HotelSearchRequest request)
    {
        var query = _uow.DichVus.GetQueryable()
            .Include(h => h.MaDiaDiemNavigation)
            .Where(h => h.TrangThai != "DELETED" && h.LoaiDichVu == "KHACH_SAN");

        if (!string.IsNullOrEmpty(request.Keyword))
        {
            query = query.Where(h => h.TenDichVu.Contains(request.Keyword) ||
                                     (h.MoTa != null && h.MoTa.Contains(request.Keyword)) ||
                                     (h.DiaChi != null && h.DiaChi.Contains(request.Keyword)));
        }

        if (request.MaDiaDiem.HasValue)
        {
            query = query.Where(h => h.MaDiaDiem == request.MaDiaDiem.Value);
        }

        if (request.GiaToiDa.HasValue)
        {
            query = query.Where(h => h.GiaTu <= request.GiaToiDa.Value);
        }

        if (request.MaNhaCungCap.HasValue)
        {
            query = query.Where(h => h.MaNhaCungCap == request.MaNhaCungCap.Value);
        }

        var list = await query.ToListAsync();

        var providerIds = list.Select(h => h.MaNhaCungCap).Distinct().ToList();
        var providerScores = await _rankingService.GetProviderPriorityScoresAsync(providerIds, applySearchBoost: true);
        var providers = await _uow.NhaCungCaps.GetQueryable()
            .Where(p => providerIds.Contains(p.MaNhaCungCap))
            .ToListAsync();

        var rankedList = list.Select(h =>
        {
            double reviewScore = (double)h.DanhGiaTrungBinh * 20.0;
            double popularityScore = Math.Min(100.0, (h.LuotXem * 0.1) + (h.TongDanhGia * 2.0));
            double relevanceScore = 100.0;
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                bool inName = h.TenDichVu.Contains(request.Keyword, StringComparison.OrdinalIgnoreCase);
                relevanceScore = inName ? 100.0 : 50.0;
            }

            providerScores.TryGetValue(h.MaNhaCungCap, out double packagePriorityScore);

            double finalScore = _rankingService.CalculateSearchScore(reviewScore, popularityScore, relevanceScore, packagePriorityScore);

            var provider = providers.FirstOrDefault(p => p.MaNhaCungCap == h.MaNhaCungCap);
            double coeff = packagePriorityScore / 50.0; // reverse map to coefficient for logging
            if (coeff > 2.0) coeff = 2.0;

            // Debug logging (Requirement: ProviderId, PackageId, PackagePriority, FinalSearchScore)
            _logger.LogDebug("Ranking Diagnostic - ProviderId: {ProviderId}, PackageId: {PackageId}, PackagePriority: {PackagePriority}, FinalSearchScore: {FinalSearchScore}",
                h.MaNhaCungCap, provider?.MaGoiNccHienTai, coeff, finalScore);

            return new
            {
                Dto = new HotelDto
                {
                    Id = h.MaDichVu,
                    MaDiaDiem = h.MaDiaDiem,
                    TenDiaDiem = h.MaDiaDiemNavigation.TenDiaDiem,
                    TenKhachSan = h.TenDichVu,
                    Slug = h.Slug,
                    MoTa = h.MoTa,
                    DiaChi = h.DiaChi,
                    SoSao = null,
                    GiaTu = h.GiaTu,
                    GiaDen = h.GiaDen,
                    AnhDaiDien = h.Thumbnail,
                    RatingAvg = (double)h.DanhGiaTrungBinh,
                    TotalReviews = h.TongDanhGia
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

    public async Task<HotelDetailDto?> GetHotelByIdAsync(int id, int? currentUserId = null)
    {
        var h = await _uow.DichVus.GetQueryable()
            .Include(x => x.MaDiaDiemNavigation)
            .FirstOrDefaultAsync(x => x.MaDichVu == id && x.TrangThai != "DELETED" && x.LoaiDichVu == "KHACH_SAN");

        if (h == null) return null;

        if (currentUserId.HasValue)
        {
            var provider = await _uow.NhaCungCaps.GetQueryable()
                .FirstOrDefaultAsync(ncc => ncc.MaNguoiDung == currentUserId.Value);

            if (provider != null && h.MaNhaCungCap != provider.MaNhaCungCap)
            {
                return null;
            }
        }

        return new HotelDetailDto
        {
            Id = h.MaDichVu,
            MaDiaDiem = h.MaDiaDiem,
            TenDiaDiem = h.MaDiaDiemNavigation.TenDiaDiem,
            TenKhachSan = h.TenDichVu,
            Slug = h.Slug,
            MoTa = h.MoTa,
            DiaChi = h.DiaChi,
            SoSao = null,
            GiaTu = h.GiaTu,
            GiaDen = h.GiaDen,
            AnhDaiDien = h.Thumbnail,
            RatingAvg = (double)h.DanhGiaTrungBinh,
            TotalReviews = h.TongDanhGia,
            NgayTao = h.NgayTao
        };
    }

    public async Task<HotelDto> CreateHotelAsync(HotelCreateRequest request, int? currentUserId = null)
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
            TenDichVu = request.TenKhachSan,
            LoaiDichVu = "KHACH_SAN",
            Slug = Guid.NewGuid().ToString(),
            MoTa = request.MoTa,
            DiaChi = request.DiaChi,
            GiaTu = request.GiaTu,
            GiaDen = request.GiaDen,
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

        return new HotelDto
        {
            Id = entity.MaDichVu,
            MaDiaDiem = entity.MaDiaDiem,
            TenDiaDiem = diaDiem?.TenDiaDiem,
            TenKhachSan = entity.TenDichVu,
            Slug = entity.Slug,
            MoTa = entity.MoTa,
            DiaChi = entity.DiaChi,
            SoSao = null,
            GiaTu = entity.GiaTu,
            GiaDen = entity.GiaDen,
            AnhDaiDien = entity.Thumbnail,
            RatingAvg = (double)entity.DanhGiaTrungBinh,
            TotalReviews = entity.TongDanhGia
        };
    }

    public async Task<HotelDto?> UpdateHotelAsync(int id, HotelUpdateRequest request, int? currentUserId = null)
    {
        var entity = await _uow.DichVus.GetQueryable()
            .FirstOrDefaultAsync(h => h.MaDichVu == id && h.TrangThai != "DELETED" && h.LoaiDichVu == "KHACH_SAN");

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
        entity.TenDichVu = request.TenKhachSan;
        entity.MoTa = request.MoTa;
        entity.DiaChi = request.DiaChi;
        entity.GiaTu = request.GiaTu;
        entity.GiaDen = request.GiaDen;
        if (!string.IsNullOrEmpty(request.AnhDaiDien))
        {
            entity.Thumbnail = request.AnhDaiDien;
        }

        _uow.DichVus.Update(entity);
        await _uow.SaveChangesAsync();

        var diaDiem = await _uow.DiaDiems.GetByIdAsync(entity.MaDiaDiem);

        return new HotelDto
        {
            Id = entity.MaDichVu,
            MaDiaDiem = entity.MaDiaDiem,
            TenDiaDiem = diaDiem?.TenDiaDiem,
            TenKhachSan = entity.TenDichVu,
            Slug = entity.Slug,
            MoTa = entity.MoTa,
            DiaChi = entity.DiaChi,
            SoSao = null,
            GiaTu = entity.GiaTu,
            GiaDen = entity.GiaDen,
            AnhDaiDien = entity.Thumbnail,
            RatingAvg = (double)entity.DanhGiaTrungBinh,
            TotalReviews = entity.TongDanhGia
        };
    }

    public async Task<bool> DeleteHotelAsync(int id, int? currentUserId = null)
    {
        var entity = await _uow.DichVus.GetByIdAsync(id);
        if (entity == null || entity.TrangThai == "DELETED" || entity.LoaiDichVu != "KHACH_SAN") return false;

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
