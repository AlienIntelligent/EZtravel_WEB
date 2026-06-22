using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;

namespace ezTravel.Services.Community;

public interface ITripCommentService
{
    Task<object> GetCommentsAsync(int tripId, int userId);
    Task<object> PostCommentAsync(int tripId, PostCommentRequest request, int userId);
}

public sealed record TripCommentServiceError(string Message, int StatusCode = 400);

public class TripCommentService : ITripCommentService
{
    private const string ActiveStatus = "ACTIVE";
    private const string ArchivedStatus = "ARCHIVED";
    private const string DeletedStatus = "DELETED";
    private const string PublicStatus = "PUBLIC";
    private const string BannedStatus = "BANNED";

    private readonly IUnitOfWork _uow;

    public TripCommentService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetCommentsAsync(int tripId, int userId)
    {
        if (userId <= 0)
        {
            return Unauthorized();
        }

        if (await FindAccessibleTripAsync(tripId, userId) == null)
        {
            return NotFound();
        }

        var comments = (await _uow.BinhLuanLichTrinhs.FindAsync(comment =>
                comment.MaLichTrinh == tripId && comment.TrangThai == ActiveStatus))
            .OrderBy(comment => comment.NgayTao)
            .ThenBy(comment => comment.MaBinhLuan)
            .ToList();

        if (comments.Count == 0)
        {
            return Array.Empty<object>();
        }

        var authorIds = comments.Select(comment => comment.MaNguoiDung).Distinct().ToList();
        var authors = (await _uow.NguoiDungs.FindAsync(user => authorIds.Contains(user.MaNguoiDung)))
            .ToDictionary(user => user.MaNguoiDung);

        return comments
            .Select(comment => MapComment(
                comment,
                authors.GetValueOrDefault(comment.MaNguoiDung),
                userId))
            .ToList();
    }

    public async Task<object> PostCommentAsync(
        int tripId,
        PostCommentRequest request,
        int userId)
    {
        if (userId <= 0)
        {
            return Unauthorized();
        }

        var user = await _uow.NguoiDungs.FirstOrDefaultAsync(item =>
            item.MaNguoiDung == userId &&
            item.TrangThai != BannedStatus &&
            item.TrangThai != DeletedStatus);
        if (user == null)
        {
            return new TripCommentServiceError("Nguoi dung khong ton tai hoac da bi khoa.", 401);
        }

        if (await FindAccessibleTripAsync(tripId, userId) == null)
        {
            return NotFound();
        }

        var content = request.Content?.Trim();
        if (string.IsNullOrEmpty(content))
        {
            return new TripCommentServiceError("Noi dung binh luan la bat buoc.");
        }

        if (content.Length > 1000)
        {
            return new TripCommentServiceError("Noi dung binh luan khong duoc vuot qua 1000 ky tu.");
        }

        var now = DateTime.UtcNow;
        var comment = new BinhLuanLichTrinh
        {
            MaLichTrinh = tripId,
            MaNguoiDung = userId,
            NoiDung = content,
            TrangThai = ActiveStatus,
            NgayTao = now,
            NgayCapNhat = now,
            MaNguoiDungNavigation = user
        };

        await _uow.BinhLuanLichTrinhs.AddAsync(comment);
        await _uow.SaveChangesAsync();

        return MapComment(comment, user, userId);
    }

    private Task<LichTrinh?> FindAccessibleTripAsync(int tripId, int userId)
        => _uow.LichTrinhs.FirstOrDefaultAsync(trip =>
            trip.MaLichTrinh == tripId &&
            trip.TrangThai != ArchivedStatus &&
            trip.TrangThai != DeletedStatus &&
            (trip.MaNguoiDung == userId ||
             trip.LaCongKhai ||
             trip.TrangThai == PublicStatus ||
             trip.ChiaSeLichTrinh.Any(share => share.MaNguoiDung == userId)));

    private static object MapComment(
        BinhLuanLichTrinh comment,
        NguoiDung? author,
        int currentUserId)
        => new
        {
            id = comment.MaBinhLuan,
            commentId = comment.MaBinhLuan,
            tripId = comment.MaLichTrinh,
            userId = comment.MaNguoiDung,
            authorName = author?.HoTen ?? "Traveler",
            authorAvatar = author?.AvatarUrl,
            content = comment.NoiDung,
            createdAt = comment.NgayTao,
            updatedAt = comment.NgayCapNhat,
            isOwn = comment.MaNguoiDung == currentUserId
        };

    private static TripCommentServiceError Unauthorized()
        => new("Can dang nhap de xem hoac dang binh luan.", 401);

    private static TripCommentServiceError NotFound()
        => new("Khong tim thay lich trinh hoac ban khong co quyen truy cap.", 404);
}
