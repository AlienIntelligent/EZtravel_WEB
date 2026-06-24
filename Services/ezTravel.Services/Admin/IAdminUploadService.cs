using Microsoft.AspNetCore.Http;

namespace ezTravel.Services.Admin;

public interface IAdminUploadService
{
    Task<string> UploadImageAsync(IFormFile file);
    Task<Stream?> GetImageStreamAsync(string filename);
    string GetContentType(string filename);
}
