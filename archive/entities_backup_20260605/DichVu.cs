using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class DichVu
{
    public int MaDichVu { get; set; }

    public int MaNhaCungCap { get; set; }

    public int MaDiaDiem { get; set; }

    public string LoaiDichVu { get; set; } = null!;

    public string TenDichVu { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string? MoTa { get; set; }

    public string? DiaChi { get; set; }

    public decimal? GiaTu { get; set; }

    public decimal? GiaDen { get; set; }

    public string? ThongTinLienHe { get; set; }

    public decimal DanhGiaTrungBinh { get; set; }

    public int TongDanhGia { get; set; }

    public int LuotXem { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string? Thumbnail { get; set; }

    public virtual ICollection<AnhDichVu> AnhDichVu { get; set; } = new List<AnhDichVu>();

    public virtual ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

    public virtual ICollection<DichVuLichTrinh> DichVuLichTrinh { get; set; } = new List<DichVuLichTrinh>();

    public virtual ICollection<DuyetNoiDung> DuyetNoiDung { get; set; } = new List<DuyetNoiDung>();

    public virtual DiaDiem MaDiaDiemNavigation { get; set; } = null!;

    public virtual NhaCungCap MaNhaCungCapNavigation { get; set; } = null!;
}
