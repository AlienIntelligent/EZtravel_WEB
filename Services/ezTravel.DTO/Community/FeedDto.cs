namespace ezTravel.DTO.Community;

public class CommentDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; } = null!;
    public string? UserAvatar { get; set; }
    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}

public class LikeDto
{
    public int UserId { get; set; }
    public string UserFullName { get; set; } = null!;
}

public class FeedDto
{
    public int TripId { get; set; }
    public string TripTitle { get; set; } = null!;
    public string? Destination { get; set; }
    public string CreatorName { get; set; } = null!;
    public string? CreatorAvatar { get; set; }
    public string? Description { get; set; }
    public int TotalLikes { get; set; }
    public int TotalComments { get; set; }
    public List<CommentDto> RecentComments { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}
