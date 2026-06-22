using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class LichTrinh
{
    public int MaLichTrinh { get; set; }

    public int MaNguoiDung { get; set; }

    public string TenLichTrinh { get; set; } = null!;

    public string? MoTa { get; set; }

    public string? Thumbnail { get; set; }

    public DateOnly NgayBatDau { get; set; }

    public DateOnly NgayKetThuc { get; set; }

    public decimal? NganSachToiDa { get; set; }

    public decimal TongChiPhiUocTinh { get; set; }

    public bool LaCongKhai { get; set; }

    public int LuotXem { get; set; }

    public int LuotThich { get; set; }

    public int LuotClone { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual ICollection<BaoCaoNoiDung> BaoCaoNoiDung { get; set; } = new List<BaoCaoNoiDung>();

    public virtual ICollection<ChiaSeLichTrinh> ChiaSeLichTrinh { get; set; } = new List<ChiaSeLichTrinh>();

    public virtual ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

    public virtual ICollection<DuyetNoiDung> DuyetNoiDung { get; set; } = new List<DuyetNoiDung>();

    public virtual ICollection<LichSuClone> LichSuCloneMaLichTrinhGocNavigation { get; set; } = new List<LichSuClone>();

    public virtual ICollection<LichSuClone> LichSuCloneMaLichTrinhMoiNavigation { get; set; } = new List<LichSuClone>();

    public virtual ICollection<LuuLichTrinh> LuuLichTrinh { get; set; } = new List<LuuLichTrinh>();

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual ICollection<NgayLichTrinh> NgayLichTrinh { get; set; } = new List<NgayLichTrinh>();

    public virtual ICollection<ThichLichTrinh> ThichLichTrinh { get; set; } = new List<ThichLichTrinh>();
}
