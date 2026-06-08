using ezTravel.Entities;

namespace ezTravel.Repository.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<NguoiDung>       NguoiDungs       { get; }
    IGenericRepository<LichTrinh>       LichTrinhs       { get; }
    IGenericRepository<ChiTietLichTrinh> ChiTietLichTrinhs { get; }
    IGenericRepository<DiaDiem>         DiaDiems         { get; }
    IGenericRepository<DichVu>          DichVus          { get; }
    IGenericRepository<DanhMucDichVu>   DanhMucDichVus   { get; }
    IGenericRepository<DanhGia>         DanhGias         { get; }
    IGenericRepository<DonDat>          DonDats          { get; }
    IGenericRepository<ChiTietDonDat>   ChiTietDonDats   { get; }
    IGenericRepository<MaGiamGia>       MaGiamGias       { get; }
    IGenericRepository<ThanhToan>       ThanhToans       { get; }
    IGenericRepository<HinhAnh>         HinhAnhs         { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
}
