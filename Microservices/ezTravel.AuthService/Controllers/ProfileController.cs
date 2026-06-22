using ezTravel.DTO.Requests;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Security.Claims;
using ezTravel.Services.Auth;
namespace ezTravel.AuthService.Controllers; [ApiController][Route("api/profile")][Authorize] public class ProfileController : ControllerBase { private readonly IProfileService _profileService; public ProfileController(IProfileService profileService) { _profileService = profileService; } private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? "0"); [HttpGet] public async Task<IActionResult> GetProfile() => Ok(await _profileService.GetProfileAsync(UserId)); [HttpPut] public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request) => Ok(await _profileService.UpdateProfileAsync(UserId, request)); [HttpPut("password")] public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request) => Ok(await _profileService.ChangePasswordAsync(UserId, request)); [HttpPost("avatar")] public async Task<IActionResult> UploadAvatar([FromBody] AvatarUploadRequest request) => Ok(await _profileService.UpdateAvatarAsync(UserId, request.AvatarUrl)); }

