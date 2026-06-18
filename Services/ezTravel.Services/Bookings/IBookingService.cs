using ezTravel.DTO.Bookings;

namespace ezTravel.Services.Bookings;

public interface IBookingService
{
    Task<BookingDto> CreateBookingAsync(CreateBookingRequest request, int userId);
    Task<BookingDto?> GetBookingByIdAsync(int id, int userId);
    Task<IEnumerable<BookingDto>> GetUserBookingsAsync(int userId);
    Task<bool> UpdateBookingStatusAsync(int id, string status);
    Task<bool> ProcessPaymentAsync(PaymentRequest request, int userId);
}
