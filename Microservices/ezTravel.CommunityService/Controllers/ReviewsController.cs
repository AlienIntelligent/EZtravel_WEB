using System.Security.Claims;
using ezTravel.DTO.Reviews;
using ezTravel.Services.Community;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace ezTravel.CommunityService.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly ICommunityService _communityService;

    public ReviewsController(ICommunityService communityService)
    {
        _communityService = communityService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post(CreateReviewRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? "0");
        return Ok(await _communityService.PostReviewAsync(request, userId));
    }

    [HttpGet("place/{id}")]
    public async Task<IActionResult> GetByPlace(int id)
        => Ok(await _communityService.GetPlaceReviewsAsync(id));

    [HttpGet("service/{id}")]
    public async Task<IActionResult> GetByService(int id)
        => Ok(await _communityService.GetServiceReviewsAsync(id));
}
