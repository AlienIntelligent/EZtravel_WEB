using ezTravel.DTO.Reviews;
using ezTravel.DTO.Trips;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Community;

public class CommunityService : ICommunityService
{
    private readonly IUnitOfWork _uow;

    public CommunityService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<ReviewDto> PostReviewAsync(CreateReviewRequest request, int userId)
    {
        var review = new DanhGia
        {
            MaNguoiDung = userId,
            MaDiaDiem = request.PlaceId,
            MaDichVu = request.ServiceId,
            SoSao = (byte)request.Rating,
            BinhLuan = request.Comment,
            NgayDanhGia = DateTime.UtcNow
        };

        await _uow.DanhGias.AddAsync(review);
        await _uow.SaveChangesAsync();

        var user = await _uow.NguoiDungs.GetByIdAsync(userId);

        return new ReviewDto
        {
            Id = review.MaDanhGia,
            UserId = userId,
            UserName = user?.HoTen ?? "Unknown",
            UserAvatar = user?.Avatar,
            PlaceId = review.MaDiaDiem,
            ServiceId = review.MaDichVu,
            Rating = review.SoSao ?? 0,
            Comment = review.BinhLuan,
            ReviewDate = review.NgayDanhGia
        };
    }

    public async Task<IEnumerable<ReviewDto>> GetPlaceReviewsAsync(int placeId)
    {
        return await _uow.DanhGias.GetQueryable()
            .Where(r => r.MaDiaDiem == placeId)
            .Include(r => r.NguoiDung)
            .OrderByDescending(r => r.NgayDanhGia)
            .Select(r => new ReviewDto
            {
                Id = r.MaDanhGia,
                UserId = r.MaNguoiDung,
                UserName = r.NguoiDung.HoTen,
                UserAvatar = r.NguoiDung.Avatar,
                PlaceId = r.MaDiaDiem,
                Rating = r.SoSao ?? 0,
                Comment = r.BinhLuan,
                ReviewDate = r.NgayDanhGia
            }).ToListAsync();
    }

    public async Task<IEnumerable<ReviewDto>> GetServiceReviewsAsync(int serviceId)
    {
        return await _uow.DanhGias.GetQueryable()
            .Where(r => r.MaDichVu == serviceId)
            .Include(r => r.NguoiDung)
            .OrderByDescending(r => r.NgayDanhGia)
            .Select(r => new ReviewDto
            {
                Id = r.MaDanhGia,
                UserId = r.MaNguoiDung,
                UserName = r.NguoiDung.HoTen,
                UserAvatar = r.NguoiDung.Avatar,
                ServiceId = r.MaDichVu,
                Rating = r.SoSao ?? 0,
                Comment = r.BinhLuan,
                ReviewDate = r.NgayDanhGia
            }).ToListAsync();
    }

    public async Task<IEnumerable<TripDto>> GetPublicTripsAsync(string? keyword = null)
    {
        var query = _uow.LichTrinhs.GetQueryable()
            .Where(t => t.TrangThaiChiaSe == "CongKhai" && !t.DaXoa);

        if (!string.IsNullOrEmpty(keyword))
        {
            query = query.Where(t => t.TenLichTrinh.Contains(keyword) || (t.DiemDen != null && t.DiemDen.Contains(keyword)));
        }

        return await query.OrderByDescending(t => t.NgayTao)
            .Select(t => new TripDto
            {
                Id = t.MaLichTrinh,
                TenLichTrinh = t.TenLichTrinh,
                DiemDen = t.DiemDen,
                NgayBatDau = t.NgayBatDau,
                NgayKetThuc = t.NgayKetThuc,
                TrangThai = t.TrangThai
            }).ToListAsync();
    }

    public async Task<bool> ToggleTripVisibilityAsync(int tripId, bool isPublic, int userId)
    {
        var trip = await _uow.LichTrinhs.GetByIdAsync(tripId);
        if (trip == null || trip.MaNguoiDung != userId) return false;

        trip.TrangThaiChiaSe = isPublic ? "CongKhai" : "RiengTu";
        _uow.LichTrinhs.Update(trip);
        return await _uow.SaveChangesAsync() > 0;
    }
}
