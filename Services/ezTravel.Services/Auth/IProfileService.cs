using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Auth;

public interface IProfileService
{
    Task<object> GetProfileAsync(int userId);
    Task<object> UpdateProfileAsync(int userId, UpdateProfileRequest request);
    Task<object> ChangePasswordAsync(int userId, ChangePasswordRequest request);
    Task<object> UpdateAvatarAsync(int userId, string avatarUrl);
}

public class ProfileService : IProfileService
{
    private readonly IUnitOfWork _uow;

    public ProfileService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetProfileAsync(int userId)
    {
        var user = await _uow.NguoiDungs.GetByIdAsync(userId);
        if (user == null)
        {
            return new { success = false, message = "Profile not found" };
        }

        var provider = await _uow.NhaCungCaps.FirstOrDefaultAsync(x => x.MaNguoiDung == userId);
        var subscription = await FindActiveSubscriptionAsync(userId);
        return MapProfile(user, provider, subscription);
    }

    public async Task<object> UpdateProfileAsync(int userId, UpdateProfileRequest request)
    {
        var user = await _uow.NguoiDungs.GetByIdAsync(userId);
        if (user == null)
        {
            return new { success = false, message = "Profile not found" };
        }

        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            user.HoTen = request.FullName.Trim();
        }

        if (request.Phone != null)
        {
            user.SoDienThoai = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        }

        user.NgayCapNhat = DateTime.UtcNow;
        _uow.NguoiDungs.Update(user);
        await _uow.SaveChangesAsync();

        var provider = await _uow.NhaCungCaps.FirstOrDefaultAsync(x => x.MaNguoiDung == userId);
        var subscription = await FindActiveSubscriptionAsync(userId);
        return MapProfile(user, provider, subscription);
    }

    public async Task<object> ChangePasswordAsync(int userId, ChangePasswordRequest request)
    {
        var user = await _uow.NguoiDungs.GetByIdAsync(userId);
        if (user == null)
        {
            return new { success = false, message = "Profile not found" };
        }

        if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.MatKhauHash))
        {
            return new { success = false, message = "Current password is incorrect" };
        }

        user.MatKhauHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.NgayCapNhat = DateTime.UtcNow;
        _uow.NguoiDungs.Update(user);
        await _uow.SaveChangesAsync();

        return new { success = true };
    }

    public async Task<object> UpdateAvatarAsync(int userId, string avatarUrl)
    {
        var user = await _uow.NguoiDungs.GetByIdAsync(userId);
        if (user == null)
        {
            return new { success = false, message = "Profile not found" };
        }

        user.AvatarUrl = string.IsNullOrWhiteSpace(avatarUrl) ? null : avatarUrl.Trim();
        user.NgayCapNhat = DateTime.UtcNow;
        _uow.NguoiDungs.Update(user);
        await _uow.SaveChangesAsync();

        var provider = await _uow.NhaCungCaps.FirstOrDefaultAsync(x => x.MaNguoiDung == userId);
        var subscription = await FindActiveSubscriptionAsync(userId);
        return MapProfile(user, provider, subscription);
    }

    private async Task<DangKyGoi?> FindActiveSubscriptionAsync(int userId)
    {
        var now = DateTime.UtcNow;
        return await _uow.DangKyGois.GetQueryable()
            .Include(subscription => subscription.MaGoiNavigation)
            .Where(subscription =>
                subscription.MaNguoiDung == userId &&
                subscription.TrangThai == "ACTIVE" &&
                subscription.NgayKetThuc > now)
            .OrderByDescending(subscription => subscription.NgayBatDau)
            .ThenByDescending(subscription => subscription.MaDangKy)
            .FirstOrDefaultAsync();
    }

    private static object MapProfile(NguoiDung user, NhaCungCap? provider, DangKyGoi? subscription)
    {
        return new
        {
            id = user.MaNguoiDung,
            userId = user.MaNguoiDung,
            maNguoiDung = user.MaNguoiDung,
            fullName = user.HoTen,
            hoTen = user.HoTen,
            name = user.HoTen,
            email = user.Email,
            phone = user.SoDienThoai,
            soDienThoai = user.SoDienThoai,
            avatarUrl = user.AvatarUrl,
            bio = user.Bio,
            role = user.VaiTro,
            vaiTro = user.VaiTro,
            status = user.TrangThai,
            trangThai = user.TrangThai,
            emailVerified = user.EmailDaXacThuc,
            emailDaXacThuc = user.EmailDaXacThuc,
            createdAt = user.NgayTao,
            updatedAt = user.NgayCapNhat,
            providerId = provider?.MaNhaCungCap,
            maNhaCungCap = provider?.MaNhaCungCap,
            providerName = provider?.TenDoanhNghiep,
            tenDoanhNghiep = provider?.TenDoanhNghiep,
            providerStatus = provider?.TrangThai,
            providerType = provider?.LoaiNhaCungCap,
            currentProviderPackageId = provider?.MaGoiNccHienTai,
            isPremium = subscription != null,
            currentTravelerPackageId = subscription?.MaGoi,
            currentTravelerPackageName = subscription?.MaGoiNavigation.TenGoi,
            premiumUntil = subscription?.NgayKetThuc
        };
    }
}
