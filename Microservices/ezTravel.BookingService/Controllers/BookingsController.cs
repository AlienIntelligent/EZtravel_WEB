using System.Security.Claims;
using ezTravel.DTO.Bookings;
using ezTravel.Services.Bookings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace ezTravel.BookingService.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    private int UserId => int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? "0");

    [HttpPost]
    public async Task<IActionResult> Create(CreateBookingRequest request)
        => Ok(await _bookingService.CreateBookingAsync(request, UserId));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id, UserId);
        return booking != null ? Ok(booking) : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetMyBookings()
        => Ok(await _bookingService.GetUserBookingsAsync(UserId));

    [HttpPost("pay")]
    public async Task<IActionResult> Pay(PaymentRequest request)
        => Ok(await _bookingService.ProcessPaymentAsync(request, UserId));
}
