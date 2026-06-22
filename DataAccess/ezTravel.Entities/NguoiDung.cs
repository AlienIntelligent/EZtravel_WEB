using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class NguoiDung
{
    public int MaNguoiDung { get; set; }

    public string HoTen { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string MatKhauHash { get; set; } = null!;

    public string? SoDienThoai { get; set; }

    public string? AvatarUrl { get; set; }

    public string Slug { get; set; } = null!;

    public string? Bio { get; set; }

    public string VaiTro { get; set; } = null!;

    public string TrangThai { get; set; } = null!;

    public bool EmailDaXacThuc { get; set; }

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual ICollection<BaiViet> BaiViet { get; set; } = new List<BaiViet>();

    public virtual ICollection<BaoCaoNoiDung> BaoCaoNoiDung { get; set; } = new List<BaoCaoNoiDung>();

    public virtual ICollection<BinhLuanBaiViet> BinhLuanBaiViet { get; set; } = new List<BinhLuanBaiViet>();

    public virtual ICollection<BinhLuanLichTrinh> BinhLuanLichTrinh { get; set; } = new List<BinhLuanLichTrinh>();

    public virtual ICollection<ChiaSeLichTrinh> ChiaSeLichTrinh { get; set; } = new List<ChiaSeLichTrinh>();

    public virtual ICollection<DangKyGoi> DangKyGoi { get; set; } = new List<DangKyGoi>();

    public virtual ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

    public virtual ICollection<DuyetNoiDung> DuyetNoiDung { get; set; } = new List<DuyetNoiDung>();

    public virtual ICollection<LichSuAi> LichSuAi { get; set; } = new List<LichSuAi>();

    public virtual ICollection<LichSuClone> LichSuClone { get; set; } = new List<LichSuClone>();

    public virtual ICollection<LichTrinh> LichTrinh { get; set; } = new List<LichTrinh>();

    public virtual ICollection<LuuLichTrinh> LuuLichTrinh { get; set; } = new List<LuuLichTrinh>();

    public virtual ICollection<NhaCungCap> NhaCungCapMaAdminDuyetNavigation { get; set; } = new List<NhaCungCap>();

    public virtual ICollection<NhaCungCap> NhaCungCapMaNguoiDungNavigation { get; set; } = new List<NhaCungCap>();

    public virtual ICollection<OtpXacThuc> OtpXacThuc { get; set; } = new List<OtpXacThuc>();

    public virtual ICollection<RefreshToken> RefreshToken { get; set; } = new List<RefreshToken>();

    public virtual ICollection<TheoDoiNguoiDung> TheoDoiNguoiDungMaNguoiDuocTheoDoiNavigation { get; set; } = new List<TheoDoiNguoiDung>();

    public virtual ICollection<TheoDoiNguoiDung> TheoDoiNguoiDungMaNguoiTheoDoiNavigation { get; set; } = new List<TheoDoiNguoiDung>();

    public virtual ICollection<ThichBaiViet> ThichBaiViet { get; set; } = new List<ThichBaiViet>();

    public virtual ICollection<ThichLichTrinh> ThichLichTrinh { get; set; } = new List<ThichLichTrinh>();

    public virtual ICollection<ThongBao> ThongBao { get; set; } = new List<ThongBao>();
}
