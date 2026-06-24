using ezTravel.DTO.Places;
using ezTravel.Services.Places;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.PlaceService.Controllers;

[ApiController]
public class ExploreController : ControllerBase
{
    private readonly IPlaceService _placeService;
    private readonly IExploreService _exploreService;

    public ExploreController(IPlaceService placeService, IExploreService exploreService)
    {
        _placeService = placeService;
        _exploreService = exploreService;
    }

    [HttpGet("api/categories/regions")]
    public async Task<IActionResult> GetRegions()
        => Ok(await _placeService.GetTinhThanhsAsync());

    [HttpGet("api/categories/tags")]
    public async Task<IActionResult> GetTags()
        => Ok(await _exploreService.GetTagsAsync());

    [HttpGet("api/explore")]
    public async Task<IActionResult> Explore([FromQuery] PlaceSearchRequest request)
        => Ok(await _exploreService.SearchExploreAsync(request));

    [HttpGet("api/destinations/{id:int}")]
    public async Task<IActionResult> GetDestination(int id)
    {
        var destination = await _placeService.GetPlaceByIdAsync(id);
        return destination == null ? NotFound(new { error = "Khong tim thay dia diem." }) : Ok(destination);
    }

    [HttpGet("api/destinations/{id:int}/services")]
    public async Task<IActionResult> GetDestinationServices(int id)
        => Ok(await _exploreService.GetDestinationServicesAsync(id));

    [HttpGet("api/public/home/trending-destinations")]
    public async Task<IActionResult> GetTrendingDestinations()
        => Ok(await _exploreService.GetTrendingDestinationsAsync());

    [HttpGet("api/explore/nearby")]
    public async Task<IActionResult> GetNearbyResources([FromQuery] int placeId)
    {
        if (placeId <= 0) return BadRequest(new { error = "placeId là bắt buộc." });
        return Ok(await _exploreService.GetNearbyResourcesAsync(placeId));
    }
}
