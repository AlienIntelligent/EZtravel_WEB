using ezTravel.Entities;
using ezTravel.DTO.Requests;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Admin;

public interface IAdminService
{
    Task<object> GetAllUsersAsync();
    Task<object> GetUsersAsync();
    Task<object> UpdateUserStatusAsync(int id, string status);
    Task<object> UpdateUserRoleAsync(int id, string role);
    Task<object> GetDashboardStatsAsync();
    Task<object> GetAlertsAsync();
    Task<object> GetPendingProvidersAsync();
    Task<object> UpdateProviderStatusAsync(int id, string status, int adminId);
    Task<object> GetProviderPackagesAsync();
    Task<object> CreateProviderPackageAsync(UpsertProviderPackageRequest request);
    Task<object> UpdateProviderPackageAsync(int id, UpsertProviderPackageRequest request);
    Task<object> UpdateProviderPackageStatusAsync(int id, bool isActive);
}

public sealed record AdminServiceError(string Message, int StatusCode = 400);

public class AdminService : IAdminService
{
    private const string ActiveStatus = "ACTIVE";
    private const string BannedStatus = "BANNED";
    private const string DeletedStatus = "DELETED";
    private const string AdminRole = "ADMIN";
    private const string ApprovedProviderStatus = "APPROVED";

    private readonly IUnitOfWork _uow;
    private readonly IDangKyGoiNccRepository _providerPackageRegistrations;
    private readonly IThanhToanNccRepository _providerPayments;
    private readonly IGoiDichVuNccRepository _providerPackages;

    public AdminService(
        IUnitOfWork uow,
        IDangKyGoiNccRepository providerPackageRegistrations,
        IThanhToanNccRepository providerPayments,
        IGoiDichVuNccRepository providerPackages)
    {
        _uow = uow;
        _providerPackageRegistrations = providerPackageRegistrations;
        _providerPayments = providerPayments;
        _providerPackages = providerPackages;
    }

    public async Task<object> GetAllUsersAsync()
    {
        var users = await _uow.NguoiDungs.GetQueryable()
            .Include(user => user.NhaCungCapMaNguoiDungNavigation)
            .OrderByDescending(user => user.NgayTao)
            .ThenByDescending(user => user.MaNguoiDung)
            .ToListAsync();

        return users.Select(MapUser).ToList();
    }

    public Task<object> GetUsersAsync()
        => GetAllUsersAsync();

