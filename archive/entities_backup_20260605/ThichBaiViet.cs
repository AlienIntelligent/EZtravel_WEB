using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class ThichBaiViet
{
    public int MaBaiViet { get; set; }

    public int MaNguoiDung { get; set; }

    public DateTime NgayThich { get; set; }

    public virtual BaiViet MaBaiVietNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
