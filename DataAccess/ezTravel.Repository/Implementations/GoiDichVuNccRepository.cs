using ezTravel.Entities;
using ezTravel.Libs;
using ezTravel.Repository.Interfaces;

namespace ezTravel.Repository.Implementations;

public class GoiDichVuNccRepository : GenericRepository<GoiDichVuNcc>, IGoiDichVuNccRepository
{
    public GoiDichVuNccRepository(AppDbContext context) : base(context)
    {
    }
}
