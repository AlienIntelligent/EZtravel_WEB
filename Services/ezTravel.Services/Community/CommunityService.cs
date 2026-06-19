using ezTravel.DTO.Community;
using ezTravel.DTO.Reviews;
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

    public async Task<IEnumerable<FeedDto>> GetFeedsAsync()
    {
        return await _uow.LichTrinhs.GetQueryable()
            .Include(t => t.NguoiDung)
            .Where(t => t.TrangThaiChiaSe == "CongKhai" && !t.DaXoa)
            .OrderByDescending(t => t.NgayTao)
            .Select(t => new FeedDto
            {
                TripId = t.MaLichTrinh,
                TripTitle = t.TenLichTrinh,
                Destination = t.DiemDen,
                CreatorName = t.NguoiDung.HoTen,
                CreatorAvatar = t.NguoiDung.Avatar,
                Description = t.MoTa,
                CreatedAt = t.NgayTao,
                TotalLikes = _uow.LuotThichs.GetQueryable().Count(l => l.MaLichTrinh == t.MaLichTrinh),
                TotalComments = _uow.BinhLuans.GetQueryable().Count(c => c.MaLichTrinh == t.MaLichTrinh),
                RecentComments = _uow.BinhLuans.GetQueryable()
                    .Where(c => c.MaLichTrinh == t.MaLichTrinh)
                    .OrderByDescending(c => c.NgayTao)
                    .Take(3)
                    .Select(c => new CommentDto
                    {
                        Id = c.MaBinhLuan,
                        UserId = c.MaNguoiDung,
                        UserFullName = c.NguoiDung.HoTen,
                        UserAvatar = c.NguoiDung.Avatar,
                        Content = c.NoiDung,
                        CreatedAt = c.NgayTao
                    }).ToList()
            }).ToListAsync();
    }

    public async Task<bool> LikeTripAsync(int userId, int tripId)
    {
        var existing = await _uow.LuotThichs.GetQueryable()
            .FirstOrDefaultAsync(l => l.MaNguoiDung == userId && l.MaLichTrinh == tripId);

        if (existing != null)
        {
            _uow.LuotThichs.Delete(existing);
        }
        else
        {
            await _uow.LuotThichs.AddAsync(new LuotThich
            {
                MaNguoiDung = userId,
                MaLichTrinh = tripId,
                NgayTao = DateTime.UtcNow
            });
        }

        return await _uow.SaveChangesAsync() > 0;
    }

    public async Task<bool> CommentOnTripAsync(int userId, int tripId, string content)
    {
        var comment = new BinhLuan
        {
            MaNguoiDung = userId,
            MaLichTrinh = tripId,
            NoiDung = content,
            NgayTao = DateTime.UtcNow
        };

        await _uow.BinhLuans.AddAsync(comment);
        return await _uow.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<CommentDto>> GetTripCommentsAsync(int tripId)
    {
        return await _uow.BinhLuans.GetQueryable()
            .Where(c => c.MaLichTrinh == tripId)
            .OrderByDescending(c => c.NgayTao)
            .Select(c => new CommentDto
            {
                Id = c.MaBinhLuan,
                UserId = c.MaNguoiDung,
                UserFullName = c.NguoiDung.HoTen,
                UserAvatar = c.NguoiDung.Avatar,
                Content = c.NoiDung,
                CreatedAt = c.NgayTao
            }).ToListAsync();
    }

    public async Task<ReviewDto> PostReviewAsync(CreateReviewRequest request, int userId)
    {
        var danhGia = new DanhGia
        {
            MaNguoiDung = userId,
            MaDichVu = request.ServiceId,
            MaDiaDiem = request.PlaceId,
            SoSao = (byte)request.Rating,
            BinhLuan = request.Comment,
            NgayDanhGia = DateTime.UtcNow
        };
        await _uow.DanhGias.AddAsync(danhGia);
        await _uow.SaveChangesAsync();

        var user = await _uow.NguoiDungs.GetQueryable().FirstOrDefaultAsync(u => u.MaNguoiDung == userId);

        return new ReviewDto
        {
            Id = danhGia.MaDanhGia,
            UserId = userId,
            UserName = user?.HoTen ?? "Unknown",
            UserAvatar = user?.Avatar,
            ServiceId = danhGia.MaDichVu,
            PlaceId = danhGia.MaDiaDiem,
            Rating = danhGia.SoSao ?? 0,
            Comment = danhGia.BinhLuan,
            ReviewDate = danhGia.NgayDanhGia
        };
    }

    public async Task<IEnumerable<ReviewDto>> GetPlaceReviewsAsync(int id)
    {
        return await _uow.DanhGias.GetQueryable()
            .Include(d => d.NguoiDung)
            .Where(d => d.MaDiaDiem == id)
            .OrderByDescending(d => d.NgayDanhGia)
            .Select(d => new ReviewDto
            {
                Id = d.MaDanhGia,
                UserId = d.MaNguoiDung,
                UserName = d.NguoiDung.HoTen,
                UserAvatar = d.NguoiDung.Avatar,
                ServiceId = d.MaDichVu,
                PlaceId = d.MaDiaDiem,
                Rating = d.SoSao ?? 0,
                Comment = d.BinhLuan,
                ReviewDate = d.NgayDanhGia
            }).ToListAsync();
    }

    public async Task<IEnumerable<ReviewDto>> GetServiceReviewsAsync(int id)
    {
        return await _uow.DanhGias.GetQueryable()
            .Include(d => d.NguoiDung)
            .Where(d => d.MaDichVu == id)
            .OrderByDescending(d => d.NgayDanhGia)
            .Select(d => new ReviewDto
            {
                Id = d.MaDanhGia,
                UserId = d.MaNguoiDung,
                UserName = d.NguoiDung.HoTen,
                UserAvatar = d.NguoiDung.Avatar,
                ServiceId = d.MaDichVu,
                PlaceId = d.MaDiaDiem,
                Rating = d.SoSao ?? 0,
                Comment = d.BinhLuan,
                ReviewDate = d.NgayDanhGia
            }).ToListAsync();
    }
}
