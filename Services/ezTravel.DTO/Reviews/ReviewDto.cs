namespace ezTravel.DTO.Reviews;

public class ReviewDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
    public string? UserAvatar { get; set; }
    public int? ServiceId { get; set; }
    public int? PlaceId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime ReviewDate { get; set; }
}

public class CreateReviewRequest
{
    public int? ServiceId { get; set; }
    public int? PlaceId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
}
