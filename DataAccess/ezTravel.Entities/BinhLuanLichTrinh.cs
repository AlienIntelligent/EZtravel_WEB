namespace ezTravel.Entities;

public partial class BinhLuanLichTrinh
{
    public int MaBinhLuan { get; set; }

    public int MaLichTrinh { get; set; }

    public int MaNguoiDung { get; set; }

    public string NoiDung { get; set; } = null!;

    public string TrangThai { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual LichTrinh MaLichTrinhNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
