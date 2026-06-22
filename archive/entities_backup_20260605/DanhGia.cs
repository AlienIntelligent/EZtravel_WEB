using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class DanhGia
{
    public int MaDanhGia { get; set; }

    public int MaNguoiDung { get; set; }

    public int? MaDiaDiem { get; set; }

    public int? MaDichVu { get; set; }

    public int? MaLichTrinh { get; set; }

    public int SoSao { get; set; }

    public decimal? DiemViTri { get; set; }

    public decimal? DiemChatLuong { get; set; }

    public decimal? DiemDichVu { get; set; }

    public decimal? DiemGiaTri { get; set; }

    public string? NoiDung { get; set; }

    public string TrangThaiDuyet { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public virtual ICollection<AnhDanhGia> AnhDanhGia { get; set; } = new List<AnhDanhGia>();

    public virtual ICollection<BaoCaoNoiDung> BaoCaoNoiDung { get; set; } = new List<BaoCaoNoiDung>();

    public virtual ICollection<DuyetNoiDung> DuyetNoiDung { get; set; } = new List<DuyetNoiDung>();

    public virtual DiaDiem? MaDiaDiemNavigation { get; set; }

    public virtual DichVu? MaDichVuNavigation { get; set; }

    public virtual LichTrinh? MaLichTrinhNavigation { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual ICollection<PhanHoiDanhGia> PhanHoiDanhGia { get; set; } = new List<PhanHoiDanhGia>();
}
