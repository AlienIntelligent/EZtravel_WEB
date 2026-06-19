using ezTravel.DTO.Places;
using ezTravel.Services.Places;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.PlaceService.Controllers;

[ApiController]
[Route("api/places")]
public class PlacesController : ControllerBase
{
    private readonly IPlaceService _placeService;

    public PlacesController(IPlaceService placeService)
    {
        _placeService = placeService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] PlaceSearchRequest request)
        => Ok(await _placeService.SearchPlacesAsync(request));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var place = await _placeService.GetPlaceByIdAsync(id);
        return place != null ? Ok(place) : NotFound();
    }

    [HttpGet("nearby")]
    public async Task<IActionResult> GetNearby([FromQuery] double lat, [FromQuery] double lng, [FromQuery] double radius = 5)
        => Ok(await _placeService.GetNearbyPlacesAsync(lat, lng, radius));

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
        => Ok(await _placeService.GetCategoriesAsync());
}
