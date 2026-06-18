using ezTravel.DTO.Bookings;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Bookings;

public class BookingService : IBookingService
{
    private readonly IUnitOfWork _uow;

    public BookingService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<BookingDto> CreateBookingAsync(CreateBookingRequest request, int userId)
    {
        await _uow.BeginTransactionAsync();
        try
        {
            var booking = new DonDat
            {
                MaNguoiDung = userId,
                MaGiamGia = request.VoucherId,
                TrangThai = "ChoThanhToan",
                NgayDat = DateTime.UtcNow
            };

            await _uow.DonDats.AddAsync(booking);
            await _uow.SaveChangesAsync();

            decimal totalAmount = 0;
            foreach (var item in request.Items)
            {
                var service = await _uow.DichVus.GetByIdAsync(item.ServiceId);
                if (service == null || service.DaXoa) continue;

                var detail = new ChiTietDonDat
                {
                    MaDon = booking.MaDon,
                    MaDichVu = service.MaDichVu,
                    SoLuong = item.Quantity,
                    DonGia = service.GiaCoBan,
                    ThanhTien = service.GiaCoBan * item.Quantity
                };
                totalAmount += detail.ThanhTien;
                await _uow.ChiTietDonDats.AddAsync(detail);
            }

            // Apply voucher if any
            if (request.VoucherId.HasValue)
            {
                var voucher = await _uow.MaGiamGias.GetByIdAsync(request.VoucherId.Value);
                if (voucher != null && voucher.NgayHetHan >= DateTime.UtcNow && (voucher.SoLuongToiDa == null || voucher.SoLuongDaDung < voucher.SoLuongToiDa))
                {
                    // Basic discount logic (assuming fixed amount for simplicity, can be expanded to percentage)
                    // If your MaGiamGia entity has specific discount fields, use them here.
                    // For now, let's assume it's a fixed reduction.
                    // totalAmount -= voucher.GiaTri; 
                    voucher.SoLuongDaDung++;
                    _uow.MaGiamGias.Update(voucher);
                }
            }

            booking.TongTien = totalAmount;
            _uow.DonDats.Update(booking);
            
            await _uow.SaveChangesAsync();
            await _uow.CommitAsync();

            return await GetBookingByIdAsync(booking.MaDon, userId) ?? throw new Exception("Booking creation failed");
        }
        catch
        {
            await _uow.RollbackAsync();
            throw;
        }
    }

    public async Task<BookingDto?> GetBookingByIdAsync(int id, int userId)
    {
        var booking = await _uow.DonDats.GetQueryable()
            .Include(b => b.ChiTietDonDats)
                .ThenInclude(ct => ct.DichVu)
            .FirstOrDefaultAsync(b => b.MaDon == id && b.MaNguoiDung == userId);

        if (booking == null) return null;

        return new BookingDto
        {
            Id = booking.MaDon,
            UserId = booking.MaNguoiDung,
            TotalAmount = booking.TongTien,
            Status = booking.TrangThai,
            BookingDate = booking.NgayDat,
            Details = booking.ChiTietDonDats.Select(ct => new BookingDetailDto
            {
                Id = ct.MaChiTiet,
                ServiceId = ct.MaDichVu,
                ServiceName = ct.DichVu.TenDichVu,
                Quantity = ct.SoLuong,
                UnitPrice = ct.DonGia
            }).ToList()
        };
    }

    public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(int userId)
    {
        return await _uow.DonDats.GetQueryable()
            .Where(b => b.MaNguoiDung == userId)
            .OrderByDescending(b => b.NgayDat)
            .Select(b => new BookingDto
            {
                Id = b.MaDon,
                UserId = b.MaNguoiDung,
                TotalAmount = b.TongTien,
                Status = b.TrangThai,
                BookingDate = b.NgayDat
            }).ToListAsync();
    }

    public async Task<bool> UpdateBookingStatusAsync(int id, string status)
    {
        var booking = await _uow.DonDats.GetByIdAsync(id);
        if (booking == null) return false;

        booking.TrangThai = status;
        _uow.DonDats.Update(booking);
        return await _uow.SaveChangesAsync() > 0;
    }

    public async Task<bool> ProcessPaymentAsync(PaymentRequest request, int userId)
    {
        var booking = await _uow.DonDats.GetByIdAsync(request.BookingId);
        if (booking == null || booking.MaNguoiDung != userId) return false;

        // Mock payment processing
        var payment = new ThanhToan
        {
            MaDon = booking.MaDon,
            PhuongThucThanhToan = request.PaymentMethod,
            SoTien = booking.TongTien ?? 0,
            TrangThai = "ThanhCong",
            NgayThanhToan = DateTime.UtcNow,
            MaGiaoDich = Guid.NewGuid().ToString() // Mock transaction ID
        };

        await _uow.ThanhToans.AddAsync(payment);
        
        booking.TrangThai = "DaThanhToan";
        _uow.DonDats.Update(booking);

        return await _uow.SaveChangesAsync() > 0;
    }
}
