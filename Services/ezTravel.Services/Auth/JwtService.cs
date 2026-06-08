using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ezTravel.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ezTravel.Services.Auth;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(NguoiDung user)
    {
        var jwt = _config.GetSection("JwtSettings");
        var key = jwt["SecretKey"];

        var claims = new[]
        {
            new Claim("sub", user.MaNguoiDung.ToString()),
            new Claim("email", user.Email),
            new Claim("role", user.VaiTro)
        };

        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(jwt["ExpiryMinutes"]!)),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
