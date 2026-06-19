using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Entities;

[Table("MA_GIAM_GIA")]
[Index(nameof(MaCode), IsUnique = true)]
public class MaGiamGia
{
    [Key]
    [Column("ma_giam_gia")]
    public int MaGiamGiaId { get; set; }

    [Column("ma_code")]
    [StringLength(50)]
    public string MaCode { get; set; } = null!;

    [Column("phan_tram_giam", TypeName = "decimal(5,2)")]
    public decimal? PhanTramGiam { get; set; }

    [Column("so_tien_giam", TypeName = "decimal(15,2)")]
    public decimal? SoTienGiam { get; set; }

    [Column("so_luong_toi_da")]
    public int? SoLuongToiDa { get; set; }

    [Column("so_luong_da_dung")]
    public int SoLuongDaDung { get; set; } = 0;

    [Column("ngay_bat_dau")]
    public DateOnly NgayBatDau { get; set; }

    [Column("ngay_het_han")]
    public DateOnly NgayHetHan { get; set; }

    [Column("da_xoa")]
    public bool DaXoa { get; set; } = false;

    // Navigation
    public virtual ICollection<DonDat> DonDats { get; set; } = new List<DonDat>();
}
