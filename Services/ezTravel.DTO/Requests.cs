namespace ezTravel.DTO.Requests
{
    public class GenerateTripRequest
    {
        public string Prompt { get; set; } = string.Empty;
        public string? Destination { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public string? BudgetMode { get; set; }
        public List<string> Preferences { get; set; } = new();
        public string? AdditionalNotes { get; set; }
    }
    public class ChatHistoryMessage { public string Role { get; set; } = string.Empty; public string Content { get; set; } = string.Empty; }
    public class ChatMessageRequest
    {
        public string Message { get; set; } = string.Empty;
        public List<ChatHistoryMessage> Messages { get; set; } = new();
    }
    public class OptimizeRouteRequest { public int TripId { get; set; } }
    public class AnalyzeBudgetRequest { public int TripId { get; set; } }
    public class UpdateProfileRequest { public string FullName { get; set; } = string.Empty; public string Phone { get; set; } = string.Empty; }
    public class ChangePasswordRequest { public string OldPassword { get; set; } = string.Empty; public string NewPassword { get; set; } = string.Empty; }
    public class AvatarUploadRequest { public string AvatarUrl { get; set; } = string.Empty; }
    public class UpdateUserStatusRequest { public string Status { get; set; } = string.Empty; }
    public class UpdateUserRoleRequest { public string Role { get; set; } = string.Empty; }
    public class UpdateProviderStatusRequest { public string Status { get; set; } = string.Empty; }
    public class UpsertProviderPackageRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal MonthlyPrice { get; set; }
        public decimal AnnualPrice { get; set; }
        public decimal PriorityCoefficient { get; set; } = 1m;
        public bool SearchPriority { get; set; }
        public bool AiPriority { get; set; }
        public bool HomePriority { get; set; }
        public bool PartnerBadge { get; set; }
    }
    public class UpdateProviderPackageStatusRequest { public bool IsActive { get; set; } }
    public class ResolveModerationRequest { public string Action { get; set; } = string.Empty; }
    public class CreateCategoryRequest { public string Name { get; set; } = string.Empty; public string Type { get; set; } = string.Empty; }
    public class UpdateCategoryRequest { public string Name { get; set; } = string.Empty; public string Type { get; set; } = string.Empty; public string? ThumbnailUrl { get; set; } }
    public class UpsertDestinationRequest { 
        public string Name { get; set; } = string.Empty; 
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty; 
        public double Longitude { get; set; } 
        public double Latitude { get; set; } 
        public int ProvinceId { get; set; } 
        public int RegionId { get; set; } 
        public string? CoverImageUrl { get; set; } 
        public string? Status { get; set; } 
        public bool? IsVerifiable { get; set; } 
    }
    public class UpsertBlogAdminRequest {
        public string Title { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string Summary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int? PlaceId { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? Status { get; set; }
        public int AuthorId { get; set; }
    }
    public class UpdateBlogStatusAdminRequest {
        public string Status { get; set; } = string.Empty;
    }
    public class UpsertProviderAdminRequest {
        public string BusinessName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string ProviderType { get; set; } = string.Empty;
        public string TaxCode { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public string? Status { get; set; }
    }
    public class UpsertServiceAdminRequest {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
    public class PostReviewRequest { public int Rating { get; set; } public string Comment { get; set; } = string.Empty; public string ImageUrl { get; set; } = string.Empty; }
    public class CreateBlogRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public string? Thumbnail { get; set; }
        public string? ImageUrl { get; set; }
        public int? PlaceId { get; set; }
        public int? MaDiaDiem { get; set; }
    }
    public class PostCommentRequest { public string Content { get; set; } = string.Empty; }
    public class RegisterProviderRequest
    {
        public string? BusinessName { get; set; }
        public string? TaxCode { get; set; }
        public string? LicenseNumber { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
    }
    public class SaveProviderDocumentRequest
    {
        public string DocumentType { get; set; } = string.Empty;
        public string OriginalFileName { get; set; } = string.Empty;
        public string StoredFileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSize { get; set; }
    }
    public class CreateServiceRequest
    {
        public string? Category { get; set; }
        public string? LoaiDichVu { get; set; }
        public string? Name { get; set; }
        public string? TenDichVu { get; set; }
        public string? TenKhachSan { get; set; }
        public string? TenNhaHang { get; set; }
        public string? TenHoatDong { get; set; }
        public string? TenPhuongTien { get; set; }
        public int? MaDiaDiem { get; set; }
        public string? MoTa { get; set; }
        public string? Description { get; set; }
        public string? DiaChi { get; set; }
        public string? Address { get; set; }
        public decimal? GiaTu { get; set; }
        public decimal? GiaDen { get; set; }
        public decimal? GiaTrungBinh { get; set; }
        public decimal? Gia { get; set; }
        public decimal? GiaThamKhao { get; set; }
        public decimal? Price { get; set; }
        public string? AnhDaiDien { get; set; }
        public string? Thumbnail { get; set; }
        public string? Status { get; set; }
        public string? TrangThai { get; set; }
        public string? LoaiPhuongTien { get; set; }
        public string? HangXe { get; set; }
        public int? SoChoNgoi { get; set; }
        public string? DiemKhoiHanh { get; set; }
        public string? DiemDen { get; set; }
        public string? ThoiLuong { get; set; }
    }
    public class UpdateServiceRequest : CreateServiceRequest { }
    public class ReplyReviewRequest { public string Content { get; set; } = string.Empty; }
    public class SubscribePackageRequest { public int PackageId { get; set; } }
    public class ManageCollaboratorRequest
    {
        public string Email { get; set; } = string.Empty;
        public int? UserId { get; set; }
        public int? MaNguoiDung { get; set; }
        public string Role { get; set; } = string.Empty;
        public string? Permission { get; set; }
        public string? Quyen { get; set; }
        public string Action { get; set; } = string.Empty;
    }
}
namespace ezTravel.DTO.Requests { public class VerifyOtpRequest { public string Email { get; set; } = string.Empty; public string Code { get; set; } = string.Empty; public string? Type { get; set; } public string? Purpose { get; set; } } public class ResendOtpRequest { public string Email { get; set; } = string.Empty; public string? Type { get; set; } public string? Purpose { get; set; } } public class ForgotPasswordRequest { public string Email { get; set; } = string.Empty; } public class ResetPasswordRequest { public string Email { get; set; } = string.Empty; public string Code { get; set; } = string.Empty; public string NewPassword { get; set; } = string.Empty; } }
namespace ezTravel.DTO.Requests { public class UpdateTimelineRequest { public int TripId { get; set; } public System.Collections.Generic.List<ezTravel.DTO.Trips.TripDayDto> Days { get; set; } = new(); } }
