using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class DangKyGoi
{
    public int MaDangKy { get; set; }

    public int MaNguoiDung { get; set; }

    public int MaGoi { get; set; }

    public DateTime NgayBatDau { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public string TrangThai { get; set; } = null!;

    public virtual GoiDichVu MaGoiNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
