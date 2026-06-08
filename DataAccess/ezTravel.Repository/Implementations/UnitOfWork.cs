using ezTravel.Entities;
using ezTravel.Libs;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace ezTravel.Repository.Implementations;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;

    // ── Repositories (lazy init) ──
    private IGenericRepository<NguoiDung>?        _nguoiDungs;
    private IGenericRepository<LichTrinh>?        _lichTrinhs;
    private IGenericRepository<ChiTietLichTrinh>? _chiTietLichTrinhs;
    private IGenericRepository<DiaDiem>?          _diaDiems;
    private IGenericRepository<DichVu>?           _dichVus;
    private IGenericRepository<DanhMucDichVu>?    _danhMucDichVus;
    private IGenericRepository<DanhGia>?          _danhGias;
    private IGenericRepository<DonDat>?           _donDats;
    private IGenericRepository<ChiTietDonDat>?    _chiTietDonDats;
    private IGenericRepository<MaGiamGia>?        _maGiamGias;
    private IGenericRepository<ThanhToan>?        _thanhToans;
    private IGenericRepository<HinhAnh>?          _hinhAnhs;

    public UnitOfWork(AppDbContext context) => _context = context;

    public IGenericRepository<NguoiDung>        NguoiDungs        => _nguoiDungs        ??= new GenericRepository<NguoiDung>(_context);
    public IGenericRepository<LichTrinh>        LichTrinhs        => _lichTrinhs        ??= new GenericRepository<LichTrinh>(_context);
    public IGenericRepository<ChiTietLichTrinh> ChiTietLichTrinhs => _chiTietLichTrinhs ??= new GenericRepository<ChiTietLichTrinh>(_context);
    public IGenericRepository<DiaDiem>          DiaDiems          => _diaDiems          ??= new GenericRepository<DiaDiem>(_context);
    public IGenericRepository<DichVu>           DichVus           => _dichVus           ??= new GenericRepository<DichVu>(_context);
    public IGenericRepository<DanhMucDichVu>    DanhMucDichVus    => _danhMucDichVus    ??= new GenericRepository<DanhMucDichVu>(_context);
    public IGenericRepository<DanhGia>          DanhGias          => _danhGias          ??= new GenericRepository<DanhGia>(_context);
    public IGenericRepository<DonDat>           DonDats           => _donDats           ??= new GenericRepository<DonDat>(_context);
    public IGenericRepository<ChiTietDonDat>    ChiTietDonDats    => _chiTietDonDats    ??= new GenericRepository<ChiTietDonDat>(_context);
    public IGenericRepository<MaGiamGia>        MaGiamGias        => _maGiamGias        ??= new GenericRepository<MaGiamGia>(_context);
    public IGenericRepository<ThanhToan>        ThanhToans        => _thanhToans        ??= new GenericRepository<ThanhToan>(_context);
    public IGenericRepository<HinhAnh>          HinhAnhs          => _hinhAnhs          ??= new GenericRepository<HinhAnh>(_context);

    public async Task<int> SaveChangesAsync()
        => await _context.SaveChangesAsync();

    public async Task BeginTransactionAsync()
        => _transaction = await _context.Database.BeginTransactionAsync();

    public async Task CommitAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
