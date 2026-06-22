using ezTravel.DTO.Places;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using ezTravel.Services.Ranking;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace ezTravel.Services.Places;

public class PlaceService : IPlaceService
{
    private readonly IUnitOfWork _uow;
    private readonly IMemoryCache _cache;
    private readonly ISearchRankingService _rankingService;
    private readonly ILogger<PlaceService> _logger;

    public PlaceService(
        IUnitOfWork uow,
        IMemoryCache cache,
        ISearchRankingService rankingService,
        ILogger<PlaceService> logger)
    {
        _uow = uow;
        _cache = cache;
        _rankingService = rankingService;
        _logger = logger;
    }

    public async Task<IEnumerable<PlaceDto>> SearchPlacesAsync(PlaceSearchRequest request)
    {
        var query = _uow.DiaDiems.GetQueryable().Where(d => d.TrangThai != "DELETED");

        if (!string.IsNullOrEmpty(request.Keyword))
            query = query.Where(d =>
                d.TenDiaDiem.Contains(request.Keyword) ||
                (d.MoTa != null && d.MoTa.Contains(request.Keyword)));

        if (request.MaTinhThanh.HasValue)
            query = query.Where(d => d.MaTinhThanh == request.MaTinhThanh);

        var list = await query
            .Include(d => d.MaTinhThanhNavigation)
            .ToListAsync();

        var rankedList = list.Select(d =>
        {
            double reviewScore = (double)d.DanhGiaTrungBinh * 20.0;
            double popularityScore = Math.Min(100.0, (d.LuotXem * 0.1) + (d.TongDanhGia * 2.0));
            double relevanceScore = 100.0;
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                bool inName = d.TenDiaDiem.Contains(request.Keyword, StringComparison.OrdinalIgnoreCase);
                relevanceScore = inName ? 100.0 : 50.0;
            }
            double packagePriorityScore = 50.0; // No provider -> FREE package priority (50 points)

            double finalScore = _rankingService.CalculateSearchScore(reviewScore, popularityScore, relevanceScore, packagePriorityScore);

            // Logging (diagnostics)
            _logger.LogDebug("Ranking Diagnostic (Place) - PlaceId: {PlaceId}, FinalSearchScore: {FinalSearchScore}",
                d.MaDiaDiem, finalScore);

            return new
            {
                Dto = new PlaceDto
                {
                    Id = d.MaDiaDiem,
                    TenDiaDiem = d.TenDiaDiem,
                    MoTa = d.MoTa,
                    DiaChi = d.DiaChi,
                    MaTinhThanh = d.MaTinhThanh,
                    TenTinhThanh = d.MaTinhThanhNavigation?.TenTinhThanh,
                    Latitude = (double?)d.Latitude,
                    Longitude = (double?)d.Longitude,
                    ThumbnailUrl = d.Thumbnail,
                    RatingAvg = (double)d.DanhGiaTrungBinh,
                    TotalReviews = d.TongDanhGia,
                    Slug = d.Slug
                },
                Score = finalScore
            };
        })
        .OrderByDescending(x => x.Score)
        .Skip((request.Page - 1) * request.PageSize)
        .Take(request.PageSize)
        .Select(x => x.Dto)
        .ToList();

