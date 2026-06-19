using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("DICH_VU")]
public class DichVu
{
    [Key]
    [Column("ma_dich_vu")]
    public int MaDichVu { get; set; }

    [Column("ma_danh_muc")]
    public int MaDanhMuc { get; set; }

    [Column("ma_dia_diem")]
    public int MaDiaDiem { get; set; }

    [Column("ten_dich_vu")]
    [StringLength(150)]
    public string TenDichVu { get; set; } = null!;

    [Column("mo_ta")]
    public string? MoTa { get; set; }

    [Column("gia_tien", TypeName = "decimal(15,2)")]
    public decimal GiaTien { get; set; }

    [Column("so_luong_toi_da")]
    public int? SoLuongToiDa { get; set; }

    [Column("ngay_tao", TypeName = "datetime")]
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;

    [Column("da_xoa")]
    public bool DaXoa { get; set; } = false;

    // Navigation
    [ForeignKey(nameof(MaDanhMuc))]
    public virtual DanhMucDichVu DanhMucDichVu { get; set; } = null!;

    [ForeignKey(nameof(MaDiaDiem))]
    public virtual DiaDiem DiaDiem { get; set; } = null!;

    public virtual ICollection<ChiTietDonDat> ChiTietDonDats { get; set; } = new List<ChiTietDonDat>();
    public virtual ICollection<ChiTietLichTrinh> ChiTietLichTrinhs { get; set; } = new List<ChiTietLichTrinh>();
    public virtual ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();
    public virtual ICollection<HinhAnh> HinhAnhs { get; set; } = new List<HinhAnh>();
}
