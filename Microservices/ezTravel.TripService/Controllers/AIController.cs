using System.Security.Claims;
using ezTravel.DTO.Requests;
using ezTravel.Services.AI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.TripService.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AIController : ControllerBase
{
    private readonly IAIChatService _chatService;
    private readonly IAITripGenerationService _tripGenService;
    private readonly IAIRouteOptimizationService _routeOptService;
    private readonly IAIBudgetAnalysisService _budgetAnalysisService;

    public AIController(
        IAIChatService chatService,
        IAITripGenerationService tripGenService,
        IAIRouteOptimizationService routeOptService,
        IAIBudgetAnalysisService budgetAnalysisService)
    {
        _chatService = chatService;
        _tripGenService = tripGenService;
        _routeOptService = routeOptService;
        _budgetAnalysisService = budgetAnalysisService;
    }

    private int UserId
    {
        get
        {
            var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return int.TryParse(rawUserId, out var userId) ? userId : 0;
        }
    }

    [HttpPost("generate")]
    public async Task<IActionResult> GenerateTrip([FromBody] GenerateTripRequest request)
    {
        return Ok(await _tripGenService.GenerateTripAsync(request, UserId));
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatMessageRequest request)
    {
        return Ok(await _chatService.SendMessageAsync(request, UserId));
    }

    [HttpPost("optimize-route")]
    public async Task<IActionResult> OptimizeRoute([FromBody] OptimizeRouteRequest request)
    {
        return Ok(await _routeOptService.OptimizeRouteAsync(request, UserId));
    }

    [HttpPost("analyze-budget")]
    public async Task<IActionResult> AnalyzeBudget([FromBody] AnalyzeBudgetRequest request)
    {
        return Ok(await _budgetAnalysisService.AnalyzeBudgetAsync(request, UserId));
    }
}
