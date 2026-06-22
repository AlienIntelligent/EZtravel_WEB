using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using ezTravel.Services.Ranking;
using ezTravel.Services.Promotion;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace ezTravel.UnitTests;

public class SearchRankingServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUow;
    private readonly Mock<IGoiDichVuNccRepository> _mockGoiRepository;
    private readonly SearchRankingService _rankingService;

    public SearchRankingServiceTests()
    {
        _mockUow = new Mock<IUnitOfWork>();
        _mockGoiRepository = new Mock<IGoiDichVuNccRepository>();
        _rankingService = new SearchRankingService(_mockUow.Object, _mockGoiRepository.Object);
    }

    [Fact]
    public void CalculateSearchScore_ShouldApplyWeightsCorrectly()
    {
        // SearchScore = ReviewScore * 0.4 + PopularityScore * 0.3 + RelevanceScore * 0.2 + PackagePriorityScore * 0.1
        // Given: Review=100, Popularity=80, Relevance=100, PackagePriority=50
        // Expected: 100*0.4 + 80*0.3 + 100*0.2 + 50*0.1 = 40 + 24 + 20 + 5 = 89
        double score = _rankingService.CalculateSearchScore(100, 80, 100, 50);
        score.Should().Be(89.0);
    }

    [Fact]
    public void Scenario1_FreeWithFiveStarRating_ShouldOutrank_PremiumWithThreeStarRating()
    {
        // Provider A: Rating = 5.0, FREE (priority = 1.0 -> 50.0)
        // Provider B: Rating = 3.0, PREMIUM (priority = 2.0 -> 100.0)
        // Assume Popularity = 0, Relevance = 100

        double reviewScoreA = 5.0 * 20.0; // 100
        double reviewScoreB = 3.0 * 20.0; // 60

        double priorityA = 50.0; // FREE
        double priorityB = 100.0; // PREMIUM

        double scoreA = _rankingService.CalculateSearchScore(reviewScoreA, 0, 100, priorityA); // 100*0.4 + 20 + 5 = 65
        double scoreB = _rankingService.CalculateSearchScore(reviewScoreB, 0, 100, priorityB); // 60*0.4 + 20 + 10 = 54

        scoreA.Should().BeGreaterThan(scoreB);
    }

    [Fact]
    public void Scenario2_PremiumWithSameRating_ShouldOutrank_FreeWithSameRating()
    {
        // Provider A: Rating = 4.6, FREE (priority = 1.0 -> 50.0)
        // Provider B: Rating = 4.6, PREMIUM (priority = 2.0 -> 100.0)
        // Assume Popularity = 0, Relevance = 100

        double reviewScoreA = 4.6 * 20.0; // 92
        double reviewScoreB = 4.6 * 20.0; // 92

        double priorityA = 50.0; // FREE
        double priorityB = 100.0; // PREMIUM

        double scoreA = _rankingService.CalculateSearchScore(reviewScoreA, 0, 100, priorityA); // 92*0.4 + 20 + 5 = 61.8
        double scoreB = _rankingService.CalculateSearchScore(reviewScoreB, 0, 100, priorityB); // 92*0.4 + 20 + 10 = 66.8

        scoreB.Should().BeGreaterThan(scoreA);
        (scoreB - scoreA).Should().BeApproximately(5.0, 0.001); // 66.8 - 61.8 = 5.0
    }

    [Fact]
    public async Task Scenario3_ProviderWithNoPackage_ShouldReceiveDefaultFreePriority()
    {
        // Provider has no active package (MaGoiNccHienTai is null)
        var providers = new List<NhaCungCap>
        {
            new NhaCungCap { MaNhaCungCap = 1, MaGoiNccHienTai = null }
        };

        var mockDbSet = MockDbSet(providers);
        _mockUow.Setup(u => u.NhaCungCaps.GetQueryable()).Returns(mockDbSet.Object);
        _mockGoiRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<GoiDichVuNcc>());

        var scores = await _rankingService.GetProviderPriorityScoresAsync(new[] { 1 }, applySearchBoost: false);

        scores.Should().ContainKey(1);
        scores[1].Should().Be(50.0); // FREE coefficient = 1.0 * 50 = 50.0
    }

    private static Mock<DbSet<T>> MockDbSet<T>(List<T> sourceList) where T : class
    {
        var queryable = sourceList.AsQueryable();
        var mockSet = new Mock<DbSet<T>>();

        mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<T>(queryable.Provider));
        mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
        mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
        mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(() => queryable.GetEnumerator());
        mockSet.As<IAsyncEnumerable<T>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
            .Returns(new TestAsyncEnumerator<T>(queryable.GetEnumerator()));

        return mockSet;
    }
}

