using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("LOAI_DIA_DIEM")]
public class LoaiDiaDiem
{
    [Key]
    [Column("ma_loai")]
    public int MaLoai { get; set; }

    [Column("ten_loai")]
    [StringLength(100)]
    public string TenLoai { get; set; } = null!;

    [Column("bieu_tuong")]
    [StringLength(50)]
    public string? BieuTuong { get; set; }

    // Navigation
    public virtual ICollection<DiaDiem> DiaDiems { get; set; } = new List<DiaDiem>();
}
