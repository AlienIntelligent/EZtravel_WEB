using ezTravel.DTO.Requests;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.AI;

public interface IAIRouteOptimizationService
{
    Task<object> OptimizeRouteAsync(OptimizeRouteRequest request, int userId);
}

public class AIRouteOptimizationService : AiServiceBase, IAIRouteOptimizationService
{
    public AIRouteOptimizationService(IUnitOfWork uow) : base(uow)
    {
    }

    public async Task<object> OptimizeRouteAsync(OptimizeRouteRequest request, int userId)
    {
        var trip = await Uow.LichTrinhs.GetQueryable()
            .Include(t => t.NgayLichTrinh)
                .ThenInclude(d => d.DiaDiemLichTrinh)
                    .ThenInclude(p => p.MaDiaDiemNavigation)
            .FirstOrDefaultAsync(t =>
                t.MaLichTrinh == request.TripId &&
                t.MaNguoiDung == userId &&
                t.TrangThai != "ARCHIVED");

        if (trip == null)
        {
            return new
            {
                success = false,
                message = "Khong tim thay lich trinh thuoc nguoi dung hien tai.",
                optimizedOrder = Array.Empty<int>(),
                source = "eztravel-db-route"
            };
        }

        var orderedPlaces = trip.NgayLichTrinh
            .OrderBy(d => d.SoThuTu)
            .ThenBy(d => d.Ngay)
            .SelectMany(d => d.DiaDiemLichTrinh
                .OrderBy(p => p.ThuTu)
                .ThenBy(p => p.GioBatDau ?? TimeOnly.MinValue)
                .Select(p => new
                {
                    p.MaDiaDiemLichTrinh,
                    p.MaDiaDiem,
                    placeName = p.MaDiaDiemNavigation.TenDiaDiem,
                    dayNumber = d.SoThuTu,
                    order = p.ThuTu
                }))
            .ToList();

        var summary = orderedPlaces.Count == 0
            ? "Lich trinh chua co diem den de toi uu."
            : $"Da sap xep {orderedPlaces.Count} diem den theo ngay va thu tu hien co de giu hanh trinh on dinh.";
        var historyId = await SaveHistoryAsync(userId, "ROUTE_OPTIMIZATION", request, summary);

        return new
        {
            success = true,
            optimizedOrder = orderedPlaces.Select(p => p.MaDiaDiemLichTrinh).ToList(),
            places = orderedPlaces,
            summary,
            source = "eztravel-db-route",
            historyId,
            maLichSuAi = historyId
        };
    }
}
