using System;
using System.Linq;
using System.Threading.Tasks;
using ezTravel.Common.Constants;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ezTravel.Services.Providers;

public class ProviderPackageValidationService : IProviderPackageValidationService
{
    private readonly IDangKyGoiNccRepository _dangKyRepository;
    private readonly ILogger<ProviderPackageValidationService> _logger;

    public ProviderPackageValidationService(
        IDangKyGoiNccRepository dangKyRepository,
        ILogger<ProviderPackageValidationService> logger)
    {
        _dangKyRepository = dangKyRepository;
        _logger = logger;
    }

    public async Task ValidateRegistrationAsync(int providerId, GoiDichVuNcc package)
    {
        // Correction 2: Enforce Single Active Package detection
        var activeCount = await _dangKyRepository.CountAsync(r => r.MaNhaCungCap == providerId && r.TrangThai == PackageStatus.Active);
        if (activeCount > 1)
        {
            _logger.LogCritical("Multiple ACTIVE packages detected for ProviderId {ProviderId}", providerId);
            throw new InvalidOperationException($"Multiple ACTIVE packages detected for ProviderId {providerId}");
        }

        // Rule 3: Inactive package cannot be purchased
        if (!package.TrangThai)
        {
            throw new InvalidOperationException("Không thể đăng ký gói dịch vụ đang bị khóa hoặc ngưng hoạt động.");
        }

        // Get current active registration
        var currentActiveReg = await _dangKyRepository.GetQueryable()
            .Include(r => r.MaGoiNccNavigation)
            .Where(r => r.MaNhaCungCap == providerId && r.TrangThai == PackageStatus.Active && r.NgayKetThuc > DateTime.UtcNow)
            .OrderByDescending(r => r.NgayBatDau)
            .FirstOrDefaultAsync();

        if (currentActiveReg != null)
        {
            // Rule 4: Prevent duplicate active subscription
            if (currentActiveReg.MaGoiNcc == package.MaGoiNcc)
            {
                throw new InvalidOperationException("Nhà cung cấp đã sở hữu gói dịch vụ này và đang trong thời hạn kích hoạt.");
            }

            // Rule 5: Downgrade protection
            if (package.HeSoUuTien < currentActiveReg.MaGoiNccNavigation.HeSoUuTien)
            {
                throw new InvalidOperationException("Không thể hạ cấp gói dịch vụ khi gói hiện tại vẫn đang hoạt động.");
            }
        }
    }

    public void ValidateDates(DateTime ngayBatDau, DateTime ngayKetThuc)
    {
        // Rule 6: Date validation
        if (ngayBatDau > ngayKetThuc)
        {
            throw new InvalidOperationException("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
        }
    }
}
