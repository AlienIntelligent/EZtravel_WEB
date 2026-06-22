using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class TinhThanh
{
    public int MaTinhThanh { get; set; }

    public string TenTinhThanh { get; set; } = null!;

    public string QuocGia { get; set; } = null!;

    public string? MaVung { get; set; }

    public virtual ICollection<DiaDiem> DiaDiem { get; set; } = new List<DiaDiem>();
}
