using System.Security.Claims;
using ezTravel.DTO.Requests;
using ezTravel.Services.Community;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ezTravel.CommunityService.Controllers;

[ApiController]
[Route("api/blogs")]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blogService;

    public BlogController(IBlogService blogService)
    {
        _blogService = blogService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetBlogs()
        => FromBlogResult(await _blogService.GetBlogsAsync());

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBlog(int id)
        => FromBlogResult(await _blogService.GetBlogByIdAsync(id));

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateBlog([FromBody] CreateBlogRequest request)
        => FromBlogResult(await _blogService.CreateBlogAsync(request, UserId));

    [HttpGet("{id}/comments")]
    [AllowAnonymous]
    public async Task<IActionResult> GetComments(int id)
        => FromBlogResult(await _blogService.GetCommentsAsync(id));

    [HttpPost("{id}/comments")]
    [Authorize]
    public async Task<IActionResult> PostComment(int id, [FromBody] PostCommentRequest request)
        => FromBlogResult(await _blogService.PostCommentAsync(id, request, UserId));

    private int UserId
    {
        get
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return int.TryParse(value, out var userId) ? userId : 0;
        }
    }

    private IActionResult FromBlogResult(object result)
        => result is BlogServiceError error
            ? StatusCode(error.StatusCode, new { message = error.Message })
            : Ok(result);
}
