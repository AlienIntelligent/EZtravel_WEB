using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class GoiDichVu
{
    public int MaGoi { get; set; }

    public string TenGoi { get; set; } = null!;

    public decimal GiaGoi { get; set; }

    public int SoNgay { get; set; }

    public string? MoTa { get; set; }

    public string TrangThai { get; set; } = null!;

    public virtual ICollection<DangKyGoi> DangKyGoi { get; set; } = new List<DangKyGoi>();
}
