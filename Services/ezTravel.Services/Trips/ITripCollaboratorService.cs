using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Trips;

public interface ITripCollaboratorService
{
    Task<object> GetCollaboratorsAsync(int tripId, int userId);
    Task<object> ManageCollaboratorAsync(int tripId, ManageCollaboratorRequest request, int userId);
}

public sealed record TripCollaboratorServiceError(string Message, int StatusCode = 400);

public class TripCollaboratorService : ITripCollaboratorService
{
    private const string ArchivedStatus = "ARCHIVED";
    private const string ViewerPermission = "VIEW";
    private const string EditorPermission = "EDITOR";

    private readonly IUnitOfWork _unitOfWork;

    public TripCollaboratorService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<object> GetCollaboratorsAsync(int tripId, int userId)
    {
        if (userId <= 0) return Unauthorized();

        var trip = await CollaboratorQuery()
            .FirstOrDefaultAsync(item => item.MaLichTrinh == tripId && item.TrangThai != ArchivedStatus);

        if (trip == null) return NotFound();
        if (!CanViewCollaborators(trip, userId)) return NotFound();

        var owner = new
        {
            id = trip.MaNguoiDung,
            userId = trip.MaNguoiDung,
            maNguoiDung = trip.MaNguoiDung,
            email = trip.MaNguoiDungNavigation.Email,
            name = trip.MaNguoiDungNavigation.HoTen,
            fullName = trip.MaNguoiDungNavigation.HoTen,
            avatarUrl = trip.MaNguoiDungNavigation.AvatarUrl,
            role = "OWNER",
            permission = "OWNER",
            quyen = "OWNER",
            isOwner = true,
            canEdit = true,
            sharedAt = trip.NgayTao
        };

        var collaborators = trip.ChiaSeLichTrinh
            .OrderBy(item => item.NgayChiaSe)
            .ThenBy(item => item.MaChiaSe)
            .Select(MapCollaborator)
            .ToList();

        return new
        {
            owner,
            collaborators,
            items = new object[] { owner }.Concat(collaborators.Cast<object>()).ToList(),
            canManage = trip.MaNguoiDung == userId
        };
    }

    public async Task<object> ManageCollaboratorAsync(int tripId, ManageCollaboratorRequest request, int userId)
    {
        if (userId <= 0) return Unauthorized();

        var trip = await _unitOfWork.LichTrinhs.GetQueryable()
            .FirstOrDefaultAsync(item => item.MaLichTrinh == tripId
                && item.MaNguoiDung == userId
                && item.TrangThai != ArchivedStatus);

        if (trip == null) return NotFound();

        var targetUser = await ResolveTargetUserAsync(request);
        if (targetUser == null)
        {
            return new TripCollaboratorServiceError("Khong tim thay nguoi dung can chia se.", 404);
        }

        if (targetUser.MaNguoiDung == trip.MaNguoiDung)
        {
            return new TripCollaboratorServiceError("Chu lich trinh da co toan quyen.");
        }

        if (IsInactiveUser(targetUser))
        {
            return new TripCollaboratorServiceError("Khong the chia se cho tai khoan khong hoat dong.");
        }

        var action = NormalizeAction(request.Action);
        if (action == null)
        {
            return new TripCollaboratorServiceError("Action khong hop le. Dung ADD, UPDATE hoac REMOVE.");
        }

        var existingShare = await _unitOfWork.ChiaSeLichTrinhs.GetQueryable()
            .Include(item => item.MaNguoiDungNavigation)
            .FirstOrDefaultAsync(item => item.MaLichTrinh == tripId
                && item.MaNguoiDung == targetUser.MaNguoiDung);

        if (action == "REMOVE")
        {
            if (existingShare == null)
            {
                return new TripCollaboratorServiceError("Nguoi dung chua duoc chia se lich trinh.", 404);
            }

            _unitOfWork.ChiaSeLichTrinhs.Remove(existingShare);
            trip.NgayCapNhat = DateTime.UtcNow;
            _unitOfWork.LichTrinhs.Update(trip);
            await _unitOfWork.SaveChangesAsync();

            return new
            {
                success = true,
                action = "REMOVE",
                removed = true,
                userId = targetUser.MaNguoiDung,
                maNguoiDung = targetUser.MaNguoiDung
            };
        }

        var permission = NormalizePermission(request.Permission ?? request.Quyen ?? request.Role);
        if (permission == null)
        {
            return new TripCollaboratorServiceError("Quyen khong hop le. Dung VIEW hoac EDITOR.");
        }

        var wasCreated = existingShare == null;
        var now = DateTime.UtcNow;
        if (existingShare == null)
        {
            existingShare = new ChiaSeLichTrinh
            {
                MaLichTrinh = tripId,
                MaNguoiDung = targetUser.MaNguoiDung,
                Quyen = permission,
                NgayChiaSe = now
            };

            await _unitOfWork.ChiaSeLichTrinhs.AddAsync(existingShare);
        }
        else
        {
            existingShare.Quyen = permission;
            existingShare.NgayChiaSe = now;
            _unitOfWork.ChiaSeLichTrinhs.Update(existingShare);
        }

        trip.NgayCapNhat = now;
        _unitOfWork.LichTrinhs.Update(trip);
        await _unitOfWork.SaveChangesAsync();

        var refreshedShare = await _unitOfWork.ChiaSeLichTrinhs.GetQueryable()
            .Include(item => item.MaNguoiDungNavigation)
            .FirstAsync(item => item.MaLichTrinh == tripId && item.MaNguoiDung == targetUser.MaNguoiDung);

        return new
        {
            success = true,
            action = wasCreated ? "ADD" : action,
            collaborator = MapCollaborator(refreshedShare)
        };
    }

