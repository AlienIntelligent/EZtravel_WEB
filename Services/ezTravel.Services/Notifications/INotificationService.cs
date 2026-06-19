using ezTravel.DTO.Notifications;

namespace ezTravel.Services.Notifications;

public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId);
    Task<bool> MarkAsReadAsync(int notificationId);
    Task<bool> CreateNotificationAsync(int userId, string title, string content, string type);
}
