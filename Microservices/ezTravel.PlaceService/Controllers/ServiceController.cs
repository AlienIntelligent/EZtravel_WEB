using System.Security.Claims;
using ezTravel.DTO.Requests;
using ezTravel.Services.Places;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.PlaceService.Controllers;

[ApiController]
[Route("api/services")]
public class ServiceController : ControllerBase
{
    private readonly IUnifiedService _unifiedService;

    public ServiceController(IUnifiedService unifiedService)
    {
        _unifiedService = unifiedService;
    }

    private int UserId
        => int.TryParse(
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub"),
            out var userId)
            ? userId
            : 0;

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetService(int id)
        => FromServiceResult(await _unifiedService.GetServiceByIdAsync(id));

    [HttpGet("{id:int}/reviews")]
    public async Task<IActionResult> GetServiceReviews(int id)
        => FromServiceResult(await _unifiedService.GetServiceReviewsAsync(id));

    [HttpPost("{id:int}/reviews")]
    [Authorize]
    public async Task<IActionResult> PostReview(int id, [FromBody] PostReviewRequest request)
        => FromServiceResult(await _unifiedService.PostReviewAsync(id, request, UserId));

    private IActionResult FromServiceResult(object result)
        => result is UnifiedServiceError error
            ? StatusCode(error.StatusCode, new { error = error.Message })
            : Ok(result);
}
