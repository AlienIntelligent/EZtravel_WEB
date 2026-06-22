using System.Globalization;
using System.Text;
using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Community;

public interface IBlogService
{
    Task<object> GetBlogsAsync();
    Task<object> GetBlogByIdAsync(int id);
    Task<object> CreateBlogAsync(CreateBlogRequest request, int userId);
    Task<object> GetCommentsAsync(int id);
    Task<object> PostCommentAsync(int id, PostCommentRequest request, int userId);
}

public sealed record BlogServiceError(string Message, int StatusCode = 400);

public class BlogService : IBlogService
{
    private const string PublishedStatus = "PUBLISHED";
    private const string BannedUserStatus = "BANNED";

    private readonly IUnitOfWork _uow;

    public BlogService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<object> GetBlogsAsync()
    {
        var blogs = await BlogQuery()
            .Where(blog => blog.TrangThai == PublishedStatus)
            .OrderByDescending(blog => blog.NgayCapNhat)
            .ThenByDescending(blog => blog.MaBaiViet)
            .Take(50)
            .ToListAsync();

        return blogs.Select(MapBlogSummary).ToList();
    }

    public async Task<object> GetBlogByIdAsync(int id)
    {
        var blog = await BlogQuery()
            .FirstOrDefaultAsync(item => item.MaBaiViet == id && item.TrangThai == PublishedStatus);

        if (blog == null)
        {
            return NotFound();
        }

        blog.LuotXem += 1;
        blog.NgayCapNhat = DateTime.UtcNow;
        _uow.BaiViets.Update(blog);
        await _uow.SaveChangesAsync();

        return MapBlogDetail(blog);
    }

    public async Task<object> CreateBlogAsync(CreateBlogRequest request, int userId)
    {
        if (userId <= 0)
        {
            return Unauthorized();
        }

        if (!await IsActiveUserAsync(userId))
        {
            return new BlogServiceError("Nguoi dung khong ton tai hoac da bi khoa.", 401);
        }

        var title = TrimToNull(request.Title);
        var content = TrimToNull(request.Content);
        if (title == null)
        {
            return new BlogServiceError("Tieu de bai viet la bat buoc.");
        }

        if (content == null)
        {
            return new BlogServiceError("Noi dung bai viet la bat buoc.");
        }

        var placeId = request.PlaceId ?? request.MaDiaDiem;
        if (placeId.HasValue && !await _uow.DiaDiems.AnyAsync(place => place.MaDiaDiem == placeId.Value))
        {
            return new BlogServiceError("Dia diem khong ton tai.", 404);
        }

        var now = DateTime.UtcNow;
        var thumbnail = TrimToNull(request.Thumbnail) ?? TrimToNull(request.ImageUrl);
        var blog = new BaiViet
        {
            MaNguoiDung = userId,
            TieuDe = Clamp(title, 500),
            Slug = await CreateUniqueSlugAsync(title),
            TomTat = Clamp(TrimToNull(request.Summary) ?? BuildSummary(content), 1000),
            NoiDung = content,
            Thumbnail = ClampNullable(thumbnail, 1000),
            LuotXem = 0,
            TrangThai = PublishedStatus,
            NgayTao = now,
            NgayCapNhat = now,
            MaDiaDiem = placeId
        };

        await _uow.BaiViets.AddAsync(blog);
        await _uow.SaveChangesAsync();

        if (thumbnail != null)
        {
            await _uow.AnhBaiViets.AddAsync(new AnhBaiViet
            {
                MaBaiViet = blog.MaBaiViet,
                UrlAnh = thumbnail,
                ThuTu = 1
            });
            await _uow.SaveChangesAsync();
        }

        var created = await BlogQuery()
            .FirstAsync(item => item.MaBaiViet == blog.MaBaiViet);

        return MapBlogDetail(created);
    }

    public async Task<object> GetCommentsAsync(int id)
    {
        if (!await _uow.BaiViets.AnyAsync(blog => blog.MaBaiViet == id && blog.TrangThai == PublishedStatus))
        {
            return NotFound();
        }

        var comments = await _uow.BinhLuanBaiViets.GetQueryable()
            .Include(comment => comment.MaNguoiDungNavigation)
            .Where(comment => comment.MaBaiViet == id)
            .OrderBy(comment => comment.NgayTao)
            .ThenBy(comment => comment.MaBinhLuan)
            .ToListAsync();

        return comments.Select(MapComment).ToList();
    }

