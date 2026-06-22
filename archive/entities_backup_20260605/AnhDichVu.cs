using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class AnhDichVu
{
    public int MaAnh { get; set; }

    public int MaDichVu { get; set; }

    public string UrlAnh { get; set; } = null!;

    public int ThuTu { get; set; }

    public virtual DichVu MaDichVuNavigation { get; set; } = null!;
}
