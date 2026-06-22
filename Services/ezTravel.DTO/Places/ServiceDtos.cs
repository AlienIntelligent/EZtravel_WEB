using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ezTravel.DTO.Places;

// ========================================== HOTEL DTOs
public class HotelSearchRequest
{
    public string? Keyword { get; set; }
    public int? MaDiaDiem { get; set; }
    public int? MaNhaCungCap { get; set; }
    public int? SoSao { get; set; }
    public decimal? GiaToiDa { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class HotelDto
{
    public int Id { get; set; }
    public int MaDiaDiem { get; set; }
    public string? TenDiaDiem { get; set; }
    public string TenKhachSan { get; set; } = null!;
    public string? Slug { get; set; }
    public string? MoTa { get; set; }
    public string? DiaChi { get; set; }
    public int? SoSao { get; set; }
    public decimal? GiaTu { get; set; }
    public decimal? GiaDen { get; set; }
    public string? AnhDaiDien { get; set; }
    public double RatingAvg { get; set; }
    public int TotalReviews { get; set; }
}

public class HotelDetailDto : HotelDto
{
    public DateTime NgayTao { get; set; }
}

public class HotelCreateRequest
{
    [Required]
    public int MaDiaDiem { get; set; }

    [Required]
    [StringLength(150)]
    public string TenKhachSan { get; set; } = null!;

    public string? MoTa { get; set; }

    [StringLength(255)]
    public string? DiaChi { get; set; }

    [Range(1, 5)]
    public int? SoSao { get; set; }

    public decimal? GiaTu { get; set; }
    public decimal? GiaDen { get; set; }
    public string? AnhDaiDien { get; set; }
}

public class HotelUpdateRequest : HotelCreateRequest { }

// ========================================== RESTAURANT DTOs
public class RestaurantSearchRequest
{
    public string? Keyword { get; set; }
    public int? MaDiaDiem { get; set; }
    public int? MaNhaCungCap { get; set; }
    public int? MaLoaiAmThuc { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class RestaurantDto
{
    public int Id { get; set; }
    public int MaDiaDiem { get; set; }
    public string? TenDiaDiem { get; set; }
    public string TenNhaHang { get; set; } = null!;
    public string? Slug { get; set; }
    public string? MoTa { get; set; }
    public int? MaLoaiAmThuc { get; set; }
    public string? TenLoaiAmThuc { get; set; }
    public decimal? GiaTrungBinh { get; set; }
    public string? AnhDaiDien { get; set; }
    public double RatingAvg { get; set; }
    public int TotalReviews { get; set; }
}

public class RestaurantDetailDto : RestaurantDto
{
    public DateTime NgayTao { get; set; }
}

public class RestaurantCreateRequest
{
    [Required]
    public int MaDiaDiem { get; set; }

    [Required]
    [StringLength(150)]
    public string TenNhaHang { get; set; } = null!;

    public string? MoTa { get; set; }

    public int? MaLoaiAmThuc { get; set; }
    public decimal? GiaTrungBinh { get; set; }
    public string? AnhDaiDien { get; set; }
}

public class RestaurantUpdateRequest : RestaurantCreateRequest { }

// ========================================== ACTIVITY DTOs
public class ActivitySearchRequest
{
    public string? Keyword { get; set; }
    public int? MaDiaDiem { get; set; }
    public int? MaNhaCungCap { get; set; }
    public decimal? GiaToiDa { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class ActivityDto
{
    public int Id { get; set; }
    public int MaDiaDiem { get; set; }
    public string? TenDiaDiem { get; set; }
    public string TenHoatDong { get; set; } = null!;
    public string? MoTa { get; set; }
    public decimal? Gia { get; set; }
    public string? ThoiLuong { get; set; }
    public string? AnhDaiDien { get; set; }
    public double RatingAvg { get; set; }
    public int TotalReviews { get; set; }
}

public class ActivityDetailDto : ActivityDto
{
    public DateTime NgayTao { get; set; }
}

public class ActivityCreateRequest
{
    [Required]
    public int MaDiaDiem { get; set; }

    [Required]
    [StringLength(150)]
    public string TenHoatDong { get; set; } = null!;

    public string? MoTa { get; set; }
    public decimal? Gia { get; set; }
    public string? ThoiLuong { get; set; }
    public string? AnhDaiDien { get; set; }
}

public class ActivityUpdateRequest : ActivityCreateRequest { }

// ========================================== VEHICLE DTOs
public class VehicleSearchRequest
{
    public string? Keyword { get; set; }
    public string? LoaiPhuongTien { get; set; }
    public int? MaDiaDiem { get; set; }
    public int? MaNhaCungCap { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class VehicleDto
{
    public int Id { get; set; }
    public int MaDiaDiem { get; set; }
    public string? TenDiaDiem { get; set; }
    public string TenPhuongTien { get; set; } = null!;
    public string? Slug { get; set; }
    public string LoaiPhuongTien { get; set; } = null!;
    public string? MoTa { get; set; }
    public string? HangXe { get; set; }
    public int? SoChoNgoi { get; set; }
    public string? DiemKhoiHanh { get; set; }
    public string? DiemDen { get; set; }
    public decimal? GiaTrungBinh { get; set; }
    public string? AnhDaiDien { get; set; }
    public double RatingAvg { get; set; }
    public int TotalReviews { get; set; }
}

public class VehicleDetailDto : VehicleDto
{
    public DateTime NgayTao { get; set; }
}

public class VehicleCreateRequest
{
    [Required]
    public int MaDiaDiem { get; set; }

    [Required]
    [StringLength(150)]
    public string TenPhuongTien { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string LoaiPhuongTien { get; set; } = null!;

    public string? MoTa { get; set; }
    public string? HangXe { get; set; }
    public int? SoChoNgoi { get; set; }
    public string? DiemKhoiHanh { get; set; }
    public string? DiemDen { get; set; }
    public decimal? GiaTrungBinh { get; set; }
    public string? AnhDaiDien { get; set; }
}

public class VehicleUpdateRequest : VehicleCreateRequest { }
