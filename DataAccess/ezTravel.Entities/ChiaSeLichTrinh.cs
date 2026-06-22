using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class ChiaSeLichTrinh
{
    public int MaChiaSe { get; set; }

    public int MaLichTrinh { get; set; }

    public int MaNguoiDung { get; set; }

    public string Quyen { get; set; } = null!;

    public DateTime NgayChiaSe { get; set; }

    public virtual LichTrinh MaLichTrinhNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
