using System.Security.Claims;
using ezTravel.DTO.Requests;
using ezTravel.Services.Trips;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.TripService.Controllers;

[ApiController]
[Route("api/trips/{id:int}/collaborators")]
[Authorize]
public class TripCollaboratorController : ControllerBase
{
    private readonly ITripCollaboratorService _collaboratorService;

    public TripCollaboratorController(ITripCollaboratorService collaboratorService)
    {
        _collaboratorService = collaboratorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCollaborators(int id)
        => FromCollaboratorResult(await _collaboratorService.GetCollaboratorsAsync(id, UserId));

    [HttpPost]
    public async Task<IActionResult> ManageCollaborators(int id, [FromBody] ManageCollaboratorRequest request)
        => FromCollaboratorResult(await _collaboratorService.ManageCollaboratorAsync(id, request, UserId));

    private int UserId
    {
        get
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return int.TryParse(value, out var userId) ? userId : 0;
        }
    }

    private IActionResult FromCollaboratorResult(object result)
        => result is TripCollaboratorServiceError error
            ? StatusCode(error.StatusCode, new { error = error.Message })
            : Ok(result);
}
