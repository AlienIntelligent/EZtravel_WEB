using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Admin;

public interface IModerationService
{
    Task<object> GetModerationQueueAsync();
    Task<object> ResolveItemAsync(int id, string action, int adminId);
}

public class ModerationService : IModerationService
{
    private const string PendingStatus = "PENDING";

    private readonly IUnitOfWork _uow;

    public ModerationService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetModerationQueueAsync()
    {
        var reports = await ReportQuery()
            .Where(report => report.TrangThai == PendingStatus)
            .OrderBy(report => report.NgayBaoCao)
            .ThenBy(report => report.MaBaoCao)
            .Take(100)
            .ToListAsync();

        return reports.Select(MapReport).ToList();
    }

    public async Task<object> ResolveItemAsync(int id, string action, int adminId)
    {
        if (adminId <= 0 || !await _uow.NguoiDungs.AnyAsync(user => user.MaNguoiDung == adminId && user.VaiTro == "ADMIN"))
        {
            return new AdminServiceError("Can tai khoan admin hop le de xu ly moderation.", 401);
        }

        var normalizedAction = NormalizeAction(action);
        if (normalizedAction == null)
        {
            return new AdminServiceError("Hanh dong moderation khong hop le.");
        }

        var report = await ReportQuery()
            .FirstOrDefaultAsync(item => item.MaBaoCao == id);

        if (report == null)
        {
            return new AdminServiceError("Khong tim thay bao cao noi dung.", 404);
        }

        report.TrangThai = normalizedAction.ReportStatus;
        _uow.BaoCaoNoiDungs.Update(report);

        await _uow.DuyetNoiDungs.AddAsync(new DuyetNoiDung
        {
            MaAdmin = adminId,
            MaBaiViet = report.MaBaiViet,
            MaDanhGia = report.MaDanhGia,
            MaLichTrinh = report.MaLichTrinh,
            TrangThai = normalizedAction.AuditStatus,
            GhiChu = $"Resolved report #{report.MaBaoCao} with action {normalizedAction.AuditStatus}.",
            NgayDuyet = DateTime.UtcNow
        });

        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            item = MapReport(report)
        };
    }

    private IQueryable<BaoCaoNoiDung> ReportQuery()
        => _uow.BaoCaoNoiDungs.GetQueryable()
            .Include(report => report.MaNguoiBaoCaoNavigation)
            .Include(report => report.MaBaiVietNavigation)
            .Include(report => report.MaDanhGiaNavigation)
            .Include(report => report.MaLichTrinhNavigation);

    private static object MapReport(BaoCaoNoiDung report)
    {
        var (targetType, targetId, targetTitle) = ResolveTarget(report);

        return new
        {
            id = report.MaBaoCao,
            maBaoCao = report.MaBaoCao,
            reporterId = report.MaNguoiBaoCao,
            maNguoiBaoCao = report.MaNguoiBaoCao,
            reporterName = report.MaNguoiBaoCaoNavigation?.HoTen,
            reason = report.LyDo,
            lyDo = report.LyDo,
            status = report.TrangThai,
            trangThai = report.TrangThai,
            targetType,
            targetId,
            targetTitle,
            blogId = report.MaBaiViet,
            reviewId = report.MaDanhGia,
            tripId = report.MaLichTrinh,
            createdAt = report.NgayBaoCao,
            ngayBaoCao = report.NgayBaoCao
        };
    }

    private static (string TargetType, int? TargetId, string? TargetTitle) ResolveTarget(BaoCaoNoiDung report)
    {
        if (report.MaBaiViet.HasValue)
        {
            return ("BLOG", report.MaBaiViet, report.MaBaiVietNavigation?.TieuDe);
        }

        if (report.MaDanhGia.HasValue)
        {
            return ("REVIEW", report.MaDanhGia, report.MaDanhGiaNavigation?.NoiDung);
        }

        if (report.MaLichTrinh.HasValue)
        {
            return ("TRIP", report.MaLichTrinh, report.MaLichTrinhNavigation?.TenLichTrinh);
        }

        return ("UNKNOWN", null, null);
    }

    private static ModerationAction? NormalizeAction(string? action)
        => TrimToNull(action)?.ToUpperInvariant() switch
        {
            "RESOLVE" or "RESOLVED" or "APPROVE" or "APPROVED" or "ACCEPT" => new("PROCESSED", "APPROVED"),
            "REJECT" or "REJECTED" or "DISMISS" or "DISMISSED" => new("REJECTED", "REJECTED"),
            _ => null
        };

    private static string? TrimToNull(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }

    private sealed record ModerationAction(string ReportStatus, string AuditStatus);
}
