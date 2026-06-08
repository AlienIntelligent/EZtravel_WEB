using BCrypt.Net;
using ezTravel.Common.Responses;
using ezTravel.DTO.Auth;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;

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
            return BaseResponse<AuthResponse>.Fail("Email dã t?n t?i");

        var user = new NguoiDung
        {
            HoTen = request.HoTen,
            Email = request.Email,
            MatKhau = BCrypt.Net.BCrypt.HashPassword(request.MatKhau)
        };

        await _uow.NguoiDungs.AddAsync(user);
        await _uow.SaveChangesAsync();

        return BaseResponse<AuthResponse>.Ok(new AuthResponse
        {
            UserId = user.MaNguoiDung,
            Email = user.Email,
            Token = _jwt.GenerateToken(user)
        });
    }

    public async Task<BaseResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _uow.NguoiDungs
            .FirstOrDefaultAsync(x => x.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.MatKhau, user.MatKhau))
            return BaseResponse<AuthResponse>.Fail("Sai email ho?c m?t kh?u");

        return BaseResponse<AuthResponse>.Ok(new AuthResponse
        {
            UserId = user.MaNguoiDung,
            Email = user.Email,
            Token = _jwt.GenerateToken(user)
        });
    }
}
