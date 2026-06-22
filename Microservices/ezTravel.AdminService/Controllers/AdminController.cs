using System.Security.Claims;
using ezTravel.DTO.Requests;
using ezTravel.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.AdminService.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "ADMIN")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly IModerationService _moderationService;
    private readonly ICategoryService _categoryService;

    public AdminController(
        IAdminService adminService,
        IModerationService moderationService,
        ICategoryService categoryService)
    {
        _adminService = adminService;
        _moderationService = moderationService;
        _categoryService = categoryService;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
        => FromAdminResult(await _adminService.GetAllUsersAsync());

    [HttpPut("users/{id}/status")]
    public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UpdateUserStatusRequest request)
        => FromAdminResult(await _adminService.UpdateUserStatusAsync(id, request.Status));

    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleRequest request)
        => FromAdminResult(await _adminService.UpdateUserRoleAsync(id, request.Role));

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
        => FromAdminResult(await _adminService.GetDashboardStatsAsync());

    [HttpGet("alerts")]
    public async Task<IActionResult> GetAlerts()
        => FromAdminResult(await _adminService.GetAlertsAsync());

    [HttpGet("providers/pending")]
    public async Task<IActionResult> GetPendingProviders()
        => FromAdminResult(await _adminService.GetPendingProvidersAsync());

    [HttpPut("providers/{id}/status")]
    public async Task<IActionResult> UpdateProviderStatus(
        int id,
        [FromBody] UpdateProviderStatusRequest request)
        => FromAdminResult(await _adminService.UpdateProviderStatusAsync(id, request.Status, UserId));

    [HttpGet("provider-packages")]
    public async Task<IActionResult> GetProviderPackages()
        => FromAdminResult(await _adminService.GetProviderPackagesAsync());

    [HttpPost("provider-packages")]
    public async Task<IActionResult> CreateProviderPackage(
        [FromBody] UpsertProviderPackageRequest request)
        => FromAdminResult(await _adminService.CreateProviderPackageAsync(request));

    [HttpPut("provider-packages/{id}")]
    public async Task<IActionResult> UpdateProviderPackage(
        int id,
        [FromBody] UpsertProviderPackageRequest request)
        => FromAdminResult(await _adminService.UpdateProviderPackageAsync(id, request));

    [HttpPut("provider-packages/{id}/status")]
    public async Task<IActionResult> UpdateProviderPackageStatus(
        int id,
        [FromBody] UpdateProviderPackageStatusRequest request)
        => FromAdminResult(await _adminService.UpdateProviderPackageStatusAsync(id, request.IsActive));

    [HttpGet("moderation")]
    public async Task<IActionResult> GetModerationQueue()
        => FromAdminResult(await _moderationService.GetModerationQueueAsync());

    [HttpPost("moderation/{id}/resolve")]
    public async Task<IActionResult> ResolveModeration(int id, [FromBody] ResolveModerationRequest request)
        => FromAdminResult(await _moderationService.ResolveItemAsync(id, request.Action, UserId));

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
        => FromAdminResult(await _categoryService.GetCategoriesAsync());

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
        => FromAdminResult(await _categoryService.CreateCategoryAsync(request));

    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
        => FromAdminResult(await _categoryService.DeleteCategoryAsync(id));

    private int UserId
    {
        get
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return int.TryParse(value, out var userId) ? userId : 0;
        }
    }

    private IActionResult FromAdminResult(object result)
        => result is AdminServiceError error
            ? StatusCode(error.StatusCode, new { message = error.Message })
            : Ok(result);
}
