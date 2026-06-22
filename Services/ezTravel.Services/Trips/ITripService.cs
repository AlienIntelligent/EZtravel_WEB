using ezTravel.DTO.Requests;
using ezTravel.DTO.Trips;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Trips;

public interface ITripService
{
    Task<object> GetUserTripsAsync(int uid);
    Task<object> CreateTripAsync(CreateTripRequest request, int uid);
    Task<object> UpdateTripAsync(int id, UpdateTripRequest request, int uid);
    Task<object> DeleteTripAsync(int id, int uid);
    Task<object> GetTripByIdAsync(int id, int uid);
    Task<object> GetTimelineAsync(int id, int uid);
    Task<object> GetUpcomingTripsAsync(int uid);
    Task<object> UpdateTimelineAsync(int id, UpdateTimelineRequest request, int uid);
    Task<object> GetTripBudgetAsync(int id);
    Task<object> GetTravelerDashboardStatsAsync(int uid);
    Task<object> GetTripDestinationsAsync(int id);
    Task<object> CloneTripAsync(int id, int uid);
}

public sealed record TripServiceError(string Message, int StatusCode = 400);

public class TripService : ITripService
{
    private const string DraftStatus = "DRAFT";
    private const string PublicStatus = "PUBLIC";
    private const string ArchivedStatus = "ARCHIVED";
    private const int MaxGeneratedDays = 30;

    private readonly IUnitOfWork _unitOfWork;

    public TripService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<object> GetUserTripsAsync(int uid)
    {
        if (uid <= 0) return Unauthorized();

        var ownedTrips = await _unitOfWork.LichTrinhs.GetQueryable()
            .AsNoTracking()
            .Where(trip => trip.MaNguoiDung == uid && trip.TrangThai != ArchivedStatus)
            .ToListAsync();

        var sharedTripIds = await _unitOfWork.ChiaSeLichTrinhs.GetQueryable()
            .AsNoTracking()
            .Where(share => share.MaNguoiDung == uid)
            .Select(share => share.MaLichTrinh)
            .Distinct()
            .ToListAsync();

        var sharedTrips = sharedTripIds.Count == 0
            ? new List<LichTrinh>()
            : await _unitOfWork.LichTrinhs.GetQueryable()
                .AsNoTracking()
                .Where(trip => sharedTripIds.Contains(trip.MaLichTrinh)
                    && trip.MaNguoiDung != uid
                    && trip.TrangThai != ArchivedStatus)
                .ToListAsync();

        var trips = ownedTrips
            .Concat(sharedTrips)
            .OrderByDescending(trip => trip.NgayCapNhat)
            .ThenByDescending(trip => trip.MaLichTrinh)
            .ToList();

        var tripIds = trips.Select(trip => trip.MaLichTrinh).ToList();
        if (tripIds.Count == 0) return new List<TripDto>();

        var costs = await _unitOfWork.ChiPhiDichVuLichTrinhs.GetQueryable()
            .AsNoTracking()
            .Where(cost => tripIds.Contains(
                cost.MaDichVuLichTrinhNavigation
                    .MaDiaDiemLichTrinhNavigation
                    .MaNgayNavigation
                    .MaLichTrinh))
            .GroupBy(cost => cost.MaDichVuLichTrinhNavigation
                .MaDiaDiemLichTrinhNavigation
                .MaNgayNavigation
                .MaLichTrinh)
            .Select(group => new { TripId = group.Key, Total = group.Sum(cost => cost.SoTien) })
            .ToDictionaryAsync(item => item.TripId, item => item.Total);

        var tripPlaces = await _unitOfWork.DiaDiemLichTrinhs.GetQueryable()
            .AsNoTracking()
            .Where(place => tripIds.Contains(place.MaNgayNavigation.MaLichTrinh))
            .Select(place => new { TripId = place.MaNgayNavigation.MaLichTrinh, place.MaDiaDiem })
            .Distinct()
            .ToListAsync();

        var placeCounts = tripPlaces
            .GroupBy(item => item.TripId)
            .ToDictionary(group => group.Key, group => group.Count());

        return trips.Select(trip =>
        {
            var mapped = MapTrip(trip);
            mapped.TongChiPhi = costs.GetValueOrDefault(trip.MaLichTrinh, trip.TongChiPhiUocTinh);
            mapped.SoLuongDiaDiem = placeCounts.GetValueOrDefault(trip.MaLichTrinh);
            return mapped;
        }).ToList();
    }

