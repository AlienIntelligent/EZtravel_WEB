namespace ezTravel.DTO.Trips;

public class TripDto
{
    public int Id { get; set; }
    public string TenLichTrinh { get; set; } = null!;
    public string? DiemDen { get; set; }
    public DateOnly NgayBatDau { get; set; }
    public DateOnly NgayKetThuc { get; set; }
    public string TrangThai { get; set; } = null!;
}

public class CreateTripRequest
{
    public string TenLichTrinh { get; set; } = null!;
    public string? DiemDen { get; set; }
    public DateOnly NgayBatDau { get; set; }
    public DateOnly NgayKetThuc { get; set; }
    public int SoNguoi { get; set; } = 1;
    public decimal? NganSach { get; set; }
    public string? MoTa { get; set; }
}

public class UpdateTripRequest : CreateTripRequest
{
    public string TrangThai { get; set; } = "Nhap";
    public string TrangThaiChiaSe { get; set; } = "RiengTu";
}

public class TripDetailDto : TripDto
{
    public int SoNguoi { get; set; }
    public decimal? NganSach { get; set; }
    public string? MoTa { get; set; }
    public string TrangThaiChiaSe { get; set; } = null!;
    public List<TripItemDto> Items { get; set; } = new();
}

public class TripItemDto
{
    public int Id { get; set; }
    public int MaDiaDiem { get; set; }
    public string TenDiaDiem { get; set; } = null!;
    public int? MaDichVu { get; set; }
    public string? TenDichVu { get; set; }
    public DateOnly? Ngay { get; set; }
    public TimeOnly? GioBatDau { get; set; }
    public int ThuTu { get; set; }
    public string? GhiChu { get; set; }
    public decimal? GiaDichVu { get; set; }
}

public class AddLocationRequest
{
    public int MaDiaDiem { get; set; }
    public int? MaDichVu { get; set; }
    public DateOnly? Ngay { get; set; }
    public TimeOnly? GioBatDau { get; set; }
    public string? GhiChu { get; set; }
}

public class ReorderItemsRequest
{
    public List<ReorderItem> Items { get; set; } = new();
}

public class ReorderItem
{
    public int MaChiTiet { get; set; }
    public DateOnly? Ngay { get; set; }
    public int ThuTu { get; set; }
}
