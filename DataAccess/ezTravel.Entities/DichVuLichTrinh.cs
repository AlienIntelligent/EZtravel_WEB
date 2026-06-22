using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class DichVuLichTrinh
{
    public int MaDichVuLichTrinh { get; set; }

    public int MaDiaDiemLichTrinh { get; set; }

    public int MaDichVu { get; set; }

    public int ThuTu { get; set; }

    public string? GhiChu { get; set; }

    public TimeOnly? GioBatDau { get; set; }

    public TimeOnly? GioKetThuc { get; set; }

    public virtual ICollection<ChiPhiDichVuLichTrinh> ChiPhiDichVuLichTrinh { get; set; } = new List<ChiPhiDichVuLichTrinh>();

    public virtual DiaDiemLichTrinh MaDiaDiemLichTrinhNavigation { get; set; } = null!;

    public virtual DichVu MaDichVuNavigation { get; set; } = null!;
}
