using ezTravel.DTO.Places;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace ezTravel.Services.Places;

public class PlaceService : IPlaceService
{
    private readonly IUnitOfWork _uow;

    public PlaceService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IEnumerable<PlaceDto>> SearchPlacesAsync(PlaceSearchRequest request)
    {
        var query = _uow.DiaDiems.GetQueryable()
            .Where(d => !d.DaXoa);

        if (!string.IsNullOrEmpty(request.Keyword))
        {
            query = query.Where(d => d.TenDiaDiem.Contains(request.Keyword) || (d.MoTa != null && d.MoTa.Contains(request.Keyword)));
        }

        if (!string.IsNullOrEmpty(request.TinhThanh))
        {
            query = query.Where(d => d.TinhThanh == request.TinhThanh);
        }

        if (request.CategoryId.HasValue)
        {
            query = query.Where(d => d.MaLoaiDiaDiem == request.CategoryId);
        }

        var results = await query
            .Include(d => d.LoaiDiaDiem)
            .OrderByDescending(d => d.NgayTao)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(d => new PlaceDto
            {
                Id = d.MaDiaDiem,
                TenDiaDiem = d.TenDiaDiem,
                MoTa = d.MoTa,
                DiaChi = d.DiaChi,
                TinhThanh = d.TinhThanh,
                QuocGia = d.QuocGia,
                Latitude = d.ToaDo != null ? d.ToaDo.Coordinate.Y : null,
                Longitude = d.ToaDo != null ? d.ToaDo.Coordinate.X : null,
                ThumbnailUrl = d.HinhAnhs.OrderBy(h => h.MaHinhAnh).Select(h => h.DuongDan).FirstOrDefault(),
                CategoryName = d.LoaiDiaDiem != null ? d.LoaiDiaDiem.TenLoai : null
            })
            .ToListAsync();

        return results;
    }

    public async Task<PlaceDetailDto?> GetPlaceByIdAsync(int id)
    {
        var place = await _uow.DiaDiems.GetQueryable()
            .Include(d => d.HinhAnhs)
            .Include(d => d.DanhGias)
            .Include(d => d.LoaiDiaDiem)
            .FirstOrDefaultAsync(d => d.MaDiaDiem == id && !d.DaXoa);

        if (place == null) return null;

        return new PlaceDetailDto
        {
            Id = place.MaDiaDiem,
            TenDiaDiem = place.TenDiaDiem,
            MoTa = place.MoTa,
            DiaChi = place.DiaChi,
            TinhThanh = place.TinhThanh,
            QuocGia = place.QuocGia,
            Latitude = place.ToaDo?.Coordinate.Y,
            Longitude = place.ToaDo?.Coordinate.X,
            Images = place.HinhAnhs.Select(h => h.DuongDan).ToList(),
            AverageRating = place.DanhGias.Any() ? place.DanhGias.Average(dg => dg.SoSao) : 0,
            TotalReviews = place.DanhGias.Count,
            CategoryName = place.LoaiDiaDiem?.TenLoai
        };
    }

    public async Task<IEnumerable<PlaceCategoryDto>> GetCategoriesAsync()
    {
        return await _uow.LoaiDiaDiems.GetQueryable()
            .Select(c => new PlaceCategoryDto
            {
                Id = c.MaLoai,
                Name = c.TenLoai,
                Icon = c.BieuTuong
            }).ToListAsync();
    }

    public async Task<IEnumerable<PlaceDto>> GetNearbyPlacesAsync(double lat, double lng, double radiusInKm)
    {
        // Simple bounding box for nearby search (approximation)
        // 1 degree latitude ~ 111km
        var latDelta = radiusInKm / 111.0;
        var lonDelta = radiusInKm / (111.0 * Math.Cos(lat * Math.PI / 180.0));

        var query = _uow.DiaDiems.GetQueryable()
            .Where(d => !d.DaXoa && d.ToaDo != null &&
                        d.ToaDo.Coordinate.Y >= lat - latDelta && d.ToaDo.Coordinate.Y <= lat + latDelta &&
                        d.ToaDo.Coordinate.X >= lng - lonDelta && d.ToaDo.Coordinate.X <= lng + lonDelta);

        return await query.Select(d => new PlaceDto
        {
            Id = d.MaDiaDiem,
            TenDiaDiem = d.TenDiaDiem,
            MoTa = d.MoTa,
            DiaChi = d.DiaChi,
            TinhThanh = d.TinhThanh,
            QuocGia = d.QuocGia,
            Latitude = d.ToaDo!.Coordinate.Y,
            Longitude = d.ToaDo!.Coordinate.X,
            ThumbnailUrl = d.HinhAnhs.OrderBy(h => h.MaHinhAnh).Select(h => h.DuongDan).FirstOrDefault()
        }).ToListAsync();
    }
}
