using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("CHI_TIET_LICH_TRINH")]
public class ChiTietLichTrinh
{
    [Key]
    [Column("ma_chi_tiet")]
    public int MaChiTiet { get; set; }

    [Column("ma_lich_trinh")]
    public int MaLichTrinh { get; set; }

    [Column("ma_dia_diem")]
    public int MaDiaDiem { get; set; }

    [Column("ma_dich_vu")]
    public int? MaDichVu { get; set; }

    [Column("ngay_trong_lich_trinh")]
    public DateOnly? NgayTrongLichTrinh { get; set; }

    [Column("gio_bat_dau", TypeName = "time")]
    public TimeOnly? GioBatDau { get; set; }

    [Column("thu_tu")]
    public int ThuTu { get; set; }

    [Column("ghi_chu")]
    public string? GhiChu { get; set; }

    // Navigation
    [ForeignKey(nameof(MaLichTrinh))]
    public virtual LichTrinh LichTrinh { get; set; } = null!;

    [ForeignKey(nameof(MaDiaDiem))]
    public virtual DiaDiem DiaDiem { get; set; } = null!;

    [ForeignKey(nameof(MaDichVu))]
    public virtual DichVu? DichVu { get; set; }
}