    public async Task<object> CreateTripAsync(CreateTripRequest request, int uid)
    {
        if (uid <= 0) return Unauthorized();
        if (!await _unitOfWork.NguoiDungs.AnyAsync(user => user.MaNguoiDung == uid))
        {
            return new TripServiceError("Nguoi dung khong ton tai.", 404);
        }

        var title = TrimToNull(request.TenLichTrinh)
            ?? TrimToNull(request.Title)
            ?? TrimToNull(request.Name);

        if (title == null)
        {
            return new TripServiceError("Ten lich trinh la bat buoc.");
        }

        var startDate = request.NgayBatDau
            ?? ToDateOnly(request.StartDate)
            ?? Today();

        var endDate = request.NgayKetThuc
            ?? ToDateOnly(request.EndDate)
            ?? startDate;

        if (endDate < startDate)
        {
            endDate = startDate;
        }

        var isPublic = request.LaCongKhai || IsPublicVisibility(request.Visibility);
        var now = DateTime.UtcNow;
        var budget = request.Budget ?? request.TongChiPhi;

        var trip = new LichTrinh
        {
            MaNguoiDung = uid,
            TenLichTrinh = title,
            MoTa = TrimToNull(request.MoTa) ?? TrimToNull(request.Description),
            Thumbnail = TrimToNull(request.Thumbnail),
            NgayBatDau = startDate,
            NgayKetThuc = endDate,
            NganSachToiDa = budget,
            TongChiPhiUocTinh = request.TongChiPhi ?? 0,
            LaCongKhai = isPublic,
            LuotXem = 0,
            LuotThich = 0,
            LuotClone = 0,
            TrangThai = isPublic ? PublicStatus : DraftStatus,
            NgayTao = now,
            NgayCapNhat = now
        };

        await _unitOfWork.LichTrinhs.AddAsync(trip);
        await _unitOfWork.SaveChangesAsync();

        var dayCount = Math.Clamp(endDate.DayNumber - startDate.DayNumber + 1, 1, MaxGeneratedDays);
        var days = Enumerable.Range(0, dayCount)
            .Select(index => new NgayLichTrinh
            {
                MaLichTrinh = trip.MaLichTrinh,
                Ngay = startDate.AddDays(index),
                SoThuTu = index + 1,
                GhiChu = null
            })
            .ToList();

        await _unitOfWork.NgayLichTrinhs.AddRangeAsync(days);
        await _unitOfWork.SaveChangesAsync();

        var createdTrip = await FindOwnedTripAsync(trip.MaLichTrinh, uid, includeGraph: true);
        return createdTrip == null
            ? new TripServiceError("Khong the tai lai lich trinh vua tao.", 500)
            : MapTripDetail(createdTrip);
    }

    public async Task<object> DeleteTripAsync(int id, int uid)
    {
        if (uid <= 0) return Unauthorized();

        var trip = await FindOwnedTripAsync(id, uid, includeGraph: false);
        if (trip == null) return NotFound();

        trip.TrangThai = ArchivedStatus;
        trip.LaCongKhai = false;
        trip.NgayCapNhat = DateTime.UtcNow;

        _unitOfWork.LichTrinhs.Update(trip);
        await _unitOfWork.SaveChangesAsync();

        return new { success = true };
    }

