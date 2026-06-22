using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezTravel.DTO.Providers;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ezTravel.Services.Promotion;

public class PromotionService : IPromotionService
{
    private readonly IUnitOfWork _uow;
    private readonly IGoiDichVuNccRepository _goiRepository;
    private readonly ILogger<PromotionService> _logger;

    public PromotionService(
        IUnitOfWork uow,
        IGoiDichVuNccRepository goiRepository,
        ILogger<PromotionService> logger)
    {
        _uow = uow;
        _goiRepository = goiRepository;
        _logger = logger;
    }

    public double CalculatePromotionScore(double heSoUuTien, double rating, double popularity)
    {
        // PromotionScore = he_so_uu_tien * 0.5 + rating * 0.3 + popularity * 0.2
        return (heSoUuTien * 0.5) + (rating * 0.3) + (popularity * 0.2);
    }

    public string DetermineBadgeType(bool coBadgeDoiTac, double heSoUuTien)
    {
        if (!coBadgeDoiTac)
            return ProviderBadgeType.NONE.ToString();

        if (heSoUuTien >= 2.0)
            return ProviderBadgeType.PREMIUM_PARTNER.ToString();

        return ProviderBadgeType.VERIFIED_PARTNER.ToString();
    }

    public async Task<IEnumerable<ProviderPromotionDto>> GetFeaturedProvidersAsync(int topN = 10)
    {
        var providers = await _uow.NhaCungCaps.GetQueryable()
            .Include(ncc => ncc.MaGoiNccHienTaiNavigation)
            .Include(ncc => ncc.DichVu)
            .Where(ncc => (ncc.TrangThai == "ACTIVE" || ncc.TrangThai == "APPROVED") && ncc.MaGoiNccHienTai.HasValue && ncc.MaGoiNccHienTaiNavigation != null && ncc.MaGoiNccHienTaiNavigation.UuTienTrangChu)
            .ToListAsync();

        var list = providers.Select(ncc =>
        {
            var activeServices = ncc.DichVu.Where(s => s.TrangThai != "DELETED").ToList();
            double rating = activeServices.Any() ? (double)activeServices.Average(s => s.DanhGiaTrungBinh) : 0.0;
            double popularity = activeServices.Any() ? Math.Min(5.0, (activeServices.Sum(s => (double)s.LuotXem) * 0.005) + (activeServices.Sum(s => s.TongDanhGia) * 0.1)) : 0.0;
            double heSoUuTien = (double)(ncc.MaGoiNccHienTaiNavigation?.HeSoUuTien ?? 1.0m);
            bool coBadge = ncc.MaGoiNccHienTaiNavigation?.CoBadgeDoiTac ?? false;
            string badge = DetermineBadgeType(coBadge, heSoUuTien);
            double promotionScore = CalculatePromotionScore(heSoUuTien, rating, popularity);

            // Logging (diagnostics)
            _logger.LogDebug("Promotion Diagnostic (Featured) - ProviderId: {ProviderId}, PackageId: {PackageId}, Badge: {Badge}, PromotionScore: {PromotionScore}",
                ncc.MaNhaCungCap, ncc.MaGoiNccHienTai, badge, promotionScore);

            return new
            {
                Dto = new ProviderPromotionDto
                {
                    ProviderId = ncc.MaNhaCungCap,
                    ProviderName = ncc.TenDoanhNghiep,
                    CurrentPackage = ncc.MaGoiNccHienTaiNavigation?.TenGoi,
                    PackagePriority = heSoUuTien,
                    BadgeType = badge,
                    Rating = rating,
                    Avatar = ncc.LogoUrl,
                    CoverImage = ncc.BannerUrl
                },
                HeSoUuTien = heSoUuTien,
                RatingScore = rating
            };
        })
        .OrderByDescending(x => x.HeSoUuTien)
        .ThenByDescending(x => x.RatingScore)
        .Take(topN)
        .Select(x => x.Dto)
        .ToList();

        return list;
    }

