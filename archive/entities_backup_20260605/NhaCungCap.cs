using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class NhaCungCap
{
    public int MaNhaCungCap { get; set; }

    public int MaNguoiDung { get; set; }

    public string TenDoanhNghiep { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string LoaiNhaCungCap { get; set; } = null!;

    public string? MaSoThue { get; set; }

    public string? SoGiayPhep { get; set; }

    public string EmailLienHe { get; set; } = null!;

    public string SoDienThoai { get; set; } = null!;

    public string? DiaChi { get; set; }

    public string? LogoUrl { get; set; }

    public string? BannerUrl { get; set; }

    public string? MoTa { get; set; }

    public string TrangThai { get; set; } = null!;

    public int? MaAdminDuyet { get; set; }

    public DateTime? NgayPheDuyet { get; set; }

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual ICollection<DichVu> DichVu { get; set; } = new List<DichVu>();

    public virtual ICollection<DuyetNoiDung> DuyetNoiDung { get; set; } = new List<DuyetNoiDung>();

    public virtual NguoiDung? MaAdminDuyetNavigation { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual ICollection<PhanHoiDanhGia> PhanHoiDanhGia { get; set; } = new List<PhanHoiDanhGia>();
}
