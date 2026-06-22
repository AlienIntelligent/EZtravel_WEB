using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class AnhDanhGia
{
    public int MaAnh { get; set; }

    public int MaDanhGia { get; set; }

    public string UrlAnh { get; set; } = null!;

    public virtual DanhGia MaDanhGiaNavigation { get; set; } = null!;
}
