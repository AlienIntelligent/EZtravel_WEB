using ezTravel.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.AdminService.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
        => Ok(await _adminService.GetAllUsersAsync());

    [HttpPost("users/{id}/lock")]
    public async Task<IActionResult> LockUser(int id)
        => Ok(await _adminService.LockUserAsync(id));

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetStats()
        => Ok(await _adminService.GetDashboardStatsAsync());
}
