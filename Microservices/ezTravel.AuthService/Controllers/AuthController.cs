using ezTravel.DTO.Auth;
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

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
        => Ok(await _auth.RegisterAsync(request));

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
        => Ok(await _auth.LoginAsync(request));
}
