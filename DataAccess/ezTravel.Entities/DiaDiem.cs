using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NetTopologySuite.Geometries;

namespace ezTravel.Entities;

[Table("DIA_DIEM")]
public class DiaDiem
{
    [Key]
    [Column("ma_dia_diem")]
    public int MaDiaDiem { get; set; }

    [Column("ten_dia_diem")]
    [StringLength(150)]
    public string TenDiaDiem { get; set; } = null!;

    [Column("mo_ta")]
    public string? MoTa { get; set; }

    [Column("dia_chi")]
    [StringLength(255)]
    public string? DiaChi { get; set; }

    [Column("tinh_thanh")]
    [StringLength(100)]
    public string? TinhThanh { get; set; }

    [Column("quoc_gia")]
    [StringLength(100)]
    public string? QuocGia { get; set; }

    [Column("ma_loai_dia_diem")]
    public int? MaLoaiDiaDiem { get; set; }

    [Column("toa_do")]
    public Geometry? ToaDo { get; set; }

    [Column("ngay_tao", TypeName = "datetime")]
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;

    [Column("da_xoa")]
    public bool DaXoa { get; set; } = false;

    // Navigation
    [ForeignKey(nameof(MaLoaiDiaDiem))]
    public virtual LoaiDiaDiem? LoaiDiaDiem { get; set; }

    public virtual ICollection<DichVu> DichVus { get; set; } = new List<DichVu>();
    public virtual ICollection<ChiTietLichTrinh> ChiTietLichTrinhs { get; set; } = new List<ChiTietLichTrinh>();
    public virtual ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();
    public virtual ICollection<HinhAnh> HinhAnhs { get; set; } = new List<HinhAnh>();
}
