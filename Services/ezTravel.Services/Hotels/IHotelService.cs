using System.Collections.Generic;
using System.Threading.Tasks;
using ezTravel.DTO.Places;

namespace ezTravel.Services.Hotels;

public interface IHotelService
{
    Task<IEnumerable<HotelDto>> SearchHotelsAsync(HotelSearchRequest request);
    Task<HotelDetailDto?> GetHotelByIdAsync(int id, int? currentUserId = null);
    Task<HotelDto> CreateHotelAsync(HotelCreateRequest request, int? currentUserId = null);
    Task<HotelDto?> UpdateHotelAsync(int id, HotelUpdateRequest request, int? currentUserId = null);
    Task<bool> DeleteHotelAsync(int id, int? currentUserId = null);
}