        return rankedList;
    }

    public async Task<PlaceDetailDto?> GetPlaceByIdAsync(int id)
    {
        var place = await _uow.DiaDiems.GetQueryable()
            .Include(d => d.MaTinhThanhNavigation)
            .Include(d => d.MaTag)
            .FirstOrDefaultAsync(d => d.MaDiaDiem == id && d.TrangThai != "DELETED");

        if (place == null) return null;

        return new PlaceDetailDto
        {
            Id = place.MaDiaDiem,
            TenDiaDiem = place.TenDiaDiem,
            MoTa = place.MoTa,
            DiaChi = place.DiaChi,
            MaTinhThanh = place.MaTinhThanh,
            TenTinhThanh = place.MaTinhThanhNavigation?.TenTinhThanh,
            Latitude = (double?)place.Latitude,
            Longitude = (double?)place.Longitude,
            ThumbnailUrl = place.Thumbnail,
            RatingAvg = (double)place.DanhGiaTrungBinh,
            TotalReviews = place.TongDanhGia,
            Slug = place.Slug,
            LuotXem = place.LuotXem,
            Tags = place.MaTag.Select(t => t.TenTag).ToList()
        };
    }

    public async Task<IEnumerable<PlaceDto>> GetNearbyPlacesAsync(double lat, double lng, double radiusInKm)
    {
        var latDelta = radiusInKm / 111.0;
        var lonDelta = radiusInKm / (111.0 * Math.Cos(lat * Math.PI / 180.0));
        decimal decLat = (decimal)lat;
        decimal decLng = (decimal)lng;
        decimal decLatDelta = (decimal)latDelta;
        decimal decLonDelta = (decimal)lonDelta;

        return await _uow.DiaDiems.GetQueryable()
            .Where(d => d.TrangThai != "DELETED" && d.Latitude != null && d.Longitude != null &&
                        d.Latitude >= decLat - decLatDelta &&
                        d.Latitude <= decLat + decLatDelta &&
                        d.Longitude >= decLng - decLonDelta &&
                        d.Longitude <= decLng + decLonDelta)
            .Select(d => new PlaceDto
            {
                Id = d.MaDiaDiem,
                TenDiaDiem = d.TenDiaDiem,
                MoTa = d.MoTa,
                DiaChi = d.DiaChi,
                MaTinhThanh = d.MaTinhThanh,
                Latitude = (double?)d.Latitude,
                Longitude = (double?)d.Longitude,
                ThumbnailUrl = d.Thumbnail,
                RatingAvg = (double)d.DanhGiaTrungBinh,
                TotalReviews = d.TongDanhGia
            })
            .ToListAsync();
    }

    public async Task<PlaceDto> CreatePlaceAsync(PlaceCreateRequest request)
    {
        var entity = new DiaDiem
        {
            TenDiaDiem = request.TenDiaDiem,
            MoTa = request.MoTa,
            DiaChi = request.DiaChi,
            MaTinhThanh = request.MaTinhThanh,
            Latitude = (decimal?)request.Latitude,
            Longitude = (decimal?)request.Longitude,
            Thumbnail = request.ThumbnailUrl,
            NgayTao = DateTime.UtcNow,
            TrangThai = "ACTIVE",
            Slug = Guid.NewGuid().ToString() // Temp slug logic
        };

        if (request.TagIds != null && request.TagIds.Any())
        {
            var tags = _uow.Tags.GetQueryable().Where(t => request.TagIds.Contains(t.MaTag)).ToList();
            entity.MaTag = tags;
        }

        await _uow.DiaDiems.AddAsync(entity);
        await _uow.SaveChangesAsync();

        return new PlaceDto
        {
            Id = entity.MaDiaDiem,
            TenDiaDiem = entity.TenDiaDiem,
            MoTa = entity.MoTa,
            DiaChi = entity.DiaChi,
            MaTinhThanh = entity.MaTinhThanh,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            ThumbnailUrl = entity.Thumbnail
        };
    }

    public async Task<PlaceDto?> UpdatePlaceAsync(int id, PlaceUpdateRequest request)
    {
        var entity = await _uow.DiaDiems.GetQueryable()
            .Include(d => d.MaTag)
            .FirstOrDefaultAsync(d => d.MaDiaDiem == id && d.TrangThai != "DELETED");

        if (entity == null) return null;

        entity.TenDiaDiem = request.TenDiaDiem;
        entity.MoTa = request.MoTa;
        entity.DiaChi = request.DiaChi;
        entity.MaTinhThanh = request.MaTinhThanh;
        entity.Latitude = (decimal?)request.Latitude;
        entity.Longitude = (decimal?)request.Longitude;
        if (!string.IsNullOrEmpty(request.ThumbnailUrl))
            entity.Thumbnail = request.ThumbnailUrl;

        if (request.TagIds != null)
        {
            entity.MaTag.Clear();
            var tags = _uow.Tags.GetQueryable().Where(t => request.TagIds.Contains(t.MaTag)).ToList();
            foreach (var t in tags)
            {
                entity.MaTag.Add(t);
            }
        }

        _uow.DiaDiems.Update(entity);
        await _uow.SaveChangesAsync();

        return new PlaceDto
        {
            Id = entity.MaDiaDiem,
            TenDiaDiem = entity.TenDiaDiem,
            MoTa = entity.MoTa,
            DiaChi = entity.DiaChi,
            MaTinhThanh = entity.MaTinhThanh,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            ThumbnailUrl = entity.Thumbnail
        };
    }

    public async Task<bool> DeletePlaceAsync(int id)
    {
        var entity = await _uow.DiaDiems.GetQueryable()
            .FirstOrDefaultAsync(d => d.MaDiaDiem == id && d.TrangThai != "DELETED");

        if (entity == null) return false;

        entity.TrangThai = "DELETED";
        _uow.DiaDiems.Update(entity);
        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<TinhThanhDto>> GetTinhThanhsAsync()
    {
        const string CacheKey = "PlaceService_TinhThanhs";
        if (!_cache.TryGetValue(CacheKey, out IEnumerable<TinhThanhDto>? result))
        {
            result = await _uow.TinhThanhs.GetQueryable()
                .Select(c => new TinhThanhDto
                {
                    Id = c.MaTinhThanh,
                    TenTinhThanh = c.TenTinhThanh,
                    QuocGia = c.QuocGia,
                    MaVung = c.MaVung
                })
                .ToListAsync();

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(1))
                .SetSlidingExpiration(TimeSpan.FromMinutes(10));

            _cache.Set(CacheKey, result, cacheEntryOptions);
        }
        return result ?? Enumerable.Empty<TinhThanhDto>();
    }

    public async Task<TinhThanhDto?> GetTinhThanhByIdAsync(int id)
    {
        var cat = await _uow.TinhThanhs.GetQueryable()
            .FirstOrDefaultAsync(c => c.MaTinhThanh == id);

        if (cat == null) return null;

        return new TinhThanhDto
        {
            Id = cat.MaTinhThanh,
            TenTinhThanh = cat.TenTinhThanh,
            QuocGia = cat.QuocGia,
            MaVung = cat.MaVung
        };
    }

    public async Task<TinhThanhDto> CreateTinhThanhAsync(TinhThanhCreateRequest request)
    {
        var entity = new TinhThanh
        {
            TenTinhThanh = request.TenTinhThanh,
            QuocGia = request.QuocGia,
            MaVung = request.MaVung
        };

        await _uow.TinhThanhs.AddAsync(entity);
        await _uow.SaveChangesAsync();

        _cache.Remove("PlaceService_TinhThanhs");

        return new TinhThanhDto
        {
            Id = entity.MaTinhThanh,
            TenTinhThanh = entity.TenTinhThanh,
            QuocGia = entity.QuocGia,
            MaVung = entity.MaVung
        };
    }

    public async Task<TinhThanhDto?> UpdateTinhThanhAsync(int id, TinhThanhCreateRequest request)
    {
        var entity = await _uow.TinhThanhs.GetQueryable()
            .FirstOrDefaultAsync(c => c.MaTinhThanh == id);

        if (entity == null) return null;

        entity.TenTinhThanh = request.TenTinhThanh;
        entity.QuocGia = request.QuocGia;
        entity.MaVung = request.MaVung;

        _uow.TinhThanhs.Update(entity);
        await _uow.SaveChangesAsync();

        _cache.Remove("PlaceService_TinhThanhs");

        return new TinhThanhDto
        {
            Id = entity.MaTinhThanh,
            TenTinhThanh = entity.TenTinhThanh,
            QuocGia = entity.QuocGia,
            MaVung = entity.MaVung
        };
    }

    public async Task<bool> DeleteTinhThanhAsync(int id)
    {
        var entity = await _uow.TinhThanhs.GetQueryable()
            .FirstOrDefaultAsync(c => c.MaTinhThanh == id);

        if (entity == null) return false;

        _uow.TinhThanhs.Remove(entity);
        await _uow.SaveChangesAsync();

        _cache.Remove("PlaceService_TinhThanhs");
        return true;
    }
}
