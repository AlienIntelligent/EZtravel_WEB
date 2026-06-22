using System;
using System.Threading.Tasks;
using ezTravel.Entities;

namespace ezTravel.Services.Providers;

public interface IProviderPackageValidationService
{
    Task ValidateRegistrationAsync(int providerId, GoiDichVuNcc package);
    void ValidateDates(DateTime ngayBatDau, DateTime ngayKetThuc);
}
