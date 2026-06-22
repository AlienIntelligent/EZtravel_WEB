using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class ThongBao
{
    public int MaThongBao { get; set; }

    public int MaNguoiDung { get; set; }

    public string LoaiThongBao { get; set; } = null!;

    public string TieuDe { get; set; } = null!;

    public string NoiDung { get; set; } = null!;

    public string? DuongDan { get; set; }

    public bool DaDoc { get; set; }

    public DateTime NgayTao { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
