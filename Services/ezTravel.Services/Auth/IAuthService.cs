using ezTravel.Common.Responses;
using ezTravel.DTO.Auth;

namespace ezTravel.Services.Auth;

public interface IAuthService
{
    Task<BaseResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
    Task<BaseResponse<AuthResponse>> LoginAsync(LoginRequest request);
}
