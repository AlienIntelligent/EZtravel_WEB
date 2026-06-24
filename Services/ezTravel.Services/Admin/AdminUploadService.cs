using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace ezTravel.Services.Admin;

public class AdminUploadService : IAdminUploadService
{
    private readonly string _storageRoot;
    private const long MaxFileSize = 10 * 1024 * 1024; // 10MB

    private static readonly IReadOnlyDictionary<string, string> AllowedFiles =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            [".jpg"] = "image/jpeg",
            [".jpeg"] = "image/jpeg",
            [".png"] = "image/png",
            [".webp"] = "image/webp"
        };

    public AdminUploadService(IWebHostEnvironment environment, IConfiguration configuration)
    {
        var configuredPath = configuration["AdminUploads:StoragePath"];
        _storageRoot = Path.GetFullPath(Path.IsPathRooted(configuredPath)
            ? configuredPath
            : Path.Combine(environment.ContentRootPath, configuredPath ?? "App_Data/admin-uploads"));
    }

    public async Task<string> UploadImageAsync(IFormFile file)
    {
        if (file.Length <= 0 || file.Length > MaxFileSize)
        {
            throw new Exception("Tep hinh anh phai co kich thuoc tu 1 byte den 10 MB.");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedFiles.TryGetValue(extension, out var expectedContentType))
        {
            throw new Exception("Chi chap nhan tep JPG, PNG hoac WEBP.");
        }

        Directory.CreateDirectory(_storageRoot);
        var storedFileName = $"{Guid.NewGuid():N}{extension}";
        var destinationPath = Path.Combine(_storageRoot, storedFileName);

        using (var stream = new FileStream(destinationPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Return the virtual path that the controller will map
        return $"/api/admin/uploads/{storedFileName}";
    }

    public Task<Stream?> GetImageStreamAsync(string filename)
    {
        var path = Path.Combine(_storageRoot, filename);
        if (!path.StartsWith(_storageRoot) || !File.Exists(path))
        {
            return Task.FromResult<Stream?>(null);
        }

        Stream? stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 81920, FileOptions.Asynchronous);
        return Task.FromResult<Stream?>(stream);
    }

    public string GetContentType(string filename)
    {
        var extension = Path.GetExtension(filename).ToLowerInvariant();
        return AllowedFiles.TryGetValue(extension, out var contentType) ? contentType : "application/octet-stream";
    }
}
