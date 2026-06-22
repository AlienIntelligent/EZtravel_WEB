using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class BaoCaoNoiDung
{
    public int MaBaoCao { get; set; }

    public int MaNguoiBaoCao { get; set; }

    public int? MaBaiViet { get; set; }

    public int? MaDanhGia { get; set; }

    public int? MaLichTrinh { get; set; }

    public string LyDo { get; set; } = null!;

    public string TrangThai { get; set; } = null!;

    public DateTime NgayBaoCao { get; set; }

    public virtual BaiViet? MaBaiVietNavigation { get; set; }

    public virtual DanhGia? MaDanhGiaNavigation { get; set; }

    public virtual LichTrinh? MaLichTrinhNavigation { get; set; }

    public virtual NguoiDung MaNguoiBaoCaoNavigation { get; set; } = null!;
}
