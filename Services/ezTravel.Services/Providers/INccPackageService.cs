using ezTravel.Common.Constants;
using ezTravel.DTO.Providers;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Providers;

public interface INccPackageService
{
    Task<object> GetPackagesAsync(int userId);
    Task<object?> GetCurrentPackageAsync(int userId);
    Task<object> GetPackageHistoryAsync(int userId);
    Task<object> GetPaymentHistoryAsync(int userId);
    Task<object> SubscribeSimulatedAsync(RegisterPackageRequest request, int userId);
}

public sealed class NccPackageServiceError
{
    public NccPackageServiceError(string message, int statusCode = 400)
    {
        Message = message;
        StatusCode = statusCode;
    }

    public bool Success => false;
    public string Message { get; }
    public int StatusCode { get; }
}

public class NccPackageService : INccPackageService
{
    private readonly IUnitOfWork _uow;
    private readonly IGoiDichVuNccRepository _packages;
    private readonly IDangKyGoiNccRepository _registrations;
    private readonly IThanhToanNccRepository _payments;
    private readonly IProviderPackageValidationService _validationService;

    public NccPackageService(
        IUnitOfWork uow,
        IGoiDichVuNccRepository packages,
        IDangKyGoiNccRepository registrations,
        IThanhToanNccRepository payments,
        IProviderPackageValidationService validationService)
    {
        _uow = uow;
        _packages = packages;
        _registrations = registrations;
        _payments = payments;
        _validationService = validationService;
    }

    public async Task<object> GetPackagesAsync(int userId)
    {
        var provider = await FindProviderAsync(userId);
        var currentRegistration = provider == null
            ? null
            : await FindCurrentRegistrationAsync(provider.MaNhaCungCap);

        var allPackages = await _packages.GetQueryable()
            .Where(package => package.TrangThai)
            .OrderBy(package => package.GiaThang)
            .ThenBy(package => package.HeSoUuTien)
            .ToListAsync();

        return allPackages.Select(package => MapPackage(package, currentRegistration)).ToList();
    }

    public async Task<object?> GetCurrentPackageAsync(int userId)
    {
        var provider = await FindProviderAsync(userId);
        if (provider == null)
        {
            return null;
        }

        var currentRegistration = await FindCurrentRegistrationAsync(provider.MaNhaCungCap);
        return currentRegistration == null ? null : MapCurrentPackage(currentRegistration);
    }

    public async Task<object> GetPackageHistoryAsync(int userId)
    {
        var provider = await FindProviderAsync(userId);
        if (provider == null)
        {
            return Array.Empty<object>();
        }

        var history = await _registrations.GetQueryable()
            .Include(registration => registration.MaGoiNccNavigation)
            .Include(registration => registration.ThanhToanNcc)
            .Where(registration => registration.MaNhaCungCap == provider.MaNhaCungCap)
            .OrderByDescending(registration => registration.NgayTao)
            .ThenByDescending(registration => registration.MaDangKyGoiNcc)
            .ToListAsync();

        return history.Select(MapPackageHistory).ToList();
    }

    public async Task<object> GetPaymentHistoryAsync(int userId)
    {
        var provider = await FindProviderAsync(userId);
        if (provider == null)
        {
            return Array.Empty<object>();
        }

        var payments = await _payments.GetQueryable()
            .Include(payment => payment.MaDangKyGoiNccNavigation)
                .ThenInclude(registration => registration.MaGoiNccNavigation)
            .Where(payment => payment.MaDangKyGoiNccNavigation.MaNhaCungCap == provider.MaNhaCungCap)
            .OrderByDescending(payment => payment.NgayTao)
            .ThenByDescending(payment => payment.MaThanhToanNcc)
            .ToListAsync();

        return payments.Select(MapPaymentHistory).ToList();
    }

