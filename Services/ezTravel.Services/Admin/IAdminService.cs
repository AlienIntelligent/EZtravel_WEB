using ezTravel.DTO.Users;

namespace ezTravel.Services.Admin;

public interface IAdminService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<bool> LockUserAsync(int userId);
    Task<AdminDashboardDto> GetDashboardStatsAsync();
}
