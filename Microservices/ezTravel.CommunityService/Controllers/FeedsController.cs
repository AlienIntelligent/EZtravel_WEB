using System.Security.Claims;
using ezTravel.Services.Community;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace ezTravel.CommunityService.Controllers;

[ApiController]
[Route("api/feeds")]
public class FeedsController : ControllerBase
{
    private readonly ICommunityService _communityService;

    public FeedsController(ICommunityService communityService)
    {
        _communityService = communityService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFeeds()
        => Ok(await _communityService.GetFeedsAsync());

    [HttpPost("{tripId}/like")]
    [Authorize]
    public async Task<IActionResult> LikeTrip(int tripId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        return Ok(await _communityService.LikeTripAsync(userId, tripId));
    }

    [HttpPost("{tripId}/comment")]
    [Authorize]
    public async Task<IActionResult> CommentOnTrip(int tripId, [FromBody] string content)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        return Ok(await _communityService.CommentOnTripAsync(userId, tripId, content));
    }

    [HttpGet("{tripId}/comments")]
    public async Task<IActionResult> GetComments(int tripId)
        => Ok(await _communityService.GetTripCommentsAsync(tripId));
}
