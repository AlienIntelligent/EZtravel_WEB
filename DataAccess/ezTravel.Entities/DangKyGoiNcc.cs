using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class DangKyGoiNcc
{
    public int MaDangKyGoiNcc { get; set; }

    public int MaNhaCungCap { get; set; }

    public int MaGoiNcc { get; set; }

    public DateTime NgayBatDau { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public virtual GoiDichVuNcc MaGoiNccNavigation { get; set; } = null!;

    public virtual NhaCungCap MaNhaCungCapNavigation { get; set; } = null!;

    public virtual ICollection<ThanhToanNcc> ThanhToanNcc { get; set; } = new List<ThanhToanNcc>();
}
