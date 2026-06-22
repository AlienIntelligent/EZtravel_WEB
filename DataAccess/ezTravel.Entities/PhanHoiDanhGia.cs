using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class PhanHoiDanhGia
{
    public int MaPhanHoi { get; set; }

    public int MaDanhGia { get; set; }

    public int MaNhaCungCap { get; set; }

    public string NoiDung { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public virtual DanhGia MaDanhGiaNavigation { get; set; } = null!;

    public virtual NhaCungCap MaNhaCungCapNavigation { get; set; } = null!;
}
