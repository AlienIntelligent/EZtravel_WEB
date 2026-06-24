using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Admin;

public interface IDestinationAdminService
{
    Task<object> GetDestinationsAsync();
    Task<object> CreateDestinationAsync(UpsertDestinationRequest request);
    Task<object> UpdateDestinationAsync(int id, UpsertDestinationRequest request);
    Task<object> DeleteDestinationAsync(int id);
}

public class DestinationAdminService : IDestinationAdminService
{
    private readonly IUnitOfWork _uow;

    public DestinationAdminService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetDestinationsAsync()
    {
        var destinations = await _uow.DiaDiems.GetQueryable()
            .Include(d => d.MaTinhThanhNavigation)
            .OrderByDescending(d => d.NgayTao)
            .ToListAsync();

        return destinations.Select(MapDestination).ToList();
    }

    public async Task<object> CreateDestinationAsync(UpsertDestinationRequest request)
    {
        var destination = new DiaDiem
        {
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow
        };

        ApplyDestinationRequest(destination, request);

        await _uow.DiaDiems.AddAsync(destination);
        await _uow.SaveChangesAsync();

        return MapDestination(destination);
    }

    public async Task<object> UpdateDestinationAsync(int id, UpsertDestinationRequest request)
    {
        var destination = await _uow.DiaDiems.GetByIdAsync(id);
        if (destination == null)
            return new AdminServiceError("Khong tim thay dia diem.", 404);

        ApplyDestinationRequest(destination, request);
        destination.NgayCapNhat = DateTime.UtcNow;

        _uow.DiaDiems.Update(destination);
        await _uow.SaveChangesAsync();

        return MapDestination(destination);
    }

    public async Task<object> DeleteDestinationAsync(int id)
    {
        var destination = await _uow.DiaDiems.GetByIdAsync(id);
        if (destination == null)
            return new AdminServiceError("Khong tim thay dia diem.", 404);

        _uow.DiaDiems.Remove(destination);
        await _uow.SaveChangesAsync();

        return new { success = true, id };
    }

    private static void ApplyDestinationRequest(DiaDiem place, UpsertDestinationRequest request)
    {
        place.TenDiaDiem = request.Name;
        place.LoaiDiaDiem = request.Type;
        place.Latitude = (decimal?)request.Latitude;
        place.Longitude = (decimal?)request.Longitude;
        place.MaTinhThanh = request.ProvinceId;
        place.TrangThai = request.Status ?? "ACTIVE";
        place.MoTa = request.Description;
        if (!string.IsNullOrEmpty(request.CoverImageUrl))
            place.Thumbnail = request.CoverImageUrl;
    }

    private static object MapDestination(DiaDiem destination)
        => new
        {
            id = destination.MaDiaDiem,
            name = destination.TenDiaDiem,
            description = destination.MoTa,
            latitude = destination.Latitude,
            longitude = destination.Longitude,
            provinceId = destination.MaTinhThanh,
            provinceName = destination.MaTinhThanhNavigation?.TenTinhThanh,
            type = destination.LoaiDiaDiem,
            coverImageUrl = destination.Thumbnail,
            status = destination.TrangThai,
            createdAt = destination.NgayTao,
            updatedAt = destination.NgayCapNhat
        };
}
