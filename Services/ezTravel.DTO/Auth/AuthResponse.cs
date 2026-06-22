using System.Text.Json.Serialization;

namespace ezTravel.DTO.Auth;

public class AuthResponse
{
    public int UserId { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Token { get; set; } = null!;
    public DateTime AccessTokenExpiresAt { get; set; }
    [JsonIgnore]
    public string? RefreshToken { get; set; }
    [JsonIgnore]
    public DateTime? RefreshTokenExpiresAt { get; set; }
    public bool RequiresVerification { get; set; }
    public string? DevOtp { get; set; }
    public DateTime? OtpExpiresAt { get; set; }
}
