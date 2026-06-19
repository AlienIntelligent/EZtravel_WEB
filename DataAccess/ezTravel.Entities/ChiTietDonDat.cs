using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("CHI_TIET_DON_DAT")]
public class ChiTietDonDat
{
    [Key]
    [Column("ma_chi_tiet")]
    public int MaChiTiet { get; set; }

    [Column("ma_don")]
    public int MaDon { get; set; }

    [Column("ma_dich_vu")]
    public int MaDichVu { get; set; }

    [Column("so_luong")]
    public int SoLuong { get; set; } = 1;

    [Column("don_gia", TypeName = "decimal(15,2)")]
    public decimal DonGia { get; set; }

    [Column("ngay_bat_dau")]
    public DateOnly? NgayBatDau { get; set; }

    [Column("ngay_ket_thuc")]
    public DateOnly? NgayKetThuc { get; set; }

    [Column("thanh_tien", TypeName = "decimal(15,2)")]
    public decimal ThanhTien { get; set; }

    // Navigation
    [ForeignKey(nameof(MaDon))]
    public virtual DonDat DonDat { get; set; } = null!;

    [ForeignKey(nameof(MaDichVu))]
    public virtual DichVu DichVu { get; set; } = null!;
}
