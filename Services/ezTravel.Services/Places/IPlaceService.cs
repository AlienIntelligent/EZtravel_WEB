using ezTravel.DTO.Places;

namespace ezTravel.Services.Places;

public interface IPlaceService
{
    // ── Places ────────────────────────────────────────────────────────────
    Task<IEnumerable<PlaceDto>> SearchPlacesAsync(PlaceSearchRequest request);
    Task<PlaceDetailDto?> GetPlaceByIdAsync(int id);
    Task<IEnumerable<PlaceDto>> GetNearbyPlacesAsync(double lat, double lng, double radiusInKm);
    Task<PlaceDto> CreatePlaceAsync(PlaceCreateRequest request);
    Task<PlaceDto?> UpdatePlaceAsync(int id, PlaceUpdateRequest request);
    Task<bool> DeletePlaceAsync(int id);

    // ── TinhThanh ────────────────────────────────────────────────────────
    Task<IEnumerable<TinhThanhDto>> GetTinhThanhsAsync();
    Task<TinhThanhDto?> GetTinhThanhByIdAsync(int id);
    Task<TinhThanhDto> CreateTinhThanhAsync(TinhThanhCreateRequest request);
    Task<TinhThanhDto?> UpdateTinhThanhAsync(int id, TinhThanhCreateRequest request);
    Task<bool> DeleteTinhThanhAsync(int id);
}
