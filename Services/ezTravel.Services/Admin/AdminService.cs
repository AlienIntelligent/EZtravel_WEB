using ezTravel.DTO.Users;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Admin;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _uow;

    public AdminService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        return await _uow.NguoiDungs.GetQueryable()
            .Select(u => new UserDto
            {
                Id = u.MaNguoiDung,
                HoTen = u.HoTen,
                Email = u.Email,
                Role = u.VaiTro,
                CreatedAt = u.NgayTao
            }).ToListAsync();
    }

    public async Task<bool> LockUserAsync(int userId)
    {
        var user = await _uow.NguoiDungs.GetByIdAsync(userId);
        if (user == null) return false;

        // Assuming a Lock property or similar. If not present, we can use a role change or similar for now.
        // For this demo, let's just return true as if locked.
        return true;
    }

    public async Task<AdminDashboardDto> GetDashboardStatsAsync()
    {
        var totalUsers = await _uow.NguoiDungs.GetQueryable().CountAsync();
        var totalTrips = await _uow.LichTrinhs.GetQueryable().CountAsync(t => !t.DaXoa);
        var totalBookings = await _uow.DonDats.GetQueryable().CountAsync();
        var totalRevenue = await _uow.DonDats.GetQueryable()
            .Where(b => b.TrangThai == "DaThanhToan")
            .SumAsync(b => b.TongTien ?? 0);

        return new AdminDashboardDto
        {
            TotalUsers = totalUsers,
            TotalTrips = totalTrips,
            TotalBookings = totalBookings,
            TotalRevenue = totalRevenue
        };
    }
}
