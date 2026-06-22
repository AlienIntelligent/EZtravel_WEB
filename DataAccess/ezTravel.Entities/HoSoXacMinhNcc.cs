namespace ezTravel.Entities;

public partial class HoSoXacMinhNcc
{
    public int MaHoSo { get; set; }

    public int MaNhaCungCap { get; set; }

    public string LoaiGiayTo { get; set; } = null!;

    public string TenTepGoc { get; set; } = null!;

    public string TenTepLuu { get; set; } = null!;

    public string LoaiNoiDung { get; set; } = null!;

    public long KichThuoc { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime NgayNop { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual NhaCungCap MaNhaCungCapNavigation { get; set; } = null!;
}
