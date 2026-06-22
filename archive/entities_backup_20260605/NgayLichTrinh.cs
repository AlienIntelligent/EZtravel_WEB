using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class NgayLichTrinh
{
    public int MaNgay { get; set; }

    public int MaLichTrinh { get; set; }

    public DateOnly Ngay { get; set; }

    public int SoThuTu { get; set; }

    public string? GhiChu { get; set; }

    public virtual ICollection<DiaDiemLichTrinh> DiaDiemLichTrinh { get; set; } = new List<DiaDiemLichTrinh>();

    public virtual LichTrinh MaLichTrinhNavigation { get; set; } = null!;
}