public class PromotionServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUow;
    private readonly Mock<IGoiDichVuNccRepository> _mockGoiRepository;
    private readonly Mock<ILogger<PromotionService>> _mockLogger;
    private readonly PromotionService _promotionService;

    public PromotionServiceTests()
    {
        _mockUow = new Mock<IUnitOfWork>();
        _mockGoiRepository = new Mock<IGoiDichVuNccRepository>();
        _mockLogger = new Mock<ILogger<PromotionService>>();
        _promotionService = new PromotionService(_mockUow.Object, _mockGoiRepository.Object, _mockLogger.Object);
    }

    [Fact]
    public void CalculatePromotionScore_ShouldApplyWeightsCorrectly()
    {
        // PromotionScore = he_so_uu_tien * 0.5 + rating * 0.3 + popularity * 0.2
        // Given: heSoUuTien=2.0, rating=4.5, popularity=3.0
        // Expected: 2.0*0.5 + 4.5*0.3 + 3.0*0.2 = 1.0 + 1.35 + 0.6 = 2.95
        double score = _promotionService.CalculatePromotionScore(2.0, 4.5, 3.0);
        score.Should().BeApproximately(2.95, 0.001);
    }

    [Fact]
    public void Scenario1_PremiumWithHighRating_ShouldOutrank_FreeWithPerfectRating()
    {
        // Provider A: FREE (1.0), Rating = 5.0
        // Provider B: PREMIUM (2.0), Rating = 4.8
        // Assume popularity is 0
        double scoreA = _promotionService.CalculatePromotionScore(1.0, 5.0, 0); // 1.0*0.5 + 5.0*0.3 = 0.5 + 1.5 = 2.0
        double scoreB = _promotionService.CalculatePromotionScore(2.0, 4.8, 0); // 2.0*0.5 + 4.8*0.3 = 1.0 + 1.44 = 2.44
        scoreB.Should().BeGreaterThan(scoreA);
    }

    [Fact]
    public void Scenario2_FreeWithPerfectRating_ShouldOutrank_PremiumWithTerribleRating()
    {
        // Provider A: PREMIUM (2.0), Rating = 2.0
        // Provider B: FREE (1.0), Rating = 5.0
        // Assume popularity is 0
        double scoreA = _promotionService.CalculatePromotionScore(2.0, 2.0, 0); // 2.0*0.5 + 2.0*0.3 = 1.0 + 0.6 = 1.6
        double scoreB = _promotionService.CalculatePromotionScore(1.0, 5.0, 0); // 1.0*0.5 + 5.0*0.3 = 0.5 + 1.5 = 2.0
        scoreB.Should().BeGreaterThan(scoreA);
    }

    [Fact]
    public void Scenario3_BadgeMappingRules_ShouldBeCorrect()
    {
        // Rules:
        // co_badge_doi_tac = false -> NONE
        // co_badge_doi_tac = true, he_so_uu_tien < 2 -> VERIFIED_PARTNER
        // co_badge_doi_tac = true, he_so_uu_tien >= 2 -> PREMIUM_PARTNER
        _promotionService.DetermineBadgeType(false, 2.0).Should().Be("NONE");
        _promotionService.DetermineBadgeType(true, 1.5).Should().Be("VERIFIED_PARTNER");
        _promotionService.DetermineBadgeType(true, 2.0).Should().Be("PREMIUM_PARTNER");
    }
}

internal class TestAsyncQueryProvider<TEntity> : IAsyncQueryProvider
{
    private readonly IQueryProvider _inner;

    internal TestAsyncQueryProvider(IQueryProvider inner)
    {
        _inner = inner;
    }

    public IQueryable CreateQuery(Expression expression)
    {
        return new TestAsyncEnumerable<TEntity>(expression);
    }

    public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
    {
        return new TestAsyncEnumerable<TElement>(expression);
    }

    public object? Execute(Expression expression)
    {
        return _inner.Execute(expression);
    }

    public TResult Execute<TResult>(Expression expression)
    {
        return _inner.Execute<TResult>(expression);
    }

    public TResult ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken = default)
    {
        return Execute<TResult>(expression);
    }
}

internal class TestAsyncEnumerable<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
{
    public TestAsyncEnumerable(IEnumerable<T> enumerable)
        : base(enumerable)
    {
    }

    public TestAsyncEnumerable(Expression expression)
        : base(expression)
    {
    }

    public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default)
    {
        return new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
    }

    IQueryProvider IQueryable.Provider => new TestAsyncQueryProvider<T>(this);
}

internal class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
{
    private readonly IEnumerator<T> _inner;

    public TestAsyncEnumerator(IEnumerator<T> inner)
    {
        _inner = inner;
    }

    public T Current => _inner.Current;

    public ValueTask DisposeAsync()
    {
        _inner.Dispose();
        return ValueTask.CompletedTask;
    }

    public ValueTask<bool> MoveNextAsync()
    {
        return ValueTask.FromResult(_inner.MoveNext());
    }
}
