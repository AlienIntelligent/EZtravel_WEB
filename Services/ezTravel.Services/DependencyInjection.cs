using ezTravel.Services.Auth;
using ezTravel.Services.Providers;
using ezTravel.Services.Ranking;
using Microsoft.Extensions.DependencyInjection;

namespace ezTravel.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddMemoryCache();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuthMessageSender, SmtpAuthMessageSender>();
        services.AddScoped<IProfileService, ProfileService>();
        services.AddScoped<JwtService>();
        services.AddScoped<Trips.ITripService, Trips.TripService>();
        services.AddScoped<Trips.ITripCollaboratorService, Trips.TripCollaboratorService>();
        services.AddScoped<AI.IAIChatService, AI.AIChatService>();
        services.AddScoped<AI.IAITripGenerationService, AI.AITripGenerationService>();
        services.AddScoped<AI.IAIRouteOptimizationService, AI.AIRouteOptimizationService>();
        services.AddScoped<AI.IAIBudgetAnalysisService, AI.AIBudgetAnalysisService>();
        services.AddScoped<Places.IPlaceService, Places.PlaceService>();
        services.AddScoped<Places.IExploreService, Places.ExploreService>();
        services.AddScoped<Places.IUnifiedService, Places.UnifiedService>();
        services.AddScoped<Hotels.IHotelService, Hotels.HotelService>();
        services.AddScoped<Restaurants.IRestaurantService, Restaurants.RestaurantService>();
        services.AddScoped<Activities.IActivityService, Activities.ActivityService>();
        services.AddScoped<Vehicles.IVehicleService, Vehicles.VehicleService>();
        services.AddScoped<Community.ICommunityService, Community.CommunityService>();
        services.AddScoped<Community.IBlogService, Community.BlogService>();
        services.AddScoped<Community.ITripCommentService, Community.TripCommentService>();
        services.AddScoped<Admin.IAdminService, Admin.AdminService>();
        services.AddScoped<Admin.IModerationService, Admin.ModerationService>();
        services.AddScoped<Admin.ICategoryService, Admin.CategoryService>();
        services.AddScoped<Admin.IDestinationAdminService, Admin.DestinationAdminService>();
        services.AddScoped<Admin.IBlogAdminService, Admin.BlogAdminService>();
        services.AddScoped<Admin.IProviderAdminService, Admin.ProviderAdminService>();
        services.AddScoped<Admin.IServiceAdminService, Admin.ServiceAdminService>();
        services.AddScoped<Admin.IAdminUploadService, Admin.AdminUploadService>();
        services.AddScoped<Notifications.INotificationService, Notifications.NotificationService>();
        services.AddScoped<Providers.IProviderService, Providers.ProviderService>();
        services.AddScoped<Providers.IProviderPackageValidationService, Providers.ProviderPackageValidationService>();
        services.AddScoped<Providers.INccPackageService, Providers.NccPackageService>();
        services.AddScoped<Subscriptions.ITravelerPackageService, Subscriptions.TravelerPackageService>();
        services.AddScoped<ISearchRankingService, SearchRankingService>();
        services.AddScoped<Promotion.IPromotionService, Promotion.PromotionService>();

        return services;
    }
}

