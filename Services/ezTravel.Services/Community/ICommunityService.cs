using ezTravel.DTO.Community;
using ezTravel.DTO.Reviews;

namespace ezTravel.Services.Community;

public interface ICommunityService
{
    Task<IEnumerable<FeedDto>> GetFeedsAsync();
    Task<bool> LikeTripAsync(int userId, int tripId);
    Task<bool> CommentOnTripAsync(int userId, int tripId, string content);
    Task<IEnumerable<CommentDto>> GetTripCommentsAsync(int tripId);
    
    Task<ReviewDto> PostReviewAsync(CreateReviewRequest request, int userId);
    Task<IEnumerable<ReviewDto>> GetPlaceReviewsAsync(int id);
    Task<IEnumerable<ReviewDto>> GetServiceReviewsAsync(int id);
}
