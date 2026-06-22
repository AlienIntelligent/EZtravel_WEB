using ezTravel.Common.Responses;
using ezTravel.DTO.Auth;
using ezTravel.DTO.Requests;
using ezTravel.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.AuthService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _auth.LoginAsync(request);
        WriteRefreshCookie(response.Data);
        return FromBaseResponse(response);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var response = await _auth.RefreshAsync(Request.Cookies["eztravel_refresh"]);
        WriteRefreshCookie(response.Data);
        return response.Success
            ? Ok(response)
            : Unauthorized(new { success = false, message = response.Message });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _auth.RevokeAsync(Request.Cookies["eztravel_refresh"]);
        Response.Cookies.Delete("eztravel_refresh", RefreshCookieOptions(DateTimeOffset.UtcNow.AddDays(-1)));
        return Ok(new { success = true });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        => FromBaseResponse(await _auth.RegisterAsync(request));

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        => FromAuthResult(await _auth.VerifyOtpAsync(request));

    [HttpPost("resend-otp")]
    public async Task<IActionResult> ResendOtp([FromBody] ResendOtpRequest request)
        => FromAuthResult(await _auth.ResendOtpAsync(request));

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        => FromAuthResult(await _auth.ForgotPasswordAsync(request));

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        => FromAuthResult(await _auth.ResetPasswordAsync(request));

    private IActionResult FromBaseResponse<T>(BaseResponse<T> response)
        => response.Success
            ? Ok(response)
            : BadRequest(new { success = false, message = response.Message });

    private IActionResult FromAuthResult(object result)
        => result is AuthServiceError error
            ? StatusCode(error.StatusCode, new { success = false, message = error.Message })
            : Ok(result);

    private void WriteRefreshCookie(AuthResponse? response)
    {
        if (response?.RefreshToken == null || !response.RefreshTokenExpiresAt.HasValue) return;
        Response.Cookies.Append(
            "eztravel_refresh",
            response.RefreshToken,
            RefreshCookieOptions(response.RefreshTokenExpiresAt.Value));
    }

    private CookieOptions RefreshCookieOptions(DateTimeOffset expires)
        => new()
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Strict,
            Expires = expires,
            IsEssential = true,
            Path = "/api/auth"
        };
}
