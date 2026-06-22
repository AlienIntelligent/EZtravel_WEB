using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Places;

public interface IUnifiedService
{
    Task<object> GetServiceByIdAsync(int id);
    Task<object> GetServiceReviewsAsync(int id);
    Task<object> PostReviewAsync(int id, PostReviewRequest request, int userId);
}

public sealed record UnifiedServiceError(string Message, int StatusCode = 400);

public class UnifiedService : IUnifiedService
{
    private readonly IUnitOfWork _uow;

    public UnifiedService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetServiceByIdAsync(int id)
    {
        var service = await ServiceQuery()
            .FirstOrDefaultAsync(item => item.MaDichVu == id && item.TrangThai != "DELETED");

        if (service == null) return NotFound();

        service.LuotXem += 1;
        service.NgayCapNhat = DateTime.UtcNow;
        _uow.DichVus.Update(service);
        await _uow.SaveChangesAsync();

        return MapServiceDetail(service);
    }

    public async Task<object> GetServiceReviewsAsync(int id)
    {
        if (!await _uow.DichVus.AnyAsync(service => service.MaDichVu == id && service.TrangThai != "DELETED"))
        {
            return NotFound();
        }

        var reviews = await _uow.DanhGias.GetQueryable()
            .Include(review => review.MaNguoiDungNavigation)
            .Include(review => review.AnhDanhGia)
            .Include(review => review.PhanHoiDanhGia)
            .Where(review => review.MaDichVu == id && review.TrangThaiDuyet != "REJECTED")
            .OrderByDescending(review => review.NgayTao)
            .ToListAsync();

        return reviews.Select(MapReview).ToList();
    }

    public async Task<object> PostReviewAsync(int id, PostReviewRequest request, int userId)
    {
        if (userId <= 0)
        {
            return new UnifiedServiceError("Can dang nhap de gui danh gia.", 401);
        }

        if (!await _uow.NguoiDungs.AnyAsync(user => user.MaNguoiDung == userId && user.TrangThai != "BANNED"))
        {
            return new UnifiedServiceError("Nguoi dung khong ton tai hoac da bi khoa.", 401);
        }

        var service = await _uow.DichVus.GetQueryable()
            .FirstOrDefaultAsync(item => item.MaDichVu == id && item.TrangThai == "ACTIVE");

        if (service == null) return NotFound();

        if (request.Rating is < 1 or > 5)
        {
            return new UnifiedServiceError("Rating phai nam trong khoang 1..5.");
        }

        var now = DateTime.UtcNow;
        var review = new DanhGia
        {
            MaNguoiDung = userId,
            MaDichVu = id,
            SoSao = request.Rating,
            NoiDung = TrimToNull(request.Comment),
            TrangThaiDuyet = "PENDING",
            NgayTao = now
        };

        await _uow.DanhGias.AddAsync(review);
        await _uow.SaveChangesAsync();

        if (TrimToNull(request.ImageUrl) is { } imageUrl)
        {
            await _uow.AnhDanhGias.AddAsync(new AnhDanhGia
            {
                MaDanhGia = review.MaDanhGia,
                UrlAnh = imageUrl
            });
        }

        await RecalculateServiceRatingAsync(service.MaDichVu);
        await _uow.SaveChangesAsync();

        var createdReview = await _uow.DanhGias.GetQueryable()
            .Include(item => item.MaNguoiDungNavigation)
            .Include(item => item.AnhDanhGia)
            .Include(item => item.PhanHoiDanhGia)
            .FirstAsync(item => item.MaDanhGia == review.MaDanhGia);

        return MapReview(createdReview);
    }

    private IQueryable<DichVu> ServiceQuery()
        => _uow.DichVus.GetQueryable()
            .Include(service => service.MaDiaDiemNavigation)
                .ThenInclude(place => place.MaTinhThanhNavigation)
            .Include(service => service.MaNhaCungCapNavigation)
                .ThenInclude(provider => provider.MaGoiNccHienTaiNavigation)
            .Include(service => service.AnhDichVu);

    private async Task RecalculateServiceRatingAsync(int serviceId)
    {
        var service = await _uow.DichVus.GetQueryable()
            .FirstAsync(item => item.MaDichVu == serviceId);

        var reviews = await _uow.DanhGias.GetQueryable()
            .Where(review => review.MaDichVu == serviceId && review.TrangThaiDuyet != "REJECTED")
            .Select(review => review.SoSao)
            .ToListAsync();

        service.TongDanhGia = reviews.Count;
        service.DanhGiaTrungBinh = reviews.Count == 0 ? 0 : (decimal)reviews.Average();
        service.NgayCapNhat = DateTime.UtcNow;
        _uow.DichVus.Update(service);
    }

