using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class Tag
{
    public int MaTag { get; set; }

    public string TenTag { get; set; } = null!;

    public string? LoaiTag { get; set; }

    public virtual ICollection<DiaDiem> MaDiaDiem { get; set; } = new List<DiaDiem>();
}