    public async Task<object> PostCommentAsync(int id, PostCommentRequest request, int userId)
    {
        if (userId <= 0)
        {
            return Unauthorized();
        }

        if (!await IsActiveUserAsync(userId))
        {
            return new BlogServiceError("Nguoi dung khong ton tai hoac da bi khoa.", 401);
        }

        if (!await _uow.BaiViets.AnyAsync(blog => blog.MaBaiViet == id && blog.TrangThai == PublishedStatus))
        {
            return NotFound();
        }

        var content = TrimToNull(request.Content);
        if (content == null)
        {
            return new BlogServiceError("Noi dung binh luan la bat buoc.");
        }

        var comment = new BinhLuanBaiViet
        {
            MaBaiViet = id,
            MaNguoiDung = userId,
            NoiDung = Clamp(content, 2000),
            NgayTao = DateTime.UtcNow
        };

        await _uow.BinhLuanBaiViets.AddAsync(comment);
        await _uow.SaveChangesAsync();

        var created = await _uow.BinhLuanBaiViets.GetQueryable()
            .Include(item => item.MaNguoiDungNavigation)
            .FirstAsync(item => item.MaBinhLuan == comment.MaBinhLuan);

        return MapComment(created);
    }

    private IQueryable<BaiViet> BlogQuery()
        => _uow.BaiViets.GetQueryable()
            .Include(blog => blog.MaNguoiDungNavigation)
            .Include(blog => blog.MaDiaDiemNavigation)
            .Include(blog => blog.AnhBaiViet)
            .Include(blog => blog.ThichBaiViet)
            .Include(blog => blog.BinhLuanBaiViet)
                .ThenInclude(comment => comment.MaNguoiDungNavigation);

    private Task<bool> IsActiveUserAsync(int userId)
        => _uow.NguoiDungs.AnyAsync(user => user.MaNguoiDung == userId && user.TrangThai != BannedUserStatus);

    private static object MapBlogSummary(BaiViet blog)
    {
        var images = OrderedImages(blog.Thumbnail, blog.AnhBaiViet
            .OrderBy(image => image.ThuTu)
            .Select(image => image.UrlAnh));

        return new
        {
            id = blog.MaBaiViet,
            maBaiViet = blog.MaBaiViet,
            title = blog.TieuDe,
            tieuDe = blog.TieuDe,
            slug = blog.Slug,
            summary = blog.TomTat,
            tomTat = blog.TomTat,
            content = blog.NoiDung,
            noiDung = blog.NoiDung,
            thumbnail = blog.Thumbnail,
            images,
            authorId = blog.MaNguoiDung,
            userId = blog.MaNguoiDung,
            authorName = blog.MaNguoiDungNavigation?.HoTen ?? "Traveler",
            userName = blog.MaNguoiDungNavigation?.HoTen ?? "Traveler",
            authorAvatar = blog.MaNguoiDungNavigation?.AvatarUrl,
            userAvatar = blog.MaNguoiDungNavigation?.AvatarUrl,
            placeId = blog.MaDiaDiem,
            placeName = blog.MaDiaDiemNavigation?.TenDiaDiem,
            viewCount = blog.LuotXem,
            luotXem = blog.LuotXem,
            likeCount = blog.ThichBaiViet.Count,
            commentCount = blog.BinhLuanBaiViet.Count,
            status = blog.TrangThai,
            trangThai = blog.TrangThai,
            createdAt = blog.NgayTao,
            updatedAt = blog.NgayCapNhat,
            ngayTao = blog.NgayTao,
            ngayCapNhat = blog.NgayCapNhat
        };
    }

    private static object MapBlogDetail(BaiViet blog)
    {
        var summary = MapBlogSummary(blog);
        var images = OrderedImages(blog.Thumbnail, blog.AnhBaiViet
            .OrderBy(image => image.ThuTu)
            .Select(image => image.UrlAnh));
        var comments = blog.BinhLuanBaiViet
            .OrderBy(comment => comment.NgayTao)
            .ThenBy(comment => comment.MaBinhLuan)
            .Select(MapComment)
            .ToList();

