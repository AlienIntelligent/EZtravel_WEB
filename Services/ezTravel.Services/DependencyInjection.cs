using ezTravel.Services.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace ezTravel.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<JwtService>();

        return services;
    }
}
