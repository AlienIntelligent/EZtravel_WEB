using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class ThanhToanNcc
{
    public int MaThanhToanNcc { get; set; }

    public int MaDangKyGoiNcc { get; set; }

    public decimal SoTien { get; set; }

    public string PhuongThucThanhToan { get; set; } = null!;

    public string? MaGiaoDich { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime? NgayThanhToan { get; set; }

    public DateTime NgayTao { get; set; }

    public virtual DangKyGoiNcc MaDangKyGoiNccNavigation { get; set; } = null!;
}
