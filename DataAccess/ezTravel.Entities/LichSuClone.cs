using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class LichSuClone
{
    public int MaClone { get; set; }

    public int MaLichTrinhGoc { get; set; }

    public int MaLichTrinhMoi { get; set; }

    public int MaNguoiDung { get; set; }

    public DateTime NgayClone { get; set; }

    public virtual LichTrinh MaLichTrinhGocNavigation { get; set; } = null!;

    public virtual LichTrinh MaLichTrinhMoiNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
