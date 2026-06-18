using ezTravel.DTO.Places;

namespace ezTravel.Services.Places;

public interface IPlaceService
{
    Task<IEnumerable<PlaceDto>> SearchPlacesAsync(PlaceSearchRequest request);
    Task<PlaceDetailDto?> GetPlaceByIdAsync(int id);
    Task<IEnumerable<PlaceDto>> GetNearbyPlacesAsync(double lat, double lng, double radiusInKm);
}
