using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using ezTravel.Common.Constants;
using ezTravel.Common.Responses;
using ezTravel.DTO.Auth;
using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ezTravel.Services.Auth;

public sealed record AuthServiceError(string Message, int StatusCode = 400);

public class AuthService : IAuthService
{
    private const string ActiveStatus = "ACTIVE";
    private const string PendingVerificationStatus = "PENDING_VERIFICATION";
    private const string BannedStatus = "BANNED";
    private const string InactiveStatus = "INACTIVE";
    private const int OtpMinutes = 10;
    private const int MaxOtpFailures = 5;
    private const int OtpLockMinutes = 15;
    private const int OtpResendCooldownSeconds = 60;
    private const int RefreshTokenDays = 14;

    private readonly IUnitOfWork _uow;
    private readonly JwtService _jwt;
    private readonly IAuthMessageSender _messageSender;
    private readonly bool _showDevOtp;

    public AuthService(IUnitOfWork uow, JwtService jwt, IAuthMessageSender messageSender, IConfiguration configuration)
    {
        _uow = uow;
        _jwt = jwt;
        _messageSender = messageSender;
        _showDevOtp = string.Equals(
            configuration["ASPNETCORE_ENVIRONMENT"] ?? Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
            "Development",
            StringComparison.OrdinalIgnoreCase);
    }

    public async Task<BaseResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        var email = NormalizeEmail(request.Email);
        var fullName = TrimToNull(request.HoTen);
        var password = TrimToNull(request.MatKhau);

        if (fullName == null) return BaseResponse<AuthResponse>.Fail("Ho ten la bat buoc.");
        if (email == null) return BaseResponse<AuthResponse>.Fail("Email khong hop le.");
        if (!IsPasswordStrong(password)) return BaseResponse<AuthResponse>.Fail("Mat khau phai co it nhat 8 ky tu, gom chu hoa, chu thuong va chu so.");

        var exists = await _uow.NguoiDungs.GetQueryable()
            .AnyAsync(user => user.Email.ToUpper() == email.ToUpper());

        if (exists) return BaseResponse<AuthResponse>.Fail("Email da ton tai.");

        var now = DateTime.UtcNow;
        var user = new NguoiDung
        {
            HoTen = fullName,
            Email = email,
            MatKhauHash = BCrypt.Net.BCrypt.HashPassword(password),
            SoDienThoai = TrimToNull(request.SoDienThoai),
            VaiTro = NormalizeRole(request.VaiTro),
            TrangThai = PendingVerificationStatus,
            EmailDaXacThuc = false,
            Slug = $"user-{Guid.NewGuid():N}",
            NgayTao = now,
            NgayCapNhat = now
        };

        await _uow.NguoiDungs.AddAsync(user);
        await _uow.SaveChangesAsync();

        var otp = await IssueOtpAsync(user, now);
        await _messageSender.SendOtpAsync(user.Email, otp.Code, "REGISTER", otp.ExpiresAt);

