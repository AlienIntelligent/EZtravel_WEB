using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("DON_DAT")]
public class DonDat
{
    [Key]
    [Column("ma_don")]
    public int MaDon { get; set; }

    [Column("ma_nguoi_dung")]
    public int MaNguoiDung { get; set; }

    [Column("ma_giam_gia")]
    public int? MaGiamGia { get; set; }

    [Column("tong_tien", TypeName = "decimal(15,2)")]
    public decimal? TongTien { get; set; }

    [Column("trang_thai")]
    [StringLength(20)]
    public string TrangThai { get; set; } = "ChoDuyet";

    [Column("ngay_dat", TypeName = "datetime")]
    public DateTime NgayDat { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey(nameof(MaNguoiDung))]
    public virtual NguoiDung NguoiDung { get; set; } = null!;

    [ForeignKey(nameof(MaGiamGia))]
    public virtual MaGiamGia? MaGiamGia_Nav { get; set; }

    public virtual ICollection<ChiTietDonDat> ChiTietDonDats { get; set; } = new List<ChiTietDonDat>();
    public virtual ICollection<ThanhToan> ThanhToans { get; set; } = new List<ThanhToan>();
}
