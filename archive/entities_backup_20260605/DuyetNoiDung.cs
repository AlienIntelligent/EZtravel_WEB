using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class DuyetNoiDung
{
    public int MaDuyet { get; set; }

    public int MaAdmin { get; set; }

    public int? MaBaiViet { get; set; }

    public int? MaDanhGia { get; set; }

    public int? MaLichTrinh { get; set; }

    public int? MaDichVu { get; set; }

    public int? MaNhaCungCap { get; set; }

    public string TrangThai { get; set; } = null!;

    public string? GhiChu { get; set; }

    public DateTime NgayDuyet { get; set; }

    public virtual NguoiDung MaAdminNavigation { get; set; } = null!;

    public virtual BaiViet? MaBaiVietNavigation { get; set; }

    public virtual DanhGia? MaDanhGiaNavigation { get; set; }

    public virtual DichVu? MaDichVuNavigation { get; set; }

    public virtual LichTrinh? MaLichTrinhNavigation { get; set; }

    public virtual NhaCungCap? MaNhaCungCapNavigation { get; set; }
}
