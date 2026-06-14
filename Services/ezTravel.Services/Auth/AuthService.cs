using BCrypt.Net;
using ezTravel.Common.Responses;
using ezTravel.DTO.Auth;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Auth;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _uow;
    private readonly JwtService _jwt;

    public AuthService(IUnitOfWork uow, JwtService jwt)
    {
        _uow = uow;
        _jwt = jwt;
    }

    public async Task<BaseResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        var exists = await _uow.NguoiDungs.AnyAsync(x => x.Email == request.Email);
        if (exists)
            return BaseResponse<AuthResponse>.Fail("Email đã tồn tại");

        var user = new NguoiDung
        {
            HoTen = request.HoTen,
            Email = request.Email,
            MatKhau = BCrypt.Net.BCrypt.HashPassword(request.MatKhau),
            VaiTro = request.VaiTro ?? ezTravel.Common.Constants.Roles.Traveler
        };

        await _uow.NguoiDungs.AddAsync(user);
        await _uow.SaveChangesAsync();

        return BaseResponse<AuthResponse>.Ok(new AuthResponse
        {
            UserId = user.MaNguoiDung,
            Name = user.HoTen,
            Email = user.Email,
            Role = user.VaiTro ?? "Traveler",
            Token = _jwt.GenerateToken(user)
        });
    }

    public async Task<BaseResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _uow.NguoiDungs
            .FirstOrDefaultAsync(x => x.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.MatKhau, user.MatKhau))
            return BaseResponse<AuthResponse>.Fail("Sai email hoặc mật khẩu");

        return BaseResponse<AuthResponse>.Ok(new AuthResponse
        {
            UserId = user.MaNguoiDung,
            Name = user.HoTen,
            Email = user.Email,
            Role = user.VaiTro ?? "Traveler",
            Token = _jwt.GenerateToken(user)
        });
    }
}
