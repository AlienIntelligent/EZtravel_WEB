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

    [HttpGet("trips")]
    public async Task<IActionResult> GetPublicTrips([FromQuery] string? keyword)
        => Ok(await _communityService.GetPublicTripsAsync(keyword));

    [HttpPost("trips/{id}/visibility")]
    [Authorize]
    public async Task<IActionResult> ToggleVisibility(int id, [FromBody] bool isPublic)
    {
        var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? "0");
        return Ok(await _communityService.ToggleTripVisibilityAsync(id, isPublic, userId));
    }
}
