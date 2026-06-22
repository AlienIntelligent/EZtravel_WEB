using System;
using System.ComponentModel.DataAnnotations;

namespace ezTravel.DTO.Providers;

public class PackageDto
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
}

public class RegisterPackageRequest
{
    [Required]
    public int MaGoiNcc { get; set; }

    [Required]
    [RegularExpression("^(MONTH|YEAR)$", ErrorMessage = "DurationType must be either MONTH or YEAR.")]
    public string DurationType { get; set; } = null!; // "MONTH" or "YEAR"

    [StringLength(50)]
    public string? PhuongThucThanhToan { get; set; } // e.g. "MOCK", "VNPAY"
}

public class CurrentPackageDto
{
    public int MaDangKyGoiNcc { get; set; }
    public int MaGoiNcc { get; set; }
    public string TenGoi { get; set; } = null!;
    public string? MoTa { get; set; }
    public DateTime NgayBatDau { get; set; }
    public DateTime NgayKetThuc { get; set; }
    public string TrangThai { get; set; } = null!;
    public decimal HeSoUuTien { get; set; }
    public bool UuTienTimKiem { get; set; }
    public bool UuTienAi { get; set; }
    public bool UuTienTrangChu { get; set; }
    public bool CoBadgeDoiTac { get; set; }
}

public class PackageHistoryDto
{
    public int MaDangKyGoiNcc { get; set; }
    public int MaGoiNcc { get; set; }
    public string TenGoi { get; set; } = null!;
    public DateTime NgayBatDau { get; set; }
    public DateTime NgayKetThuc { get; set; }
    public string TrangThai { get; set; } = null!;
    public DateTime NgayTao { get; set; }
    public decimal GiaDaThanhToan { get; set; }
}

public class PaymentHistoryDto
{
    public int MaThanhToanNcc { get; set; }
    public int MaDangKyGoiNcc { get; set; }
    public string TenGoi { get; set; } = null!; // Package name
    public decimal SoTien { get; set; }
    public string PhuongThucThanhToan { get; set; } = null!;
    public string? MaGiaoDich { get; set; }
    public string TrangThai { get; set; } = null!;
    public DateTime? NgayThanhToan { get; set; }
    public DateTime NgayTao { get; set; }
}

public class AdminProviderPackageDto
{
    public int MaNhaCungCap { get; set; }
    public string TenDoanhNghiep { get; set; } = null!;
    public int? MaGoiNccHienTai { get; set; }
    public string? TenGoiHienTai { get; set; }
    public string? TrangThaiGoi { get; set; } // "ACTIVE", "EXPIRED", "NONE"
    public DateTime? NgayBatDau { get; set; }
    public DateTime? NgayKetThuc { get; set; }
}

public class AdminProviderDetailDto
{
    public int MaNhaCungCap { get; set; }
    public string TenDoanhNghiep { get; set; } = null!;
    public string EmailLienHe { get; set; } = null!;
    public string SoDienThoai { get; set; } = null!;
    public string? DiaChi { get; set; }
    public string TrangThaiProvider { get; set; } = null!;
    public List<PackageHistoryDto> PackageHistory { get; set; } = new();
    public List<PaymentHistoryDto> PaymentHistory { get; set; } = new();
}

public class ExpirePackageRequest
{
    [Required]
    public int ProviderId { get; set; }
}

public class ExtendPackageRequest
{
    [Required]
    public int ProviderId { get; set; }

    [Required]
    public DateTime NewEndDate { get; set; }
}

public class AssignPackageRequest
{
    [Required]
    public int ProviderId { get; set; }

    [Required]
    public int MaGoiNcc { get; set; }

    [Required]
    [RegularExpression("^(MONTH|YEAR)$", ErrorMessage = "DurationType must be either MONTH or YEAR.")]
    public string DurationType { get; set; } = null!;
}

public class PackageStatisticsDto
{
    public int TotalProviders { get; set; }
    public int ActivePackages { get; set; }
    public int ExpiredPackages { get; set; }
    public int FreeProviders { get; set; }
    public int StandardProviders { get; set; }
    public int PremiumProviders { get; set; }
}

public enum ProviderBadgeType
{
    NONE,
    VERIFIED_PARTNER,
    PREMIUM_PARTNER
}

public class ProviderPromotionDto
{
    public int ProviderId { get; set; }
    public string ProviderName { get; set; } = null!;
    public string? CurrentPackage { get; set; }
    public double PackagePriority { get; set; }
    public string BadgeType { get; set; } = null!;
    public double Rating { get; set; }
    public string? Avatar { get; set; }
    public string? CoverImage { get; set; }
}

public class AdminPromotionPreviewDto
{
    public int ProviderId { get; set; }
    public string ProviderName { get; set; } = null!;
    public string? PackageName { get; set; }
    public string Badge { get; set; } = null!;
    public double PromotionScore { get; set; }
    public bool AppearsOnHomepage { get; set; }
    public bool AppearsOnExplore { get; set; }
}
