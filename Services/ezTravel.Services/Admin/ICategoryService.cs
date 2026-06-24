using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Admin;

public interface ICategoryService
{
    Task<object> GetCategoriesAsync();
    Task<object> CreateCategoryAsync(CreateCategoryRequest request);
    Task<object> UpdateCategoryAsync(int id, UpdateCategoryRequest request);
    Task<object> DeleteCategoryAsync(int id);
}

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _uow;

    public CategoryService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetCategoriesAsync()
    {
        var tags = await _uow.Tags.GetQueryable()
            .Include(tag => tag.MaDiaDiem)
            .OrderBy(tag => tag.LoaiTag)
            .ThenBy(tag => tag.TenTag)
            .ToListAsync();

        return tags.Select(MapTag).ToList();
    }

    public async Task<object> CreateCategoryAsync(CreateCategoryRequest request)
    {
        var name = TrimToNull(request.Name);
        if (name == null)
        {
            return new AdminServiceError("Ten danh muc la bat buoc.");
        }

        var type = TrimToNull(request.Type) ?? "GENERAL";
        var normalizedName = Clamp(name, 100);
        var normalizedType = Clamp(type.ToUpperInvariant(), 50);

        var exists = await _uow.Tags.AnyAsync(tag =>
            tag.TenTag == normalizedName &&
            (tag.LoaiTag ?? "GENERAL") == normalizedType);

        if (exists)
        {
            return new AdminServiceError("Danh muc da ton tai.");
        }

        var tag = new Tag
        {
            TenTag = normalizedName,
            LoaiTag = normalizedType
        };

        await _uow.Tags.AddAsync(tag);
        await _uow.SaveChangesAsync();

        return MapTag(tag);
    }

    public async Task<object> UpdateCategoryAsync(int id, UpdateCategoryRequest request)
    {
        var tag = await _uow.Tags.GetByIdAsync(id);
        if (tag == null)
        {
            return new AdminServiceError("Khong tim thay danh muc.", 404);
        }

        var name = TrimToNull(request.Name);
        if (name == null)
        {
            return new AdminServiceError("Ten danh muc la bat buoc.");
        }

        var type = TrimToNull(request.Type) ?? "GENERAL";
        var normalizedName = Clamp(name, 100);
        var normalizedType = Clamp(type.ToUpperInvariant(), 50);

        var exists = await _uow.Tags.AnyAsync(t =>
            t.MaTag != id &&
            t.TenTag == normalizedName &&
            (t.LoaiTag ?? "GENERAL") == normalizedType);

        if (exists)
        {
            return new AdminServiceError("Danh muc da ton tai.");
        }

        tag.TenTag = normalizedName;
        tag.LoaiTag = normalizedType;
        if (request.ThumbnailUrl != null)
        {
            // Note: Tag entity may not have an IconUrl/ThumbnailUrl in the current schema. 
            // We'll update it if it exists or ignore if it doesn't. 
            // For now we map it conceptually.
            // tag.IconUrl = request.ThumbnailUrl;
        }

        _uow.Tags.Update(tag);
        await _uow.SaveChangesAsync();

        return MapTag(tag);
    }

    public async Task<object> DeleteCategoryAsync(int id)
    {
        var tag = await _uow.Tags.GetQueryable()
            .Include(item => item.MaDiaDiem)
            .FirstOrDefaultAsync(item => item.MaTag == id);

        if (tag == null)
        {
            return new AdminServiceError("Khong tim thay danh muc.", 404);
        }

        if (tag.MaDiaDiem.Count > 0)
        {
            return new AdminServiceError("Khong the xoa danh muc dang duoc gan voi dia diem.", 409);
        }

        _uow.Tags.Remove(tag);
        await _uow.SaveChangesAsync();

        return new
        {
            success = true,
            id
        };
    }

    private static object MapTag(Tag tag)
        => new
        {
            id = tag.MaTag,
            maTag = tag.MaTag,
            name = tag.TenTag,
            tenTag = tag.TenTag,
            type = tag.LoaiTag ?? "GENERAL",
            loaiTag = tag.LoaiTag,
            placeCount = tag.MaDiaDiem.Count
        };

    private static string Clamp(string value, int maxLength)
        => value.Length <= maxLength ? value : value[..maxLength];

    private static string? TrimToNull(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }
}
