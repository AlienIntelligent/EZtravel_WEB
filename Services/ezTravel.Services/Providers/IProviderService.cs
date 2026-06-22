using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Providers;

public interface IProviderService
{
    Task<object> RegisterProviderAsync(RegisterProviderRequest r, int uid);
    Task<object> GetProviderStatusAsync(int uid);
    Task<object> SaveProviderDocumentAsync(SaveProviderDocumentRequest request, int uid);
    Task<object> GetProviderDocumentFileAsync(int id, int uid, bool isAdmin);
    Task<object> GetProviderDashboardStatsAsync(int uid);
    Task<object> GetProviderServicesAsync(int uid, string? category = null, string? keyword = null);
    Task<object> CreateServiceAsync(CreateServiceRequest r, int uid);
    Task<object> UpdateServiceAsync(int id, UpdateServiceRequest r, int uid);
    Task<object> DeleteServiceAsync(int id, int uid);
    Task<object> GetProviderReviewsAsync(int uid);
    Task<object> ReplyReviewAsync(int id, ReplyReviewRequest r, int uid);
}

public sealed class ProviderServiceError
{
    public ProviderServiceError(string message, int statusCode = 400)
    {
        Message = message;
        StatusCode = statusCode;
    }

    public bool Success => false;
    public string Message { get; }
    public int StatusCode { get; }
}

public sealed record ProviderDocumentFileResult(
    string StoredFileName,
    string OriginalFileName,
    string ContentType);

public class ProviderService : IProviderService
{
    private const string DefaultProviderType = "MULTI_SERVICE";
    private const string DefaultStatus = "ACTIVE";

    private readonly IUnitOfWork _uow;

    public ProviderService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> RegisterProviderAsync(RegisterProviderRequest r, int uid)
    {
        var user = await _uow.NguoiDungs.GetByIdAsync(uid);
        if (user == null)
        {
            return Error("Nguoi dung khong ton tai.");
        }

        var existing = await FindProviderAsync(uid);
        if (existing != null)
        {
            return MapProviderStatus(existing);
        }

        var now = DateTime.UtcNow;
        var provider = new NhaCungCap
        {
            MaNguoiDung = uid,
            TenDoanhNghiep = TrimToNull(r.BusinessName) ?? user.HoTen,
            Slug = Guid.NewGuid().ToString("N"),
            LoaiNhaCungCap = DefaultProviderType,
            MaSoThue = ClampNullable(TrimToNull(r.TaxCode), 50),
            SoGiayPhep = ClampNullable(TrimToNull(r.LicenseNumber), 100),
            EmailLienHe = user.Email,
            SoDienThoai = ClampNullable(TrimToNull(r.Phone) ?? user.SoDienThoai, 20) ?? string.Empty,
            DiaChi = ClampNullable(TrimToNull(r.Address), 500),
            TrangThai = "PENDING",
            NgayTao = now,
            NgayCapNhat = now
        };

        await _uow.NhaCungCaps.AddAsync(provider);
        await _uow.SaveChangesAsync();

        return MapProviderStatus(provider);
    }

    public async Task<object> GetProviderStatusAsync(int uid)
    {
        var provider = await FindProviderAsync(uid);
        if (provider == null)
        {
            return new
            {
                registered = false,
                status = "NOT_REGISTERED",
                trangThai = "NOT_REGISTERED"
            };
        }

        await LoadProviderDocumentsAsync(provider);
        return MapProviderStatus(provider);
    }

