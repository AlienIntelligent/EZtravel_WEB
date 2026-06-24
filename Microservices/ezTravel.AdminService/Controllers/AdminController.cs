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
    private readonly IAdminUploadService _uploadService;
    private readonly IDestinationAdminService _destinationService;
    private readonly IBlogAdminService _blogService;
    private readonly IProviderAdminService _providerService;
    private readonly IServiceAdminService _serviceAdminService;

    public AdminController(
        IAdminService adminService,
        IModerationService moderationService,
        ICategoryService categoryService,
        IAdminUploadService uploadService,
        IDestinationAdminService destinationService,
        IBlogAdminService blogService,
        IProviderAdminService providerService,
        IServiceAdminService serviceAdminService)
    {
        _adminService = adminService;
        _moderationService = moderationService;
        _categoryService = categoryService;
        _uploadService = uploadService;
        _destinationService = destinationService;
        _blogService = blogService;
        _providerService = providerService;
        _serviceAdminService = serviceAdminService;
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

    [HttpGet("providers")]
    public async Task<IActionResult> GetProviders()
        => FromAdminResult(await _providerService.GetAllProvidersAsync());

    [HttpGet("providers/pending")]
    public async Task<IActionResult> GetPendingProviders()
        => FromAdminResult(await _adminService.GetPendingProvidersAsync());

    [HttpPut("providers/{id}/status")]
    public async Task<IActionResult> UpdateProviderStatus(
        int id,
        [FromBody] UpdateProviderStatusRequest request)
        => FromAdminResult(await _adminService.UpdateProviderStatusAsync(id, request.Status, UserId));

    [HttpPut("providers/{id}")]
    public async Task<IActionResult> UpdateProvider(int id, [FromBody] UpsertProviderAdminRequest request)
        => FromAdminResult(await _providerService.UpdateProviderAsync(id, request));

    [HttpDelete("providers/{id}")]
    public async Task<IActionResult> DeleteProvider(int id)
        => FromAdminResult(await _providerService.DeleteProviderAsync(id));

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

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryRequest request)
        => FromAdminResult(await _categoryService.UpdateCategoryAsync(id, request));

    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
        => FromAdminResult(await _categoryService.DeleteCategoryAsync(id));

    [HttpGet("destinations")]
    public async Task<IActionResult> GetDestinations()
        => FromAdminResult(await _destinationService.GetDestinationsAsync());

    [HttpPost("destinations")]
    public async Task<IActionResult> CreateDestination([FromBody] UpsertDestinationRequest request)
        => FromAdminResult(await _destinationService.CreateDestinationAsync(request));

    [HttpPut("destinations/{id}")]
    public async Task<IActionResult> UpdateDestination(int id, [FromBody] UpsertDestinationRequest request)
        => FromAdminResult(await _destinationService.UpdateDestinationAsync(id, request));

    [HttpDelete("destinations/{id}")]
    public async Task<IActionResult> DeleteDestination(int id)
        => FromAdminResult(await _destinationService.DeleteDestinationAsync(id));

    [HttpGet("blogs")]
    public async Task<IActionResult> GetBlogs()
        => FromAdminResult(await _blogService.GetBlogsAsync());

    [HttpPost("blogs")]
    public async Task<IActionResult> CreateBlog([FromBody] UpsertBlogAdminRequest request)
        => FromAdminResult(await _blogService.CreateBlogAsync(request, UserId));

    [HttpPut("blogs/{id}")]
    public async Task<IActionResult> UpdateBlog(int id, [FromBody] UpsertBlogAdminRequest request)
        => FromAdminResult(await _blogService.UpdateBlogAsync(id, request));

    [HttpPut("blogs/{id}/status")]
    public async Task<IActionResult> UpdateBlogStatus(int id, [FromBody] UpdateBlogStatusAdminRequest request)
        => FromAdminResult(await _blogService.UpdateBlogStatusAsync(id, request.Status));

    [HttpDelete("blogs/{id}")]
    public async Task<IActionResult> DeleteBlog(int id)
        => FromAdminResult(await _blogService.DeleteBlogAsync(id));

    [HttpGet("services")]
    public async Task<IActionResult> GetServices()
        => FromAdminResult(await _serviceAdminService.GetAllServicesAsync());

    [HttpPut("services/{id}/status")]
    public async Task<IActionResult> UpdateServiceStatus(int id, [FromBody] UpdateBlogStatusAdminRequest request)
        => FromAdminResult(await _serviceAdminService.UpdateServiceStatusAsync(id, request.Status));

    [HttpPut("services/{id}")]
    public async Task<IActionResult> UpdateService(int id, [FromBody] UpsertServiceAdminRequest request)
        => FromAdminResult(await _serviceAdminService.UpdateServiceAsync(id, request));

    [HttpDelete("services/{id}")]
    public async Task<IActionResult> DeleteService(int id)
        => FromAdminResult(await _serviceAdminService.DeleteServiceAsync(id));

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        try
        {
            var url = await _uploadService.UploadImageAsync(file);
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("uploads/{filename}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUploadedImage(string filename)
    {
        var stream = await _uploadService.GetImageStreamAsync(filename);
        if (stream == null)
            return NotFound();

        var contentType = _uploadService.GetContentType(filename);
        return File(stream, contentType);
    }

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
