namespace ezTravel.DTO.Bookings;

public class BookingDto
{
    public int Id { get; set; }
    public decimal TongTien { get; set; }
    public string TrangThai { get; set; } = null!;
}
