namespace ezTravel.DTO.Trips;

public class TripDto
{
    public int Id { get; set; }
    public string TenLichTrinh { get; set; } = null!;
    public string? DiemDen { get; set; }
    public DateOnly NgayBatDau { get; set; }
    public DateOnly NgayKetThuc { get; set; }
}
