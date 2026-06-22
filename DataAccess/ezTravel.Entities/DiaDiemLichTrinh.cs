using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class DiaDiemLichTrinh
{
    public int MaDiaDiemLichTrinh { get; set; }

    public int MaNgay { get; set; }

    public int MaDiaDiem { get; set; }

    public string? TieuDe { get; set; }

    public TimeOnly? GioBatDau { get; set; }

    public TimeOnly? GioKetThuc { get; set; }

    public int ThuTu { get; set; }

    public string? GhiChu { get; set; }

    public virtual ICollection<DichVuLichTrinh> DichVuLichTrinh { get; set; } = new List<DichVuLichTrinh>();

    public virtual DiaDiem MaDiaDiemNavigation { get; set; } = null!;

    public virtual NgayLichTrinh MaNgayNavigation { get; set; } = null!;
}
