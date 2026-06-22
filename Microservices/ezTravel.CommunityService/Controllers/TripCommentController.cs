using System.Security.Claims;
using ezTravel.DTO.Requests;
using ezTravel.Services.Community;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.CommunityService.Controllers;

[ApiController]
[Route("api/trips/{tripId:int}/comments")]
[Authorize]
public class TripCommentController : ControllerBase
{
    private readonly ITripCommentService _tripCommentService;

    public TripCommentController(ITripCommentService tripCommentService)
    {
        _tripCommentService = tripCommentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetComments(int tripId)
        => FromResult(await _tripCommentService.GetCommentsAsync(tripId, UserId));

    [HttpPost]
    public async Task<IActionResult> PostComment(
        int tripId,
        [FromBody] PostCommentRequest request)
        => FromResult(await _tripCommentService.PostCommentAsync(tripId, request, UserId));

    private int UserId
    {
        get
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return int.TryParse(value, out var userId) ? userId : 0;
        }
    }

    private IActionResult FromResult(object result)
        => result is TripCommentServiceError error
            ? StatusCode(error.StatusCode, new { message = error.Message })
            : Ok(result);
}
