namespace ezTravel.DTO.Bookings;

public class BookingDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal? TotalAmount { get; set; }
    public string Status { get; set; } = null!;
    public DateTime BookingDate { get; set; }
    public List<BookingDetailDto> Details { get; set; } = new();
}

public class BookingDetailDto
{
    public int Id { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class CreateBookingRequest
{
    public List<BookingItemRequest> Items { get; set; } = new();
    public int? VoucherId { get; set; }
}

public class BookingItemRequest
{
    public int ServiceId { get; set; }
    public int Quantity { get; set; }
}

public class PaymentRequest
{
    public int BookingId { get; set; }
    public string PaymentMethod { get; set; } = null!;
}
