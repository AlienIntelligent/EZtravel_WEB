using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("HINH_ANH")]
public class HinhAnh
{
    [Key]
    [Column("ma_hinh_anh")]
    public int MaHinhAnh { get; set; }

    [Column("ma_dich_vu")]
    public int? MaDichVu { get; set; }

    [Column("ma_dia_diem")]
    public int? MaDiaDiem { get; set; }

    [Column("duong_dan")]
    [StringLength(255)]
    public string DuongDan { get; set; } = null!;

    // Navigation
    [ForeignKey(nameof(MaDiaDiem))]
    public virtual DiaDiem? DiaDiem { get; set; }

    [ForeignKey(nameof(MaDichVu))]
    public virtual DichVu? DichVu { get; set; }
}
