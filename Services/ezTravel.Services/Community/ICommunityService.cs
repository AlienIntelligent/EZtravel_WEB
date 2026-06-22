using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Community;

public interface ICommunityService
{
    Task<object> GetFeedsAsync();
    Task<object> LikeTripAsync(int userId, int tripId);
    Task<object> GetTrendingTripsAsync();
    Task<object> GetTopBloggersAsync();
    Task<object> FollowUserAsync(int followerUserId, int targetUserId);
}

public sealed record CommunityServiceError(string Message, int StatusCode = 400);

public class CommunityService : ICommunityService
{
    private const string PublicTripStatus = "PUBLIC";
    private const string ArchivedStatus = "ARCHIVED";
    private const string DeletedStatus = "DELETED";
    private const string BannedUserStatus = "BANNED";
    private const string PublishedBlogStatus = "PUBLISHED";

    private readonly IUnitOfWork _uow;

    public CommunityService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetFeedsAsync()
    {
        var trips = await PublicTripsQuery()
            .Include(trip => trip.MaNguoiDungNavigation)
            .Include(trip => trip.ThichLichTrinh)
            .Include(trip => trip.BinhLuanLichTrinh)
            .OrderByDescending(trip => trip.NgayCapNhat)
            .ThenByDescending(trip => trip.MaLichTrinh)
            .Take(20)
            .ToListAsync();

        return trips.Select(trip => MapTripFeed(trip, isLiked: false)).ToList();
    }

    public async Task<object> LikeTripAsync(int userId, int tripId)
    {
        if (userId <= 0)
        {
            return Unauthorized();
        }

        if (!await IsActiveUserAsync(userId))
        {
            return new CommunityServiceError("Nguoi dung khong ton tai hoac da bi khoa.", 401);
        }

        var trip = await PublicTripsQuery()
            .FirstOrDefaultAsync(item => item.MaLichTrinh == tripId);

        if (trip == null)
        {
            return new CommunityServiceError("Khong tim thay lich trinh cong khai.", 404);
        }

        var existingLike = await _uow.ThichLichTrinhs.GetQueryable()
            .FirstOrDefaultAsync(item => item.MaLichTrinh == tripId && item.MaNguoiDung == userId);

        var isLiked = existingLike == null;
        if (existingLike == null)
        {
            await _uow.ThichLichTrinhs.AddAsync(new ThichLichTrinh
            {
                MaLichTrinh = tripId,
                MaNguoiDung = userId,
                NgayThich = DateTime.UtcNow
            });
        }
        else
        {
            _uow.ThichLichTrinhs.Remove(existingLike);
        }

        await _uow.SaveChangesAsync();

        var likeCount = await _uow.ThichLichTrinhs.CountAsync(item => item.MaLichTrinh == tripId);
        if (trip.LuotThich != likeCount)
        {
            trip.LuotThich = likeCount;
            trip.NgayCapNhat = DateTime.UtcNow;
            _uow.LichTrinhs.Update(trip);
            await _uow.SaveChangesAsync();
        }

        return new
        {
            success = true,
            liked = isLiked,
            isLiked,
            likeCount,
            luotThich = likeCount
        };
    }

    public async Task<object> GetTrendingTripsAsync()
    {
        var trips = await PublicTripsQuery()
            .Include(trip => trip.MaNguoiDungNavigation)
            .Include(trip => trip.ThichLichTrinh)
            .Include(trip => trip.BinhLuanLichTrinh)
            .OrderByDescending(trip => trip.LuotThich)
            .ThenByDescending(trip => trip.LuotClone)
            .ThenByDescending(trip => trip.LuotXem)
            .ThenByDescending(trip => trip.NgayCapNhat)
            .Take(8)
            .ToListAsync();

        return trips.Select(trip => MapTrendingTrip(trip)).ToList();
    }

    public async Task<object> GetTopBloggersAsync()
    {
        var blogs = await _uow.BaiViets.GetQueryable()
            .Include(blog => blog.MaNguoiDungNavigation)
            .Include(blog => blog.ThichBaiViet)
            .Where(blog => blog.TrangThai == PublishedBlogStatus
                && blog.MaNguoiDungNavigation.TrangThai != BannedUserStatus)
            .ToListAsync();

        var followerCounts = await _uow.TheoDoiNguoiDungs.GetQueryable()
            .GroupBy(item => item.MaNguoiDuocTheoDoi)
            .Select(group => new
            {
                UserId = group.Key,
                Count = group.Count()
            })
            .ToDictionaryAsync(item => item.UserId, item => item.Count);

        return blogs
            .GroupBy(blog => blog.MaNguoiDung)
            .Select(group =>
            {
                var user = group.First().MaNguoiDungNavigation;
                var totalLikes = group.Sum(blog => blog.ThichBaiViet.Count);
                followerCounts.TryGetValue(user.MaNguoiDung, out var followerCount);

                return new
                {
                    id = user.MaNguoiDung,
                    userId = user.MaNguoiDung,
                    name = user.HoTen,
                    userName = user.HoTen,
                    fullName = user.HoTen,
                    avatar = user.AvatarUrl,
                    avatarUrl = user.AvatarUrl,
                    bio = user.Bio,
                    postCount = group.Count(),
                    blogCount = group.Count(),
                    followerCount,
                    totalLikes
                };
            })
            .OrderByDescending(item => item.totalLikes)
            .ThenByDescending(item => item.followerCount)
            .ThenByDescending(item => item.postCount)
            .Take(10)
            .ToList();
    }

