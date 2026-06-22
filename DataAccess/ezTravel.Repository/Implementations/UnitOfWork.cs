using ezTravel.Entities;
using ezTravel.Libs;
using ezTravel.Repository.Interfaces;

namespace ezTravel.Repository.Implementations;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    private IGenericRepository<AnhBaiViet>? _anhbaivietRepository;
    private IGenericRepository<AnhDanhGia>? _anhdanhgiaRepository;
    private IGenericRepository<AnhDiaDiem>? _anhdiadiemRepository;
    private IGenericRepository<AnhDichVu>? _anhdichvuRepository;
    private IGenericRepository<BaiViet>? _baivietRepository;
    private IGenericRepository<BaoCaoNoiDung>? _baocaonoidungRepository;
    private IGenericRepository<BinhLuanBaiViet>? _binhluanbaivietRepository;
    private IGenericRepository<BinhLuanLichTrinh>? _binhluanlichtrinhRepository;
    private IGenericRepository<ChiPhiDichVuLichTrinh>? _chiphidichvulichtrinhRepository;
    private IGenericRepository<ChiaSeLichTrinh>? _chiaselichtrinhRepository;
    private IGenericRepository<DangKyGoi>? _dangkygoiRepository;
    private IGenericRepository<DanhGia>? _danhgiaRepository;
    private IGenericRepository<DiaDiem>? _diadiemRepository;
    private IGenericRepository<DiaDiemLichTrinh>? _diadiemlichtrinhRepository;
    private IGenericRepository<DichVu>? _dichvuRepository;
    private IGenericRepository<DichVuLichTrinh>? _dichvulichtrinhRepository;
    private IGenericRepository<DuyetNoiDung>? _duyetnoidungRepository;
    private IGenericRepository<GoiDichVu>? _goidichvuRepository;
    private IGenericRepository<HoSoXacMinhNcc>? _hosoxacminhnccRepository;
    private IGenericRepository<LichSuAi>? _lichsuaiRepository;
    private IGenericRepository<LichSuClone>? _lichsucloneRepository;
    private IGenericRepository<LichTrinh>? _lichtrinhRepository;
    private IGenericRepository<LuuLichTrinh>? _luulichtrinhRepository;
    private IGenericRepository<NgayLichTrinh>? _ngaylichtrinhRepository;
    private IGenericRepository<NguoiDung>? _nguoidungRepository;
    private IGenericRepository<NhaCungCap>? _nhacungcapRepository;
    private IGenericRepository<OtpXacThuc>? _otpxacthucRepository;
    private IGenericRepository<PhanHoiDanhGia>? _phanhoidanhgiaRepository;
    private IGenericRepository<RefreshToken>? _refreshtokenRepository;
    private IGenericRepository<Tag>? _tagRepository;
    private IGenericRepository<TheoDoiNguoiDung>? _theodoinguoidungRepository;
    private IGenericRepository<ThichBaiViet>? _thichbaivietRepository;
    private IGenericRepository<ThichLichTrinh>? _thichlichtrinhRepository;
    private IGenericRepository<ThongBao>? _thongbaoRepository;
    private IGenericRepository<TinhThanh>? _tinhthanhRepository;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IGenericRepository<AnhBaiViet> AnhBaiViets => _anhbaivietRepository ??= new GenericRepository<AnhBaiViet>(_context);
    public IGenericRepository<AnhDanhGia> AnhDanhGias => _anhdanhgiaRepository ??= new GenericRepository<AnhDanhGia>(_context);
    public IGenericRepository<AnhDiaDiem> AnhDiaDiems => _anhdiadiemRepository ??= new GenericRepository<AnhDiaDiem>(_context);
    public IGenericRepository<AnhDichVu> AnhDichVus => _anhdichvuRepository ??= new GenericRepository<AnhDichVu>(_context);
    public IGenericRepository<BaiViet> BaiViets => _baivietRepository ??= new GenericRepository<BaiViet>(_context);
    public IGenericRepository<BaoCaoNoiDung> BaoCaoNoiDungs => _baocaonoidungRepository ??= new GenericRepository<BaoCaoNoiDung>(_context);
    public IGenericRepository<BinhLuanBaiViet> BinhLuanBaiViets => _binhluanbaivietRepository ??= new GenericRepository<BinhLuanBaiViet>(_context);
    public IGenericRepository<BinhLuanLichTrinh> BinhLuanLichTrinhs => _binhluanlichtrinhRepository ??= new GenericRepository<BinhLuanLichTrinh>(_context);
    public IGenericRepository<ChiPhiDichVuLichTrinh> ChiPhiDichVuLichTrinhs => _chiphidichvulichtrinhRepository ??= new GenericRepository<ChiPhiDichVuLichTrinh>(_context);
    public IGenericRepository<ChiaSeLichTrinh> ChiaSeLichTrinhs => _chiaselichtrinhRepository ??= new GenericRepository<ChiaSeLichTrinh>(_context);
    public IGenericRepository<DangKyGoi> DangKyGois => _dangkygoiRepository ??= new GenericRepository<DangKyGoi>(_context);
    public IGenericRepository<DanhGia> DanhGias => _danhgiaRepository ??= new GenericRepository<DanhGia>(_context);
    public IGenericRepository<DiaDiem> DiaDiems => _diadiemRepository ??= new GenericRepository<DiaDiem>(_context);
    public IGenericRepository<DiaDiemLichTrinh> DiaDiemLichTrinhs => _diadiemlichtrinhRepository ??= new GenericRepository<DiaDiemLichTrinh>(_context);
    public IGenericRepository<DichVu> DichVus => _dichvuRepository ??= new GenericRepository<DichVu>(_context);
    public IGenericRepository<DichVuLichTrinh> DichVuLichTrinhs => _dichvulichtrinhRepository ??= new GenericRepository<DichVuLichTrinh>(_context);
    public IGenericRepository<DuyetNoiDung> DuyetNoiDungs => _duyetnoidungRepository ??= new GenericRepository<DuyetNoiDung>(_context);
    public IGenericRepository<GoiDichVu> GoiDichVus => _goidichvuRepository ??= new GenericRepository<GoiDichVu>(_context);
    public IGenericRepository<HoSoXacMinhNcc> HoSoXacMinhNccs => _hosoxacminhnccRepository ??= new GenericRepository<HoSoXacMinhNcc>(_context);
    public IGenericRepository<LichSuAi> LichSuAis => _lichsuaiRepository ??= new GenericRepository<LichSuAi>(_context);
    public IGenericRepository<LichSuClone> LichSuClones => _lichsucloneRepository ??= new GenericRepository<LichSuClone>(_context);
    public IGenericRepository<LichTrinh> LichTrinhs => _lichtrinhRepository ??= new GenericRepository<LichTrinh>(_context);
    public IGenericRepository<LuuLichTrinh> LuuLichTrinhs => _luulichtrinhRepository ??= new GenericRepository<LuuLichTrinh>(_context);
    public IGenericRepository<NgayLichTrinh> NgayLichTrinhs => _ngaylichtrinhRepository ??= new GenericRepository<NgayLichTrinh>(_context);
    public IGenericRepository<NguoiDung> NguoiDungs => _nguoidungRepository ??= new GenericRepository<NguoiDung>(_context);
    public IGenericRepository<NhaCungCap> NhaCungCaps => _nhacungcapRepository ??= new GenericRepository<NhaCungCap>(_context);
    public IGenericRepository<OtpXacThuc> OtpXacThucs => _otpxacthucRepository ??= new GenericRepository<OtpXacThuc>(_context);
    public IGenericRepository<PhanHoiDanhGia> PhanHoiDanhGias => _phanhoidanhgiaRepository ??= new GenericRepository<PhanHoiDanhGia>(_context);
    public IGenericRepository<RefreshToken> RefreshTokens => _refreshtokenRepository ??= new GenericRepository<RefreshToken>(_context);
    public IGenericRepository<Tag> Tags => _tagRepository ??= new GenericRepository<Tag>(_context);
    public IGenericRepository<TheoDoiNguoiDung> TheoDoiNguoiDungs => _theodoinguoidungRepository ??= new GenericRepository<TheoDoiNguoiDung>(_context);
    public IGenericRepository<ThichBaiViet> ThichBaiViets => _thichbaivietRepository ??= new GenericRepository<ThichBaiViet>(_context);
    public IGenericRepository<ThichLichTrinh> ThichLichTrinhs => _thichlichtrinhRepository ??= new GenericRepository<ThichLichTrinh>(_context);
    public IGenericRepository<ThongBao> ThongBaos => _thongbaoRepository ??= new GenericRepository<ThongBao>(_context);
    public IGenericRepository<TinhThanh> TinhThanhs => _tinhthanhRepository ??= new GenericRepository<TinhThanh>(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitAsync()
    {
        await _context.Database.CommitTransactionAsync();
    }

    public async Task RollbackAsync()
    {
        await _context.Database.RollbackTransactionAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
