namespace ezTravel.DTO.Users;

public class UserDto
{
    public int Id { get; set; }
    public string HoTen { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsLocked { get; set; }
}

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int TotalTrips { get; set; }
    public int TotalBookings { get; set; }
    public decimal TotalRevenue { get; set; }
}
