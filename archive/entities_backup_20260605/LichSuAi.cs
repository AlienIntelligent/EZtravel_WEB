using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class LichSuAi
{
    public int MaLichSuAi { get; set; }

    public int MaNguoiDung { get; set; }

    public string LoaiAi { get; set; } = null!;

    public string Prompt { get; set; } = null!;

    public string? KetQuaTomTat { get; set; }

    public int SoToken { get; set; }

    public DateTime NgayTao { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
