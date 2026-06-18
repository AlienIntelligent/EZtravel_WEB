namespace ezTravel.DTO.Places;

public class PlaceDto
{
    public int Id { get; set; }
    public string TenDiaDiem { get; set; } = null!;
    public string? MoTa { get; set; }
    public string? DiaChi { get; set; }
    public string? TinhThanh { get; set; }
    public string? QuocGia { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? ThumbnailUrl { get; set; }
}

public class PlaceDetailDto : PlaceDto
{
    public List<string> Images { get; set; } = new();
    public double? AverageRating { get; set; }
    public int TotalReviews { get; set; }
}

public class PlaceSearchRequest
{
    public string? Keyword { get; set; }
    public string? TinhThanh { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
