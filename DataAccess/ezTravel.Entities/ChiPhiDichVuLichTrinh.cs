using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class ChiPhiDichVuLichTrinh
{
    public int MaChiPhi { get; set; }

    public int MaDichVuLichTrinh { get; set; }

    public string LoaiChiPhi { get; set; } = null!;

    public decimal SoTien { get; set; }

    public string? GhiChu { get; set; }

    public virtual DichVuLichTrinh MaDichVuLichTrinhNavigation { get; set; } = null!;
}
