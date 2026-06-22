using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezTravel.Services.Ranking;

public interface ISearchRankingService
{
    double CalculateSearchScore(
        double reviewScore,
        double popularityScore,
        double relevanceScore,
        double packagePriorityScore
    );

    Task<Dictionary<int, double>> GetProviderPriorityScoresAsync(
        IEnumerable<int> providerIds,
        bool applySearchBoost
    );
}
