using System.Security.Claims;
using ezTravel.DTO.Providers;
using ezTravel.DTO.Requests;
using ezTravel.Services.Providers;
using ezTravel.BookingService.ProviderDocuments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.BookingService.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class ProviderController : ControllerBase
{
    private readonly IProviderService _providerService;
    private readonly INccPackageService _packageService;
    private readonly IProviderDocumentStorage _documentStorage;

    public ProviderController(
        IProviderService providerService,
        INccPackageService packageService,
        IProviderDocumentStorage documentStorage)
    {
        _providerService = providerService;
        _packageService = packageService;
        _documentStorage = documentStorage;
    }

    private int UserId
    {
        get
        {
            var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return int.TryParse(rawUserId, out var userId) ? userId : 0;
        }
    }

    [HttpPost("provider/register")]
    public async Task<IActionResult> Register([FromBody] RegisterProviderRequest request)
    {
        return FromProviderResult(await _providerService.RegisterProviderAsync(request, UserId));
    }

    [HttpPost("provider/upload-docs")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(6 * 1024 * 1024)]
    public async Task<IActionResult> UploadDocs(
        [FromForm] UploadProviderDocumentForm request,
        CancellationToken cancellationToken)
    {
        if (request.File == null)
        {
            return BadRequest(new { message = "Can chon tep ho so." });
        }

        StoredProviderDocument storedDocument;
        try
        {
            storedDocument = await _documentStorage.StoreAsync(request.File, cancellationToken);
        }
        catch (ProviderDocumentValidationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }

        var result = await _providerService.SaveProviderDocumentAsync(
            new SaveProviderDocumentRequest
            {
                DocumentType = request.DocumentType,
                OriginalFileName = storedDocument.OriginalFileName,
                StoredFileName = storedDocument.StoredFileName,
                ContentType = storedDocument.ContentType,
                FileSize = storedDocument.FileSize
            },
            UserId);

        if (result is ProviderServiceError)
        {
            await _documentStorage.DeleteAsync(storedDocument.StoredFileName, cancellationToken);
        }

        return FromProviderResult(result);
    }

    [HttpGet("provider/documents/{id:int}/download")]
    public async Task<IActionResult> DownloadDocument(int id, CancellationToken cancellationToken)
    {
        var result = await _providerService.GetProviderDocumentFileAsync(
            id,
            UserId,
            User.IsInRole("ADMIN"));

        if (result is ProviderServiceError error)
        {
            return FromProviderResult(error);
        }

        var document = (ProviderDocumentFileResult)result;
        var stream = await _documentStorage.OpenReadAsync(document.StoredFileName, cancellationToken);
        if (stream == null)
        {
            return NotFound(new { message = "Tep ho so khong con ton tai trong storage." });
        }

        return File(stream, document.ContentType, document.OriginalFileName);
    }

    [HttpGet("provider/status")]
    public async Task<IActionResult> GetStatus()
    {
        return Ok(await _providerService.GetProviderStatusAsync(UserId));
    }

    [HttpGet("provider/stats")]
    public async Task<IActionResult> GetStats()
    {
        return Ok(await _providerService.GetProviderDashboardStatsAsync(UserId));
    }

    [HttpGet("provider/services")]
    public async Task<IActionResult> GetServices([FromQuery] string? category, [FromQuery] string? keyword)
    {
        return Ok(await _providerService.GetProviderServicesAsync(UserId, category, keyword));
    }

    [HttpPost("provider/services")]
    public async Task<IActionResult> CreateService([FromBody] CreateServiceRequest request)
    {
        return FromProviderResult(await _providerService.CreateServiceAsync(request, UserId));
    }

    [HttpPut("provider/services/{id}")]
    public async Task<IActionResult> UpdateService(int id, [FromBody] UpdateServiceRequest request)
    {
        return FromProviderResult(await _providerService.UpdateServiceAsync(id, request, UserId));
    }

    [HttpDelete("provider/services/{id}")]
    public async Task<IActionResult> DeleteService(int id)
    {
        return FromProviderResult(await _providerService.DeleteServiceAsync(id, UserId));
    }

    [HttpGet("provider/reviews")]
    public async Task<IActionResult> GetReviews()
    {
        return Ok(await _providerService.GetProviderReviewsAsync(UserId));
    }

    [HttpPost("provider/reviews/{id}/reply")]
    public async Task<IActionResult> ReplyReview(int id, [FromBody] ReplyReviewRequest request)
    {
        return FromProviderResult(await _providerService.ReplyReviewAsync(id, request, UserId));
    }

    [HttpGet("packages/provider")]
    public async Task<IActionResult> GetPackages()
    {
        return FromPackageResult(await _packageService.GetPackagesAsync(UserId));
    }

    [HttpGet("provider/packages/current")]
    public async Task<IActionResult> GetCurrentPackage()
    {
        return Ok(await _packageService.GetCurrentPackageAsync(UserId));
    }

    [HttpGet("provider/packages/history")]
    public async Task<IActionResult> GetPackageHistory()
    {
        return FromPackageResult(await _packageService.GetPackageHistoryAsync(UserId));
    }

    [HttpGet("provider/packages/payments")]
    public async Task<IActionResult> GetPaymentHistory()
    {
        return FromPackageResult(await _packageService.GetPaymentHistoryAsync(UserId));
    }

    [HttpPost("provider/packages/subscribe-simulated")]
    public async Task<IActionResult> SubscribePackage([FromBody] RegisterPackageRequest request)
    {
        return FromPackageResult(await _packageService.SubscribeSimulatedAsync(request, UserId));
    }

    private IActionResult FromProviderResult(object result)
    {
        return result is ProviderServiceError error
            ? StatusCode(error.StatusCode, error)
            : Ok(result);
    }

    private IActionResult FromPackageResult(object? result)
    {
        return result is NccPackageServiceError error
            ? StatusCode(error.StatusCode, error)
            : Ok(result);
    }
}