        return BaseResponse<AuthResponse>.Ok(new AuthResponse
        {
            UserId = user.MaNguoiDung,
            Name = user.HoTen,
            Email = user.Email,
            Role = user.VaiTro,
            Token = string.Empty,
            RequiresVerification = true,
            DevOtp = _showDevOtp ? otp.Code : null,
            OtpExpiresAt = otp.ExpiresAt
        }, "Dang ky thanh cong. Vui long xac minh email.");
    }

    public async Task<BaseResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var email = NormalizeEmail(request.Email);
        if (email == null) return BaseResponse<AuthResponse>.Fail("Sai email hoac mat khau.");

        var user = await FindUserByEmailAsync(email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.MatKhau ?? string.Empty, user.MatKhauHash))
        {
            return BaseResponse<AuthResponse>.Fail("Sai email hoac mat khau.");
        }

        if (string.Equals(user.TrangThai, BannedStatus, StringComparison.OrdinalIgnoreCase))
        {
            return BaseResponse<AuthResponse>.Fail("Tai khoan cua ban da bi khoa.");
        }

        if (string.Equals(user.TrangThai, InactiveStatus, StringComparison.OrdinalIgnoreCase))
        {
            return BaseResponse<AuthResponse>.Fail("Tai khoan cua ban dang ngung hoat dong.");
        }

        if (string.Equals(user.TrangThai, PendingVerificationStatus, StringComparison.OrdinalIgnoreCase))
        {
            return BaseResponse<AuthResponse>.Fail("Tai khoan chua xac minh email. Vui long nhap ma OTP.");
        }

        var response = ToAuthResponse(user);
        var refresh = await IssueRefreshTokenAsync(user);
        response.RefreshToken = refresh.Token;
        response.RefreshTokenExpiresAt = refresh.ExpiresAt;
        return BaseResponse<AuthResponse>.Ok(response);
    }

    public async Task<BaseResponse<AuthResponse>> RefreshAsync(string? refreshToken)
    {
        var rawToken = TrimToNull(refreshToken);
        if (rawToken == null) return BaseResponse<AuthResponse>.Fail("Phien dang nhap khong hop le.");

        var tokenHash = HashRefreshToken(rawToken);
        var stored = await _uow.RefreshTokens.GetQueryable()
            .Include(token => token.MaNguoiDungNavigation)
            .FirstOrDefaultAsync(token => token.RefreshToken1 == tokenHash
                && !token.DaThuHoi
                && token.NgayHetHan > DateTime.UtcNow);

        if (stored == null || IsBlocked(stored.MaNguoiDungNavigation))
        {
            return BaseResponse<AuthResponse>.Fail("Phien dang nhap da het han hoac da bi thu hoi.");
        }

        stored.DaThuHoi = true;
        _uow.RefreshTokens.Update(stored);

        var replacement = await IssueRefreshTokenAsync(stored.MaNguoiDungNavigation, saveChanges: false);
        await _uow.SaveChangesAsync();

        var response = ToAuthResponse(stored.MaNguoiDungNavigation);
        response.RefreshToken = replacement.Token;
        response.RefreshTokenExpiresAt = replacement.ExpiresAt;
        return BaseResponse<AuthResponse>.Ok(response);
    }

    public async Task<object> RevokeAsync(string? refreshToken)
    {
        var rawToken = TrimToNull(refreshToken);
        if (rawToken == null) return new { success = true };

        var tokenHash = HashRefreshToken(rawToken);
        var stored = await _uow.RefreshTokens.GetQueryable()
            .FirstOrDefaultAsync(token => token.RefreshToken1 == tokenHash && !token.DaThuHoi);
        if (stored != null)
        {
            stored.DaThuHoi = true;
            _uow.RefreshTokens.Update(stored);
            await _uow.SaveChangesAsync();
        }

        return new { success = true };
    }

    public async Task<BaseResponse<AuthResponse>> GetMeAsync(int userId)
    {
        var user = await _uow.NguoiDungs.GetByIdAsync(userId);
        if (user == null
            || string.Equals(user.TrangThai, BannedStatus, StringComparison.OrdinalIgnoreCase)
            || string.Equals(user.TrangThai, InactiveStatus, StringComparison.OrdinalIgnoreCase))
        {
            return BaseResponse<AuthResponse>.Fail("Tai khoan khong hop le hoac da bi khoa.");
        }

        return BaseResponse<AuthResponse>.Ok(ToAuthResponse(user));
    }

    public async Task<object> VerifyOtpAsync(VerifyOtpRequest request)
    {
        var email = NormalizeEmail(request.Email);
        if (email == null) return new AuthServiceError("Email khong hop le.");

        var user = await FindUserByEmailAsync(email);
        if (user == null) return new AuthServiceError("Khong tim thay tai khoan.", 404);
        if (IsBlocked(user)) return new AuthServiceError("Tai khoan khong duoc phep thuc hien thao tac nay.", 403);

        var purpose = NormalizeOtpPurpose(request.Purpose ?? request.Type);
        var validation = await ValidateOtpAsync(user, request.Code, consume: purpose != "RESET");
        if (validation.Error != null) return validation.Error;

        if (purpose == "RESET")
        {
            return new
            {
                success = true,
                message = "Ma OTP hop le. Vui long dat mat khau moi.",
                email = user.Email,
                code = request.Code,
                purpose,
                resetUrl = $"/auth/reset-password?email={Uri.EscapeDataString(user.Email)}&code={Uri.EscapeDataString(request.Code)}"
            };
        }

        user.EmailDaXacThuc = true;
        if (string.Equals(user.TrangThai, PendingVerificationStatus, StringComparison.OrdinalIgnoreCase))
        {
            user.TrangThai = ActiveStatus;
        }

        user.NgayCapNhat = DateTime.UtcNow;
        _uow.NguoiDungs.Update(user);
        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            message = "Email da duoc xac minh. Ban co the dang nhap.",
            email = user.Email,
            purpose = "REGISTER"
        };
    }

    public async Task<object> ResendOtpAsync(ResendOtpRequest request)
    {
        var email = NormalizeEmail(request.Email);
        if (email == null) return new AuthServiceError("Email khong hop le.");

        var user = await FindUserByEmailAsync(email);
        if (user == null) return new AuthServiceError("Khong tim thay tai khoan.", 404);
        if (IsBlocked(user)) return new AuthServiceError("Tai khoan khong duoc phep thuc hien thao tac nay.", 403);

        var purpose = NormalizeOtpPurpose(request.Purpose ?? request.Type);
        if (purpose == "REGISTER" && user.EmailDaXacThuc && user.TrangThai == ActiveStatus)
        {
            return new
            {
                success = true,
                message = "Email da duoc xac minh.",
                email = user.Email,
                purpose
            };
        }

        var rateLimit = await GetOtpIssuanceErrorAsync(user, DateTime.UtcNow);
        if (rateLimit != null) return rateLimit;

        var otp = await IssueOtpAsync(user, DateTime.UtcNow);
        await _messageSender.SendOtpAsync(user.Email, otp.Code, purpose, otp.ExpiresAt);
        return OtpIssuedResponse(user, otp, purpose, "Ma OTP moi da duoc tao.");
    }

    public async Task<object> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var email = NormalizeEmail(request.Email);
        if (email == null) return new AuthServiceError("Email khong hop le.");

        var user = await FindUserByEmailAsync(email);
        if (user == null) return new AuthServiceError("Khong tim thay tai khoan.", 404);
        if (IsBlocked(user)) return new AuthServiceError("Tai khoan khong duoc phep dat lai mat khau.", 403);

        var rateLimit = await GetOtpIssuanceErrorAsync(user, DateTime.UtcNow);
        if (rateLimit != null) return rateLimit;

        var otp = await IssueOtpAsync(user, DateTime.UtcNow);
        await _messageSender.SendOtpAsync(user.Email, otp.Code, "RESET", otp.ExpiresAt);
        return OtpIssuedResponse(user, otp, "RESET", "Ma OTP dat lai mat khau da duoc tao.");
    }

    public async Task<object> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var email = NormalizeEmail(request.Email);
        var password = TrimToNull(request.NewPassword);

        if (email == null) return new AuthServiceError("Email khong hop le.");
        if (!IsPasswordStrong(password)) return new AuthServiceError("Mat khau phai co it nhat 8 ky tu, gom chu hoa, chu thuong va chu so.");

        var user = await FindUserByEmailAsync(email);
        if (user == null) return new AuthServiceError("Khong tim thay tai khoan.", 404);
        if (IsBlocked(user)) return new AuthServiceError("Tai khoan khong duoc phep dat lai mat khau.", 403);

        var validation = await ValidateOtpAsync(user, request.Code, consume: true);
        if (validation.Error != null) return validation.Error;

        user.MatKhauHash = BCrypt.Net.BCrypt.HashPassword(password);
        user.EmailDaXacThuc = true;
        if (string.Equals(user.TrangThai, PendingVerificationStatus, StringComparison.OrdinalIgnoreCase))
        {
            user.TrangThai = ActiveStatus;
        }

        user.NgayCapNhat = DateTime.UtcNow;
        _uow.NguoiDungs.Update(user);
        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            message = "Mat khau da duoc cap nhat. Vui long dang nhap lai.",
            email = user.Email
        };
    }

    private async Task<NguoiDung?> FindUserByEmailAsync(string email)
    {
        var normalizedEmail = email.ToUpperInvariant();
        return await _uow.NguoiDungs.GetQueryable()
            .FirstOrDefaultAsync(user => user.Email.ToUpper() == normalizedEmail);
    }

    private async Task<(string Code, DateTime ExpiresAt)> IssueOtpAsync(NguoiDung user, DateTime now)
    {
        var pendingOtps = await _uow.OtpXacThucs.GetQueryable()
            .Where(otp => otp.MaNguoiDung == user.MaNguoiDung && !otp.DaSuDung)
            .ToListAsync();

        foreach (var otp in pendingOtps)
        {
            otp.DaSuDung = true;
            _uow.OtpXacThucs.Update(otp);
        }

        var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
        var expiresAt = now.AddMinutes(OtpMinutes);
        await _uow.OtpXacThucs.AddAsync(new OtpXacThuc
        {
            MaNguoiDung = user.MaNguoiDung,
            Otp = code,
            SoLanSai = 0,
            NgayHetHan = expiresAt,
            DaSuDung = false
        });

        await _uow.SaveChangesAsync();
        return (code, expiresAt);
    }

    private async Task<(OtpXacThuc? Otp, AuthServiceError? Error)> ValidateOtpAsync(NguoiDung user, string? code, bool consume)
    {
        var normalizedCode = TrimToNull(code);
        if (normalizedCode == null || normalizedCode.Length != 6 || normalizedCode.Any(ch => !char.IsDigit(ch)))
        {
            return (null, new AuthServiceError("Ma OTP phai gom 6 chu so."));
        }

        var now = DateTime.UtcNow;
        var lockout = await _uow.OtpXacThucs.GetQueryable()
            .Where(item => item.MaNguoiDung == user.MaNguoiDung
                && item.SoLanSai >= MaxOtpFailures
                && item.NgayHetHan > now)
            .OrderByDescending(item => item.MaOtp)
            .FirstOrDefaultAsync();
        if (lockout != null)
        {
            return (null, new AuthServiceError("OTP tam khoa 15 phut do nhap sai qua nhieu lan.", 429));
        }

        var otp = await _uow.OtpXacThucs.GetQueryable()
            .Where(item => item.MaNguoiDung == user.MaNguoiDung && !item.DaSuDung)
            .OrderByDescending(item => item.MaOtp)
            .FirstOrDefaultAsync();

        if (otp == null) return (null, new AuthServiceError("Ma OTP khong ton tai hoac da duoc su dung.", 404));

        if (otp.NgayHetHan < now)
        {
            otp.DaSuDung = true;
            _uow.OtpXacThucs.Update(otp);
            await _uow.SaveChangesAsync();
            return (null, new AuthServiceError("Ma OTP da het han. Vui long gui lai ma moi."));
        }

        if (otp.SoLanSai >= MaxOtpFailures)
        {
            otp.DaSuDung = true;
            _uow.OtpXacThucs.Update(otp);
            await _uow.SaveChangesAsync();
            return (null, new AuthServiceError("Ma OTP da bi khoa do nhap sai qua nhieu lan."));
        }

        if (otp.Otp != normalizedCode)
        {
            otp.SoLanSai += 1;
            if (otp.SoLanSai >= MaxOtpFailures)
            {
                otp.DaSuDung = true;
                otp.NgayHetHan = now.AddMinutes(OtpLockMinutes);
            }

            _uow.OtpXacThucs.Update(otp);
            await _uow.SaveChangesAsync();
            return (null, new AuthServiceError("Ma OTP khong chinh xac."));
        }

        if (consume)
        {
            otp.DaSuDung = true;
            _uow.OtpXacThucs.Update(otp);
        }

        return (otp, null);
    }

    private AuthResponse ToAuthResponse(NguoiDung user)
        => new()
        {
            UserId = user.MaNguoiDung,
            Name = user.HoTen,
            Email = user.Email,
            Role = user.VaiTro ?? Roles.Traveler.ToUpperInvariant(),
            Token = _jwt.GenerateToken(user),
            AccessTokenExpiresAt = _jwt.GetAccessTokenExpiry(),
            RequiresVerification = string.Equals(user.TrangThai, PendingVerificationStatus, StringComparison.OrdinalIgnoreCase)
        };

    private async Task<(string Token, DateTime ExpiresAt)> IssueRefreshTokenAsync(NguoiDung user, bool saveChanges = true)
    {
        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var expiresAt = DateTime.UtcNow.AddDays(RefreshTokenDays);
        await _uow.RefreshTokens.AddAsync(new RefreshToken
        {
            MaNguoiDung = user.MaNguoiDung,
            RefreshToken1 = HashRefreshToken(rawToken),
            NgayHetHan = expiresAt,
            DaThuHoi = false
        });

        if (saveChanges) await _uow.SaveChangesAsync();
        return (rawToken, expiresAt);
    }

    private static string HashRefreshToken(string token)
        => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    private object OtpIssuedResponse(NguoiDung user, (string Code, DateTime ExpiresAt) otp, string purpose, string message)
        => new
        {
            success = true,
            message,
            email = user.Email,
            purpose,
            devOtp = _showDevOtp ? otp.Code : null,
            expiresAt = otp.ExpiresAt
        };

    private async Task<AuthServiceError?> GetOtpIssuanceErrorAsync(NguoiDung user, DateTime now)
    {
        var recent = await _uow.OtpXacThucs.GetQueryable()
            .Where(item => item.MaNguoiDung == user.MaNguoiDung)
            .OrderByDescending(item => item.MaOtp)
            .FirstOrDefaultAsync();

        if (recent == null) return null;
        if (recent.SoLanSai >= MaxOtpFailures && recent.NgayHetHan > now)
        {
            return new AuthServiceError("OTP tam khoa 15 phut do nhap sai qua nhieu lan.", 429);
        }

        var estimatedCreatedAt = recent.NgayHetHan.AddMinutes(-OtpMinutes);
        var retryAt = estimatedCreatedAt.AddSeconds(OtpResendCooldownSeconds);
        if (!recent.DaSuDung && retryAt > now)
        {
            var seconds = Math.Max(1, (int)Math.Ceiling((retryAt - now).TotalSeconds));
            return new AuthServiceError($"Vui long doi {seconds} giay truoc khi gui lai OTP.", 429);
        }

        return null;
    }

    private static string NormalizeOtpPurpose(string? value)
    {
        var normalized = TrimToNull(value)?.ToUpperInvariant();
        return normalized is "RESET" or "PASSWORD_RESET" or "FORGOT_PASSWORD" ? "RESET" : "REGISTER";
    }

    private static string NormalizeRole(string? value)
    {
        var normalized = TrimToNull(value)?.ToUpperInvariant();
        return normalized is "PROVIDER" or "BLOGGER" ? normalized : Roles.Traveler.ToUpperInvariant();
    }

    private static string? NormalizeEmail(string? value)
        => TrimToNull(value)?.ToLowerInvariant();

    private static bool IsBlocked(NguoiDung user)
        => string.Equals(user.TrangThai, BannedStatus, StringComparison.OrdinalIgnoreCase)
            || string.Equals(user.TrangThai, InactiveStatus, StringComparison.OrdinalIgnoreCase);

    private static bool IsPasswordStrong(string? password)
        => password is { Length: >= 8 }
            && password.Any(char.IsUpper)
            && password.Any(char.IsLower)
            && password.Any(char.IsDigit);

    private static string? TrimToNull(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }
}