    public async Task<object> UpdateTripAsync(int id, UpdateTripRequest request, int uid)
    {
        if (uid <= 0) return Unauthorized();

        var trip = await FindEditableTripAsync(id, uid, includeGraph: false);
        if (trip == null) return NotFound();

        var title = TrimToNull(request.TenLichTrinh)
            ?? TrimToNull(request.Title)
            ?? TrimToNull(request.Name);
        if (title != null) trip.TenLichTrinh = title;

        var description = TrimToNull(request.MoTa) ?? TrimToNull(request.Description);
        if (description != null) trip.MoTa = description;

        var budget = request.Budget;
        if (budget.HasValue)
        {
            if (budget.Value < 0) return new TripServiceError("Ngan sach khong duoc am.");
            trip.NganSachToiDa = budget.Value;
        }

        var visibility = TrimToNull(request.Visibility);
        if (visibility != null)
        {
            trip.LaCongKhai = IsPublicVisibility(visibility);
            trip.TrangThai = trip.LaCongKhai ? PublicStatus : DraftStatus;
        }

        var thumbnail = TrimToNull(request.Thumbnail);
        if (thumbnail != null) trip.Thumbnail = thumbnail;

        trip.NgayCapNhat = DateTime.UtcNow;
        _unitOfWork.LichTrinhs.Update(trip);
        await _unitOfWork.SaveChangesAsync();

        var refreshedTrip = await FindEditableTripAsync(id, uid, includeGraph: true);
        return refreshedTrip == null
            ? new TripServiceError("Khong the tai lai lich trinh vua cap nhat.", 500)
            : MapTripDetail(refreshedTrip);
    }

    public async Task<object> GetTripByIdAsync(int id, int uid)
    {
        var trip = await FindAccessibleTripAsync(id, uid, includeGraph: true);
        if (trip == null) return NotFound();

        return MapTripDetail(trip);
    }

    public async Task<object> GetTimelineAsync(int id, int uid)
    {
        var trip = await FindAccessibleTripAsync(id, uid, includeGraph: true);
        if (trip == null) return NotFound();

        return MapDays(trip);
    }

    public async Task<object> GetUpcomingTripsAsync(int uid)
    {
        if (uid <= 0) return Unauthorized();

        var today = Today();
        var trips = await TripGraphQuery()
            .Where(trip => (trip.MaNguoiDung == uid
                    || trip.ChiaSeLichTrinh.Any(share => share.MaNguoiDung == uid))
                && trip.TrangThai != ArchivedStatus
                && trip.NgayKetThuc >= today)
            .OrderBy(trip => trip.NgayBatDau)
            .ThenBy(trip => trip.MaLichTrinh)
            .Take(5)
            .ToListAsync();

        return trips.Select(MapTrip).ToList();
    }

    public async Task<object> UpdateTimelineAsync(int id, UpdateTimelineRequest request, int uid)
    {
        if (uid <= 0) return Unauthorized();
        if (request.TripId > 0 && request.TripId != id)
        {
            return new TripServiceError("TripId trong body khong khop route.");
        }

        var trip = await FindEditableTripAsync(id, uid, includeGraph: true);
        if (trip == null) return NotFound();

        if (request.Days.Count == 0)
        {
            return new { success = true, days = MapDays(trip) };
        }

        await ReplaceTimelineAsync(trip, request.Days);

        var refreshedTrip = await FindEditableTripAsync(id, uid, includeGraph: true);
        return refreshedTrip == null
            ? new TripServiceError("Khong the tai lai timeline vua cap nhat.", 500)
            : new { success = true, days = MapDays(refreshedTrip) };
    }

    public async Task<object> GetTripBudgetAsync(int id)
    {
        var trip = await TripGraphQuery()
            .FirstOrDefaultAsync(item => item.MaLichTrinh == id && item.TrangThai != ArchivedStatus);

        if (trip == null) return NotFound();

        var items = trip.NgayLichTrinh
            .SelectMany(day => day.DiaDiemLichTrinh)
            .SelectMany(place => place.DichVuLichTrinh)
            .SelectMany(service => service.ChiPhiDichVuLichTrinh.Select(cost => new
            {
                id = cost.MaChiPhi,
                type = cost.LoaiChiPhi,
                amount = cost.SoTien,
                note = cost.GhiChu,
                serviceName = service.MaDichVuNavigation.TenDichVu
            }))
            .ToList();

        var total = items.Sum(item => item.amount);
        return new
        {
            total = total > 0 ? total : trip.TongChiPhiUocTinh,
            items
        };
    }

