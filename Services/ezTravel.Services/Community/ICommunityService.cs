using ezTravel.DTO.Reviews;
using ezTravel.DTO.Trips;

namespace ezTravel.Services.Community;

public interface ICommunityService
{
    // Reviews
    Task<ReviewDto> PostReviewAsync(CreateReviewRequest request, int userId);
    Task<IEnumerable<ReviewDto>> GetPlaceReviewsAsync(int placeId);
    Task<IEnumerable<ReviewDto>> GetServiceReviewsAsync(int serviceId);
    
    // Sharing
    Task<IEnumerable<TripDto>> GetPublicTripsAsync(string? keyword = null);
    Task<bool> ToggleTripVisibilityAsync(int tripId, bool isPublic, int userId);
}
