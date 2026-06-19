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
        return await _uow.ThongBaos.GetQueryable()
            .Where(n => n.MaNguoiDung == userId)
            .OrderByDescending(n => n.NgayTao)
            .Select(n => new NotificationDto
            {
                Id = n.MaThongBao,
                Title = n.TieuDe,
                Content = n.NoiDung,
                Type = n.LoaiThongBao,
                IsRead = n.DaDoc,
                CreatedAt = n.NgayTao
            }).ToListAsync();
    }

    public async Task<bool> MarkAsReadAsync(int notificationId)
    {
        var notification = await _uow.ThongBaos.GetByIdAsync(notificationId);
        if (notification == null) return false;

        notification.DaDoc = true;
        _uow.ThongBaos.Update(notification);
        return await _uow.SaveChangesAsync() > 0;
    }

    public async Task<bool> CreateNotificationAsync(int userId, string title, string content, string type)
    {
        var notification = new ThongBao
        {
            MaNguoiDung = userId,
            TieuDe = title,
            NoiDung = content,
            LoaiThongBao = type,
            DaDoc = false,
            NgayTao = DateTime.UtcNow
        };

        await _uow.ThongBaos.AddAsync(notification);
        return await _uow.SaveChangesAsync() > 0;
    }
}