    public async Task<object> GetTravelerDashboardStatsAsync(int uid)
    {
        if (uid <= 0) return Unauthorized();

        var today = Today();
        var trips = _unitOfWork.LichTrinhs.GetQueryable()
            .Where(trip => (trip.MaNguoiDung == uid
                    || trip.ChiaSeLichTrinh.Any(share => share.MaNguoiDung == uid))
                && trip.TrangThai != ArchivedStatus);

        var totalTrips = await trips.CountAsync();
        var upcomingTrips = await trips.CountAsync(trip => trip.NgayKetThuc >= today);
        var publicTrips = await trips.CountAsync(trip => trip.LaCongKhai || trip.TrangThai == PublicStatus);
        var savedTrips = await _unitOfWork.LuuLichTrinhs.CountAsync(saved => saved.MaNguoiDung == uid);

        return new
        {
            totalTrips,
            upcomingTrips,
            publicTrips,
            savedTrips,
            savedPlaces = 0,
            totalDistance = 0
        };
    }

    public async Task<object> GetTripDestinationsAsync(int id)
    {
        var destinations = await _unitOfWork.DiaDiemLichTrinhs.GetQueryable()
            .Where(item => item.MaNgayNavigation.MaLichTrinh == id
                && item.MaNgayNavigation.MaLichTrinhNavigation.TrangThai != ArchivedStatus)
            .Select(item => new
            {
                id = item.MaDiaDiem,
                name = item.MaDiaDiemNavigation.TenDiaDiem,
                thumbnail = item.MaDiaDiemNavigation.Thumbnail,
                address = item.MaDiaDiemNavigation.DiaChi
            })
            .Distinct()
            .OrderBy(item => item.name)
            .ToListAsync();

        return destinations;
    }

    public async Task<object> CloneTripAsync(int id, int uid)
    {
        if (uid <= 0) return Unauthorized();
        if (!await _unitOfWork.NguoiDungs.AnyAsync(user => user.MaNguoiDung == uid))
        {
            return new TripServiceError("Nguoi dung khong ton tai.", 404);
        }

        var sourceTrip = await FindAccessibleTripAsync(id, uid, includeGraph: true);
        if (sourceTrip == null) return NotFound();

        var now = DateTime.UtcNow;
        var clonedTrip = new LichTrinh
        {
            MaNguoiDung = uid,
            TenLichTrinh = $"{sourceTrip.TenLichTrinh} - ban sao",
            MoTa = sourceTrip.MoTa,
            Thumbnail = sourceTrip.Thumbnail,
            NgayBatDau = sourceTrip.NgayBatDau,
            NgayKetThuc = sourceTrip.NgayKetThuc,
            NganSachToiDa = sourceTrip.NganSachToiDa,
            TongChiPhiUocTinh = sourceTrip.TongChiPhiUocTinh,
            LaCongKhai = false,
            LuotXem = 0,
            LuotThich = 0,
            LuotClone = 0,
            TrangThai = DraftStatus,
            NgayTao = now,
            NgayCapNhat = now
        };

        await _unitOfWork.LichTrinhs.AddAsync(clonedTrip);
        await _unitOfWork.SaveChangesAsync();

        foreach (var sourceDay in sourceTrip.NgayLichTrinh.OrderBy(day => day.SoThuTu))
        {
            var clonedDay = new NgayLichTrinh
            {
                MaLichTrinh = clonedTrip.MaLichTrinh,
                Ngay = sourceDay.Ngay,
                SoThuTu = sourceDay.SoThuTu,
                GhiChu = sourceDay.GhiChu
            };

            await _unitOfWork.NgayLichTrinhs.AddAsync(clonedDay);
            await _unitOfWork.SaveChangesAsync();

            foreach (var sourcePlace in sourceDay.DiaDiemLichTrinh.OrderBy(place => place.ThuTu))
            {
                var clonedPlace = new DiaDiemLichTrinh
                {
                    MaNgay = clonedDay.MaNgay,
                    MaDiaDiem = sourcePlace.MaDiaDiem,
                    TieuDe = sourcePlace.TieuDe,
                    GioBatDau = sourcePlace.GioBatDau,
                    GioKetThuc = sourcePlace.GioKetThuc,
                    ThuTu = sourcePlace.ThuTu,
                    GhiChu = sourcePlace.GhiChu
                };

                await _unitOfWork.DiaDiemLichTrinhs.AddAsync(clonedPlace);
                await _unitOfWork.SaveChangesAsync();

                foreach (var sourceService in sourcePlace.DichVuLichTrinh.OrderBy(service => service.ThuTu))
                {
                    var clonedService = new DichVuLichTrinh
                    {
                        MaDiaDiemLichTrinh = clonedPlace.MaDiaDiemLichTrinh,
                        MaDichVu = sourceService.MaDichVu,
                        ThuTu = sourceService.ThuTu,
                        GhiChu = sourceService.GhiChu,
                        GioBatDau = sourceService.GioBatDau,
                        GioKetThuc = sourceService.GioKetThuc
                    };

                    await _unitOfWork.DichVuLichTrinhs.AddAsync(clonedService);
                    await _unitOfWork.SaveChangesAsync();

                    var clonedCosts = sourceService.ChiPhiDichVuLichTrinh.Select(cost => new ChiPhiDichVuLichTrinh
                    {
                        MaDichVuLichTrinh = clonedService.MaDichVuLichTrinh,
                        LoaiChiPhi = cost.LoaiChiPhi,
                        SoTien = cost.SoTien,
                        GhiChu = cost.GhiChu
                    });

                    await _unitOfWork.ChiPhiDichVuLichTrinhs.AddRangeAsync(clonedCosts);
                    await _unitOfWork.SaveChangesAsync();
                }
            }
        }

        sourceTrip.LuotClone += 1;
        sourceTrip.NgayCapNhat = now;
        _unitOfWork.LichTrinhs.Update(sourceTrip);

        await _unitOfWork.LichSuClones.AddAsync(new LichSuClone
        {
            MaLichTrinhGoc = sourceTrip.MaLichTrinh,
            MaLichTrinhMoi = clonedTrip.MaLichTrinh,
            MaNguoiDung = uid,
            NgayClone = now
        });

        await _unitOfWork.SaveChangesAsync();

        var refreshedTrip = await FindOwnedTripAsync(clonedTrip.MaLichTrinh, uid, includeGraph: true);
        return refreshedTrip == null
            ? new TripServiceError("Khong the tai lai lich trinh vua clone.", 500)
            : MapTripDetail(refreshedTrip);
    }

