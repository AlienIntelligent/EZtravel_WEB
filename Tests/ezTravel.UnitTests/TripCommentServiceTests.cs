using System.Linq.Expressions;
using System.Text.Json;
using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using ezTravel.Services.Community;
using FluentAssertions;
using Moq;
using Xunit;

namespace ezTravel.UnitTests;

public class TripCommentServiceTests
{
    [Fact]
    public async Task PostCommentAsync_PublicTrip_PersistsTrimmedComment()
    {
        var user = CreateUser(2);
        var trip = CreateTrip(68, ownerId: 1, isPublic: true);
        var (service, unitOfWork, comments) = CreateService(new[] { trip }, new[] { user });

        var result = await service.PostCommentAsync(
            trip.MaLichTrinh,
            new PostCommentRequest { Content = "  Helpful itinerary  " },
            user.MaNguoiDung);

        result.Should().NotBeOfType<TripCommentServiceError>();
        comments.Should().ContainSingle();
        comments[0].NoiDung.Should().Be("Helpful itinerary");
        comments[0].TrangThai.Should().Be("ACTIVE");
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task PostCommentAsync_PrivateInaccessibleTrip_ReturnsNotFound()
    {
        var user = CreateUser(2);
        var trip = CreateTrip(68, ownerId: 1, isPublic: false);
        var (service, unitOfWork, comments) = CreateService(new[] { trip }, new[] { user });

        var result = await service.PostCommentAsync(
            trip.MaLichTrinh,
            new PostCommentRequest { Content = "Should not persist" },
            user.MaNguoiDung);

        result.Should().BeOfType<TripCommentServiceError>()
            .Which.StatusCode.Should().Be(404);
        comments.Should().BeEmpty();
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task PostCommentAsync_EmptyContent_ReturnsValidationError()
    {
        var user = CreateUser(2);
        var trip = CreateTrip(68, ownerId: 1, isPublic: true);
        var (service, unitOfWork, comments) = CreateService(new[] { trip }, new[] { user });

        var result = await service.PostCommentAsync(
            trip.MaLichTrinh,
            new PostCommentRequest { Content = "   " },
            user.MaNguoiDung);

        result.Should().BeOfType<TripCommentServiceError>()
            .Which.StatusCode.Should().Be(400);
        comments.Should().BeEmpty();
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task GetCommentsAsync_ReturnsActiveCommentsWithAuthorAndOwnership()
    {
        var user = CreateUser(2);
        var trip = CreateTrip(68, ownerId: 1, isPublic: true);
        var existing = new[]
        {
            CreateComment(1, trip.MaLichTrinh, user.MaNguoiDung, "Visible", "ACTIVE"),
            CreateComment(2, trip.MaLichTrinh, user.MaNguoiDung, "Hidden", "DELETED")
        };
        var (service, _, _) = CreateService(new[] { trip }, new[] { user }, existing);

        var result = await service.GetCommentsAsync(trip.MaLichTrinh, user.MaNguoiDung);
        var json = JsonSerializer.Serialize(result);

        json.Should().Contain("Visible");
        json.Should().NotContain("Hidden");
        json.Should().Contain(user.HoTen);
        json.Should().Contain("\"isOwn\":true");
    }

    private static (
        TripCommentService Service,
        Mock<IUnitOfWork> UnitOfWork,
        List<BinhLuanLichTrinh> Comments) CreateService(
        IEnumerable<LichTrinh> trips,
        IEnumerable<NguoiDung> users,
        IEnumerable<BinhLuanLichTrinh>? existingComments = null)
    {
        var tripList = trips.ToList();
        var userList = users.ToList();
        var comments = existingComments?.ToList() ?? new List<BinhLuanLichTrinh>();
        var unitOfWork = new Mock<IUnitOfWork>();
        var tripRepository = new Mock<IGenericRepository<LichTrinh>>();
        var userRepository = new Mock<IGenericRepository<NguoiDung>>();
        var commentRepository = new Mock<IGenericRepository<BinhLuanLichTrinh>>();

        tripRepository
            .Setup(item => item.FirstOrDefaultAsync(It.IsAny<Expression<Func<LichTrinh, bool>>>() ))
            .ReturnsAsync((Expression<Func<LichTrinh, bool>> predicate) =>
                tripList.AsQueryable().FirstOrDefault(predicate));
        userRepository
            .Setup(item => item.FirstOrDefaultAsync(It.IsAny<Expression<Func<NguoiDung, bool>>>() ))
            .ReturnsAsync((Expression<Func<NguoiDung, bool>> predicate) =>
                userList.AsQueryable().FirstOrDefault(predicate));
        userRepository
            .Setup(item => item.FindAsync(It.IsAny<Expression<Func<NguoiDung, bool>>>() ))
            .ReturnsAsync((Expression<Func<NguoiDung, bool>> predicate) =>
                userList.AsQueryable().Where(predicate).ToList());
        commentRepository
            .Setup(item => item.FindAsync(It.IsAny<Expression<Func<BinhLuanLichTrinh, bool>>>() ))
            .ReturnsAsync((Expression<Func<BinhLuanLichTrinh, bool>> predicate) =>
                comments.AsQueryable().Where(predicate).ToList());
        commentRepository
            .Setup(item => item.AddAsync(It.IsAny<BinhLuanLichTrinh>()))
            .Callback<BinhLuanLichTrinh>(comment =>
            {
                comment.MaBinhLuan = comments.Count == 0 ? 1 : comments.Max(item => item.MaBinhLuan) + 1;
                comments.Add(comment);
            })
            .Returns(Task.CompletedTask);

        unitOfWork.SetupGet(item => item.LichTrinhs).Returns(tripRepository.Object);
        unitOfWork.SetupGet(item => item.NguoiDungs).Returns(userRepository.Object);
        unitOfWork.SetupGet(item => item.BinhLuanLichTrinhs).Returns(commentRepository.Object);
        unitOfWork.Setup(item => item.SaveChangesAsync()).ReturnsAsync(1);

        return (new TripCommentService(unitOfWork.Object), unitOfWork, comments);
    }

    private static NguoiDung CreateUser(int id)
        => new()
        {
            MaNguoiDung = id,
            HoTen = $"Traveler {id}",
            Email = $"traveler{id}@example.com",
            MatKhauHash = "hash",
            Slug = $"traveler-{id}",
            VaiTro = "TRAVELER",
            TrangThai = "ACTIVE",
            EmailDaXacThuc = true,
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow
        };

    private static LichTrinh CreateTrip(int id, int ownerId, bool isPublic)
        => new()
        {
            MaLichTrinh = id,
            MaNguoiDung = ownerId,
            TenLichTrinh = "Trip comments test",
            NgayBatDau = DateOnly.FromDateTime(DateTime.UtcNow),
            NgayKetThuc = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            LaCongKhai = isPublic,
            TrangThai = isPublic ? "PUBLIC" : "DRAFT",
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow
        };

    private static BinhLuanLichTrinh CreateComment(
        int id,
        int tripId,
        int userId,
        string content,
        string status)
        => new()
        {
            MaBinhLuan = id,
            MaLichTrinh = tripId,
            MaNguoiDung = userId,
            NoiDung = content,
            TrangThai = status,
            NgayTao = DateTime.UtcNow.AddMinutes(id),
            NgayCapNhat = DateTime.UtcNow.AddMinutes(id)
        };
}