    public async Task<IEnumerable<ProviderPromotionDto>> GetExplorePromotedProvidersAsync()
    {
        var providers = await _uow.NhaCungCaps.GetQueryable()
            .Include(ncc => ncc.MaGoiNccHienTaiNavigation)
            .Include(ncc => ncc.DichVu)
            .Where(ncc => (ncc.TrangThai == "ACTIVE" || ncc.TrangThai == "APPROVED") && ncc.MaGoiNccHienTai.HasValue && ncc.MaGoiNccHienTaiNavigation != null &&
                         (ncc.MaGoiNccHienTaiNavigation.UuTienTrangChu || ncc.MaGoiNccHienTaiNavigation.HeSoUuTien > 1.0m))
            .ToListAsync();

        var list = providers.Select(ncc =>
        {
            var activeServices = ncc.DichVu.Where(s => s.TrangThai != "DELETED").ToList();
            double rating = activeServices.Any() ? (double)activeServices.Average(s => s.DanhGiaTrungBinh) : 0.0;
            double popularity = activeServices.Any() ? Math.Min(5.0, (activeServices.Sum(s => (double)s.LuotXem) * 0.005) + (activeServices.Sum(s => s.TongDanhGia) * 0.1)) : 0.0;
            double heSoUuTien = (double)(ncc.MaGoiNccHienTaiNavigation?.HeSoUuTien ?? 1.0m);
            bool coBadge = ncc.MaGoiNccHienTaiNavigation?.CoBadgeDoiTac ?? false;
            string badge = DetermineBadgeType(coBadge, heSoUuTien);
            double promotionScore = CalculatePromotionScore(heSoUuTien, rating, popularity);

            // Logging (diagnostics)
            _logger.LogDebug("Promotion Diagnostic (Explore) - ProviderId: {ProviderId}, PackageId: {PackageId}, Badge: {Badge}, PromotionScore: {PromotionScore}",
                ncc.MaNhaCungCap, ncc.MaGoiNccHienTai, badge, promotionScore);

            return new
            {
                Dto = new ProviderPromotionDto
                {
                    ProviderId = ncc.MaNhaCungCap,
                    ProviderName = ncc.TenDoanhNghiep,
                    CurrentPackage = ncc.MaGoiNccHienTaiNavigation?.TenGoi,
                    PackagePriority = heSoUuTien,
                    BadgeType = badge,
                    Rating = rating,
                    Avatar = ncc.LogoUrl,
                    CoverImage = ncc.BannerUrl
                },
                Score = promotionScore
            };
        })
        .OrderByDescending(x => x.Score)
        .Select(x => x.Dto)
        .ToList();

        return list;
    }

    public async Task<IEnumerable<AdminPromotionPreviewDto>> GetAdminPromotionsPreviewAsync()
    {
        var providers = await _uow.NhaCungCaps.GetQueryable()
            .Include(ncc => ncc.MaGoiNccHienTaiNavigation)
            .Include(ncc => ncc.DichVu)
            .Where(ncc => ncc.TrangThai == "ACTIVE" || ncc.TrangThai == "APPROVED")
            .ToListAsync();

        var list = providers.Select(ncc =>
        {
            var activeServices = ncc.DichVu.Where(s => s.TrangThai != "DELETED").ToList();
            double rating = activeServices.Any() ? (double)activeServices.Average(s => s.DanhGiaTrungBinh) : 0.0;
            double popularity = activeServices.Any() ? Math.Min(5.0, (activeServices.Sum(s => (double)s.LuotXem) * 0.005) + (activeServices.Sum(s => s.TongDanhGia) * 0.1)) : 0.0;
            double heSoUuTien = (double)(ncc.MaGoiNccHienTaiNavigation?.HeSoUuTien ?? 1.0m);
            bool coBadge = ncc.MaGoiNccHienTaiNavigation?.CoBadgeDoiTac ?? false;
            string badge = DetermineBadgeType(coBadge, heSoUuTien);
            double promotionScore = CalculatePromotionScore(heSoUuTien, rating, popularity);

            bool appearsOnHomepage = ncc.MaGoiNccHienTai.HasValue && ncc.MaGoiNccHienTaiNavigation != null && ncc.MaGoiNccHienTaiNavigation.UuTienTrangChu;
            bool appearsOnExplore = ncc.MaGoiNccHienTai.HasValue && ncc.MaGoiNccHienTaiNavigation != null &&
                                    (ncc.MaGoiNccHienTaiNavigation.UuTienTrangChu || ncc.MaGoiNccHienTaiNavigation.HeSoUuTien > 1.0m);

            return new AdminPromotionPreviewDto
            {
                ProviderId = ncc.MaNhaCungCap,
                ProviderName = ncc.TenDoanhNghiep,
                PackageName = ncc.MaGoiNccHienTaiNavigation?.TenGoi,
                Badge = badge,
                PromotionScore = promotionScore,
                AppearsOnHomepage = appearsOnHomepage,
                AppearsOnExplore = appearsOnExplore
            };
        })
        .OrderByDescending(x => x.PromotionScore)
        .ToList();

        return list;
    }

}
