using System.ComponentModel.DataAnnotations;

namespace ezTravel.DTO.Providers;

public class ProviderDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string TenDoanhNghiep { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string LoaiNhaCungCap { get; set; } = null!;
    public string? MaSoThue { get; set; }
    public string? SoGiayPhep { get; set; }
    public string EmailLienHe { get; set; } = null!;
    public string SoDienThoai { get; set; } = null!;
    public string? DiaChi { get; set; }
    public string? LogoUrl { get; set; }
    public string? BannerUrl { get; set; }
    public string? MoTa { get; set; }
    public string TrangThai { get; set; } = null!;
    public DateTime? VerifiedAt { get; set; }
    public int? ApprovedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
}

public class CreateProviderRequest
{
    [Required]
    public int UserId { get; set; }

    [Required]
    [StringLength(200)]
    public string TenDoanhNghiep { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string LoaiNhaCungCap { get; set; } = null!;

    [StringLength(50)]
    public string? MaSoThue { get; set; }

    [StringLength(100)]
    public string? SoGiayPhep { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string EmailLienHe { get; set; } = null!;

    [Required]
    [Phone]
    [StringLength(15)]
    public string SoDienThoai { get; set; } = null!;

    [StringLength(255)]
    public string? DiaChi { get; set; }

    [StringLength(500)]
    public string? LogoUrl { get; set; }

    [StringLength(500)]
    public string? BannerUrl { get; set; }

    public string? MoTa { get; set; }
}

public class UpdateProviderRequest
{
    [StringLength(200)]
    public string? TenDoanhNghiep { get; set; }

    [StringLength(50)]
    public string? LoaiNhaCungCap { get; set; }

    [StringLength(50)]
    public string? MaSoThue { get; set; }

    [StringLength(100)]
    public string? SoGiayPhep { get; set; }

    [EmailAddress]
    [StringLength(100)]
    public string? EmailLienHe { get; set; }

    [Phone]
    [StringLength(15)]
    public string? SoDienThoai { get; set; }

    [StringLength(255)]
    public string? DiaChi { get; set; }

    [StringLength(500)]
    public string? LogoUrl { get; set; }

    [StringLength(500)]
    public string? BannerUrl { get; set; }

    public string? MoTa { get; set; }
}

public class ApproveProviderRequest
{
    [Required]
    public int ApprovedBy { get; set; }
}

public class RejectProviderRequest
{
    [Required]
    [StringLength(1000)]
    public string Reason { get; set; } = null!;
}