    public async Task<object> UpdateUserStatusAsync(int id, string status)
    {
        var normalizedStatus = NormalizeUserStatus(status);
        if (normalizedStatus == null)
        {
            return new AdminServiceError("Trang thai nguoi dung khong hop le.");
        }

        var user = await _uow.NguoiDungs.GetQueryable()
            .Include(item => item.NhaCungCapMaNguoiDungNavigation)
            .FirstOrDefaultAsync(item => item.MaNguoiDung == id);

        if (user == null)
        {
            return new AdminServiceError("Khong tim thay nguoi dung.", 404);
        }

        if (user.VaiTro == AdminRole && normalizedStatus != ActiveStatus)
        {
            return new AdminServiceError("Khong the khoa tai khoan admin.");
        }

        user.TrangThai = normalizedStatus;
        user.NgayCapNhat = DateTime.UtcNow;
        _uow.NguoiDungs.Update(user);
        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            user = MapUser(user)
        };
    }

    public async Task<object> UpdateUserRoleAsync(int id, string role)
    {
        var normalizedRole = NormalizeRole(role);
        if (normalizedRole == null)
        {
            return new AdminServiceError("Vai tro nguoi dung khong hop le.");
        }

        var user = await _uow.NguoiDungs.GetQueryable()
            .Include(item => item.NhaCungCapMaNguoiDungNavigation)
            .FirstOrDefaultAsync(item => item.MaNguoiDung == id);

        if (user == null)
        {
            return new AdminServiceError("Khong tim thay nguoi dung.", 404);
        }

        user.VaiTro = normalizedRole;
        user.NgayCapNhat = DateTime.UtcNow;
        _uow.NguoiDungs.Update(user);
        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            user = MapUser(user)
        };
    }

    public async Task<object> GetDashboardStatsAsync()
    {
        var totalUsers = await _uow.NguoiDungs.CountAsync(user => user.TrangThai != DeletedStatus);
        var activeUsers = await _uow.NguoiDungs.CountAsync(user => user.TrangThai == ActiveStatus);
        var lockedUsers = await _uow.NguoiDungs.CountAsync(user => user.TrangThai == BannedStatus);
        var totalTrips = await _uow.LichTrinhs.CountAsync(trip => trip.TrangThai != "ARCHIVED");
        var publicTrips = await _uow.LichTrinhs.CountAsync(trip => trip.LaCongKhai || trip.TrangThai == "PUBLIC");
        var totalProviders = await _uow.NhaCungCaps.CountAsync(provider => provider.TrangThai != DeletedStatus);
        var pendingProviders = await _uow.NhaCungCaps.CountAsync(provider => provider.TrangThai == "PENDING");
        var totalServices = await _uow.DichVus.CountAsync(service => service.TrangThai != DeletedStatus);
        var activeServices = await _uow.DichVus.CountAsync(service => service.TrangThai == ActiveStatus);
        var totalBlogs = await _uow.BaiViets.CountAsync(blog => blog.TrangThai != "ARCHIVED");
        var pendingReports = await _uow.BaoCaoNoiDungs.CountAsync(report => report.TrangThai == "PENDING");
        var pendingReviews = await _uow.DanhGias.CountAsync(review => review.TrangThaiDuyet == "PENDING");
        var travelerPackages = await _uow.DangKyGois.CountAsync();
        var providerPackages = await _providerPackageRegistrations.CountAsync();
        var totalRevenue = await _providerPayments.GetQueryable()
            .Where(payment => payment.TrangThai != "FAILED" && payment.TrangThai != "CANCELLED")
            .SumAsync(payment => (decimal?)payment.SoTien) ?? 0m;

        var recentUsers = await _uow.NguoiDungs.GetQueryable()
            .OrderByDescending(user => user.NgayTao)
            .ThenByDescending(user => user.MaNguoiDung)
            .Take(5)
            .Select(user => new
            {
                id = user.MaNguoiDung,
                hoTen = user.HoTen,
                email = user.Email,
                role = user.VaiTro,
                status = ToFrontendStatus(user.TrangThai),
                createdAt = user.NgayTao
            })
            .ToListAsync();

        return new
        {
            totalUsers,
            activeUsers,
            lockedUsers,
            totalTrips,
            publicTrips,
            totalProviders,
            pendingProviders,
            totalServices,
            activeServices,
            totalBlogs,
            pendingReports,
            pendingReviews,
            totalBookings = travelerPackages + providerPackages,
            totalRevenue,
            recentUsers
        };
    }

    public async Task<object> GetAlertsAsync()
    {
        var pendingReports = await _uow.BaoCaoNoiDungs.CountAsync(report => report.TrangThai == "PENDING");
        var pendingProviders = await _uow.NhaCungCaps.CountAsync(provider => provider.TrangThai == "PENDING");
        var pendingReviews = await _uow.DanhGias.CountAsync(review => review.TrangThaiDuyet == "PENDING");
        var lockedUsers = await _uow.NguoiDungs.CountAsync(user => user.TrangThai == BannedStatus);

        var alerts = new List<object>();
        if (pendingReports > 0)
        {
            alerts.Add(new
            {
                id = "pending-reports",
                type = "MODERATION",
                severity = "HIGH",
                title = "Pending content reports",
                message = $"{pendingReports} reports are waiting for moderation.",
                count = pendingReports
            });
        }

        if (pendingProviders > 0)
        {
            alerts.Add(new
            {
                id = "pending-providers",
                type = "PROVIDER",
                severity = "MEDIUM",
                title = "Pending provider approvals",
                message = $"{pendingProviders} providers are waiting for approval.",
                count = pendingProviders
            });
        }

        if (pendingReviews > 0)
        {
            alerts.Add(new
            {
                id = "pending-reviews",
                type = "REVIEW",
                severity = "MEDIUM",
                title = "Pending reviews",
                message = $"{pendingReviews} reviews are waiting for moderation.",
                count = pendingReviews
            });
        }

        if (lockedUsers > 0)
        {
            alerts.Add(new
            {
                id = "locked-users",
                type = "USER",
                severity = "LOW",
                title = "Locked users",
                message = $"{lockedUsers} users are currently locked.",
                count = lockedUsers
            });
        }

        return alerts;
    }

    public async Task<object> GetPendingProvidersAsync()
    {
        var providers = await _uow.NhaCungCaps.GetQueryable()
            .Include(provider => provider.MaNguoiDungNavigation)
            .Include(provider => provider.HoSoXacMinhNcc)
            .Where(provider => provider.TrangThai == "PENDING")
            .OrderBy(provider => provider.NgayTao)
            .ThenBy(provider => provider.MaNhaCungCap)
            .ToListAsync();

        return providers.Select(provider => MapProvider(provider)).ToList();
    }

    public async Task<object> UpdateProviderStatusAsync(int id, string status, int adminId)
    {
        var normalizedStatus = NormalizeProviderStatus(status);
        if (normalizedStatus == null)
        {
            return new AdminServiceError("Trang thai nha cung cap khong hop le.");
        }

        var adminExists = await _uow.NguoiDungs.AnyAsync(user =>
            user.MaNguoiDung == adminId &&
            user.VaiTro == AdminRole);
        if (!adminExists)
        {
            return new AdminServiceError("Can tai khoan admin hop le de duyet nha cung cap.", 401);
        }

        var provider = await _uow.NhaCungCaps.GetByIdAsync(id);
        if (provider == null)
        {
            return new AdminServiceError("Khong tim thay nha cung cap.", 404);
        }

        var user = await _uow.NguoiDungs.GetByIdAsync(provider.MaNguoiDung);
        if (user == null)
        {
            return new AdminServiceError("Khong tim thay tai khoan cua nha cung cap.", 404);
        }

        var documents = (await _uow.HoSoXacMinhNccs.FindAsync(document =>
                document.MaNhaCungCap == id &&
                document.TrangThai != "REPLACED"))
            .ToList();

        if (normalizedStatus == ApprovedProviderStatus &&
            documents.All(document => document.TrangThai is not ("SUBMITTED" or "APPROVED")))
        {
            return new AdminServiceError("Nha cung cap can nop it nhat mot giay to xac minh truoc khi phe duyet.", 409);
        }

        var now = DateTime.UtcNow;
        provider.TrangThai = normalizedStatus;
        provider.MaAdminDuyet = adminId;
        provider.NgayPheDuyet = now;
        provider.NgayCapNhat = now;

        if (normalizedStatus == ApprovedProviderStatus)
        {
            user.VaiTro = "PROVIDER";
        }
        else if (user.VaiTro == "PROVIDER")
        {
            user.VaiTro = "TRAVELER";
        }

        user.NgayCapNhat = now;
        foreach (var document in documents.Where(document => document.TrangThai == "SUBMITTED"))
        {
            document.TrangThai = normalizedStatus == ApprovedProviderStatus ? "APPROVED" : "REJECTED";
            document.NgayCapNhat = now;
            _uow.HoSoXacMinhNccs.Update(document);
        }

        _uow.NhaCungCaps.Update(provider);
        _uow.NguoiDungs.Update(user);
        await _uow.SaveChangesAsync();

        provider.MaNguoiDungNavigation = user;
        return new
        {
            success = true,
            provider = MapProvider(provider, documents)
        };
    }

    public async Task<object> GetProviderPackagesAsync()
    {
        var packages = await _providerPackages.GetAllAsync();

        return packages
            .OrderByDescending(package => package.TrangThai)
            .ThenBy(package => package.GiaThang)
            .ThenBy(package => package.TenGoi)
            .Select(MapProviderPackage)
            .ToList();
    }

    public async Task<object> CreateProviderPackageAsync(UpsertProviderPackageRequest request)
    {
        var validationError = ValidateProviderPackage(request);
        if (validationError != null)
        {
            return validationError;
        }

        var name = request.Name.Trim();
        if (await ProviderPackageNameExistsAsync(name))
        {
            return new AdminServiceError("Ten goi nha cung cap da ton tai.", 409);
        }

        var now = DateTime.UtcNow;
        var package = new GoiDichVuNcc
        {
            TrangThai = true,
            NgayTao = now,
            NgayCapNhat = now
        };
        ApplyProviderPackageRequest(package, request);

        await _providerPackages.AddAsync(package);
        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            package = MapProviderPackage(package)
        };
    }

    public async Task<object> UpdateProviderPackageAsync(int id, UpsertProviderPackageRequest request)
    {
        var validationError = ValidateProviderPackage(request);
        if (validationError != null)
        {
            return validationError;
        }

        var package = await _providerPackages.GetByIdAsync(id);
        if (package == null)
        {
            return new AdminServiceError("Khong tim thay goi nha cung cap.", 404);
        }

        var name = request.Name.Trim();
        if (await ProviderPackageNameExistsAsync(name, id))
        {
            return new AdminServiceError("Ten goi nha cung cap da ton tai.", 409);
        }

        ApplyProviderPackageRequest(package, request);
        package.NgayCapNhat = DateTime.UtcNow;
        _providerPackages.Update(package);
        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            package = MapProviderPackage(package)
        };
    }

    public async Task<object> UpdateProviderPackageStatusAsync(int id, bool isActive)
    {
        var package = await _providerPackages.GetByIdAsync(id);
        if (package == null)
        {
            return new AdminServiceError("Khong tim thay goi nha cung cap.", 404);
        }

        package.TrangThai = isActive;
        package.NgayCapNhat = DateTime.UtcNow;
        _providerPackages.Update(package);
        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            package = MapProviderPackage(package)
        };
    }

    private static object MapUser(NguoiDung user)
    {
        var provider = user.NhaCungCapMaNguoiDungNavigation
            .OrderByDescending(item => item.NgayTao)
            .FirstOrDefault();

        return new
        {
            id = user.MaNguoiDung,
            maNguoiDung = user.MaNguoiDung,
            hoTen = user.HoTen,
            fullName = user.HoTen,
            email = user.Email,
            phone = user.SoDienThoai,
            soDienThoai = user.SoDienThoai,
            avatarUrl = user.AvatarUrl,
            role = user.VaiTro,
            vaiTro = user.VaiTro,
            status = ToFrontendStatus(user.TrangThai),
            trangThai = user.TrangThai,
            emailVerified = user.EmailDaXacThuc,
            emailDaXacThuc = user.EmailDaXacThuc,
            createdAt = user.NgayTao,
            updatedAt = user.NgayCapNhat,
            ngayTao = user.NgayTao,
            ngayCapNhat = user.NgayCapNhat,
            providerId = provider?.MaNhaCungCap,
            providerName = provider?.TenDoanhNghiep,
            providerStatus = provider?.TrangThai
        };
    }

    private static object MapProvider(
        NhaCungCap provider,
        IEnumerable<HoSoXacMinhNcc>? suppliedDocuments = null)
    {
        var documents = (suppliedDocuments ?? provider.HoSoXacMinhNcc)
            .Where(document => document.TrangThai != "REPLACED")
            .GroupBy(document => document.LoaiGiayTo)
            .Select(group => group.OrderByDescending(document => document.NgayNop).First())
            .OrderBy(document => document.LoaiGiayTo)
            .ToList();

        return new
        {
            id = provider.MaNhaCungCap,
            providerId = provider.MaNhaCungCap,
            maNhaCungCap = provider.MaNhaCungCap,
            userId = provider.MaNguoiDung,
            maNguoiDung = provider.MaNguoiDung,
            applicantName = provider.MaNguoiDungNavigation?.HoTen,
            email = provider.EmailLienHe,
            phone = provider.SoDienThoai,
            businessName = provider.TenDoanhNghiep,
            tenDoanhNghiep = provider.TenDoanhNghiep,
            providerType = provider.LoaiNhaCungCap,
            loaiNhaCungCap = provider.LoaiNhaCungCap,
            taxCode = provider.MaSoThue,
            licenseNumber = provider.SoGiayPhep,
            address = provider.DiaChi,
            status = provider.TrangThai,
            trangThai = provider.TrangThai,
            hasVerificationDocuments = documents.Count > 0,
            documents = documents.Select(document => new
            {
                id = document.MaHoSo,
                documentId = document.MaHoSo,
                documentType = document.LoaiGiayTo,
                originalFileName = document.TenTepGoc,
                contentType = document.LoaiNoiDung,
                fileSize = document.KichThuoc,
                status = document.TrangThai,
                submittedAt = document.NgayNop,
                updatedAt = document.NgayCapNhat,
                downloadPath = $"/api/provider/documents/{document.MaHoSo}/download"
            }).ToList(),
            createdAt = provider.NgayTao,
            updatedAt = provider.NgayCapNhat,
            approvedAt = provider.NgayPheDuyet
        };
    }

    private async Task<bool> ProviderPackageNameExistsAsync(string name, int? exceptId = null)
    {
        var packages = await _providerPackages.GetAllAsync();
        return packages.Any(package =>
            package.MaGoiNcc != exceptId &&
            string.Equals(package.TenGoi.Trim(), name, StringComparison.OrdinalIgnoreCase));
    }

    private static AdminServiceError? ValidateProviderPackage(UpsertProviderPackageRequest request)
    {
        var name = request.Name?.Trim() ?? string.Empty;
        if (name.Length is < 2 or > 100)
        {
            return new AdminServiceError("Ten goi phai co tu 2 den 100 ky tu.");
        }

        if (request.Description?.Trim().Length > 1000)
        {
            return new AdminServiceError("Mo ta goi khong duoc vuot qua 1000 ky tu.");
        }

        if (request.MonthlyPrice < 0 || request.AnnualPrice < 0)
        {
            return new AdminServiceError("Gia goi khong duoc la so am.");
        }

        if (request.PriorityCoefficient is <= 0 or > 999.99m)
        {
            return new AdminServiceError("He so uu tien phai lon hon 0 va khong vuot qua 999.99.");
        }

        return null;
    }

    private static void ApplyProviderPackageRequest(
        GoiDichVuNcc package,
        UpsertProviderPackageRequest request)
    {
        package.TenGoi = request.Name.Trim();
        package.MoTa = TrimToNull(request.Description);
        package.GiaThang = decimal.Round(request.MonthlyPrice, 2);
        package.GiaNam = decimal.Round(request.AnnualPrice, 2);
        package.HeSoUuTien = decimal.Round(request.PriorityCoefficient, 2);
        package.UuTienTimKiem = request.SearchPriority;
        package.UuTienAi = request.AiPriority;
        package.UuTienTrangChu = request.HomePriority;
        package.CoBadgeDoiTac = request.PartnerBadge;
    }

    private static object MapProviderPackage(GoiDichVuNcc package)
        => new
        {
            id = package.MaGoiNcc,
            maGoiNcc = package.MaGoiNcc,
            name = package.TenGoi,
            tenGoi = package.TenGoi,
            description = package.MoTa,
            moTa = package.MoTa,
            monthlyPrice = package.GiaThang,
            giaThang = package.GiaThang,
            annualPrice = package.GiaNam,
            giaNam = package.GiaNam,
            priorityCoefficient = package.HeSoUuTien,
            heSoUuTien = package.HeSoUuTien,
            searchPriority = package.UuTienTimKiem,
            uuTienTimKiem = package.UuTienTimKiem,
            aiPriority = package.UuTienAi,
            uuTienAi = package.UuTienAi,
            homePriority = package.UuTienTrangChu,
            uuTienTrangChu = package.UuTienTrangChu,
            partnerBadge = package.CoBadgeDoiTac,
            coBadgeDoiTac = package.CoBadgeDoiTac,
            isActive = package.TrangThai,
            trangThai = package.TrangThai,
            createdAt = package.NgayTao,
            updatedAt = package.NgayCapNhat
        };

    private static string? NormalizeUserStatus(string? status)
        => TrimToNull(status)?.ToUpperInvariant() switch
        {
            "ACTIVE" => ActiveStatus,
            "LOCKED" or "INACTIVE" or "BANNED" => BannedStatus,
            "DELETED" => DeletedStatus,
            _ => null
        };

    private static string ToFrontendStatus(string? status)
        => string.Equals(status, BannedStatus, StringComparison.OrdinalIgnoreCase)
            ? "LOCKED"
            : status ?? ActiveStatus;

    private static string? NormalizeProviderStatus(string? status)
        => TrimToNull(status)?.ToUpperInvariant() switch
        {
            "ACTIVE" or "APPROVE" or "APPROVED" => ApprovedProviderStatus,
            "REJECT" or "REJECTED" => "REJECTED",
            _ => null
        };

    private static string? NormalizeRole(string? role)
        => TrimToNull(role)?.ToUpperInvariant() switch
        {
            "TRAVELER" => "TRAVELER",
            "PREMIUM" or "PREMIUM_TRAVELER" => "PREMIUM_TRAVELER",
            "PROVIDER" or "SERVICEPROVIDER" or "PROVIDER_PENDING" or "PROVIDER_APPROVED" => "PROVIDER",
            "ADMIN" => AdminRole,
            _ => null
        };

    private static string? TrimToNull(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }
}
