using System.Security.Claims;
using ezTravel.DTO.Requests;
using ezTravel.Services.Subscriptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.BookingService.Controllers;

[ApiController]
[Route("api/packages/traveler")]
[Authorize]
public class TravelerPackageController : ControllerBase
{
    private readonly ITravelerPackageService _packageService;

    public TravelerPackageController(ITravelerPackageService packageService)
    {
        _packageService = packageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPackages()
        => FromResult(await _packageService.GetPackagesAsync(UserId));

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentPackage()
        => FromResult(await _packageService.GetCurrentPackageAsync(UserId));

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
        => FromResult(await _packageService.GetHistoryAsync(UserId));

    [HttpPost("subscribe-simulated")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribePackageRequest request)
        => FromResult(await _packageService.SubscribeSimulatedAsync(request, UserId));

    private int UserId
    {
        get
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return int.TryParse(value, out var userId) ? userId : 0;
        }
    }

    private IActionResult FromResult(object? result)
        => result is TravelerPackageServiceError error
            ? StatusCode(error.StatusCode, error)
            : Ok(result);
}