    public async Task<object> SaveProviderDocumentAsync(SaveProviderDocumentRequest request, int uid)
    {
        var provider = await FindProviderAsync(uid);
        if (provider == null)
        {
            return Error("Can dang ky nha cung cap truoc khi nop ho so.", 404);
        }

        await LoadProviderDocumentsAsync(provider);

        if (provider.TrangThai is not ("PENDING" or "REJECTED"))
        {
            return Error("Chi ho so dang cho hoac bi tu choi moi co the cap nhat giay to.", 409);
        }

        var documentType = NormalizeDocumentType(request.DocumentType);
        if (documentType == null)
        {
            return Error("Loai giay to khong hop le.");
        }

        var originalFileName = TrimToNull(request.OriginalFileName);
        var storedFileName = TrimToNull(request.StoredFileName);
        var contentType = TrimToNull(request.ContentType);
        if (originalFileName == null || storedFileName == null || contentType == null ||
            request.FileSize <= 0 || request.FileSize > 5 * 1024 * 1024)
        {
            return Error("Metadata tep ho so khong hop le.");
        }

        var now = DateTime.UtcNow;
        foreach (var existing in provider.HoSoXacMinhNcc.Where(item =>
                     item.LoaiGiayTo == documentType &&
                     item.TrangThai != "REPLACED"))
        {
            existing.TrangThai = "REPLACED";
            existing.NgayCapNhat = now;
            _uow.HoSoXacMinhNccs.Update(existing);
        }

        var document = new HoSoXacMinhNcc
        {
            MaNhaCungCap = provider.MaNhaCungCap,
            MaNhaCungCapNavigation = provider,
            LoaiGiayTo = documentType,
            TenTepGoc = Clamp(originalFileName, 255),
            TenTepLuu = Clamp(storedFileName, 255),
            LoaiNoiDung = Clamp(contentType, 100),
            KichThuoc = request.FileSize,
            TrangThai = "SUBMITTED",
            NgayNop = now,
            NgayCapNhat = now
        };

        await _uow.HoSoXacMinhNccs.AddAsync(document);
        provider.HoSoXacMinhNcc.Add(document);
        provider.TrangThai = "PENDING";
        provider.MaAdminDuyet = null;
        provider.NgayPheDuyet = null;
        provider.NgayCapNhat = now;
        _uow.NhaCungCaps.Update(provider);
        await _uow.SaveChangesAsync();

        return MapDocument(document);
    }

    public async Task<object> GetProviderDocumentFileAsync(int id, int uid, bool isAdmin)
    {
        var document = await _uow.HoSoXacMinhNccs.GetQueryable()
            .Include(item => item.MaNhaCungCapNavigation)
            .FirstOrDefaultAsync(item => item.MaHoSo == id);

        if (document == null)
        {
            return Error("Khong tim thay tep ho so.", 404);
        }

        if (!isAdmin && document.MaNhaCungCapNavigation.MaNguoiDung != uid)
        {
            return Error("Ban khong co quyen truy cap tep ho so nay.", 403);
        }

        return new ProviderDocumentFileResult(
            document.TenTepLuu,
            document.TenTepGoc,
            document.LoaiNoiDung);
    }

    public async Task<object> GetProviderDashboardStatsAsync(int uid)
    {
        var provider = await FindProviderAsync(uid);
        if (provider == null)
        {
            return new
            {
                registered = false,
                totalServices = 0,
                activeServices = 0,
                totalBookings = 0,
                averageRating = 0.0,
                totalReviews = 0,
                totalViews = 0,
                revenue = 0
            };
        }

        var services = await _uow.DichVus.GetQueryable()
            .Where(s => s.MaNhaCungCap == provider.MaNhaCungCap && s.TrangThai != "DELETED")
            .ToListAsync();

        var totalReviews = services.Sum(s => s.TongDanhGia);
        var averageRating = totalReviews > 0
            ? services.Where(s => s.TongDanhGia > 0).Average(s => (double)s.DanhGiaTrungBinh)
            : 0.0;

        return new
        {
            registered = true,
            providerId = provider.MaNhaCungCap,
            maNhaCungCap = provider.MaNhaCungCap,
            status = provider.TrangThai,
            trangThai = provider.TrangThai,
            totalServices = services.Count,
            activeServices = services.Count(s => s.TrangThai == DefaultStatus),
            totalBookings = 0,
            averageRating,
            totalReviews,
            totalViews = services.Sum(s => s.LuotXem),
            revenue = 0
        };
    }