    private static object MapServiceDetail(DichVu service)
    {
        var images = OrderedImages(service.Thumbnail, service.AnhDichVu
            .OrderBy(image => image.ThuTu)
            .Select(image => image.UrlAnh));

        var price = service.GiaTu ?? service.GiaDen ?? 0;
        var frontendType = ToFrontendServiceType(service.LoaiDichVu);
        var provider = service.MaNhaCungCapNavigation;
        var place = service.MaDiaDiemNavigation;

        return new
        {
            id = service.MaDichVu,
            providerId = service.MaNhaCungCap,
            providerName = provider.TenDoanhNghiep,
            provider = new
            {
                id = provider.MaNhaCungCap,
                name = provider.TenDoanhNghiep,
                logo = provider.LogoUrl,
                banner = provider.BannerUrl,
                status = provider.TrangThai
            },
            placeId = service.MaDiaDiem,
            placeName = place.TenDiaDiem,
            place = new
            {
                id = place.MaDiaDiem,
                name = place.TenDiaDiem,
                cityId = place.MaTinhThanh,
                cityName = place.MaTinhThanhNavigation?.TenTinhThanh,
                address = place.DiaChi,
                latitude = (double?)place.Latitude,
                longitude = (double?)place.Longitude
            },
            name = service.TenDichVu,
            description = service.MoTa ?? string.Empty,
            address = service.DiaChi ?? place.DiaChi ?? place.TenDiaDiem,
            type = frontendType,
            price,
            referencePrice = service.GiaDen ?? service.GiaTu,
            images,
            averageRating = (double)service.DanhGiaTrungBinh,
            totalReviews = service.TongDanhGia,
            status = service.TrangThai,
            createdAt = service.NgayTao,
            updatedAt = service.NgayCapNhat,
            latitude = (double?)(service.Latitude ?? place.Latitude),
            longitude = (double?)(service.Longitude ?? place.Longitude),
            maDichVu = service.MaDichVu,
            maNhaCungCap = service.MaNhaCungCap,
            maDiaDiem = service.MaDiaDiem,
            tenDichVu = service.TenDichVu,
            tenDiaDiem = place.TenDiaDiem,
            loaiDichVu = service.LoaiDichVu,
            moTa = service.MoTa,
            diaChi = service.DiaChi,
            giaTu = service.GiaTu,
            giaDen = service.GiaDen,
            thumbnail = service.Thumbnail,
            ratingAvg = (double)service.DanhGiaTrungBinh,
            totalReview = service.TongDanhGia,
            luotXem = service.LuotXem,
            slug = service.Slug
        };
    }

    private static object MapReview(DanhGia review)
    {
        var reply = review.PhanHoiDanhGia
            .OrderByDescending(item => item.NgayTao)
            .FirstOrDefault();

        return new
        {
            id = review.MaDanhGia,
            userId = review.MaNguoiDung,
            targetId = review.MaDichVu,
            targetType = "SERVICE",
            rating = review.SoSao,
            content = review.NoiDung ?? string.Empty,
            comment = review.NoiDung ?? string.Empty,
            images = review.AnhDanhGia.Select(image => image.UrlAnh).ToList(),
            createdAt = review.NgayTao,
            updatedAt = review.NgayTao,
            userName = review.MaNguoiDungNavigation.HoTen,
            avatar = review.MaNguoiDungNavigation.AvatarUrl,
            status = review.TrangThaiDuyet,
            trangThaiDuyet = review.TrangThaiDuyet,
            reply = reply?.NoiDung,
            repliedAt = reply?.NgayTao,
            maDanhGia = review.MaDanhGia,
            maNguoiDung = review.MaNguoiDung,
            maDichVu = review.MaDichVu,
            soSao = review.SoSao,
            noiDung = review.NoiDung
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

    private static List<string> OrderedImages(string? primary, IEnumerable<string> extra)
    {
        var result = new List<string>();
        if (!string.IsNullOrWhiteSpace(primary)) result.Add(primary);
        result.AddRange(extra.Where(url => !string.IsNullOrWhiteSpace(url)));
        return result.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
    }

    private static string? TrimToNull(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }

    private static UnifiedServiceError NotFound()
        => new("Khong tim thay dich vu.", 404);
}
