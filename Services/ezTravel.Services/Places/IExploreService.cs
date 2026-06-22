using ezTravel.DTO.Places;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using ezTravel.Services.Promotion;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Places;

public interface IExploreService
{
    Task<object> GetTagsAsync();
    Task<object> SearchExploreAsync(PlaceSearchRequest request);
    Task<object> GetDestinationServicesAsync(int id);
    Task<object> GetTrendingDestinationsAsync();
}

public class ExploreService : IExploreService
{
    private readonly IUnitOfWork _uow;
    private readonly IPromotionService _promotionService;

    public ExploreService(IUnitOfWork uow, IPromotionService promotionService)
    {
        _uow = uow;
        _promotionService = promotionService;
    }

    public async Task<object> GetTagsAsync()
        => await _uow.Tags.GetQueryable()
            .OrderBy(tag => tag.TenTag)
            .Select(tag => new
            {
                id = tag.MaTag,
                maTag = tag.MaTag,
                name = tag.TenTag,
                tenTag = tag.TenTag,
                type = tag.LoaiTag,
                loaiTag = tag.LoaiTag
            })
            .ToListAsync();

    public async Task<object> SearchExploreAsync(PlaceSearchRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Type)
            && string.IsNullOrWhiteSpace(request.Keyword)
            && string.IsNullOrWhiteSpace(request.Province)
            && string.IsNullOrWhiteSpace(request.ServiceCategory)
            && !request.MaTinhThanh.HasValue)
        {
            return (await _promotionService.GetExplorePromotedProvidersAsync()).ToList();
        }

        var type = request.Type?.Trim().ToLowerInvariant();
        return type == "services" || type == "service"
            ? await SearchServicesAsync(request)
            : await SearchPlacesAsync(request);
    }

    public async Task<object> GetDestinationServicesAsync(int id)
    {
        var services = await _uow.DichVus.GetQueryable()
            .Include(service => service.MaDiaDiemNavigation)
                .ThenInclude(place => place.MaTinhThanhNavigation)
            .Include(service => service.MaNhaCungCapNavigation)
                .ThenInclude(provider => provider.MaGoiNccHienTaiNavigation)
            .Include(service => service.AnhDichVu)
            .Where(service => service.MaDiaDiem == id && service.TrangThai == "ACTIVE")
            .OrderByDescending(service => service.DanhGiaTrungBinh)
            .ThenByDescending(service => service.LuotXem)
            .ToListAsync();

        return services.Select(MapServiceCard).ToList();
    }

    public async Task<object> GetTrendingDestinationsAsync()
    {
        var places = await _uow.DiaDiems.GetQueryable()
            .Include(place => place.MaTinhThanhNavigation)
            .Include(place => place.AnhDiaDiem)
            .Include(place => place.MaTag)
            .Where(place => place.TrangThai != "DELETED")
            .OrderByDescending(place => place.LuotXem)
            .ThenByDescending(place => place.DanhGiaTrungBinh)
            .ThenByDescending(place => place.TongDanhGia)
            .Take(6)
            .ToListAsync();

        return places.Select(place =>
        {
            var card = MapPlaceCard(place);
            return new
            {
                card.id,
                card.name,
                card.description,
                card.address,
                card.cityId,
                card.cityName,
                card.latitude,
                card.longitude,
                card.images,
                card.tags,
                card.averageRating,
                card.totalReviews,
                card.status,
                card.createdAt,
                card.updatedAt,
                card.tenDiaDiem,
                card.moTa,
                card.diaChi,
                card.maTinhThanh,
                card.tenTinhThanh,
                card.thumbnailUrl,
                card.ratingAvg,
                providerId = card.id,
                providerName = card.name,
                rating = card.averageRating,
                avatar = card.images.FirstOrDefault(),
                coverImage = card.images.FirstOrDefault(),
                badgeType = "FEATURED"
            };
        }).ToList();
    }

    private async Task<object> SearchPlacesAsync(PlaceSearchRequest request)
    {
        var query = _uow.DiaDiems.GetQueryable()
            .Include(place => place.MaTinhThanhNavigation)
            .Include(place => place.AnhDiaDiem)
            .Include(place => place.MaTag)
            .Where(place => place.TrangThai != "DELETED");

        if (request.MaTinhThanh.HasValue)
        {
            query = query.Where(place => place.MaTinhThanh == request.MaTinhThanh.Value);
        }

        var keyword = TrimToNull(request.Keyword);
        if (keyword != null)
        {
            query = query.Where(place =>
                place.TenDiaDiem.Contains(keyword) ||
                (place.MoTa != null && place.MoTa.Contains(keyword)) ||
                (place.DiaChi != null && place.DiaChi.Contains(keyword)) ||
                place.MaTinhThanhNavigation.TenTinhThanh.Contains(keyword));
        }

        var province = NormalizeProvince(request.Province);
        if (province != null)
        {
            query = query.Where(place =>
                place.MaTinhThanhNavigation.TenTinhThanh.Contains(province) ||
                place.TenDiaDiem.Contains(province) ||
                (place.DiaChi != null && place.DiaChi.Contains(province)));
        }

        if (request.Rating is > 0)
        {
            query = query.Where(place => place.DanhGiaTrungBinh >= (decimal)request.Rating.Value);
        }

        var total = await query.CountAsync();
        var page = NormalizePage(request.Page);
        var pageSize = NormalizePageSize(request.PageSize);

        var items = await query
            .OrderByDescending(place => place.DanhGiaTrungBinh)
            .ThenByDescending(place => place.LuotXem)
            .ThenBy(place => place.TenDiaDiem)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return ToPagedResponse(items.Select(MapPlaceCard).ToList(), total, page, pageSize);
    }

    private async Task<object> SearchServicesAsync(PlaceSearchRequest request)
    {
        var query = _uow.DichVus.GetQueryable()
            .Include(service => service.MaDiaDiemNavigation)
                .ThenInclude(place => place.MaTinhThanhNavigation)
            .Include(service => service.MaNhaCungCapNavigation)
                .ThenInclude(provider => provider.MaGoiNccHienTaiNavigation)
            .Include(service => service.AnhDichVu)
            .Where(service => service.TrangThai == "ACTIVE");

        var category = NormalizeServiceCategory(request.ServiceCategory);
        if (category != null)
        {
            query = query.Where(service => service.LoaiDichVu == category);
        }

        if (request.MaTinhThanh.HasValue)
        {
            query = query.Where(service => service.MaDiaDiemNavigation.MaTinhThanh == request.MaTinhThanh.Value);
        }

        var keyword = TrimToNull(request.Keyword);
        if (keyword != null)
        {
            query = query.Where(service =>
                service.TenDichVu.Contains(keyword) ||
                (service.MoTa != null && service.MoTa.Contains(keyword)) ||
                (service.DiaChi != null && service.DiaChi.Contains(keyword)) ||
                service.MaDiaDiemNavigation.TenDiaDiem.Contains(keyword) ||
                service.MaNhaCungCapNavigation.TenDoanhNghiep.Contains(keyword));
        }

        var province = NormalizeProvince(request.Province);
        if (province != null)
        {
            query = query.Where(service =>
                service.MaDiaDiemNavigation.MaTinhThanhNavigation.TenTinhThanh.Contains(province) ||
                service.MaDiaDiemNavigation.TenDiaDiem.Contains(province) ||
                (service.MaDiaDiemNavigation.DiaChi != null && service.MaDiaDiemNavigation.DiaChi.Contains(province)) ||
                (service.DiaChi != null && service.DiaChi.Contains(province)));
        }

        if (request.Rating is > 0)
        {
            query = query.Where(service => service.DanhGiaTrungBinh >= (decimal)request.Rating.Value);
        }

        if (request.BudgetMin is > 0)
        {
            query = query.Where(service => (service.GiaTu ?? service.GiaDen ?? 0) >= request.BudgetMin.Value);
        }

        if (request.BudgetMax is > 0)
        {
            query = query.Where(service => (service.GiaTu ?? service.GiaDen ?? 0) <= request.BudgetMax.Value);
        }

        var total = await query.CountAsync();
        var page = NormalizePage(request.Page);
        var pageSize = NormalizePageSize(request.PageSize);

        var items = await query
            .OrderByDescending(service => service.MaNhaCungCapNavigation.MaGoiNccHienTaiNavigation != null
                ? service.MaNhaCungCapNavigation.MaGoiNccHienTaiNavigation.HeSoUuTien
                : 1m)
            .ThenByDescending(service => service.DanhGiaTrungBinh)
            .ThenByDescending(service => service.LuotXem)
            .ThenBy(service => service.TenDichVu)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return ToPagedResponse(items.Select(MapServiceCard).ToList(), total, page, pageSize);
    }

    private static object ToPagedResponse<T>(IReadOnlyCollection<T> items, int total, int page, int pageSize)
        => new
        {
            items,
            data = items,
            total,
            page,
            pageSize,
            totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)pageSize))
        };

    private static PlaceCard MapPlaceCard(DiaDiem place)
    {
        var images = OrderedImages(place.Thumbnail, place.AnhDiaDiem
            .OrderBy(image => image.ThuTu)
            .Select(image => image.UrlAnh));

        return new PlaceCard
        {
            id = place.MaDiaDiem,
            name = place.TenDiaDiem,
            description = place.MoTa ?? string.Empty,
            address = place.DiaChi ?? place.MaTinhThanhNavigation?.TenTinhThanh ?? "Vietnam",
            cityId = place.MaTinhThanh.ToString(),
            cityName = place.MaTinhThanhNavigation?.TenTinhThanh,
            latitude = (double?)place.Latitude,
            longitude = (double?)place.Longitude,
            images = images,
            tags = place.MaTag.Select(tag => tag.TenTag).ToList(),
            averageRating = (double)place.DanhGiaTrungBinh,
            totalReviews = place.TongDanhGia,
            status = place.TrangThai == "DELETED" ? "INACTIVE" : "ACTIVE",
            createdAt = place.NgayTao,
            updatedAt = place.NgayCapNhat,
            tenDiaDiem = place.TenDiaDiem,
            moTa = place.MoTa,
            diaChi = place.DiaChi,
            maTinhThanh = place.MaTinhThanh,
            tenTinhThanh = place.MaTinhThanhNavigation?.TenTinhThanh,
            thumbnailUrl = place.Thumbnail,
            ratingAvg = (double)place.DanhGiaTrungBinh,
            totalReview = place.TongDanhGia,
            slug = place.Slug
        };
    }

    private static object MapServiceCard(DichVu service)
    {
        var images = OrderedImages(service.Thumbnail, service.AnhDichVu
            .OrderBy(image => image.ThuTu)
            .Select(image => image.UrlAnh));

        var price = service.GiaTu ?? service.GiaDen ?? 0;
        var frontendType = ToFrontendServiceType(service.LoaiDichVu);
        var badgeType = ResolveBadgeType(service.MaNhaCungCapNavigation);

        return new
        {
            id = service.MaDichVu,
            providerId = service.MaNhaCungCap,
            providerName = service.MaNhaCungCapNavigation.TenDoanhNghiep,
            placeId = service.MaDiaDiem,
            placeName = service.MaDiaDiemNavigation.TenDiaDiem,
            name = service.TenDichVu,
            description = service.MoTa ?? string.Empty,
            address = service.DiaChi ?? service.MaDiaDiemNavigation.DiaChi ?? service.MaDiaDiemNavigation.TenDiaDiem,
            type = frontendType,
            price,
            referencePrice = service.GiaDen ?? service.GiaTu,
            images,
            averageRating = (double)service.DanhGiaTrungBinh,
            totalReviews = service.TongDanhGia,
            status = service.TrangThai,
            createdAt = service.NgayTao,
            updatedAt = service.NgayCapNhat,
            latitude = (double?)(service.Latitude ?? service.MaDiaDiemNavigation.Latitude),
            longitude = (double?)(service.Longitude ?? service.MaDiaDiemNavigation.Longitude),
            badgeType,
            maDichVu = service.MaDichVu,
            maNhaCungCap = service.MaNhaCungCap,
            maDiaDiem = service.MaDiaDiem,
            tenDichVu = service.TenDichVu,
            tenDiaDiem = service.MaDiaDiemNavigation.TenDiaDiem,
            loaiDichVu = service.LoaiDichVu,
            giaTu = service.GiaTu,
            giaDen = service.GiaDen,
            thumbnail = service.Thumbnail,
            ratingAvg = (double)service.DanhGiaTrungBinh,
            totalReview = service.TongDanhGia,
            slug = service.Slug
        };
    }

    private static string? NormalizeServiceCategory(string? category)
    {
        return TrimToNull(category)?.ToUpperInvariant() switch
        {
            "ACCOMMODATION" or "HOTEL" or "HOTELS" or "KHACH_SAN" => "KHACH_SAN",
            "FOOD" or "RESTAURANT" or "RESTAURANTS" or "NHA_HANG" => "NHA_HANG",
            "ACTIVITY" or "ACTIVITIES" or "HOAT_DONG" => "HOAT_DONG",
            "TRANSPORT" or "VEHICLE" or "VEHICLES" or "PHUONG_TIEN" => "PHUONG_TIEN",
            _ => null
        };
    }

    private static string ToFrontendServiceType(string type)
        => type switch
        {
            "KHACH_SAN" => "ACCOMMODATION",
            "NHA_HANG" => "FOOD",
            "HOAT_DONG" => "ACTIVITY",
            "PHUONG_TIEN" => "TRANSPORT",
            _ => type
        };

    private static string ResolveBadgeType(NhaCungCap provider)
    {
        var package = provider.MaGoiNccHienTaiNavigation;
        if (package == null || !package.CoBadgeDoiTac) return "NONE";
        return package.HeSoUuTien >= 2.0m ? "PREMIUM_PARTNER" : "VERIFIED_PARTNER";
    }

    private static List<string> OrderedImages(string? primary, IEnumerable<string> extra)
    {
        var result = new List<string>();
        if (!string.IsNullOrWhiteSpace(primary)) result.Add(primary);
        result.AddRange(extra.Where(url => !string.IsNullOrWhiteSpace(url)));
        return result.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
    }

    private static int NormalizePage(int page)
        => page < 1 ? 1 : page;

    private static int NormalizePageSize(int pageSize)
        => pageSize is < 1 or > 60 ? 12 : pageSize;

    private static string? NormalizeProvince(string? province)
        => TrimToNull(province) switch
        {
            "Da Nang" => "Đà Nẵng",
            "Hoi An" => "Hội An",
            "Hue" => "Huế",
            var value => value
        };

    private static string? TrimToNull(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }

    private sealed class PlaceCard
    {
        public int id { get; init; }
        public string name { get; init; } = string.Empty;
        public string description { get; init; } = string.Empty;
        public string address { get; init; } = string.Empty;
        public string cityId { get; init; } = string.Empty;
        public string? cityName { get; init; }
        public double? latitude { get; init; }
        public double? longitude { get; init; }
        public List<string> images { get; init; } = new();
        public List<string> tags { get; init; } = new();
        public double averageRating { get; init; }
        public int totalReviews { get; init; }
        public string status { get; init; } = "ACTIVE";
        public DateTime createdAt { get; init; }
        public DateTime updatedAt { get; init; }
        public string tenDiaDiem { get; init; } = string.Empty;
        public string? moTa { get; init; }
        public string? diaChi { get; init; }
        public int maTinhThanh { get; init; }
        public string? tenTinhThanh { get; init; }
        public string? thumbnailUrl { get; init; }
        public double ratingAvg { get; init; }
        public int totalReview { get; init; }
        public string? slug { get; init; }
    }
}
