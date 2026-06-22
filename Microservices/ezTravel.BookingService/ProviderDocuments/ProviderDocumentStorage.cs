using Microsoft.AspNetCore.Http;

namespace ezTravel.BookingService.ProviderDocuments;

public sealed class UploadProviderDocumentForm
{
    public string DocumentType { get; set; } = string.Empty;
    public IFormFile? File { get; set; }
}

public sealed record StoredProviderDocument(
    string OriginalFileName,
    string StoredFileName,
    string ContentType,
    long FileSize);

public sealed class ProviderDocumentValidationException(string message) : Exception(message);

public interface IProviderDocumentStorage
{
    Task<StoredProviderDocument> StoreAsync(IFormFile file, CancellationToken cancellationToken);
    Task<Stream?> OpenReadAsync(string storedFileName, CancellationToken cancellationToken);
    Task DeleteAsync(string storedFileName, CancellationToken cancellationToken);
}

public sealed class LocalProviderDocumentStorage : IProviderDocumentStorage
{
    private const long MaxFileSize = 5 * 1024 * 1024;

    private static readonly IReadOnlyDictionary<string, string> AllowedFiles =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            [".pdf"] = "application/pdf",
            [".jpg"] = "image/jpeg",
            [".jpeg"] = "image/jpeg",
            [".png"] = "image/png"
        };

    private readonly string _storageRoot;

    public LocalProviderDocumentStorage(
        IWebHostEnvironment environment,
        IConfiguration configuration)
    {
        var configuredPath = configuration["ProviderDocuments:StoragePath"];
        _storageRoot = Path.GetFullPath(Path.IsPathRooted(configuredPath)
            ? configuredPath
            : Path.Combine(
                environment.ContentRootPath,
                configuredPath ?? "App_Data/provider-documents"));
    }

    public async Task<StoredProviderDocument> StoreAsync(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file.Length <= 0 || file.Length > MaxFileSize)
        {
            throw new ProviderDocumentValidationException("Tep ho so phai co kich thuoc tu 1 byte den 5 MB.");
        }

        var originalFileName = Path.GetFileName(file.FileName);
        var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
        if (!AllowedFiles.TryGetValue(extension, out var expectedContentType) ||
            !string.Equals(file.ContentType, expectedContentType, StringComparison.OrdinalIgnoreCase))
        {
            throw new ProviderDocumentValidationException("Chi chap nhan tep PDF, JPG hoac PNG hop le.");
        }

        await using var source = file.OpenReadStream();
        var signature = new byte[8];
        var bytesRead = await source.ReadAsync(signature, cancellationToken);
        if (!HasValidSignature(extension, signature.AsSpan(0, bytesRead)))
        {
            throw new ProviderDocumentValidationException("Noi dung tep khong khop voi dinh dang da chon.");
        }

        Directory.CreateDirectory(_storageRoot);
        var storedFileName = $"{Guid.NewGuid():N}{extension}";
        var destinationPath = ResolvePath(storedFileName);

        await using (var destination = new FileStream(
                         destinationPath,
                         FileMode.CreateNew,
                         FileAccess.Write,
                         FileShare.None,
                         81920,
                         FileOptions.Asynchronous))
        {
            await destination.WriteAsync(signature.AsMemory(0, bytesRead), cancellationToken);
            await source.CopyToAsync(destination, cancellationToken);
        }

        return new StoredProviderDocument(
            originalFileName,
            storedFileName,
            expectedContentType,
            file.Length);
    }

    public Task<Stream?> OpenReadAsync(string storedFileName, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var path = ResolvePath(storedFileName);
        Stream? stream = File.Exists(path)
            ? new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 81920, FileOptions.Asynchronous)
            : null;
        return Task.FromResult(stream);
    }

    public Task DeleteAsync(string storedFileName, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var path = ResolvePath(storedFileName);
        if (File.Exists(path))
        {
            File.Delete(path);
        }

        return Task.CompletedTask;
    }

    private string ResolvePath(string storedFileName)
    {
        var safeFileName = Path.GetFileName(storedFileName);
        if (!string.Equals(safeFileName, storedFileName, StringComparison.Ordinal))
        {
            throw new ProviderDocumentValidationException("Ten tep luu tru khong hop le.");
        }

        var path = Path.GetFullPath(Path.Combine(_storageRoot, safeFileName));
        var rootPrefix = _storageRoot.TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;
        if (!path.StartsWith(rootPrefix, StringComparison.OrdinalIgnoreCase))
        {
            throw new ProviderDocumentValidationException("Duong dan tep luu tru khong hop le.");
        }

        return path;
    }

    private static bool HasValidSignature(string extension, ReadOnlySpan<byte> signature)
        => extension switch
        {
            ".pdf" => signature.Length >= 5 && signature[..5].SequenceEqual("%PDF-"u8),
            ".jpg" or ".jpeg" => signature.Length >= 3 &&
                                  signature[0] == 0xFF &&
                                  signature[1] == 0xD8 &&
                                  signature[2] == 0xFF,
            ".png" => signature.Length >= 8 &&
                       signature.SequenceEqual(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A }),
            _ => false
        };
}
