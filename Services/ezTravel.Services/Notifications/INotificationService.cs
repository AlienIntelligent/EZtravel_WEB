using ezTravel.DTO.Notifications;

namespace ezTravel.Services.Notifications;

public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId);
    Task<NotificationDto?> MarkAsReadAsync(int notificationId, int userId);
    Task<NotificationDto?> CreateNotificationAsync(int userId, string title, string content, string type);
}
