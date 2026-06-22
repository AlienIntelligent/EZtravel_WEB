using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class BinhLuanBaiViet
{
    public int MaBinhLuan { get; set; }

    public int MaBaiViet { get; set; }

    public int MaNguoiDung { get; set; }

    public int? MaBinhLuanCha { get; set; }

    public string NoiDung { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public virtual ICollection<BinhLuanBaiViet> InverseMaBinhLuanChaNavigation { get; set; } = new List<BinhLuanBaiViet>();

    public virtual BaiViet MaBaiVietNavigation { get; set; } = null!;

    public virtual BinhLuanBaiViet? MaBinhLuanChaNavigation { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