    public async Task<object> SubscribeSimulatedAsync(RegisterPackageRequest request, int userId)
    {
        var provider = await FindProviderAsync(userId);
        if (provider == null)
        {
            return Error("Tai khoan hien tai chua co ho so nha cung cap.", 404);
        }

        if (IsBlockedProvider(provider.TrangThai))
        {
            return Error("Ho so nha cung cap hien tai khong duoc phep dang ky goi.");
        }

        var package = await _packages.GetByIdAsync(request.MaGoiNcc);
        if (package == null)
        {
            return Error("Khong tim thay goi dich vu nha cung cap.", 404);
        }

        try
        {
            await _validationService.ValidateRegistrationAsync(provider.MaNhaCungCap, package);
        }
        catch (InvalidOperationException ex)
        {
            return Error(ex.Message);
        }

        var now = DateTime.UtcNow;
        var normalizedDuration = NormalizeDuration(request.DurationType);
        if (normalizedDuration == null)
        {
            return Error("Chu ky thanh toan khong hop le.");
        }

        var amount = normalizedDuration == "YEAR" ? package.GiaNam : package.GiaThang;
        var endDate = normalizedDuration == "YEAR" ? now.AddYears(1) : now.AddMonths(1);

        _validationService.ValidateDates(now, endDate);

        await _uow.BeginTransactionAsync();

        try
        {
            var activeRegistrations = await _registrations.GetQueryable()
                .Where(registration =>
                    registration.MaNhaCungCap == provider.MaNhaCungCap &&
                    registration.TrangThai == PackageStatus.Active &&
                    registration.NgayKetThuc > now)
                .ToListAsync();

            foreach (var activeRegistration in activeRegistrations)
            {
                activeRegistration.TrangThai = PackageStatus.Expired;
                activeRegistration.NgayKetThuc = now;
                _registrations.Update(activeRegistration);
            }

            var registration = new DangKyGoiNcc
            {
                MaNhaCungCap = provider.MaNhaCungCap,
                MaGoiNcc = package.MaGoiNcc,
                NgayBatDau = now,
                NgayKetThuc = endDate,
                TrangThai = PackageStatus.Active,
                NgayTao = now
            };

            await _registrations.AddAsync(registration);
            await _uow.SaveChangesAsync();

            var payment = new ThanhToanNcc
            {
                MaDangKyGoiNcc = registration.MaDangKyGoiNcc,
                SoTien = amount,
                PhuongThucThanhToan = NormalizePaymentMethod(request.PhuongThucThanhToan),
                MaGiaoDich = $"DEMO-NCC-{registration.MaDangKyGoiNcc}-{now:yyyyMMddHHmmss}",
                TrangThai = PaymentStatus.Success,
                NgayThanhToan = now,
                NgayTao = now
            };

            await _payments.AddAsync(payment);

            provider.MaGoiNccHienTai = package.MaGoiNcc;
            provider.NgayCapNhat = now;
            _uow.NhaCungCaps.Update(provider);

            await _uow.SaveChangesAsync();
            await _uow.CommitAsync();

            registration.MaGoiNccNavigation = package;
            payment.MaDangKyGoiNccNavigation = registration;
            registration.ThanhToanNcc.Add(payment);

            return new
            {
                success = true,
                message = "Dang ky goi nha cung cap thanh cong.",
                package = MapPackage(package, registration),
                currentPackage = MapCurrentPackage(registration),
                payment = MapPaymentHistory(payment)
            };
        }
        catch
        {
            await _uow.RollbackAsync();
            throw;
        }
    }

    private async Task<NhaCungCap?> FindProviderAsync(int userId)
    {
        return await _uow.NhaCungCaps.GetQueryable()
            .FirstOrDefaultAsync(provider => provider.MaNguoiDung == userId);
    }

    private async Task<DangKyGoiNcc?> FindCurrentRegistrationAsync(int providerId)
    {
        var now = DateTime.UtcNow;

        return await _registrations.GetQueryable()
            .Include(registration => registration.MaGoiNccNavigation)
            .Include(registration => registration.ThanhToanNcc)
            .Where(registration =>
                registration.MaNhaCungCap == providerId &&
                registration.TrangThai == PackageStatus.Active &&
                registration.NgayKetThuc > now)
            .OrderByDescending(registration => registration.NgayBatDau)
            .ThenByDescending(registration => registration.MaDangKyGoiNcc)
            .FirstOrDefaultAsync();
    }

