using ezTravel.DTO.Notifications;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Notifications;

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _uow;

    public NotificationService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId)
    {
        if (userId <= 0)
        {
            return Enumerable.Empty<NotificationDto>();
        }

        var notifications = await _uow.ThongBaos.GetQueryable()
            .Where(n => n.MaNguoiDung == userId)
            .OrderBy(n => n.DaDoc)
            .ThenByDescending(n => n.NgayTao)
            .Take(50)
            .ToListAsync();

        return notifications.Select(MapNotification).ToList();
    }

    public async Task<NotificationDto?> MarkAsReadAsync(int notificationId, int userId)
    {
        if (userId <= 0)
        {
            return null;
        }

        var notification = await _uow.ThongBaos.GetQueryable()
            .FirstOrDefaultAsync(n =>
                n.MaThongBao == notificationId &&
                n.MaNguoiDung == userId);

        if (notification == null)
        {
            return null;
        }

        if (!notification.DaDoc)
        {
            notification.DaDoc = true;
            _uow.ThongBaos.Update(notification);
            await _uow.SaveChangesAsync();
        }

        return MapNotification(notification);
    }

    public async Task<NotificationDto?> CreateNotificationAsync(int userId, string title, string content, string type)
    {
        if (userId <= 0)
        {
            return null;
        }

        var userExists = await _uow.NguoiDungs.AnyAsync(u => u.MaNguoiDung == userId);
        if (!userExists)
        {
            return null;
        }

        var notification = new ThongBao
        {
            MaNguoiDung = userId,
            LoaiThongBao = TrimToNull(type) ?? "SYSTEM",
            TieuDe = TrimToNull(title) ?? "Thong bao",
            NoiDung = TrimToNull(content) ?? string.Empty,
            DaDoc = false,
            NgayTao = DateTime.UtcNow
        };

        await _uow.ThongBaos.AddAsync(notification);
        await _uow.SaveChangesAsync();

        return MapNotification(notification);
    }

    private static NotificationDto MapNotification(ThongBao notification)
    {
        return new NotificationDto
        {
            Id = notification.MaThongBao,
            Title = notification.TieuDe,
            Content = notification.NoiDung,
            Message = notification.NoiDung,
            Type = notification.LoaiThongBao,
            Link = notification.DuongDan,
            IsRead = notification.DaDoc,
            CreatedAt = notification.NgayTao
        };
    }

    private static string? TrimToNull(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