    public async Task<object> GetProviderServicesAsync(int uid, string? category = null, string? keyword = null)
    {
        var provider = await FindProviderAsync(uid);
        if (provider == null)
        {
            return Array.Empty<object>();
        }

        var serviceType = ResolveServiceType(category);
        var query = _uow.DichVus.GetQueryable()
            .Include(s => s.MaDiaDiemNavigation)
            .Where(s => s.MaNhaCungCap == provider.MaNhaCungCap && s.TrangThai != "DELETED");

        if (serviceType != null)
        {
            query = query.Where(s => s.LoaiDichVu == serviceType);
        }

        var normalizedKeyword = TrimToNull(keyword);
        if (normalizedKeyword != null)
        {
            query = query.Where(s =>
                s.TenDichVu.Contains(normalizedKeyword) ||
                (s.MoTa != null && s.MoTa.Contains(normalizedKeyword)) ||
                (s.DiaChi != null && s.DiaChi.Contains(normalizedKeyword)));
        }

        var services = await query
            .OrderByDescending(s => s.NgayCapNhat)
            .ThenByDescending(s => s.NgayTao)
            .ToListAsync();

        return services.Select(MapService).ToList();
    }

    public async Task<object> CreateServiceAsync(CreateServiceRequest r, int uid)
    {
        var provider = await FindProviderAsync(uid);
        if (provider == null)
        {
            return Error("Tai khoan hien tai chua co ho so nha cung cap.");
        }

        var serviceType = ResolveServiceType(r.Category)
            ?? ResolveServiceType(r.LoaiDichVu)
            ?? InferServiceType(r)
            ?? "KHACH_SAN";

        var serviceName = ResolveName(r, serviceType);
        if (serviceName == null)
        {
            return Error("Ten dich vu la bat buoc.");
        }

        var placeId = await ResolvePlaceIdAsync(r.MaDiaDiem);
        if (placeId == null)
        {
            return Error("Khong tim thay dia diem hop le de gan dich vu.");
        }

        var now = DateTime.UtcNow;
        var entity = new DichVu
        {
            MaNhaCungCap = provider.MaNhaCungCap,
            MaDiaDiem = placeId.Value,
            LoaiDichVu = serviceType,
            TenDichVu = serviceName,
            Slug = Guid.NewGuid().ToString("N"),
            MoTa = TrimToNull(r.MoTa) ?? TrimToNull(r.Description),
            DiaChi = TrimToNull(r.DiaChi) ?? TrimToNull(r.Address),
            GiaTu = ResolveStartPrice(r, serviceType),
            GiaDen = r.GiaDen,
            Thumbnail = TrimToNull(r.AnhDaiDien) ?? TrimToNull(r.Thumbnail),
            DanhGiaTrungBinh = 0m,
            TongDanhGia = 0,
            LuotXem = 0,
            TrangThai = NormalizeStatus(r.TrangThai ?? r.Status) ?? DefaultStatus,
            NgayTao = now,
            NgayCapNhat = now
        };

        await _uow.DichVus.AddAsync(entity);
        await _uow.SaveChangesAsync();

        return MapService(entity);
    }

