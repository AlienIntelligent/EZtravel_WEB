using System.Collections.Generic;
using System.Threading.Tasks;
using ezTravel.DTO.Places;

namespace ezTravel.Services.Activities;

public interface IActivityService
{
    Task<IEnumerable<ActivityDto>> SearchActivitiesAsync(ActivitySearchRequest request);
    Task<ActivityDetailDto?> GetActivityByIdAsync(int id, int? currentUserId = null);
    Task<ActivityDto> CreateActivityAsync(ActivityCreateRequest request, int? currentUserId = null);
    Task<ActivityDto?> UpdateActivityAsync(int id, ActivityUpdateRequest request, int? currentUserId = null);
    Task<bool> DeleteActivityAsync(int id, int? currentUserId = null);
}
