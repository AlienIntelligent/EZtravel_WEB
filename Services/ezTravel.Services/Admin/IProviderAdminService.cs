using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Admin;

public interface IProviderAdminService
{
    Task<object> GetAllProvidersAsync();
    Task<object> UpdateProviderAsync(int id, UpsertProviderAdminRequest request);
    Task<object> DeleteProviderAsync(int id);
}

public class ProviderAdminService : IProviderAdminService
{
    private readonly IUnitOfWork _uow;

    public ProviderAdminService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetAllProvidersAsync()
    {
        var providers = await _uow.NhaCungCaps.GetQueryable()
            .Include(p => p.MaNguoiDungNavigation)
            .OrderByDescending(p => p.NgayTao)
            .ToListAsync();

        return providers.Select(MapProvider).ToList();
    }

    public async Task<object> UpdateProviderAsync(int id, UpsertProviderAdminRequest request)
    {
        var provider = await _uow.NhaCungCaps.GetQueryable()
            .Include(p => p.MaNguoiDungNavigation)
            .FirstOrDefaultAsync(p => p.MaNhaCungCap == id);

        if (provider == null)
            return new AdminServiceError("Khong tim thay nha cung cap.", 404);

        provider.TenDoanhNghiep = request.BusinessName;
        provider.SoDienThoai = request.Phone;
        provider.EmailLienHe = request.Email;
        provider.DiaChi = request.Address;
        provider.LoaiNhaCungCap = request.ProviderType;
        provider.MaSoThue = request.TaxCode;
        provider.SoGiayPhep = request.LicenseNumber;

        if (request.Status != null)
        {
            provider.TrangThai = request.Status;
        }

        provider.NgayCapNhat = DateTime.UtcNow;

        _uow.NhaCungCaps.Update(provider);
        await _uow.SaveChangesAsync();

        return MapProvider(provider);
    }

    public async Task<object> DeleteProviderAsync(int id)
    {
        var provider = await _uow.NhaCungCaps.GetByIdAsync(id);
        if (provider == null)
            return new AdminServiceError("Khong tim thay nha cung cap.", 404);

        _uow.NhaCungCaps.Remove(provider);
        await _uow.SaveChangesAsync();

        return new { success = true, id };
    }

    private static object MapProvider(NhaCungCap provider)
        => new
        {
            id = provider.MaNhaCungCap,
            userId = provider.MaNguoiDung,
            applicantName = provider.MaNguoiDungNavigation?.HoTen,
            email = provider.EmailLienHe,
            phone = provider.SoDienThoai,
            businessName = provider.TenDoanhNghiep,
            providerType = provider.LoaiNhaCungCap,
            taxCode = provider.MaSoThue,
            licenseNumber = provider.SoGiayPhep,
            address = provider.DiaChi,
            status = provider.TrangThai,
            createdAt = provider.NgayTao,
            updatedAt = provider.NgayCapNhat,
            approvedAt = provider.NgayPheDuyet
        };
}
