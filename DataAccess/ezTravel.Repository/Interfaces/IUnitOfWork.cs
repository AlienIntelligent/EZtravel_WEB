using ezTravel.Entities;

namespace ezTravel.Repository.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<AnhBaiViet> AnhBaiViets { get; }
    IGenericRepository<AnhDanhGia> AnhDanhGias { get; }
    IGenericRepository<AnhDiaDiem> AnhDiaDiems { get; }
    IGenericRepository<AnhDichVu> AnhDichVus { get; }
    IGenericRepository<BaiViet> BaiViets { get; }
    IGenericRepository<BaoCaoNoiDung> BaoCaoNoiDungs { get; }
    IGenericRepository<BinhLuanBaiViet> BinhLuanBaiViets { get; }
    IGenericRepository<BinhLuanLichTrinh> BinhLuanLichTrinhs { get; }
    IGenericRepository<ChiPhiDichVuLichTrinh> ChiPhiDichVuLichTrinhs { get; }
    IGenericRepository<ChiaSeLichTrinh> ChiaSeLichTrinhs { get; }
    IGenericRepository<DangKyGoi> DangKyGois { get; }
    IGenericRepository<DanhGia> DanhGias { get; }
    IGenericRepository<DiaDiem> DiaDiems { get; }
    IGenericRepository<DiaDiemLichTrinh> DiaDiemLichTrinhs { get; }
    IGenericRepository<DichVu> DichVus { get; }
    IGenericRepository<DichVuLichTrinh> DichVuLichTrinhs { get; }
    IGenericRepository<DuyetNoiDung> DuyetNoiDungs { get; }
    IGenericRepository<GoiDichVu> GoiDichVus { get; }
    IGenericRepository<HoSoXacMinhNcc> HoSoXacMinhNccs { get; }
    IGenericRepository<LichSuAi> LichSuAis { get; }
    IGenericRepository<LichSuClone> LichSuClones { get; }
    IGenericRepository<LichTrinh> LichTrinhs { get; }
    IGenericRepository<LuuLichTrinh> LuuLichTrinhs { get; }
    IGenericRepository<NgayLichTrinh> NgayLichTrinhs { get; }
    IGenericRepository<NguoiDung> NguoiDungs { get; }
    IGenericRepository<NhaCungCap> NhaCungCaps { get; }
    IGenericRepository<OtpXacThuc> OtpXacThucs { get; }
    IGenericRepository<PhanHoiDanhGia> PhanHoiDanhGias { get; }
    IGenericRepository<RefreshToken> RefreshTokens { get; }
    IGenericRepository<Tag> Tags { get; }
    IGenericRepository<TheoDoiNguoiDung> TheoDoiNguoiDungs { get; }
    IGenericRepository<ThichBaiViet> ThichBaiViets { get; }
    IGenericRepository<ThichLichTrinh> ThichLichTrinhs { get; }
    IGenericRepository<ThongBao> ThongBaos { get; }
    IGenericRepository<TinhThanh> TinhThanhs { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
}
