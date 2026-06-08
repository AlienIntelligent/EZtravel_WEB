using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezTravel.Entities;

[Table("DANH_MUC_DICH_VU")]
public class DanhMucDichVu
{
    [Key]
    [Column("ma_danh_muc")]
    public int MaDanhMuc { get; set; }

    [Column("ten_danh_muc")]
    [StringLength(100)]
    public string TenDanhMuc { get; set; } = null!;

    [Column("hien_thi")]
    public bool HienThi { get; set; } = true;

    // Navigation
    public virtual ICollection<DichVu> DichVus { get; set; } = new List<DichVu>();
}