    private IQueryable<LichTrinh> TripGraphQuery()
        => _unitOfWork.LichTrinhs.GetQueryable()
            .AsSplitQuery()
            .Include(trip => trip.NgayLichTrinh)
                .ThenInclude(day => day.DiaDiemLichTrinh)
                    .ThenInclude(place => place.MaDiaDiemNavigation)
            .Include(trip => trip.NgayLichTrinh)
                .ThenInclude(day => day.DiaDiemLichTrinh)
                    .ThenInclude(place => place.DichVuLichTrinh)
                        .ThenInclude(service => service.MaDichVuNavigation)
            .Include(trip => trip.NgayLichTrinh)
                .ThenInclude(day => day.DiaDiemLichTrinh)
                    .ThenInclude(place => place.DichVuLichTrinh)
                        .ThenInclude(service => service.ChiPhiDichVuLichTrinh);

    private Task<LichTrinh?> FindOwnedTripAsync(int id, int uid, bool includeGraph)
    {
        var query = includeGraph ? TripGraphQuery() : _unitOfWork.LichTrinhs.GetQueryable();

        return query.FirstOrDefaultAsync(trip => trip.MaLichTrinh == id
            && trip.MaNguoiDung == uid
            && trip.TrangThai != ArchivedStatus);
    }

    private Task<LichTrinh?> FindEditableTripAsync(int id, int uid, bool includeGraph)
    {
        var query = includeGraph ? TripGraphQuery() : _unitOfWork.LichTrinhs.GetQueryable();

        return query.FirstOrDefaultAsync(trip => trip.MaLichTrinh == id
            && trip.TrangThai != ArchivedStatus
            && (trip.MaNguoiDung == uid
                || trip.ChiaSeLichTrinh.Any(share => share.MaNguoiDung == uid && share.Quyen == "EDITOR")));
    }

    private Task<LichTrinh?> FindAccessibleTripAsync(int id, int uid, bool includeGraph)
    {
        var query = includeGraph ? TripGraphQuery() : _unitOfWork.LichTrinhs.GetQueryable();

        query = query.Where(trip => trip.MaLichTrinh == id && trip.TrangThai != ArchivedStatus);
        query = uid > 0
            ? query.Where(trip => trip.MaNguoiDung == uid
                || trip.ChiaSeLichTrinh.Any(share => share.MaNguoiDung == uid)
                || trip.LaCongKhai
                || trip.TrangThai == PublicStatus)
            : query.Where(trip => trip.LaCongKhai || trip.TrangThai == PublicStatus);

        return query.FirstOrDefaultAsync();
    }

