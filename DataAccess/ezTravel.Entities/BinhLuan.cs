using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("BINH_LUAN")]
public class BinhLuan
{
    [Key]
    [Column("ma_binh_luan")]
    public int MaBinhLuan { get; set; }

    [Column("ma_nguoi_dung")]
    public int MaNguoiDung { get; set; }

    [Column("ma_lich_trinh")]
    public int MaLichTrinh { get; set; }

    [Column("noi_dung")]
    public string NoiDung { get; set; } = null!;

    [Column("ngay_tao", TypeName = "datetime")]
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey(nameof(MaNguoiDung))]
    public virtual NguoiDung NguoiDung { get; set; } = null!;

    [ForeignKey(nameof(MaLichTrinh))]
    public virtual LichTrinh LichTrinh { get; set; } = null!;
}
