using System.Collections.Generic;
using System.Threading.Tasks;
using ezTravel.DTO.Places;

namespace ezTravel.Services.Vehicles;

public interface IVehicleService
{
    Task<IEnumerable<VehicleDto>> SearchVehiclesAsync(VehicleSearchRequest request);
    Task<VehicleDetailDto?> GetVehicleByIdAsync(int id, int? currentUserId = null);
    Task<VehicleDto> CreateVehicleAsync(VehicleCreateRequest request, int? currentUserId = null);
    Task<VehicleDto?> UpdateVehicleAsync(int id, VehicleUpdateRequest request, int? currentUserId = null);
    Task<bool> DeleteVehicleAsync(int id, int? currentUserId = null);
}