    public async Task<object> FollowUserAsync(int followerUserId, int targetUserId)
    {
        if (followerUserId <= 0)
        {
            return Unauthorized();
        }

        if (followerUserId == targetUserId)
        {
            return new CommunityServiceError("Khong the tu theo doi chinh minh.");
        }

        if (!await IsActiveUserAsync(followerUserId))
        {
            return new CommunityServiceError("Nguoi dung hien tai khong ton tai hoac da bi khoa.", 401);
        }

        if (!await IsActiveUserAsync(targetUserId))
        {
            return new CommunityServiceError("Nguoi dung can theo doi khong ton tai.", 404);
        }

        var existingFollow = await _uow.TheoDoiNguoiDungs.GetQueryable()
            .FirstOrDefaultAsync(item =>
                item.MaNguoiTheoDoi == followerUserId &&
                item.MaNguoiDuocTheoDoi == targetUserId);

        var following = existingFollow == null;
        if (existingFollow == null)
        {
            await _uow.TheoDoiNguoiDungs.AddAsync(new TheoDoiNguoiDung
            {
                MaNguoiTheoDoi = followerUserId,
                MaNguoiDuocTheoDoi = targetUserId,
                NgayTheoDoi = DateTime.UtcNow
            });
        }
        else
        {
            _uow.TheoDoiNguoiDungs.Remove(existingFollow);
        }

        await _uow.SaveChangesAsync();

        var followerCount = await _uow.TheoDoiNguoiDungs.CountAsync(item => item.MaNguoiDuocTheoDoi == targetUserId);
        return new
        {
            success = true,
            following,
            isFollowing = following,
            followerCount
        };
    }

    private IQueryable<LichTrinh> PublicTripsQuery()
        => _uow.LichTrinhs.GetQueryable()
            .Where(trip =>
                (trip.LaCongKhai || trip.TrangThai == PublicTripStatus) &&
                trip.TrangThai != ArchivedStatus &&
                trip.TrangThai != DeletedStatus);

    private Task<bool> IsActiveUserAsync(int userId)
        => _uow.NguoiDungs.AnyAsync(user => user.MaNguoiDung == userId && user.TrangThai != BannedUserStatus);

    private static object MapTripFeed(LichTrinh trip, bool isLiked)
    {
        var likeCount = trip.ThichLichTrinh?.Count ?? trip.LuotThich;
        var createdAt = trip.NgayCapNhat == default ? trip.NgayTao : trip.NgayCapNhat;

        return new
        {
            id = trip.MaLichTrinh,
            tripId = trip.MaLichTrinh,
            type = "TRIP",
            itemType = "TRIP",
            tripName = trip.TenLichTrinh,
            title = trip.TenLichTrinh,
            content = trip.MoTa ?? string.Empty,
            description = trip.MoTa ?? string.Empty,
            thumbnail = trip.Thumbnail,
            userId = trip.MaNguoiDung,
            userName = trip.MaNguoiDungNavigation?.HoTen ?? "Traveler",
            authorName = trip.MaNguoiDungNavigation?.HoTen ?? "Traveler",
            avatar = trip.MaNguoiDungNavigation?.AvatarUrl,
            userAvatar = trip.MaNguoiDungNavigation?.AvatarUrl,
            createdAt,
            updatedAt = trip.NgayCapNhat,
            startDate = trip.NgayBatDau,
            endDate = trip.NgayKetThuc,
            budget = trip.NganSachToiDa ?? trip.TongChiPhiUocTinh,
            totalCost = trip.TongChiPhiUocTinh,
            likeCount,
            luotThich = likeCount,
            cloneCount = trip.LuotClone,
            viewCount = trip.LuotXem,
            commentCount = trip.BinhLuanLichTrinh.Count(comment => comment.TrangThai == "ACTIVE"),
            isLiked
        };
    }

    private static object MapTrendingTrip(LichTrinh trip)
    {
        var feed = MapTripFeed(trip, isLiked: false);
        return new
        {
            id = trip.MaLichTrinh,
            tripId = trip.MaLichTrinh,
            title = trip.TenLichTrinh,
            name = trip.TenLichTrinh,
            tripName = trip.TenLichTrinh,
            description = trip.MoTa ?? string.Empty,
            content = trip.MoTa ?? string.Empty,
            thumbnail = trip.Thumbnail,
            coverImage = trip.Thumbnail,
            authorId = trip.MaNguoiDung,
            authorName = trip.MaNguoiDungNavigation?.HoTen ?? "Traveler",
            userName = trip.MaNguoiDungNavigation?.HoTen ?? "Traveler",
            avatar = trip.MaNguoiDungNavigation?.AvatarUrl,
            startDate = trip.NgayBatDau,
            endDate = trip.NgayKetThuc,
            budget = trip.NganSachToiDa ?? trip.TongChiPhiUocTinh,
            likeCount = trip.ThichLichTrinh?.Count ?? trip.LuotThich,
            likes = trip.ThichLichTrinh?.Count ?? trip.LuotThich,
            cloneCount = trip.LuotClone,
            viewCount = trip.LuotXem,
            createdAt = trip.NgayTao,
            updatedAt = trip.NgayCapNhat,
            item = feed
        };
    }

    private static CommunityServiceError Unauthorized()
        => new("Can dang nhap de thuc hien thao tac nay.", 401);
}
