using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("DANH_GIA")]
public class DanhGia
{
    [Key]
    [Column("ma_danh_gia")]
    public int MaDanhGia { get; set; }

    [Column("ma_nguoi_dung")]
    public int MaNguoiDung { get; set; }

    [Column("ma_dich_vu")]
    public int? MaDichVu { get; set; }

    [Column("ma_dia_diem")]
    public int? MaDiaDiem { get; set; }

    [Column("so_sao")]
    public byte? SoSao { get; set; }

    [Column("binh_luan")]
    public string? BinhLuan { get; set; }

    [Column("ngay_danh_gia", TypeName = "datetime")]
    public DateTime NgayDanhGia { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey(nameof(MaNguoiDung))]
    public virtual NguoiDung NguoiDung { get; set; } = null!;

    [ForeignKey(nameof(MaDichVu))]
    public virtual DichVu? DichVu { get; set; }

    [ForeignKey(nameof(MaDiaDiem))]
    public virtual DiaDiem? DiaDiem { get; set; }
}
