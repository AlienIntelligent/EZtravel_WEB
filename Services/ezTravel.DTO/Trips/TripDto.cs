namespace ezTravel.DTO.Trips;

public class TripDto
{
    public int Id { get; set; }
    public string TenLichTrinh { get; set; } = null!;
    public string Title => TenLichTrinh;
    public DateOnly? NgayBatDau { get; set; }
    public DateOnly? StartDate => NgayBatDau;
    public DateOnly? NgayKetThuc { get; set; }
    public DateOnly? EndDate => NgayKetThuc;
    public bool LaCongKhai { get; set; }
    public string Visibility => LaCongKhai ? "PUBLIC" : "PRIVATE";
    public decimal? NganSachToiDa { get; set; }
    public decimal? BudgetLimit => NganSachToiDa;
    public decimal? Budget => NganSachToiDa;
    public decimal? TongChiPhi { get; set; }
    public decimal? EstimatedCost => TongChiPhi;
    public string? Thumbnail { get; set; }
    public string TrangThai { get; set; } = "DRAFT";
    public DateTime? NgayCapNhat { get; set; }
    public int SoLuongDiaDiem { get; set; }
}

public class CreateTripRequest
{
    public string? TenLichTrinh { get; set; }
    public string? Title { get; set; }
    public string? Name { get; set; }
    public string? MoTa { get; set; }
    public string? Description { get; set; }
    public DateOnly? NgayBatDau { get; set; }
    public DateTime? StartDate { get; set; }
    public DateOnly? NgayKetThuc { get; set; }
    public DateTime? EndDate { get; set; }
    public int? MaPhongCach { get; set; }
    public int? MaDoiTuong { get; set; }
    public int? MaMucNganSach { get; set; }
    public bool LaCongKhai { get; set; }
    public string? Visibility { get; set; }
    public decimal? TongChiPhi { get; set; }
    public decimal? Budget { get; set; }
    public string? Thumbnail { get; set; }
}

public class UpdateTripRequest : CreateTripRequest
{
}

public class TripDetailDto : TripDto
{
    public string? MoTa { get; set; }
    public int? MaPhongCach { get; set; }
    public int? MaDoiTuong { get; set; }
    public int? MaMucNganSach { get; set; }
    public List<TripDayDto> Days { get; set; } = new();
}

public class TripDayDto
{
    public int MaNgay { get; set; }
    public DateOnly? Ngay { get; set; }
    public int SoThuTu { get; set; }
    public string? GhiChu { get; set; }
    public List<TripItemDto> Items { get; set; } = new();
}

public class TripItemDto
{
    public int Id { get; set; }
    public int MaNgay { get; set; }
    public int? MaDiaDiem { get; set; }
    public string? TenDiaDiem { get; set; }
    public int? MaKhachSan { get; set; }
    public int? MaNhaHang { get; set; }
    public int? MaHoatDong { get; set; }
    public int? MaPhuongTien { get; set; }
    public string? TieuDe { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public int ThuTu { get; set; }
    public string? GhiChu { get; set; }
    public decimal? ChiPhiDuKien { get; set; }
}

public class AddLocationRequest
{
    public int MaNgay { get; set; }
    public int? MaDiaDiem { get; set; }
    public int? MaKhachSan { get; set; }
    public int? MaNhaHang { get; set; }
    public int? MaHoatDong { get; set; }
    public int? MaPhuongTien { get; set; }
    public string? TieuDe { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public string? GhiChu { get; set; }
    public decimal? ChiPhiDuKien { get; set; }
}

public class ReorderItemsRequest
{
    public List<ReorderItem> Items { get; set; } = new();
}

public class ReorderItem
{
    public int MaChiTiet { get; set; }
    public int MaNgay { get; set; }
    public int ThuTu { get; set; }
}

public class PhongCachDuLichDto
{
    public int Id { get; set; }
    public string TenPhongCach { get; set; } = null!;
}

public class DoiTuongDuLichDto
{
    public int Id { get; set; }
    public string TenDoiTuong { get; set; } = null!;
}

public class MucNganSachDto
{
    public int Id { get; set; }
    public string TenMuc { get; set; } = null!;
    public decimal? GiaTuNgay { get; set; }
    public decimal? GiaDenNgay { get; set; }
}

public class RecommendationRequestDto
{
    public int? MaPhongCach { get; set; }
    public int? MaDoiTuong { get; set; }
    public int? MaMucNganSach { get; set; }
    public int? MaTinhThanh { get; set; }
}

public class RecommendationResponseDto
{
    public List<RecommendedHotelDto> Hotels { get; set; } = new();
    public List<RecommendedRestaurantDto> Restaurants { get; set; } = new();
    public List<RecommendedActivityDto> Activities { get; set; } = new();
    public List<RecommendedPlaceDto> Places { get; set; } = new();
}

public class RecommendedHotelDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Image { get; set; }
    public decimal Price { get; set; }
    public string? Province { get; set; }
    public double Rating { get; set; }
}

public class RecommendedRestaurantDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string? Province { get; set; }
    public double Rating { get; set; }
}

public class RecommendedActivityDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Image { get; set; }
    public decimal Price { get; set; }
    public string? Province { get; set; }
    public double Rating { get; set; }
}

public class RecommendedPlaceDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string? Province { get; set; }
    public double Rating { get; set; }
}
