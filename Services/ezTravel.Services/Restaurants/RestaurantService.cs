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

namespace ezTravel.Services.Restaurants;

public class RestaurantService : IRestaurantService
{
    private readonly IUnitOfWork _uow;
    private readonly ISearchRankingService _rankingService;
    private readonly ILogger<RestaurantService> _logger;

    public RestaurantService(IUnitOfWork uow, ISearchRankingService rankingService, ILogger<RestaurantService> logger)
    {
        _uow = uow;
        _rankingService = rankingService;
        _logger = logger;
    }

    public async Task<IEnumerable<RestaurantDto>> SearchRestaurantsAsync(RestaurantSearchRequest request)
    {
        var query = _uow.DichVus.GetQueryable()
            .Include(r => r.MaDiaDiemNavigation)
            .Where(r => r.TrangThai != "DELETED" && r.LoaiDichVu == "NHA_HANG");

        if (!string.IsNullOrEmpty(request.Keyword))
        {
            query = query.Where(r => r.TenDichVu.Contains(request.Keyword) ||
                                     (r.MoTa != null && r.MoTa.Contains(request.Keyword)));
        }

        if (request.MaDiaDiem.HasValue)
        {
            query = query.Where(r => r.MaDiaDiem == request.MaDiaDiem.Value);
        }

        if (request.MaNhaCungCap.HasValue)
        {
            query = query.Where(r => r.MaNhaCungCap == request.MaNhaCungCap.Value);
        }

        var list = await query.ToListAsync();

        var providerIds = list.Select(r => r.MaNhaCungCap).Distinct().ToList();
        var providerScores = await _rankingService.GetProviderPriorityScoresAsync(providerIds, applySearchBoost: true);
        var providers = await _uow.NhaCungCaps.GetQueryable()
            .Where(p => providerIds.Contains(p.MaNhaCungCap))
            .ToListAsync();

        var rankedList = list.Select(r =>
        {
            double reviewScore = (double)r.DanhGiaTrungBinh * 20.0;
            double popularityScore = Math.Min(100.0, (r.LuotXem * 0.1) + (r.TongDanhGia * 2.0));
            double relevanceScore = 100.0;
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                bool inName = r.TenDichVu.Contains(request.Keyword, StringComparison.OrdinalIgnoreCase);
                relevanceScore = inName ? 100.0 : 50.0;
            }

            providerScores.TryGetValue(r.MaNhaCungCap, out double packagePriorityScore);

            double finalScore = _rankingService.CalculateSearchScore(reviewScore, popularityScore, relevanceScore, packagePriorityScore);

            var provider = providers.FirstOrDefault(p => p.MaNhaCungCap == r.MaNhaCungCap);
            double coeff = packagePriorityScore / 50.0;
            if (coeff > 2.0) coeff = 2.0;

            // Debug logging (Requirement: ProviderId, PackageId, PackagePriority, FinalSearchScore)
            _logger.LogDebug("Ranking Diagnostic - ProviderId: {ProviderId}, PackageId: {PackageId}, PackagePriority: {PackagePriority}, FinalSearchScore: {FinalSearchScore}",
                r.MaNhaCungCap, provider?.MaGoiNccHienTai, coeff, finalScore);

            return new
            {
                Dto = new RestaurantDto
                {
                    Id = r.MaDichVu,
                    MaDiaDiem = r.MaDiaDiem,
                    TenDiaDiem = r.MaDiaDiemNavigation.TenDiaDiem,
                    TenNhaHang = r.TenDichVu,
                    Slug = r.Slug,
                    MoTa = r.MoTa,
                    MaLoaiAmThuc = null,
                    TenLoaiAmThuc = null,
                    GiaTrungBinh = r.GiaTu,
                    AnhDaiDien = r.Thumbnail,
                    RatingAvg = (double)r.DanhGiaTrungBinh,
                    TotalReviews = r.TongDanhGia
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

    public async Task<RestaurantDetailDto?> GetRestaurantByIdAsync(int id, int? currentUserId = null)
    {
        var r = await _uow.DichVus.GetQueryable()
            .Include(x => x.MaDiaDiemNavigation)
            .FirstOrDefaultAsync(x => x.MaDichVu == id && x.TrangThai != "DELETED" && x.LoaiDichVu == "NHA_HANG");

        if (r == null) return null;

        if (currentUserId.HasValue)
        {
            var provider = await _uow.NhaCungCaps.GetQueryable()
                .FirstOrDefaultAsync(ncc => ncc.MaNguoiDung == currentUserId.Value);

            if (provider != null && r.MaNhaCungCap != provider.MaNhaCungCap)
            {
                return null;
            }
        }

        return new RestaurantDetailDto
        {
            Id = r.MaDichVu,
            MaDiaDiem = r.MaDiaDiem,
            TenDiaDiem = r.MaDiaDiemNavigation.TenDiaDiem,
            TenNhaHang = r.TenDichVu,
            Slug = r.Slug,
            MoTa = r.MoTa,
            MaLoaiAmThuc = null,
            TenLoaiAmThuc = null,
            GiaTrungBinh = r.GiaTu,
            AnhDaiDien = r.Thumbnail,
            RatingAvg = (double)r.DanhGiaTrungBinh,
            TotalReviews = r.TongDanhGia,
            NgayTao = r.NgayTao
        };
    }

    public async Task<RestaurantDto> CreateRestaurantAsync(RestaurantCreateRequest request, int? currentUserId = null)
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
            TenDichVu = request.TenNhaHang,
            LoaiDichVu = "NHA_HANG",
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

        return new RestaurantDto
        {
            Id = entity.MaDichVu,
            MaDiaDiem = entity.MaDiaDiem,
            TenDiaDiem = diaDiem?.TenDiaDiem,
            TenNhaHang = entity.TenDichVu,
            Slug = entity.Slug,
            MoTa = entity.MoTa,
            MaLoaiAmThuc = null,
            TenLoaiAmThuc = null,
            GiaTrungBinh = entity.GiaTu,
            AnhDaiDien = entity.Thumbnail,
            RatingAvg = (double)entity.DanhGiaTrungBinh,
            TotalReviews = entity.TongDanhGia
        };
    }

    public async Task<RestaurantDto?> UpdateRestaurantAsync(int id, RestaurantUpdateRequest request, int? currentUserId = null)
    {
        var entity = await _uow.DichVus.GetQueryable()
            .FirstOrDefaultAsync(r => r.MaDichVu == id && r.TrangThai != "DELETED" && r.LoaiDichVu == "NHA_HANG");

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
        entity.TenDichVu = request.TenNhaHang;
        entity.MoTa = request.MoTa;
        entity.GiaTu = request.GiaTrungBinh;
        if (!string.IsNullOrEmpty(request.AnhDaiDien))
        {
            entity.Thumbnail = request.AnhDaiDien;
        }

        _uow.DichVus.Update(entity);
        await _uow.SaveChangesAsync();

        var diaDiem = await _uow.DiaDiems.GetByIdAsync(entity.MaDiaDiem);

        return new RestaurantDto
        {
            Id = entity.MaDichVu,
            MaDiaDiem = entity.MaDiaDiem,
            TenDiaDiem = diaDiem?.TenDiaDiem,
            TenNhaHang = entity.TenDichVu,
            Slug = entity.Slug,
            MoTa = entity.MoTa,
            MaLoaiAmThuc = null,
            TenLoaiAmThuc = null,
            GiaTrungBinh = entity.GiaTu,
            AnhDaiDien = entity.Thumbnail,
            RatingAvg = (double)entity.DanhGiaTrungBinh,
            TotalReviews = entity.TongDanhGia
        };
    }

    public async Task<bool> DeleteRestaurantAsync(int id, int? currentUserId = null)
    {
        var entity = await _uow.DichVus.GetByIdAsync(id);
        if (entity == null || entity.TrangThai == "DELETED" || entity.LoaiDichVu != "NHA_HANG") return false;

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