    private IQueryable<LichTrinh> CollaboratorQuery()
        => _unitOfWork.LichTrinhs.GetQueryable()
            .Include(item => item.MaNguoiDungNavigation)
            .Include(item => item.ChiaSeLichTrinh)
                .ThenInclude(share => share.MaNguoiDungNavigation);

    private async Task<NguoiDung?> ResolveTargetUserAsync(ManageCollaboratorRequest request)
    {
        var targetUserId = request.UserId ?? request.MaNguoiDung;
        if (targetUserId is > 0)
        {
            return await _unitOfWork.NguoiDungs.GetQueryable()
                .FirstOrDefaultAsync(user => user.MaNguoiDung == targetUserId.Value);
        }

        var email = TrimToNull(request.Email);
        if (email == null) return null;

        var normalizedEmail = email.ToUpperInvariant();
        return await _unitOfWork.NguoiDungs.GetQueryable()
            .FirstOrDefaultAsync(user => user.Email.ToUpper() == normalizedEmail);
    }

    private static bool CanViewCollaborators(LichTrinh trip, int userId)
        => trip.MaNguoiDung == userId
            || trip.ChiaSeLichTrinh.Any(item => item.MaNguoiDung == userId);

    private static object MapCollaborator(ChiaSeLichTrinh share)
        => new
        {
            id = share.MaNguoiDung,
            shareId = share.MaChiaSe,
            userId = share.MaNguoiDung,
            maNguoiDung = share.MaNguoiDung,
            email = share.MaNguoiDungNavigation.Email,
            name = share.MaNguoiDungNavigation.HoTen,
            fullName = share.MaNguoiDungNavigation.HoTen,
            avatarUrl = share.MaNguoiDungNavigation.AvatarUrl,
            role = share.Quyen,
            permission = share.Quyen,
            quyen = share.Quyen,
            isOwner = false,
            canEdit = share.Quyen == EditorPermission,
            sharedAt = share.NgayChiaSe
        };

    private static string? NormalizeAction(string? value)
    {
        var action = TrimToNull(value)?.ToUpperInvariant();
        return action switch
        {
            null or "" or "ADD" or "INVITE" or "SHARE" => "ADD",
            "UPDATE" or "UPSERT" or "SET_ROLE" or "SET_PERMISSION" => "UPDATE",
            "REMOVE" or "DELETE" or "REVOKE" => "REMOVE",
            _ => null
        };
    }

    private static string? NormalizePermission(string? value)
    {
        var permission = TrimToNull(value)?.ToUpperInvariant();
        return permission switch
        {
            null or "" or "VIEW" or "VIEWER" or "READ" => ViewerPermission,
            "EDITOR" or "EDIT" or "WRITE" => EditorPermission,
            _ => null
        };
    }

    private static bool IsInactiveUser(NguoiDung user)
        => string.Equals(user.TrangThai, "BANNED", StringComparison.OrdinalIgnoreCase)
            || string.Equals(user.TrangThai, "DELETED", StringComparison.OrdinalIgnoreCase)
            || string.Equals(user.TrangThai, "INACTIVE", StringComparison.OrdinalIgnoreCase);

    private static string? TrimToNull(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }

    private static TripCollaboratorServiceError Unauthorized()
        => new("Can dang nhap de thuc hien thao tac nay.", 401);

    private static TripCollaboratorServiceError NotFound()
        => new("Khong tim thay lich trinh.", 404);
}
