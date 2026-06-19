using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("THONG_BAO")]
public class ThongBao
{
    [Key]
    [Column("ma_thong_bao")]
    public int MaThongBao { get; set; }

    [Column("ma_nguoi_dung")]
    public int MaNguoiDung { get; set; }

    [Column("tieu_de")]
    [StringLength(200)]
    public string TieuDe { get; set; } = null!;

    [Column("noi_dung")]
    public string NoiDung { get; set; } = null!;

    [Column("loai_thong_bao")]
    [StringLength(50)]
    public string? LoaiThongBao { get; set; } // Booking, Community, System

    [Column("da_doc")]
    public bool DaDoc { get; set; } = false;

    [Column("ngay_tao", TypeName = "datetime")]
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey(nameof(MaNguoiDung))]
    public virtual NguoiDung NguoiDung { get; set; } = null!;
}
