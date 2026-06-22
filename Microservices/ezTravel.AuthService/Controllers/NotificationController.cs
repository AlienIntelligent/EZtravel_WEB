using System.Security.Claims;
using ezTravel.Services.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.AuthService.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    private int UserId
    {
        get
        {
            var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return int.TryParse(rawUserId, out var userId) ? userId : 0;
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        return Ok(await _notificationService.GetUserNotificationsAsync(UserId));
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var notification = await _notificationService.MarkAsReadAsync(id, UserId);
        return notification == null
            ? NotFound(new { success = false, message = "Khong tim thay thong bao thuoc nguoi dung hien tai." })
            : Ok(notification);
    }
}
