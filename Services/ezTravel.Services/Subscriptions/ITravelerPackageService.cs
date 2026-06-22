using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Subscriptions;

public interface ITravelerPackageService
{
    Task<object> GetPackagesAsync(int userId);
    Task<object?> GetCurrentPackageAsync(int userId);
    Task<object> GetHistoryAsync(int userId);
    Task<object> SubscribeSimulatedAsync(SubscribePackageRequest request, int userId);
}

public sealed record TravelerPackageServiceError(string Message, int StatusCode = 400)
{
    public bool Success => false;
}

public class TravelerPackageService : ITravelerPackageService
{
    private const string ActiveStatus = "ACTIVE";
    private const string ExpiredStatus = "EXPIRED";

    private readonly IUnitOfWork _uow;

    public TravelerPackageService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetPackagesAsync(int userId)
    {
        var current = await FindCurrentAsync(userId);
        var packages = await _uow.GoiDichVus.GetQueryable()
            .Where(package => package.TrangThai == ActiveStatus)
            .OrderBy(package => package.GiaGoi)
            .ThenBy(package => package.SoNgay)
            .ThenBy(package => package.MaGoi)
            .ToListAsync();

        return packages.Select(package => MapPackage(package, current)).ToList();
    }

    public async Task<object?> GetCurrentPackageAsync(int userId)
    {
        var current = await FindCurrentAsync(userId);
        return current == null ? null : MapSubscription(current);
    }

    public async Task<object> GetHistoryAsync(int userId)
    {
        var history = await _uow.DangKyGois.GetQueryable()
            .Include(registration => registration.MaGoiNavigation)
            .Where(registration => registration.MaNguoiDung == userId)
            .OrderByDescending(registration => registration.NgayBatDau)
            .ThenByDescending(registration => registration.MaDangKy)
            .Take(50)
            .ToListAsync();

        return history.Select(MapSubscription).ToList();
    }

    public async Task<object> SubscribeSimulatedAsync(SubscribePackageRequest request, int userId)
    {
        var user = await _uow.NguoiDungs.GetByIdAsync(userId);
        if (user == null)
        {
            return Error("Khong tim thay tai khoan.", 404);
        }

        if (user.VaiTro is not ("TRAVELER" or "PREMIUM_TRAVELER"))
        {
            return Error("Chi tai khoan Traveler moi co the dang ky goi nay.", 403);
        }

        var package = await _uow.GoiDichVus.GetByIdAsync(request.PackageId);
        if (package == null || package.TrangThai != ActiveStatus)
        {
            return Error("Khong tim thay goi Traveler dang hoat dong.", 404);
        }

        if (package.SoNgay <= 0)
        {
            return Error("Thoi han goi khong hop le.");
        }

        var now = DateTime.UtcNow;
        var activeRegistrations = (await _uow.DangKyGois.FindAsync(registration =>
            registration.MaNguoiDung == userId &&
            registration.TrangThai == ActiveStatus)).ToList();

        foreach (var activeRegistration in activeRegistrations)
        {
            activeRegistration.TrangThai = ExpiredStatus;
            if (activeRegistration.NgayKetThuc > now)
            {
                activeRegistration.NgayKetThuc = now;
            }

            _uow.DangKyGois.Update(activeRegistration);
        }

        var registration = new DangKyGoi
        {
            MaNguoiDung = userId,
            MaGoi = package.MaGoi,
            NgayBatDau = now,
            NgayKetThuc = now.AddDays(package.SoNgay),
            TrangThai = ActiveStatus
        };

        await _uow.DangKyGois.AddAsync(registration);
        user.VaiTro = "PREMIUM_TRAVELER";
        user.NgayCapNhat = now;
        _uow.NguoiDungs.Update(user);
        await _uow.SaveChangesAsync();

        registration.MaGoiNavigation = package;
        registration.MaNguoiDungNavigation = user;

        return new
        {
            success = true,
            message = "Kich hoat goi Traveler thanh cong.",
            currentPackage = MapSubscription(registration),
            paymentMode = "SIMULATED"
        };
    }

    private async Task<DangKyGoi?> FindCurrentAsync(int userId)
    {
        var now = DateTime.UtcNow;
        return await _uow.DangKyGois.GetQueryable()
            .Include(registration => registration.MaGoiNavigation)
            .Where(registration =>
                registration.MaNguoiDung == userId &&
                registration.TrangThai == ActiveStatus &&
                registration.NgayKetThuc > now)
            .OrderByDescending(registration => registration.NgayBatDau)
            .ThenByDescending(registration => registration.MaDangKy)
            .FirstOrDefaultAsync();
    }

    private static object MapPackage(GoiDichVu package, DangKyGoi? current)
    {
        var isCurrent = current?.MaGoi == package.MaGoi;
        return new
        {
            id = package.MaGoi,
            packageId = package.MaGoi,
            maGoi = package.MaGoi,
            name = package.TenGoi,
            tenGoi = package.TenGoi,
            price = package.GiaGoi,
            giaGoi = package.GiaGoi,
            durationDays = package.SoNgay,
            soNgay = package.SoNgay,
            description = package.MoTa,
            moTa = package.MoTa,
            status = package.TrangThai,
            trangThai = package.TrangThai,
            isCurrent
        };
    }

    private static object MapSubscription(DangKyGoi registration)
        => new
        {
            id = registration.MaDangKy,
            subscriptionId = registration.MaDangKy,
            maDangKy = registration.MaDangKy,
            packageId = registration.MaGoi,
            maGoi = registration.MaGoi,
            packageName = registration.MaGoiNavigation.TenGoi,
            tenGoi = registration.MaGoiNavigation.TenGoi,
            price = registration.MaGoiNavigation.GiaGoi,
            giaGoi = registration.MaGoiNavigation.GiaGoi,
            startDate = registration.NgayBatDau,
            ngayBatDau = registration.NgayBatDau,
            endDate = registration.NgayKetThuc,
            ngayKetThuc = registration.NgayKetThuc,
            status = registration.TrangThai,
            trangThai = registration.TrangThai
        };

    private static TravelerPackageServiceError Error(string message, int statusCode = 400)
        => new(message, statusCode);
}
