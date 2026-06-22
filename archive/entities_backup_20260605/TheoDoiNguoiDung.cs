using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class TheoDoiNguoiDung
{
    public int MaNguoiTheoDoi { get; set; }

    public int MaNguoiDuocTheoDoi { get; set; }

    public DateTime NgayTheoDoi { get; set; }

    public virtual NguoiDung MaNguoiDuocTheoDoiNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiTheoDoiNavigation { get; set; } = null!;
}
