using ezTravel.DTO.Trips;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Trips;

public class TripService : ITripService
{
    private readonly IUnitOfWork _uow;

    public TripService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IEnumerable<TripDto>> GetUserTripsAsync(int userId)
    {
        var trips = await _uow.LichTrinhs.GetQueryable()
            .Where(t => t.MaNguoiDung == userId && !t.DaXoa)
            .OrderByDescending(t => t.NgayTao)
            .Select(t => new TripDto
            {
                Id = t.MaLichTrinh,
                TenLichTrinh = t.TenLichTrinh,
                DiemDen = t.DiemDen,
                NgayBatDau = t.NgayBatDau,
                NgayKetThuc = t.NgayKetThuc,
                TrangThai = t.TrangThai
            })
            .ToListAsync();

        return trips;
    }

    public async Task<TripDetailDto?> GetTripByIdAsync(int tripId, int userId)
    {
        var trip = await _uow.LichTrinhs.GetQueryable()
            .Include(t => t.ChiTietLichTrinhs)
                .ThenInclude(ct => ct.DiaDiem)
            .Include(t => t.ChiTietLichTrinhs)
                .ThenInclude(ct => ct.DichVu)
            .FirstOrDefaultAsync(t => t.MaLichTrinh == tripId && t.MaNguoiDung == userId && !t.DaXoa);

        if (trip == null) return null;

        return new TripDetailDto
        {
            Id = trip.MaLichTrinh,
            TenLichTrinh = trip.TenLichTrinh,
            DiemDen = trip.DiemDen,
            NgayBatDau = trip.NgayBatDau,
            NgayKetThuc = trip.NgayKetThuc,
            TrangThai = trip.TrangThai,
            SoNguoi = trip.SoNguoi,
            NganSach = trip.NganSach,
            MoTa = trip.MoTa,
            TrangThaiChiaSe = trip.TrangThaiChiaSe,
            Items = trip.ChiTietLichTrinhs
                .OrderBy(ct => ct.NgayTrongLichTrinh)
                .ThenBy(ct => ct.ThuTu)
                .Select(ct => new TripItemDto
                {
                    Id = ct.MaChiTiet,
                    MaDiaDiem = ct.MaDiaDiem,
                    TenDiaDiem = ct.DiaDiem.TenDiaDiem,
                    MaDichVu = ct.MaDichVu,
                    TenDichVu = ct.DichVu?.TenDichVu,
                    Ngay = ct.NgayTrongLichTrinh,
                    GioBatDau = ct.GioBatDau,
                    ThuTu = ct.ThuTu,
                    GhiChu = ct.GhiChu,
                    GiaDichVu = ct.DichVu?.GiaTien
                }).ToList()
        };
    }

    public async Task<TripDto> CreateTripAsync(CreateTripRequest request, int userId)
    {
        var trip = new LichTrinh
        {
            MaNguoiDung = userId,
            TenLichTrinh = request.TenLichTrinh,
            DiemDen = request.DiemDen,
            NgayBatDau = request.NgayBatDau,
            NgayKetThuc = request.NgayKetThuc,
            SoNguoi = request.SoNguoi,
            NganSach = request.NganSach,
            MoTa = request.MoTa,
            TrangThai = "Nhap",
            TrangThaiChiaSe = "RiengTu",
            NgayTao = DateTime.UtcNow
        };

        await _uow.LichTrinhs.AddAsync(trip);
        await _uow.SaveChangesAsync();

        return new TripDto
        {
            Id = trip.MaLichTrinh,
            TenLichTrinh = trip.TenLichTrinh,
            DiemDen = trip.DiemDen,
            NgayBatDau = trip.NgayBatDau,
            NgayKetThuc = trip.NgayKetThuc,
            TrangThai = trip.TrangThai
        };
    }

