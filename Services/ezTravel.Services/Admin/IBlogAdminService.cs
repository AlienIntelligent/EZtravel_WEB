using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Admin;

public interface IBlogAdminService
{
    Task<object> GetBlogsAsync();
    Task<object> CreateBlogAsync(UpsertBlogAdminRequest request, int adminId);
    Task<object> UpdateBlogAsync(int id, UpsertBlogAdminRequest request);
    Task<object> DeleteBlogAsync(int id);
    Task<object> UpdateBlogStatusAsync(int id, string status);
}

public class BlogAdminService : IBlogAdminService
{
    private readonly IUnitOfWork _uow;

    public BlogAdminService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetBlogsAsync()
    {
        var blogs = await _uow.BaiViets.GetQueryable()
            .Include(b => b.MaNguoiDungNavigation)
            .Include(b => b.MaDiaDiemNavigation)
            .OrderByDescending(b => b.NgayTao)
            .ToListAsync();

        return blogs.Select(MapBlog).ToList();
    }

    public async Task<object> CreateBlogAsync(UpsertBlogAdminRequest request, int adminId)
    {
        var blog = new BaiViet
        {
            MaNguoiDung = request.AuthorId > 0 ? request.AuthorId : adminId,
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
            TrangThai = request.Status ?? "PUBLISHED",
            LuotXem = 0
        };

        ApplyBlogRequest(blog, request);

        await _uow.BaiViets.AddAsync(blog);
        await _uow.SaveChangesAsync();

        return MapBlog(blog);
    }

    public async Task<object> UpdateBlogAsync(int id, UpsertBlogAdminRequest request)
    {
        var blog = await _uow.BaiViets.GetQueryable()
            .Include(b => b.MaNguoiDungNavigation)
            .Include(b => b.MaDiaDiemNavigation)
            .FirstOrDefaultAsync(b => b.MaBaiViet == id);

        if (blog == null)
            return new AdminServiceError("Khong tim thay bai viet.", 404);

        ApplyBlogRequest(blog, request);
        
        if (request.Status != null)
        {
            blog.TrangThai = request.Status;
        }

        blog.NgayCapNhat = DateTime.UtcNow;

        _uow.BaiViets.Update(blog);
        await _uow.SaveChangesAsync();

        return MapBlog(blog);
    }

    public async Task<object> DeleteBlogAsync(int id)
    {
        var blog = await _uow.BaiViets.GetByIdAsync(id);
        if (blog == null)
            return new AdminServiceError("Khong tim thay bai viet.", 404);

        _uow.BaiViets.Remove(blog);
        await _uow.SaveChangesAsync();

        return new { success = true, id };
    }

    public async Task<object> UpdateBlogStatusAsync(int id, string status)
    {
        var blog = await _uow.BaiViets.GetByIdAsync(id);
        if (blog == null)
            return new AdminServiceError("Khong tim thay bai viet.", 404);

        blog.TrangThai = status;
        blog.NgayCapNhat = DateTime.UtcNow;

        _uow.BaiViets.Update(blog);
        await _uow.SaveChangesAsync();

        return new { success = true, id, status };
    }

    private static void ApplyBlogRequest(BaiViet blog, UpsertBlogAdminRequest request)
    {
        blog.TieuDe = request.Title;
        blog.Slug = request.Slug ?? CreateSlug(request.Title);
        blog.TomTat = request.Summary;
        blog.NoiDung = request.Content;
        blog.MaDiaDiem = request.PlaceId;
        
        if (!string.IsNullOrEmpty(request.ThumbnailUrl))
        {
            blog.Thumbnail = request.ThumbnailUrl;
        }
    }

    private static string CreateSlug(string value)
    {
        if (string.IsNullOrEmpty(value)) return "blog-" + Guid.NewGuid().ToString("N")[..8];
        return value.ToLowerInvariant()
                    .Replace(" ", "-")
                    .Replace("--", "-")
                    .Trim('-') + "-" + Guid.NewGuid().ToString("N")[..8];
    }

    private static object MapBlog(BaiViet blog)
        => new
        {
            id = blog.MaBaiViet,
            title = blog.TieuDe,
            slug = blog.Slug,
            summary = blog.TomTat,
            content = blog.NoiDung,
            thumbnail = blog.Thumbnail,
            authorId = blog.MaNguoiDung,
            authorName = blog.MaNguoiDungNavigation?.HoTen,
            placeId = blog.MaDiaDiem,
            placeName = blog.MaDiaDiemNavigation?.TenDiaDiem,
            viewCount = blog.LuotXem,
            status = blog.TrangThai,
            createdAt = blog.NgayTao,
            updatedAt = blog.NgayCapNhat
        };
}
