using ezTravel.Services.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace ezTravel.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<JwtService>();
        services.AddScoped<Trips.ITripService, Trips.TripService>();
        services.AddScoped<Places.IPlaceService, Places.PlaceService>();
        services.AddScoped<Bookings.IBookingService, Bookings.BookingService>();
        services.AddScoped<Community.ICommunityService, Community.CommunityService>();
        services.AddScoped<Admin.IAdminService, Admin.AdminService>();
        services.AddScoped<Notifications.INotificationService, Notifications.NotificationService>();

        return services;
    }
}
