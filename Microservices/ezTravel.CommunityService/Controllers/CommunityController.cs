using System.Security.Claims;
using ezTravel.Services.Community;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.CommunityService.Controllers;

[ApiController]
public class CommunityController : ControllerBase
{
    private readonly ICommunityService _communityService;

    public CommunityController(ICommunityService communityService)
    {
        _communityService = communityService;
    }

    [HttpGet("api/community/feed")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeed()
        => FromCommunityResult(await _communityService.GetFeedsAsync());

    [HttpPost("api/trips/{id}/like")]
    [Authorize]
    public async Task<IActionResult> LikeTrip(int id)
        => FromCommunityResult(await _communityService.LikeTripAsync(UserId, id));

    [HttpGet("api/public/home/trending-trips")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrendingTrips()
        => FromCommunityResult(await _communityService.GetTrendingTripsAsync());

    [HttpGet("api/community/top-bloggers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTopBloggers()
        => FromCommunityResult(await _communityService.GetTopBloggersAsync());

    [HttpPost("api/users/{id}/follow")]
    [Authorize]
    public async Task<IActionResult> FollowUser(int id)
        => FromCommunityResult(await _communityService.FollowUserAsync(UserId, id));

    private int UserId
    {
        get
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return int.TryParse(value, out var userId) ? userId : 0;
        }
    }

    private IActionResult FromCommunityResult(object result)
        => result is CommunityServiceError error
            ? StatusCode(error.StatusCode, new { message = error.Message })
            : Ok(result);
}
