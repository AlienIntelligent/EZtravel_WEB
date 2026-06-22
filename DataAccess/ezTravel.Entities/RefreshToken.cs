using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class RefreshToken
{
    public int MaToken { get; set; }

    public int MaNguoiDung { get; set; }

    public string RefreshToken1 { get; set; } = null!;

    public DateTime NgayHetHan { get; set; }

    public bool DaThuHoi { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
