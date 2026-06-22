using ezTravel.Common.Responses;
using ezTravel.DTO.Auth;
using ezTravel.DTO.Requests;

namespace ezTravel.Services.Auth;

public interface IAuthService
{
    Task<BaseResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
    Task<BaseResponse<AuthResponse>> LoginAsync(LoginRequest request);
    Task<BaseResponse<AuthResponse>> RefreshAsync(string? refreshToken);
    Task<object> RevokeAsync(string? refreshToken);
    Task<BaseResponse<AuthResponse>> GetMeAsync(int userId);
    Task<object> VerifyOtpAsync(VerifyOtpRequest request);
    Task<object> ResendOtpAsync(ResendOtpRequest request);
    Task<object> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<object> ResetPasswordAsync(ResetPasswordRequest request);
}
