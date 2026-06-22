using System.ComponentModel.DataAnnotations;

namespace ezTravel.DTO.Places;

public class PlaceSearchRequest
{
    public string? Keyword { get; set; }
    public string? Type { get; set; }
    public string? Province { get; set; }
    public string? ServiceCategory { get; set; }
    public double? Rating { get; set; }
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public int? MaTinhThanh { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}

public class PlaceDto
{
    public int Id { get; set; }
    public string TenDiaDiem { get; set; } = null!;
    public string? MoTa { get; set; }
    public string? DiaChi { get; set; }
    public int MaTinhThanh { get; set; }
    public string? TenTinhThanh { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? ThumbnailUrl { get; set; }
    public double RatingAvg { get; set; }
    public int TotalReviews { get; set; }
    public string? Slug { get; set; }
}

public class PlaceDetailDto : PlaceDto
{
    public int LuotXem { get; set; }
    public List<string> Tags { get; set; } = new();
}

public class TinhThanhDto
{
    public int Id { get; set; }
    public string TenTinhThanh { get; set; } = null!;
    public string QuocGia { get; set; } = null!;
    public string? MaVung { get; set; }
}

public class PlaceCreateRequest
{
    [Required]
    [StringLength(150)]
    public string TenDiaDiem { get; set; } = null!;

    public string? MoTa { get; set; }

    [StringLength(255)]
    public string? DiaChi { get; set; }

    [Required]
    public int MaTinhThanh { get; set; }

    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? ThumbnailUrl { get; set; }
    public List<int> TagIds { get; set; } = new();
}

public class PlaceUpdateRequest : PlaceCreateRequest { }

public class TinhThanhCreateRequest
{
    [Required]
    [StringLength(100)]
    public string TenTinhThanh { get; set; } = null!;

    [Required]
    [StringLength(100)]
    public string QuocGia { get; set; } = null!;

    [StringLength(50)]
    public string? MaVung { get; set; }
}
