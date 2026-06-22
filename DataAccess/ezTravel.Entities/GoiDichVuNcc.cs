using System;
using System.Collections.Generic;

namespace ezTravel.Entities;

public partial class GoiDichVuNcc
{
    public int MaGoiNcc { get; set; }

    public string TenGoi { get; set; } = null!;

    public string? MoTa { get; set; }

    public decimal GiaThang { get; set; }

    public decimal GiaNam { get; set; }

    public decimal HeSoUuTien { get; set; }

    public bool UuTienTimKiem { get; set; }

    public bool UuTienAi { get; set; }

    public bool UuTienTrangChu { get; set; }

    public bool CoBadgeDoiTac { get; set; }

    public bool TrangThai { get; set; }

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual ICollection<DangKyGoiNcc> DangKyGoiNcc { get; set; } = new List<DangKyGoiNcc>();

    public virtual ICollection<NhaCungCap> NhaCungCap { get; set; } = new List<NhaCungCap>();
}