        return new
        {
            id = blog.MaBaiViet,
            maBaiViet = blog.MaBaiViet,
            title = blog.TieuDe,
            tieuDe = blog.TieuDe,
            slug = blog.Slug,
            tomTat = blog.TomTat,
            content = blog.NoiDung,
            noiDung = blog.NoiDung,
            thumbnail = blog.Thumbnail,
            images,
            authorId = blog.MaNguoiDung,
            userId = blog.MaNguoiDung,
            authorName = blog.MaNguoiDungNavigation?.HoTen ?? "Traveler",
            userName = blog.MaNguoiDungNavigation?.HoTen ?? "Traveler",
            authorAvatar = blog.MaNguoiDungNavigation?.AvatarUrl,
            userAvatar = blog.MaNguoiDungNavigation?.AvatarUrl,
            placeId = blog.MaDiaDiem,
            placeName = blog.MaDiaDiemNavigation?.TenDiaDiem,
            viewCount = blog.LuotXem,
            luotXem = blog.LuotXem,
            likeCount = blog.ThichBaiViet.Count,
            status = blog.TrangThai,
            trangThai = blog.TrangThai,
            createdAt = blog.NgayTao,
            updatedAt = blog.NgayCapNhat,
            summary,
            comments,
            commentCount = comments.Count,
            details = summary
        };
    }

    private static object MapComment(BinhLuanBaiViet comment)
        => new
        {
            id = comment.MaBinhLuan,
            maBinhLuan = comment.MaBinhLuan,
            blogId = comment.MaBaiViet,
            maBaiViet = comment.MaBaiViet,
            parentId = comment.MaBinhLuanCha,
            maBinhLuanCha = comment.MaBinhLuanCha,
            userId = comment.MaNguoiDung,
            maNguoiDung = comment.MaNguoiDung,
            userName = comment.MaNguoiDungNavigation?.HoTen ?? "Traveler",
            authorName = comment.MaNguoiDungNavigation?.HoTen ?? "Traveler",
            avatar = comment.MaNguoiDungNavigation?.AvatarUrl,
            userAvatar = comment.MaNguoiDungNavigation?.AvatarUrl,
            content = comment.NoiDung,
            noiDung = comment.NoiDung,
            createdAt = comment.NgayTao,
            ngayTao = comment.NgayTao
        };

    private async Task<string> CreateUniqueSlugAsync(string title)
    {
        var baseSlug = Clamp(CreateSlug(title), 240);
        if (string.IsNullOrEmpty(baseSlug))
        {
            baseSlug = "blog";
        }

        var suffix = Guid.NewGuid().ToString("N")[..8];
        var slug = $"{baseSlug}-{suffix}";
        while (await _uow.BaiViets.AnyAsync(blog => blog.Slug == slug))
        {
            suffix = Guid.NewGuid().ToString("N")[..8];
            slug = $"{baseSlug}-{suffix}";
        }

        return Clamp(slug, 300);
    }

    private static string CreateSlug(string value)
    {
        var normalized = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(normalized.Length);
        var lastWasSeparator = false;

        foreach (var ch in normalized)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(ch);
            if (category == UnicodeCategory.NonSpacingMark)
            {
                continue;
            }

            if (char.IsLetterOrDigit(ch))
            {
                builder.Append(ch);
                lastWasSeparator = false;
                continue;
            }

            if (!lastWasSeparator && builder.Length > 0)
            {
                builder.Append('-');
                lastWasSeparator = true;
            }
        }

        return builder.ToString().Trim('-').Normalize(NormalizationForm.FormC);
    }

    private static string BuildSummary(string content)
    {
        var normalized = string.Join(" ", content.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries));
        return normalized.Length <= 240 ? normalized : normalized[..240];
    }

    private static List<string> OrderedImages(string? primary, IEnumerable<string> extra)
    {
        var result = new List<string>();
        if (!string.IsNullOrWhiteSpace(primary)) result.Add(primary);
        result.AddRange(extra.Where(url => !string.IsNullOrWhiteSpace(url)));
        return result.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
    }

    private static string Clamp(string value, int maxLength)
        => value.Length <= maxLength ? value : value[..maxLength];

    private static string? ClampNullable(string? value, int maxLength)
        => value == null ? null : Clamp(value, maxLength);

    private static string? TrimToNull(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }

    private static BlogServiceError Unauthorized()
        => new("Can dang nhap de thuc hien thao tac nay.", 401);

    private static BlogServiceError NotFound()
        => new("Khong tim thay bai viet.", 404);
}