    public async Task<object> UpdateServiceAsync(int id, UpdateServiceRequest r, int uid)
    {
        var provider = await FindProviderAsync(uid);
        if (provider == null)
        {
            return Error("Tai khoan hien tai chua co ho so nha cung cap.");
        }

        var entity = await _uow.DichVus.GetQueryable()
            .FirstOrDefaultAsync(s =>
                s.MaDichVu == id &&
                s.MaNhaCungCap == provider.MaNhaCungCap &&
                s.TrangThai != "DELETED");

        if (entity == null)
        {
            return Error("Khong tim thay dich vu thuoc nha cung cap hien tai.");
        }

        var nextServiceType = ResolveServiceType(r.Category) ?? ResolveServiceType(r.LoaiDichVu);
        if (nextServiceType != null)
        {
            entity.LoaiDichVu = nextServiceType;
        }

        var serviceName = ResolveName(r, entity.LoaiDichVu);
        if (serviceName != null)
        {
            entity.TenDichVu = serviceName;
        }

        if (r.MaDiaDiem.HasValue)
        {
            var placeExists = await _uow.DiaDiems.AnyAsync(d => d.MaDiaDiem == r.MaDiaDiem.Value);
            if (!placeExists)
            {
                return Error("Dia diem cap nhat khong ton tai.");
            }

            entity.MaDiaDiem = r.MaDiaDiem.Value;
        }

        entity.MoTa = TrimToNull(r.MoTa) ?? TrimToNull(r.Description) ?? entity.MoTa;
        entity.DiaChi = TrimToNull(r.DiaChi) ?? TrimToNull(r.Address) ?? entity.DiaChi;
        entity.GiaTu = ResolveStartPrice(r, entity.LoaiDichVu) ?? entity.GiaTu;
        entity.GiaDen = r.GiaDen ?? entity.GiaDen;
        entity.Thumbnail = TrimToNull(r.AnhDaiDien) ?? TrimToNull(r.Thumbnail) ?? entity.Thumbnail;
        entity.TrangThai = NormalizeStatus(r.TrangThai ?? r.Status) ?? entity.TrangThai;
        entity.NgayCapNhat = DateTime.UtcNow;

        _uow.DichVus.Update(entity);
        await _uow.SaveChangesAsync();

        return MapService(entity);
    }