    private async Task ReplaceTimelineAsync(LichTrinh trip, IReadOnlyCollection<TripDayDto> days)
    {
        var existingDays = trip.NgayLichTrinh.ToList();
        var existingPlaces = existingDays.SelectMany(day => day.DiaDiemLichTrinh).ToList();
        var existingServices = existingPlaces.SelectMany(place => place.DichVuLichTrinh).ToList();
        var existingCosts = existingServices.SelectMany(service => service.ChiPhiDichVuLichTrinh).ToList();

        _unitOfWork.ChiPhiDichVuLichTrinhs.RemoveRange(existingCosts);
        _unitOfWork.DichVuLichTrinhs.RemoveRange(existingServices);
        _unitOfWork.DiaDiemLichTrinhs.RemoveRange(existingPlaces);
        _unitOfWork.NgayLichTrinhs.RemoveRange(existingDays);
        await _unitOfWork.SaveChangesAsync();

        var normalizedDays = days
            .OrderBy(day => day.SoThuTu > 0 ? day.SoThuTu : int.MaxValue)
            .ThenBy(day => day.Ngay)
            .Take(MaxGeneratedDays)
            .ToList();

        var usedDates = new HashSet<int>();
        for (var dayIndex = 0; dayIndex < normalizedDays.Count; dayIndex++)
        {
            var sourceDay = normalizedDays[dayIndex];
            var dayDate = sourceDay.Ngay ?? trip.NgayBatDau.AddDays(dayIndex);
            while (!usedDates.Add(dayDate.DayNumber))
            {
                dayDate = dayDate.AddDays(1);
            }

            var newDay = new NgayLichTrinh
            {
                MaLichTrinh = trip.MaLichTrinh,
                Ngay = dayDate,
                SoThuTu = dayIndex + 1,
                GhiChu = TrimToNull(sourceDay.GhiChu)
            };

            await _unitOfWork.NgayLichTrinhs.AddAsync(newDay);
            await _unitOfWork.SaveChangesAsync();

            var orderedItems = sourceDay.Items
                .OrderBy(item => item.ThuTu > 0 ? item.ThuTu : int.MaxValue)
                .ToList();

            for (var itemIndex = 0; itemIndex < orderedItems.Count; itemIndex++)
            {
                var item = orderedItems[itemIndex];
                var service = await ResolveServiceAsync(item);
                var placeId = item.MaDiaDiem ?? service?.MaDiaDiem;

                if (placeId == null || !await _unitOfWork.DiaDiems.AnyAsync(place => place.MaDiaDiem == placeId.Value))
                {
                    continue;
                }

                var newPlace = new DiaDiemLichTrinh
                {
                    MaNgay = newDay.MaNgay,
                    MaDiaDiem = placeId.Value,
                    TieuDe = TrimToNull(item.TieuDe) ?? service?.TenDichVu,
                    GioBatDau = item.StartTime,
                    GioKetThuc = item.EndTime,
                    ThuTu = itemIndex + 1,
                    GhiChu = TrimToNull(item.GhiChu)
                };

                await _unitOfWork.DiaDiemLichTrinhs.AddAsync(newPlace);
                await _unitOfWork.SaveChangesAsync();

                if (service == null) continue;

                var newService = new DichVuLichTrinh
                {
                    MaDiaDiemLichTrinh = newPlace.MaDiaDiemLichTrinh,
                    MaDichVu = service.MaDichVu,
                    ThuTu = 1,
                    GhiChu = TrimToNull(item.GhiChu),
                    GioBatDau = item.StartTime,
                    GioKetThuc = item.EndTime
                };

                await _unitOfWork.DichVuLichTrinhs.AddAsync(newService);
                await _unitOfWork.SaveChangesAsync();

                if (item.ChiPhiDuKien is > 0)
                {
                    await _unitOfWork.ChiPhiDichVuLichTrinhs.AddAsync(new ChiPhiDichVuLichTrinh
                    {
                        MaDichVuLichTrinh = newService.MaDichVuLichTrinh,
                        LoaiChiPhi = MapCostType(service.LoaiDichVu),
                        SoTien = item.ChiPhiDuKien.Value,
                        GhiChu = null
                    });
                }
            }
        }

        trip.NgayCapNhat = DateTime.UtcNow;
        trip.TongChiPhiUocTinh = days
            .SelectMany(day => day.Items)
            .Where(item => item.ChiPhiDuKien.HasValue)
            .Sum(item => item.ChiPhiDuKien!.Value);

        _unitOfWork.LichTrinhs.Update(trip);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task<DichVu?> ResolveServiceAsync(TripItemDto item)
    {
        var (serviceId, expectedType) = ResolveServiceIdentity(item);
        if (serviceId == null) return null;

        var service = await _unitOfWork.DichVus.GetQueryable()
            .FirstOrDefaultAsync(candidate => candidate.MaDichVu == serviceId.Value
                && candidate.TrangThai != "DELETED");

        if (service == null) return null;
        if (expectedType != null && service.LoaiDichVu != expectedType) return null;

        return service;
    }

    private static (int? ServiceId, string? ExpectedType) ResolveServiceIdentity(TripItemDto item)
    {
        if (item.MaKhachSan.HasValue) return (item.MaKhachSan.Value, "KHACH_SAN");
        if (item.MaNhaHang.HasValue) return (item.MaNhaHang.Value, "NHA_HANG");
        if (item.MaHoatDong.HasValue) return (item.MaHoatDong.Value, "HOAT_DONG");
        if (item.MaPhuongTien.HasValue) return (item.MaPhuongTien.Value, "PHUONG_TIEN");
        return (null, null);
    }

    private static TripDto MapTrip(LichTrinh trip)
        => new()
        {
            Id = trip.MaLichTrinh,
            TenLichTrinh = trip.TenLichTrinh,
            NgayBatDau = trip.NgayBatDau,
            NgayKetThuc = trip.NgayKetThuc,
            LaCongKhai = IsTripPublic(trip),
            NganSachToiDa = trip.NganSachToiDa,
            TongChiPhi = CalculateTripCost(trip),
            Thumbnail = trip.Thumbnail,
            TrangThai = MapTripStatus(trip),
            NgayCapNhat = trip.NgayCapNhat,
            SoLuongDiaDiem = CountDistinctPlaces(trip)
        };

    private static TripDetailDto MapTripDetail(LichTrinh trip)
        => new()
        {
            Id = trip.MaLichTrinh,
            TenLichTrinh = trip.TenLichTrinh,
            MoTa = trip.MoTa,
            NgayBatDau = trip.NgayBatDau,
            NgayKetThuc = trip.NgayKetThuc,
            LaCongKhai = IsTripPublic(trip),
            NganSachToiDa = trip.NganSachToiDa,
            TongChiPhi = CalculateTripCost(trip),
            Thumbnail = trip.Thumbnail,
            TrangThai = MapTripStatus(trip),
            NgayCapNhat = trip.NgayCapNhat,
            SoLuongDiaDiem = CountDistinctPlaces(trip),
            Days = MapDays(trip)
        };

    private static List<TripDayDto> MapDays(LichTrinh trip)
        => trip.NgayLichTrinh
            .OrderBy(day => day.SoThuTu)
            .ThenBy(day => day.Ngay)
            .Select(day => new TripDayDto
            {
                MaNgay = day.MaNgay,
                Ngay = day.Ngay,
                SoThuTu = day.SoThuTu,
                GhiChu = day.GhiChu,
                Items = MapItems(day).ToList()
            })
            .ToList();

    private static IEnumerable<TripItemDto> MapItems(NgayLichTrinh day)
    {
        foreach (var place in day.DiaDiemLichTrinh.OrderBy(item => item.ThuTu))
        {
            var services = place.DichVuLichTrinh.OrderBy(service => service.ThuTu).ToList();
            if (services.Count == 0)
            {
                yield return new TripItemDto
                {
                    Id = place.MaDiaDiemLichTrinh,
                    MaNgay = day.MaNgay,
                    MaDiaDiem = place.MaDiaDiem,
                    TenDiaDiem = place.MaDiaDiemNavigation.TenDiaDiem,
                    TieuDe = place.TieuDe ?? place.MaDiaDiemNavigation.TenDiaDiem,
                    StartTime = place.GioBatDau,
                    EndTime = place.GioKetThuc,
                    ThuTu = place.ThuTu,
                    GhiChu = place.GhiChu,
                    ChiPhiDuKien = null
                };

                continue;
            }

            foreach (var service in services)
            {
                var item = new TripItemDto
                {
                    Id = service.MaDichVuLichTrinh,
                    MaNgay = day.MaNgay,
                    MaDiaDiem = place.MaDiaDiem,
                    TenDiaDiem = place.MaDiaDiemNavigation.TenDiaDiem,
                    TieuDe = place.TieuDe ?? service.MaDichVuNavigation.TenDichVu,
                    StartTime = service.GioBatDau ?? place.GioBatDau,
                    EndTime = service.GioKetThuc ?? place.GioKetThuc,
                    ThuTu = service.ThuTu,
                    GhiChu = service.GhiChu ?? place.GhiChu,
                    ChiPhiDuKien = service.ChiPhiDichVuLichTrinh.Sum(cost => cost.SoTien)
                };

                ApplyServiceType(item, service.MaDichVuNavigation);
                yield return item;
            }
        }
    }

    private static void ApplyServiceType(TripItemDto item, DichVu service)
    {
        switch (service.LoaiDichVu)
        {
            case "KHACH_SAN":
                item.MaKhachSan = service.MaDichVu;
                break;
            case "NHA_HANG":
                item.MaNhaHang = service.MaDichVu;
                break;
            case "HOAT_DONG":
                item.MaHoatDong = service.MaDichVu;
                break;
            case "PHUONG_TIEN":
                item.MaPhuongTien = service.MaDichVu;
                break;
        }
    }

    private static string MapCostType(string serviceType)
        => serviceType switch
        {
            "KHACH_SAN" => "LUU_TRU",
            "NHA_HANG" => "AN_UONG",
            "HOAT_DONG" => "THAM_QUAN",
            "PHUONG_TIEN" => "DI_CHUYEN",
            _ => "KHAC"
        };

    private static int CountDistinctPlaces(LichTrinh trip)
        => trip.NgayLichTrinh
            .SelectMany(day => day.DiaDiemLichTrinh)
            .Select(place => place.MaDiaDiem)
            .Distinct()
            .Count();

    private static decimal CalculateTripCost(LichTrinh trip)
    {
        var itemCost = trip.NgayLichTrinh
            .SelectMany(day => day.DiaDiemLichTrinh)
            .SelectMany(place => place.DichVuLichTrinh)
            .SelectMany(service => service.ChiPhiDichVuLichTrinh)
            .Sum(cost => cost.SoTien);

        return itemCost > 0 ? itemCost : trip.TongChiPhiUocTinh;
    }

    private static string MapTripStatus(LichTrinh trip)
    {
        if (trip.TrangThai == ArchivedStatus) return "COMPLETED";
        if (!IsTripPublic(trip)) return DraftStatus;
        if (trip.TrangThai != PublicStatus && trip.TrangThai != DraftStatus) return trip.TrangThai;

        var today = Today();
        if (today < trip.NgayBatDau) return "PLANNED";
        return today > trip.NgayKetThuc ? "COMPLETED" : "ONGOING";
    }

    private static bool IsPublicVisibility(string? visibility)
        => string.Equals(TrimToNull(visibility), "PUBLIC", StringComparison.OrdinalIgnoreCase);

    private static bool IsTripPublic(LichTrinh trip)
        => trip.LaCongKhai || trip.TrangThai == PublicStatus;

    private static DateOnly? ToDateOnly(DateTime? value)
        => value.HasValue ? DateOnly.FromDateTime(value.Value) : null;

    private static DateOnly Today()
        => DateOnly.FromDateTime(DateTime.UtcNow.AddHours(7));

    private static string? TrimToNull(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }

    private static TripServiceError Unauthorized()
        => new("Can dang nhap de thuc hien thao tac nay.", 401);

    private static TripServiceError NotFound()
        => new("Khong tim thay lich trinh.", 404);
}
