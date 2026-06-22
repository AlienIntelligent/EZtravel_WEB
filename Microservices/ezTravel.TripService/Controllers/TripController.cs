using System.Security.Claims;
using ezTravel.DTO.Requests;
using ezTravel.DTO.Trips;
using ezTravel.Services.Trips;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.TripService.Controllers;

[ApiController]
[Route("api/trips")]
[Authorize]
public class TripController : ControllerBase
{
    private readonly ITripService _tripService;

    public TripController(ITripService tripService)
    {
        _tripService = tripService;
    }

    private int UserId
        => int.TryParse(
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub"),
            out var userId)
            ? userId
            : 0;

    [HttpGet]
    public async Task<IActionResult> GetTrips()
        => FromTripResult(await _tripService.GetUserTripsAsync(UserId));

    [HttpPost]
    public async Task<IActionResult> CreateTrip([FromBody] CreateTripRequest request)
        => FromTripResult(await _tripService.CreateTripAsync(request, UserId));

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTrip(int id, [FromBody] UpdateTripRequest request)
        => FromTripResult(await _tripService.UpdateTripAsync(id, request, UserId));

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTrip(int id)
        => FromTripResult(await _tripService.DeleteTripAsync(id, UserId));

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrip(int id)
        => FromTripResult(await _tripService.GetTripByIdAsync(id, UserId));

    [HttpGet("{id:int}/timeline")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTimeline(int id)
        => FromTripResult(await _tripService.GetTimelineAsync(id, UserId));

    [HttpPut("{id:int}/timeline")]
    public async Task<IActionResult> UpdateTimeline(int id, [FromBody] UpdateTimelineRequest request)
        => FromTripResult(await _tripService.UpdateTimelineAsync(id, request, UserId));

    [HttpPost("{id:int}/clone")]
    public async Task<IActionResult> CloneTrip(int id)
        => FromTripResult(await _tripService.CloneTripAsync(id, UserId));

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingTrips()
        => FromTripResult(await _tripService.GetUpcomingTripsAsync(UserId));

    [HttpGet("/api/traveler/dashboard/stats")]
    public async Task<IActionResult> GetDashboardStats()
        => FromTripResult(await _tripService.GetTravelerDashboardStatsAsync(UserId));

    private IActionResult FromTripResult(object result)
        => result is TripServiceError error
            ? StatusCode(error.StatusCode, new { error = error.Message })
            : Ok(result);
}
