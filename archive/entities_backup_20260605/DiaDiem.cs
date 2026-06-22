using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class DiaDiem
{
    public int MaDiaDiem { get; set; }

    public int MaTinhThanh { get; set; }

    public string TenDiaDiem { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string? MoTa { get; set; }

    public string? DiaChi { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public decimal DanhGiaTrungBinh { get; set; }

    public int TongDanhGia { get; set; }

    public int LuotXem { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public string? Thumbnail { get; set; }

    public string? LoaiDiaDiem { get; set; }

    public virtual ICollection<AnhDiaDiem> AnhDiaDiem { get; set; } = new List<AnhDiaDiem>();

    public virtual ICollection<BaiViet> BaiViet { get; set; } = new List<BaiViet>();

    public virtual ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

    public virtual ICollection<DiaDiemLichTrinh> DiaDiemLichTrinh { get; set; } = new List<DiaDiemLichTrinh>();

    public virtual ICollection<DichVu> DichVu { get; set; } = new List<DichVu>();

    public virtual TinhThanh MaTinhThanhNavigation { get; set; } = null!;

    public virtual ICollection<Tag> MaTag { get; set; } = new List<Tag>();
}
