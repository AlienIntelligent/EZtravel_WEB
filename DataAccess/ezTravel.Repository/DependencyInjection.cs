using ezTravel.Libs;
using ezTravel.Repository.Implementations;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ezTravel.Repository;

public static class DependencyInjection
{
    public static IServiceCollection AddRepositories(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                sql => sql.UseNetTopologySuite()
            )
        );

        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<IGoiDichVuNccRepository, GoiDichVuNccRepository>();
        services.AddScoped<IDangKyGoiNccRepository, DangKyGoiNccRepository>();
        services.AddScoped<IThanhToanNccRepository, ThanhToanNccRepository>();

        return services;
    }
}
