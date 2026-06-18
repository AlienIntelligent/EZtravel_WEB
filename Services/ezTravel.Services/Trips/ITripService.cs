using ezTravel.DTO.Trips;

namespace ezTravel.Services.Trips;

public interface ITripService
{
    Task<IEnumerable<TripDto>> GetUserTripsAsync(int userId);
    Task<TripDetailDto?> GetTripByIdAsync(int tripId, int userId);
    Task<TripDto> CreateTripAsync(CreateTripRequest request, int userId);
    Task<bool> UpdateTripAsync(int tripId, UpdateTripRequest request, int userId);
    Task<bool> DeleteTripAsync(int tripId, int userId);
    
    // Items management
    Task<bool> AddLocationToTripAsync(int tripId, AddLocationRequest request, int userId);
    Task<bool> RemoveLocationFromTripAsync(int tripId, int itemId, int userId);
    Task<bool> ReorderItemsAsync(int tripId, ReorderItemsRequest request, int userId);
    
    // Core business logic
    Task<decimal> CalculateTotalCostAsync(int tripId);
    Task<TripDto> CloneTripAsync(int tripId, int userId);
}
