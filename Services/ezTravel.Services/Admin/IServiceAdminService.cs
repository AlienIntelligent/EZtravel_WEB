using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Admin;

public interface IServiceAdminService
{
    Task<object> GetAllServicesAsync();
    Task<object> UpdateServiceStatusAsync(int id, string status);
    Task<object> UpdateServiceAsync(int id, UpsertServiceAdminRequest request);
    Task<object> DeleteServiceAsync(int id);
}

public class ServiceAdminService : IServiceAdminService
{
    private readonly IUnitOfWork _uow;

    public ServiceAdminService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetAllServicesAsync()
    {
        var services = await _uow.DichVus.GetQueryable()
            .Include(s => s.MaNhaCungCapNavigation)
                .ThenInclude(p => p.MaNguoiDungNavigation)
            .OrderByDescending(s => s.NgayTao)
            .ToListAsync();

        return services.Select(MapService).ToList();
    }

    public async Task<object> UpdateServiceStatusAsync(int id, string status)
    {
        var service = await _uow.DichVus.GetByIdAsync(id);
        if (service == null)
            return new AdminServiceError("Khong tim thay dich vu.", 404);

        if (status == "APPROVED") status = "ACTIVE";
        else if (status == "REJECTED") status = "INACTIVE";

        service.TrangThai = status;
        service.NgayCapNhat = DateTime.UtcNow;

        _uow.DichVus.Update(service);
        await _uow.SaveChangesAsync();

        return MapService(service);
    }

    public async Task<object> UpdateServiceAsync(int id, UpsertServiceAdminRequest request)
    {
        var service = await _uow.DichVus.GetByIdAsync(id);
        if (service == null)
            return new AdminServiceError("Khong tim thay dich vu.", 404);

        service.TenDichVu = request.Name;
        service.LoaiDichVu = request.Type;
        service.GiaTu = request.Price;
        service.DiaChi = request.Location;
        service.MoTa = request.Description;
        var status = request.Status;
        if (status == "APPROVED") status = "ACTIVE";
        else if (status == "REJECTED") status = "INACTIVE";
        service.TrangThai = status;
        service.NgayCapNhat = DateTime.UtcNow;

        _uow.DichVus.Update(service);
        await _uow.SaveChangesAsync();

        return MapService(service);
    }

    public async Task<object> DeleteServiceAsync(int id)
    {
        var service = await _uow.DichVus.GetByIdAsync(id);
        if (service == null)
            return new AdminServiceError("Khong tim thay dich vu.", 404);

        _uow.DichVus.Remove(service);
        await _uow.SaveChangesAsync();

        return new { success = true, id };
    }

    private static object MapService(DichVu service)
    {
        var status = service.TrangThai;
        if (status == "ACTIVE") status = "APPROVED";
        else if (status == "INACTIVE") status = "REJECTED";

        return new
        {
            id = service.MaDichVu,
            name = service.TenDichVu,
            providerId = service.MaNhaCungCap,
            providerName = service.MaNhaCungCapNavigation?.TenDoanhNghiep ?? service.MaNhaCungCapNavigation?.MaNguoiDungNavigation?.HoTen,
            type = service.LoaiDichVu,
            price = service.GiaTu,
            location = service.DiaChi,
            description = service.MoTa,
            status = status,
            createdAt = service.NgayTao,
            updatedAt = service.NgayCapNhat
        };
    }
}
