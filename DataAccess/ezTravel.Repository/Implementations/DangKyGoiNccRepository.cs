using ezTravel.Entities;
using ezTravel.Libs;
using ezTravel.Repository.Interfaces;

namespace ezTravel.Repository.Implementations;

public class DangKyGoiNccRepository : GenericRepository<DangKyGoiNcc>, IDangKyGoiNccRepository
{
    public DangKyGoiNccRepository(AppDbContext context) : base(context)
    {
    }
}