    public async Task<object> DeleteServiceAsync(int id, int uid)
    {
        var provider = await FindProviderAsync(uid);
        if (provider == null)
        {
            return Error("Tai khoan hien tai chua co ho so nha cung cap.", 404);
        }

        var entity = await _uow.DichVus.GetQueryable()
            .FirstOrDefaultAsync(s =>
                s.MaDichVu == id &&
                s.MaNhaCungCap == provider.MaNhaCungCap &&
                s.TrangThai != "DELETED");

        if (entity == null)
        {
            return Error("Khong tim thay dich vu thuoc nha cung cap hien tai.", 404);
        }

        entity.TrangThai = "DELETED";
        entity.NgayCapNhat = DateTime.UtcNow;

        _uow.DichVus.Update(entity);
        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            id = entity.MaDichVu,
            maDichVu = entity.MaDichVu,
            status = entity.TrangThai,
            trangThai = entity.TrangThai
        };
    }

    public async Task<object> GetProviderReviewsAsync(int uid)
    {
        var provider = await FindProviderAsync(uid);
        if (provider == null)
        {
            return Array.Empty<object>();
        }

        var reviews = await _uow.DanhGias.GetQueryable()
            .Include(r => r.MaNguoiDungNavigation)
            .Include(r => r.MaDichVuNavigation)
            .Include(r => r.PhanHoiDanhGia)
            .Where(r =>
                r.MaDichVu != null &&
                r.MaDichVuNavigation != null &&
                r.MaDichVuNavigation.MaNhaCungCap == provider.MaNhaCungCap)
            .OrderByDescending(r => r.NgayTao)
            .ToListAsync();

        return reviews.Select(r =>
        {
            var reply = r.PhanHoiDanhGia.FirstOrDefault(p => p.MaNhaCungCap == provider.MaNhaCungCap);
            return new
            {
                id = r.MaDanhGia,
                maDanhGia = r.MaDanhGia,
                serviceId = r.MaDichVu,
                maDichVu = r.MaDichVu,
                serviceName = r.MaDichVuNavigation?.TenDichVu,
                tenDichVu = r.MaDichVuNavigation?.TenDichVu,
                userId = r.MaNguoiDung,
                maNguoiDung = r.MaNguoiDung,
                userName = r.MaNguoiDungNavigation.HoTen,
                rating = r.SoSao,
                soSao = r.SoSao,
                comment = r.NoiDung,
                noiDung = r.NoiDung,
                status = r.TrangThaiDuyet,
                trangThaiDuyet = r.TrangThaiDuyet,
                reply = reply?.NoiDung,
                phanHoi = reply?.NoiDung,
                createdAt = r.NgayTao,
                ngayTao = r.NgayTao
            };
        }).ToList();
    }

    public async Task<object> ReplyReviewAsync(int id, ReplyReviewRequest r, int uid)
    {
        var provider = await FindProviderAsync(uid);
        if (provider == null)
        {
            return Error("Tai khoan hien tai chua co ho so nha cung cap.");
        }

        var review = await _uow.DanhGias.GetQueryable()
            .Include(x => x.MaDichVuNavigation)
            .Include(x => x.PhanHoiDanhGia)
            .FirstOrDefaultAsync(x =>
                x.MaDanhGia == id &&
                x.MaDichVuNavigation != null &&
                x.MaDichVuNavigation.MaNhaCungCap == provider.MaNhaCungCap);

        if (review == null)
        {
            return Error("Khong tim thay danh gia thuoc nha cung cap hien tai.");
        }

        var content = TrimToNull(r.Content);
        if (content == null)
        {
            return Error("Noi dung phan hoi la bat buoc.");
        }

        var existingReply = review.PhanHoiDanhGia.FirstOrDefault(p => p.MaNhaCungCap == provider.MaNhaCungCap);
        if (existingReply == null)
        {
            existingReply = new PhanHoiDanhGia
            {
                MaDanhGia = review.MaDanhGia,
                MaNhaCungCap = provider.MaNhaCungCap,
                NoiDung = content,
                NgayTao = DateTime.UtcNow
            };
            await _uow.PhanHoiDanhGias.AddAsync(existingReply);
        }
        else
        {
            existingReply.NoiDung = content;
            _uow.PhanHoiDanhGias.Update(existingReply);
        }

        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            reviewId = review.MaDanhGia,
            maDanhGia = review.MaDanhGia,
            reply = existingReply.NoiDung,
            phanHoi = existingReply.NoiDung
        };
    }

    private async Task<NhaCungCap?> FindProviderAsync(int uid)
    {
        return await _uow.NhaCungCaps.FirstOrDefaultAsync(provider => provider.MaNguoiDung == uid);
    }

    private async Task LoadProviderDocumentsAsync(NhaCungCap provider)
    {
        var documents = await _uow.HoSoXacMinhNccs.FindAsync(document =>
            document.MaNhaCungCap == provider.MaNhaCungCap);
        provider.HoSoXacMinhNcc = documents.ToList();
    }

    private async Task<int?> ResolvePlaceIdAsync(int? requestedPlaceId)
    {
        if (requestedPlaceId.HasValue)
        {
            var exists = await _uow.DiaDiems.AnyAsync(d => d.MaDiaDiem == requestedPlaceId.Value);
            return exists ? requestedPlaceId.Value : null;
        }

        return await _uow.DiaDiems.GetQueryable()
            .OrderBy(d => d.MaDiaDiem)
            .Select(d => (int?)d.MaDiaDiem)
            .FirstOrDefaultAsync();
    }

    private static object MapProviderStatus(NhaCungCap provider)
    {
        return new
        {
            registered = true,
            success = true,
            providerId = provider.MaNhaCungCap,
            maNhaCungCap = provider.MaNhaCungCap,
            userId = provider.MaNguoiDung,
            maNguoiDung = provider.MaNguoiDung,
            businessName = provider.TenDoanhNghiep,
            tenDoanhNghiep = provider.TenDoanhNghiep,
            providerType = provider.LoaiNhaCungCap,
            loaiNhaCungCap = provider.LoaiNhaCungCap,
            status = provider.TrangThai,
            trangThai = provider.TrangThai,
            logoUrl = provider.LogoUrl,
            bannerUrl = provider.BannerUrl,
            taxCode = provider.MaSoThue,
            licenseNumber = provider.SoGiayPhep,
            address = provider.DiaChi,
            phone = provider.SoDienThoai,
            hasVerificationDocuments = provider.HoSoXacMinhNcc.Any(item => item.TrangThai != "REPLACED"),
            documents = provider.HoSoXacMinhNcc
                .Where(item => item.TrangThai != "REPLACED")
                .GroupBy(item => item.LoaiGiayTo)
                .Select(group => group.OrderByDescending(item => item.NgayNop).First())
                .OrderBy(item => item.LoaiGiayTo)
                .Select(MapDocument)
                .ToList(),
            createdAt = provider.NgayTao,
            updatedAt = provider.NgayCapNhat
        };
    }

    private static object MapDocument(HoSoXacMinhNcc document)
        => new
        {
            id = document.MaHoSo,
            documentId = document.MaHoSo,
            providerId = document.MaNhaCungCap,
            documentType = document.LoaiGiayTo,
            originalFileName = document.TenTepGoc,
            contentType = document.LoaiNoiDung,
            fileSize = document.KichThuoc,
            status = document.TrangThai,
            submittedAt = document.NgayNop,
            updatedAt = document.NgayCapNhat,
            downloadPath = $"/api/provider/documents/{document.MaHoSo}/download"
        };

    private static object MapService(DichVu service)
    {
        var category = ToCategory(service.LoaiDichVu);
        var isHotel = service.LoaiDichVu == "KHACH_SAN";
        var isRestaurant = service.LoaiDichVu == "NHA_HANG";
        var isActivity = service.LoaiDichVu == "HOAT_DONG";
        var isVehicle = service.LoaiDichVu == "PHUONG_TIEN";

        return new
        {
            id = service.MaDichVu,
            maDichVu = service.MaDichVu,
            maKhachSan = isHotel ? service.MaDichVu : (int?)null,
            maNhaHang = isRestaurant ? service.MaDichVu : (int?)null,
            maHoatDong = isActivity ? service.MaDichVu : (int?)null,
            maPhuongTien = isVehicle ? service.MaDichVu : (int?)null,
            providerId = service.MaNhaCungCap,
            maNhaCungCap = service.MaNhaCungCap,
            maDiaDiem = service.MaDiaDiem,
            tenDiaDiem = service.MaDiaDiemNavigation?.TenDiaDiem,
            category,
            loaiDichVu = service.LoaiDichVu,
            name = service.TenDichVu,
            tenDichVu = service.TenDichVu,
            tenKhachSan = isHotel ? service.TenDichVu : null,
            tenNhaHang = isRestaurant ? service.TenDichVu : null,
            tenHoatDong = isActivity ? service.TenDichVu : null,
            tenPhuongTien = isVehicle ? service.TenDichVu : null,
            slug = service.Slug,
            description = service.MoTa,
            moTa = service.MoTa,
            address = service.DiaChi,
            diaChi = service.DiaChi,
            price = service.GiaTu,
            giaThamKhao = service.GiaTu,
            giaTu = service.GiaTu,
            giaDen = service.GiaDen,
            giaTrungBinh = isRestaurant || isVehicle ? service.GiaTu : null,
            gia = isActivity ? service.GiaTu : null,
            thumbnail = service.Thumbnail,
            anhDaiDien = service.Thumbnail,
            ratingAvg = (double)service.DanhGiaTrungBinh,
            totalReviews = service.TongDanhGia,
            luotXem = service.LuotXem,
            status = service.TrangThai,
            trangThai = service.TrangThai,
            createdAt = service.NgayTao,
            ngayTao = service.NgayTao,
            updatedAt = service.NgayCapNhat,
            ngayCapNhat = service.NgayCapNhat
        };
    }

    private static string? ResolveServiceType(string? value)
    {
        return TrimToNull(value)?.ToUpperInvariant() switch
        {
            "HOTEL" or "HOTELS" or "KHACH_SAN" => "KHACH_SAN",
            "RESTAURANT" or "RESTAURANTS" or "NHA_HANG" => "NHA_HANG",
            "ACTIVITY" or "ACTIVITIES" or "HOAT_DONG" => "HOAT_DONG",
            "VEHICLE" or "VEHICLES" or "PHUONG_TIEN" => "PHUONG_TIEN",
            _ => null
        };
    }

    private static string? InferServiceType(CreateServiceRequest r)
    {
        if (TrimToNull(r.TenKhachSan) != null) return "KHACH_SAN";
        if (TrimToNull(r.TenNhaHang) != null) return "NHA_HANG";
        if (TrimToNull(r.TenHoatDong) != null) return "HOAT_DONG";
        if (TrimToNull(r.TenPhuongTien) != null) return "PHUONG_TIEN";
        return null;
    }

    private static string? ResolveName(CreateServiceRequest r, string serviceType)
    {
        return serviceType switch
        {
            "KHACH_SAN" => TrimToNull(r.TenKhachSan) ?? TrimToNull(r.TenDichVu) ?? TrimToNull(r.Name),
            "NHA_HANG" => TrimToNull(r.TenNhaHang) ?? TrimToNull(r.TenDichVu) ?? TrimToNull(r.Name),
            "HOAT_DONG" => TrimToNull(r.TenHoatDong) ?? TrimToNull(r.TenDichVu) ?? TrimToNull(r.Name),
            "PHUONG_TIEN" => TrimToNull(r.TenPhuongTien) ?? TrimToNull(r.TenDichVu) ?? TrimToNull(r.Name),
            _ => TrimToNull(r.TenDichVu) ?? TrimToNull(r.Name)
        };
    }

    private static decimal? ResolveStartPrice(CreateServiceRequest r, string serviceType)
    {
        return serviceType switch
        {
            "KHACH_SAN" => r.GiaTu ?? r.GiaThamKhao ?? r.Price,
            "NHA_HANG" => r.GiaTrungBinh ?? r.GiaThamKhao ?? r.Price,
            "HOAT_DONG" => r.Gia ?? r.GiaThamKhao ?? r.Price,
            "PHUONG_TIEN" => r.GiaTrungBinh ?? r.GiaThamKhao ?? r.Price,
            _ => r.GiaThamKhao ?? r.Price
        };
    }

    private static string? NormalizeStatus(string? value)
    {
        var status = TrimToNull(value)?.ToUpperInvariant();
        return status switch
        {
            "ACTIVE" or "PENDING" or "INACTIVE" => status,
            _ => null
        };
    }

    private static string? NormalizeDocumentType(string? value)
        => TrimToNull(value)?.ToUpperInvariant() switch
        {
            "BUSINESS_LICENSE" => "BUSINESS_LICENSE",
            "TAX_REGISTRATION" => "TAX_REGISTRATION",
            "IDENTITY" => "IDENTITY",
            _ => null
        };

    private static string? ToCategory(string serviceType)
    {
        return serviceType switch
        {
            "KHACH_SAN" => "hotels",
            "NHA_HANG" => "restaurants",
            "HOAT_DONG" => "activities",
            "PHUONG_TIEN" => "vehicles",
            _ => null
        };
    }

    private static string? TrimToNull(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static string Clamp(string value, int maxLength)
        => value.Length <= maxLength ? value : value[..maxLength];

    private static string? ClampNullable(string? value, int maxLength)
        => value == null ? null : Clamp(value, maxLength);

    private static ProviderServiceError Error(string message, int statusCode = 400) => new(message, statusCode);
}
