using System.Collections.Generic;
using System.Threading.Tasks;
using ezTravel.DTO.Places;

namespace ezTravel.Services.Restaurants;

public interface IRestaurantService
{
    Task<IEnumerable<RestaurantDto>> SearchRestaurantsAsync(RestaurantSearchRequest request);
    Task<RestaurantDetailDto?> GetRestaurantByIdAsync(int id, int? currentUserId = null);
    Task<RestaurantDto> CreateRestaurantAsync(RestaurantCreateRequest request, int? currentUserId = null);
    Task<RestaurantDto?> UpdateRestaurantAsync(int id, RestaurantUpdateRequest request, int? currentUserId = null);
    Task<bool> DeleteRestaurantAsync(int id, int? currentUserId = null);
}
