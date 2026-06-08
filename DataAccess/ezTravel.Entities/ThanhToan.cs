using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Entities;

[Table("THANH_TOAN")]
[Index(nameof(MaGiaoDich), IsUnique = true)]
public class ThanhToan
{
    [Key]
    [Column("ma_thanh_toan")]
    public int MaThanhToan { get; set; }

    [Column("ma_don")]
    public int MaDon { get; set; }

    [Column("phuong_thuc")]
    [StringLength(20)]
    public string? PhuongThuc { get; set; }

    [Column("so_tien", TypeName = "decimal(15,2)")]
    public decimal SoTien { get; set; }

    [Column("trang_thai")]
    [StringLength(20)]
    public string TrangThai { get; set; } = "ChoDuyet";

    [Column("ma_giao_dich")]
    [StringLength(100)]
    public string? MaGiaoDich { get; set; }

    [Column("ngay_thanh_toan", TypeName = "datetime")]
    public DateTime? NgayThanhToan { get; set; }

    // Navigation
    [ForeignKey(nameof(MaDon))]
    public virtual DonDat DonDat { get; set; } = null!;
}
