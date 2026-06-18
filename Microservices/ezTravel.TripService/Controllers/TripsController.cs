using System.Security.Claims;
using ezTravel.DTO.Trips;
using ezTravel.Services.Trips;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace ezTravel.TripService.Controllers;

[ApiController]
[Route("api/trips")]
[Authorize]
public class TripsController : ControllerBase
{
    private readonly ITripService _tripService;

    public TripsController(ITripService tripService)
    {
        _tripService = tripService;
    }

    private int UserId => int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? "0");

    [HttpGet]
    public async Task<IActionResult> GetMyTrips()
        => Ok(await _tripService.GetUserTripsAsync(UserId));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTrip(int id)
    {
        var trip = await _tripService.GetTripByIdAsync(id, UserId);
        return trip != null ? Ok(trip) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> CreateTrip(CreateTripRequest request)
        => Ok(await _tripService.CreateTripAsync(request, UserId));

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTrip(int id, UpdateTripRequest request)
        => Ok(await _tripService.UpdateTripAsync(id, request, UserId));

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrip(int id)
        => Ok(await _tripService.DeleteTripAsync(id, UserId));

    // Items management
    [HttpPost("{id}/locations")]
    public async Task<IActionResult> AddLocation(int id, AddLocationRequest request)
        => Ok(await _tripService.AddLocationToTripAsync(id, request, UserId));

    [HttpDelete("{id}/items/{itemId}")]
    public async Task<IActionResult> RemoveLocation(int id, int itemId)
        => Ok(await _tripService.RemoveLocationFromTripAsync(id, itemId, UserId));

    [HttpPut("{id}/reorder")]
    public async Task<IActionResult> ReorderItems(int id, ReorderItemsRequest request)
        => Ok(await _tripService.ReorderItemsAsync(id, request, UserId));

    [HttpGet("{id}/cost")]
    public async Task<IActionResult> GetCost(int id)
        => Ok(await _tripService.CalculateTotalCostAsync(id));

    [HttpPost("{id}/clone")]
    public async Task<IActionResult> CloneTrip(int id)
        => Ok(await _tripService.CloneTripAsync(id, UserId));
}
