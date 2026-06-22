using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class BaiViet
{
    public int MaBaiViet { get; set; }

    public int MaNguoiDung { get; set; }

    public string TieuDe { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string? TomTat { get; set; }

    public string NoiDung { get; set; } = null!;

    public string? Thumbnail { get; set; }

    public int LuotXem { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public int? MaDiaDiem { get; set; }

    public virtual ICollection<AnhBaiViet> AnhBaiViet { get; set; } = new List<AnhBaiViet>();

    public virtual ICollection<BaoCaoNoiDung> BaoCaoNoiDung { get; set; } = new List<BaoCaoNoiDung>();

    public virtual ICollection<BinhLuanBaiViet> BinhLuanBaiViet { get; set; } = new List<BinhLuanBaiViet>();

    public virtual ICollection<DuyetNoiDung> DuyetNoiDung { get; set; } = new List<DuyetNoiDung>();

    public virtual DiaDiem? MaDiaDiemNavigation { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual ICollection<ThichBaiViet> ThichBaiViet { get; set; } = new List<ThichBaiViet>();
}
