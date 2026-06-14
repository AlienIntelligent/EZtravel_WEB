using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Entities;

[Table("NGUOI_DUNG")]
[Index(nameof(Email), IsUnique = true)]
public class NguoiDung
{
    [Key]
    [Column("ma_nguoi_dung")]
    public int MaNguoiDung { get; set; }

    [Column("ho_ten")]
    [StringLength(100)]
    public string HoTen { get; set; } = null!;

    [Column("mat_khau")]
    [StringLength(255)]
    public string MatKhau { get; set; } = null!;

    [Column("email")]
    [StringLength(100)]
    public string Email { get; set; } = null!;

    [Column("so_dien_thoai")]
    [StringLength(15)]
    public string? SoDienThoai { get; set; }

    [Column("ngay_sinh")]
    public DateOnly? NgaySinh { get; set; }

    [Column("anh_dai_dien")]
    [StringLength(255)]
    public string? AnhDaiDien { get; set; }

    [Column("vai_tro")]
    [StringLength(20)]
    public string? VaiTro { get; set; } = "Traveler";

    [Column("trang_thai")]
    [StringLength(20)]
    public string? TrangThai { get; set; } = "HoatDong";

    [Column("ngay_tao", TypeName = "datetime")]
    public DateTime? NgayTao { get; set; } = DateTime.UtcNow;

    [Column("da_xoa")]
    public bool? DaXoa { get; set; } = false;

    // Navigation
    public virtual ICollection<LichTrinh> LichTrinhs { get; set; } = new List<LichTrinh>();
    public virtual ICollection<DonDat> DonDats { get; set; } = new List<DonDat>();
    public virtual ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();
}
