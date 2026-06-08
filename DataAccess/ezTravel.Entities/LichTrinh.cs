using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("LICH_TRINH")]
public class LichTrinh
{
    [Key]
    [Column("ma_lich_trinh")]
    public int MaLichTrinh { get; set; }

    [Column("ma_nguoi_dung")]
    public int MaNguoiDung { get; set; }

    [Column("ten_lich_trinh")]
    [StringLength(200)]
    public string TenLichTrinh { get; set; } = null!;

    [Column("diem_den")]
    [StringLength(200)]
    public string? DiemDen { get; set; }

    [Column("ngay_bat_dau")]
    public DateOnly NgayBatDau { get; set; }

    [Column("ngay_ket_thuc")]
    public DateOnly NgayKetThuc { get; set; }

    [Column("so_nguoi")]
    public int SoNguoi { get; set; } = 1;

    [Column("ngan_sach", TypeName = "decimal(15,2)")]
    public decimal? NganSach { get; set; }

    [Column("mo_ta")]
    public string? MoTa { get; set; }

    [Column("trang_thai")]
    [StringLength(20)]
    public string TrangThai { get; set; } = "Nhap";

    [Column("trang_thai_chia_se")]
    [StringLength(20)]
    public string TrangThaiChiaSe { get; set; } = "RiengTu";

    [Column("ngay_tao", TypeName = "datetime")]
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;

    [Column("da_xoa")]
    public bool DaXoa { get; set; } = false;

    // Navigation
    [ForeignKey(nameof(MaNguoiDung))]
    public virtual NguoiDung NguoiDung { get; set; } = null!;

    public virtual ICollection<ChiTietLichTrinh> ChiTietLichTrinhs { get; set; } = new List<ChiTietLichTrinh>();
}
