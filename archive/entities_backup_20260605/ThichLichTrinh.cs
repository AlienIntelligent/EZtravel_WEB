using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class ThichLichTrinh
{
    public int MaLichTrinh { get; set; }

    public int MaNguoiDung { get; set; }

    public DateTime NgayThich { get; set; }

    public virtual LichTrinh MaLichTrinhNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
