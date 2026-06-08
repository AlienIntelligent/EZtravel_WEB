namespace ezTravel.DTO.Users;

public class UserDto
{
    public int Id { get; set; }
    public string HoTen { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? AnhDaiDien { get; set; }
}
