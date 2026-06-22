using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class AnhDiaDiem
{
    public int MaAnh { get; set; }

    public int MaDiaDiem { get; set; }

    public string UrlAnh { get; set; } = null!;

    public int ThuTu { get; set; }

    public virtual DiaDiem MaDiaDiemNavigation { get; set; } = null!;
}