    public async Task<bool> UpdateTripAsync(int tripId, UpdateTripRequest request, int userId)
    {
        var trip = await _uow.LichTrinhs.GetByIdAsync(tripId);
        if (trip == null || trip.MaNguoiDung != userId || trip.DaXoa) return false;

        trip.TenLichTrinh = request.TenLichTrinh;
        trip.DiemDen = request.DiemDen;
        trip.NgayBatDau = request.NgayBatDau;
        trip.NgayKetThuc = request.NgayKetThuc;
        trip.SoNguoi = request.SoNguoi;
        trip.NganSach = request.NganSach;
        trip.MoTa = request.MoTa;
        trip.TrangThai = request.TrangThai;
        trip.TrangThaiChiaSe = request.TrangThaiChiaSe;

        _uow.LichTrinhs.Update(trip);
        return await _uow.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteTripAsync(int tripId, int userId)
    {
        var trip = await _uow.LichTrinhs.GetByIdAsync(tripId);
        if (trip == null || trip.MaNguoiDung != userId) return false;

        trip.DaXoa = true;
        _uow.LichTrinhs.Update(trip);
        return await _uow.SaveChangesAsync() > 0;
    }

    public async Task<bool> AddLocationToTripAsync(int tripId, AddLocationRequest request, int userId)
    {
        var trip = await _uow.LichTrinhs.GetByIdAsync(tripId);
        if (trip == null || trip.MaNguoiDung != userId || trip.DaXoa) return false;

        // Get max order for the day
        var maxOrder = await _uow.ChiTietLichTrinhs.GetQueryable()
            .Where(ct => ct.MaLichTrinh == tripId && ct.NgayTrongLichTrinh == request.Ngay)
            .Select(ct => (int?)ct.ThuTu)
            .MaxAsync() ?? 0;

        var detail = new ChiTietLichTrinh
        {
            MaLichTrinh = tripId,
            MaDiaDiem = request.MaDiaDiem,
            MaDichVu = request.MaDichVu,
            NgayTrongLichTrinh = request.Ngay,
            GioBatDau = request.GioBatDau,
            ThuTu = maxOrder + 1,
            GhiChu = request.GhiChu
        };

        await _uow.ChiTietLichTrinhs.AddAsync(detail);
        return await _uow.SaveChangesAsync() > 0;
    }

    public async Task<bool> RemoveLocationFromTripAsync(int tripId, int itemId, int userId)
    {
        var trip = await _uow.LichTrinhs.GetByIdAsync(tripId);
        if (trip == null || trip.MaNguoiDung != userId || trip.DaXoa) return false;

        var item = await _uow.ChiTietLichTrinhs.GetByIdAsync(itemId);
        if (item == null || item.MaLichTrinh != tripId) return false;

        _uow.ChiTietLichTrinhs.Delete(item);
        return await _uow.SaveChangesAsync() > 0;
    }

    public async Task<bool> ReorderItemsAsync(int tripId, ReorderItemsRequest request, int userId)
    {
        var trip = await _uow.LichTrinhs.GetByIdAsync(tripId);
        if (trip == null || trip.MaNguoiDung != userId || trip.DaXoa) return false;

        await _uow.BeginTransactionAsync();
        try
        {
            foreach (var itemUpdate in request.Items)
            {
                var item = await _uow.ChiTietLichTrinhs.GetByIdAsync(itemUpdate.MaChiTiet);
                if (item != null && item.MaLichTrinh == tripId)
                {
                    item.NgayTrongLichTrinh = itemUpdate.Ngay;
                    item.ThuTu = itemUpdate.ThuTu;
                    _uow.ChiTietLichTrinhs.Update(item);
                }
            }

            await _uow.SaveChangesAsync();
            await _uow.CommitAsync();
            return true;
        }
        catch
        {
            await _uow.RollbackAsync();
            return false;
        }
    }

    public async Task<decimal> CalculateTotalCostAsync(int tripId)
    {
        var total = await _uow.ChiTietLichTrinhs.GetQueryable()
            .Where(ct => ct.MaLichTrinh == tripId)
            .SumAsync(ct => ct.DichVu != null ? ct.DichVu.GiaTien : 0);

        return total;
    }

    public async Task<TripDto> CloneTripAsync(int tripId, int userId)
    {
        var sourceTrip = await _uow.LichTrinhs.GetQueryable()
            .Include(t => t.ChiTietLichTrinhs)
            .FirstOrDefaultAsync(t => t.MaLichTrinh == tripId && !t.DaXoa);

        if (sourceTrip == null) throw new Exception("Trip not found");

        var newTrip = new LichTrinh
        {
            MaNguoiDung = userId,
            TenLichTrinh = "Copy of " + sourceTrip.TenLichTrinh,
            DiemDen = sourceTrip.DiemDen,
            NgayBatDau = sourceTrip.NgayBatDau,
            NgayKetThuc = sourceTrip.NgayKetThuc,
            SoNguoi = sourceTrip.SoNguoi,
            NganSach = sourceTrip.NganSach,
            MoTa = sourceTrip.MoTa,
            TrangThai = "Nhap",
            TrangThaiChiaSe = "RiengTu",
            NgayTao = DateTime.UtcNow
        };

        await _uow.LichTrinhs.AddAsync(newTrip);
        await _uow.SaveChangesAsync();

        foreach (var item in sourceTrip.ChiTietLichTrinhs)
        {
            var newItem = new ChiTietLichTrinh
            {
                MaLichTrinh = newTrip.MaLichTrinh,
                MaDiaDiem = item.MaDiaDiem,
                MaDichVu = item.MaDichVu,
                NgayTrongLichTrinh = item.NgayTrongLichTrinh,
                GioBatDau = item.GioBatDau,
                ThuTu = item.ThuTu,
                GhiChu = item.GhiChu
            };
            await _uow.ChiTietLichTrinhs.AddAsync(newItem);
        }

        await _uow.SaveChangesAsync();

        return new TripDto
        {
            Id = newTrip.MaLichTrinh,
            TenLichTrinh = newTrip.TenLichTrinh,
            DiemDen = newTrip.DiemDen,
            NgayBatDau = newTrip.NgayBatDau,
            NgayKetThuc = newTrip.NgayKetThuc,
            TrangThai = newTrip.TrangThai
        };
    }
}