    private static object MapPackage(GoiDichVuNcc package, DangKyGoiNcc? currentRegistration)
    {
        var isCurrent = currentRegistration?.MaGoiNcc == package.MaGoiNcc;

        return new
        {
            maGoiNcc = package.MaGoiNcc,
            id = package.MaGoiNcc,
            tenGoi = package.TenGoi,
            moTa = package.MoTa,
            giaThang = package.GiaThang,
            giaNam = package.GiaNam,
            heSoUuTien = package.HeSoUuTien,
            uuTienTimKiem = package.UuTienTimKiem,
            uuTienAi = package.UuTienAi,
            uuTienTrangChu = package.UuTienTrangChu,
            coBadgeDoiTac = package.CoBadgeDoiTac,
            trangThai = isCurrent ? PackageStatus.Active : (package.TrangThai ? "AVAILABLE" : "INACTIVE"),
            isCurrent,
            ngayTao = package.NgayTao,
            ngayCapNhat = package.NgayCapNhat,
            currentSubscription = isCurrent ? MapCurrentPackage(currentRegistration!) : null
        };
    }

    private static object MapCurrentPackage(DangKyGoiNcc registration)
    {
        var package = registration.MaGoiNccNavigation;

        return new
        {
            maDangKyGoiNcc = registration.MaDangKyGoiNcc,
            maGoiNcc = registration.MaGoiNcc,
            tenGoi = package.TenGoi,
            moTa = package.MoTa,
            ngayBatDau = registration.NgayBatDau,
            ngayKetThuc = registration.NgayKetThuc,
            trangThai = registration.TrangThai,
            heSoUuTien = package.HeSoUuTien,
            uuTienTimKiem = package.UuTienTimKiem,
            uuTienAi = package.UuTienAi,
            uuTienTrangChu = package.UuTienTrangChu,
            coBadgeDoiTac = package.CoBadgeDoiTac,
            giaDaThanhToan = SumSuccessfulPayments(registration)
        };
    }

    private static object MapPackageHistory(DangKyGoiNcc registration)
    {
        return new
        {
            maDangKyGoiNcc = registration.MaDangKyGoiNcc,
            maGoiNcc = registration.MaGoiNcc,
            tenGoi = registration.MaGoiNccNavigation.TenGoi,
            ngayBatDau = registration.NgayBatDau,
            ngayKetThuc = registration.NgayKetThuc,
            trangThai = registration.TrangThai,
            ngayTao = registration.NgayTao,
            giaDaThanhToan = SumSuccessfulPayments(registration)
        };
    }

    private static object MapPaymentHistory(ThanhToanNcc payment)
    {
        return new
        {
            maThanhToanNcc = payment.MaThanhToanNcc,
            maDangKyGoiNcc = payment.MaDangKyGoiNcc,
            tenGoi = payment.MaDangKyGoiNccNavigation.MaGoiNccNavigation.TenGoi,
            soTien = payment.SoTien,
            phuongThucThanhToan = payment.PhuongThucThanhToan,
            maGiaoDich = payment.MaGiaoDich,
            trangThai = payment.TrangThai,
            ngayThanhToan = payment.NgayThanhToan,
            ngayTao = payment.NgayTao
        };
    }

    private static decimal SumSuccessfulPayments(DangKyGoiNcc registration)
    {
        return registration.ThanhToanNcc
            .Where(payment => payment.TrangThai != PaymentStatus.Failed)
            .Sum(payment => payment.SoTien);
    }

    private static string? NormalizeDuration(string? value)
    {
        return value?.Trim().ToUpperInvariant() switch
        {
            "MONTH" => "MONTH",
            "YEAR" => "YEAR",
            _ => null
        };
    }

    private static string NormalizePaymentMethod(string? value)
    {
        var method = string.IsNullOrWhiteSpace(value) ? "DEMO_PAYMENT" : value.Trim().ToUpperInvariant();
        return method.Length <= 50 ? method : method[..50];
    }

    private static bool IsBlockedProvider(string? status)
    {
        return status?.Trim().ToUpperInvariant() is "REJECTED" or "DELETED" or "INACTIVE" or "BANNED";
    }

    private static NccPackageServiceError Error(string message, int statusCode = 400)
        => new(message, statusCode);
}
