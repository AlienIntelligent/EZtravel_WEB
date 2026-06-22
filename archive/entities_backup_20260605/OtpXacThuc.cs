using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class OtpXacThuc
{
    public int MaOtp { get; set; }

    public int MaNguoiDung { get; set; }

    public string Otp { get; set; } = null!;

    public int SoLanSai { get; set; }

    public DateTime NgayHetHan { get; set; }

    public bool DaSuDung { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
