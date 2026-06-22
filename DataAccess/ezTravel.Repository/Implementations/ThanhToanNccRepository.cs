using ezTravel.Entities;
using ezTravel.Libs;
using ezTravel.Repository.Interfaces;

namespace ezTravel.Repository.Implementations;

public class ThanhToanNccRepository : GenericRepository<ThanhToanNcc>, IThanhToanNccRepository
{
    public ThanhToanNccRepository(AppDbContext context) : base(context)
    {
    }
}
