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

namespace ezTravel.Services.Vehicles;

public class VehicleService : IVehicleService
{
    private readonly IUnitOfWork _uow;
    private readonly ISearchRankingService _rankingService;
    private readonly ILogger<VehicleService> _logger;

    public VehicleService(IUnitOfWork uow, ISearchRankingService rankingService, ILogger<VehicleService> logger)
    {
        _uow = uow;
        _rankingService = rankingService;
        _logger = logger;
    }

    public async Task<IEnumerable<VehicleDto>> SearchVehiclesAsync(VehicleSearchRequest request)
    {
        var query = _uow.DichVus.GetQueryable()
            .Include(v => v.MaDiaDiemNavigation)
            .Where(v => v.TrangThai != "DELETED" && v.LoaiDichVu == "PHUONG_TIEN");

        if (!string.IsNullOrEmpty(request.Keyword))
        {
            query = query.Where(v => v.TenDichVu.Contains(request.Keyword) ||
                                     (v.MoTa != null && v.MoTa.Contains(request.Keyword)));
        }

        if (request.MaDiaDiem.HasValue)
        {
            query = query.Where(v => v.MaDiaDiem == request.MaDiaDiem.Value);
        }

        if (request.MaNhaCungCap.HasValue)
        {
            query = query.Where(v => v.MaNhaCungCap == request.MaNhaCungCap.Value);
        }

        var list = await query.ToListAsync();

        var providerIds = list.Select(v => v.MaNhaCungCap).Distinct().ToList();
        var providerScores = await _rankingService.GetProviderPriorityScoresAsync(providerIds, applySearchBoost: true);
        var providers = await _uow.NhaCungCaps.GetQueryable()
            .Where(p => providerIds.Contains(p.MaNhaCungCap))
            .ToListAsync();

        var rankedList = list.Select(v =>
        {
            double reviewScore = (double)v.DanhGiaTrungBinh * 20.0;
            double popularityScore = Math.Min(100.0, (v.LuotXem * 0.1) + (v.TongDanhGia * 2.0));
            double relevanceScore = 100.0;
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                bool inName = v.TenDichVu.Contains(request.Keyword, StringComparison.OrdinalIgnoreCase);
                relevanceScore = inName ? 100.0 : 50.0;
            }

            providerScores.TryGetValue(v.MaNhaCungCap, out double packagePriorityScore);

            double finalScore = _rankingService.CalculateSearchScore(reviewScore, popularityScore, relevanceScore, packagePriorityScore);

            var provider = providers.FirstOrDefault(p => p.MaNhaCungCap == v.MaNhaCungCap);
            double coeff = packagePriorityScore / 50.0;
            if (coeff > 2.0) coeff = 2.0;

            // Debug logging (Requirement: ProviderId, PackageId, PackagePriority, FinalSearchScore)
            _logger.LogDebug("Ranking Diagnostic - ProviderId: {ProviderId}, PackageId: {PackageId}, PackagePriority: {PackagePriority}, FinalSearchScore: {FinalSearchScore}",
                v.MaNhaCungCap, provider?.MaGoiNccHienTai, coeff, finalScore);

            return new
            {
                Dto = new VehicleDto
                {
                    Id = v.MaDichVu,
                    MaDiaDiem = v.MaDiaDiem,
                    TenDiaDiem = v.MaDiaDiemNavigation?.TenDiaDiem,
                    TenPhuongTien = v.TenDichVu,
                    Slug = v.Slug,
                    LoaiPhuongTien = "",
                    MoTa = v.MoTa,
                    HangXe = null,
                    SoChoNgoi = null,
                    DiemKhoiHanh = null,
                    DiemDen = null,
                    GiaTrungBinh = v.GiaTu,
                    AnhDaiDien = v.Thumbnail,
                    RatingAvg = (double)v.DanhGiaTrungBinh,
                    TotalReviews = v.TongDanhGia
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

    public async Task<VehicleDetailDto?> GetVehicleByIdAsync(int id, int? currentUserId = null)
    {
        var v = await _uow.DichVus.GetQueryable()
            .Include(x => x.MaDiaDiemNavigation)
            .FirstOrDefaultAsync(x => x.MaDichVu == id && x.TrangThai != "DELETED" && x.LoaiDichVu == "PHUONG_TIEN");

        if (v == null) return null;

        if (currentUserId.HasValue)
        {
            var provider = await _uow.NhaCungCaps.GetQueryable()
                .FirstOrDefaultAsync(ncc => ncc.MaNguoiDung == currentUserId.Value);

            if (provider != null && v.MaNhaCungCap != provider.MaNhaCungCap)
            {
                return null;
            }
        }

        return new VehicleDetailDto
        {
            Id = v.MaDichVu,
            MaDiaDiem = v.MaDiaDiem,
            TenDiaDiem = v.MaDiaDiemNavigation.TenDiaDiem,
            TenPhuongTien = v.TenDichVu,
            Slug = v.Slug,
            LoaiPhuongTien = "",
            MoTa = v.MoTa,
            HangXe = null,
            SoChoNgoi = null,
            DiemKhoiHanh = null,
            DiemDen = null,
            GiaTrungBinh = v.GiaTu,
            AnhDaiDien = v.Thumbnail,
            RatingAvg = (double)v.DanhGiaTrungBinh,
            TotalReviews = v.TongDanhGia,
            NgayTao = v.NgayTao
        };
    }

    public async Task<VehicleDto> CreateVehicleAsync(VehicleCreateRequest request, int? currentUserId = null)
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
            TenDichVu = request.TenPhuongTien,
            LoaiDichVu = "PHUONG_TIEN",
            Slug = Guid.NewGuid().ToString(),
            MoTa = request.MoTa,
            GiaTu = request.GiaTrungBinh,
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

        return new VehicleDto
        {
            Id = entity.MaDichVu,
            MaDiaDiem = entity.MaDiaDiem,
            TenDiaDiem = diaDiem?.TenDiaDiem,
            TenPhuongTien = entity.TenDichVu,
            Slug = entity.Slug,
            LoaiPhuongTien = "",
            MoTa = entity.MoTa,
            HangXe = null,
            SoChoNgoi = null,
            DiemKhoiHanh = null,
            DiemDen = null,
            GiaTrungBinh = entity.GiaTu,
            AnhDaiDien = entity.Thumbnail,
            RatingAvg = (double)entity.DanhGiaTrungBinh,
            TotalReviews = entity.TongDanhGia
        };
    }

    public async Task<VehicleDto?> UpdateVehicleAsync(int id, VehicleUpdateRequest request, int? currentUserId = null)
    {
        var entity = await _uow.DichVus.GetQueryable()
            .FirstOrDefaultAsync(v => v.MaDichVu == id && v.TrangThai != "DELETED" && v.LoaiDichVu == "PHUONG_TIEN");

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
        entity.TenDichVu = request.TenPhuongTien;
        entity.MoTa = request.MoTa;
        entity.GiaTu = request.GiaTrungBinh;
        if (!string.IsNullOrEmpty(request.AnhDaiDien))
        {
            entity.Thumbnail = request.AnhDaiDien;
        }

        _uow.DichVus.Update(entity);
        await _uow.SaveChangesAsync();

        var diaDiem = await _uow.DiaDiems.GetByIdAsync(entity.MaDiaDiem);

        return new VehicleDto
        {
            Id = entity.MaDichVu,
            MaDiaDiem = entity.MaDiaDiem,
            TenDiaDiem = diaDiem?.TenDiaDiem,
            TenPhuongTien = entity.TenDichVu,
            Slug = entity.Slug,
            LoaiPhuongTien = "",
            MoTa = entity.MoTa,
            HangXe = null,
            SoChoNgoi = null,
            DiemKhoiHanh = null,
            DiemDen = null,
            GiaTrungBinh = entity.GiaTu,
            AnhDaiDien = entity.Thumbnail,
            RatingAvg = (double)entity.DanhGiaTrungBinh,
            TotalReviews = entity.TongDanhGia
        };
    }

    public async Task<bool> DeleteVehicleAsync(int id, int? currentUserId = null)
    {
        var entity = await _uow.DichVus.GetByIdAsync(id);
        if (entity == null || entity.TrangThai == "DELETED" || entity.LoaiDichVu != "PHUONG_TIEN") return false;

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
