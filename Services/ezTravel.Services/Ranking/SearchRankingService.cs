using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.Ranking;

public class SearchRankingService : ISearchRankingService
{
    private readonly IUnitOfWork _uow;
    private readonly IGoiDichVuNccRepository _goiRepository;

    public SearchRankingService(IUnitOfWork uow, IGoiDichVuNccRepository goiRepository)
    {
        _uow = uow;
        _goiRepository = goiRepository;
    }

    public double CalculateSearchScore(
        double reviewScore,
        double popularityScore,
        double relevanceScore,
        double packagePriorityScore)
    {
        // SearchScore = ReviewScore * 0.4 + PopularityScore * 0.3 + RelevanceScore * 0.2 + PackagePriorityScore * 0.1
        return (reviewScore * 0.4) + (popularityScore * 0.3) + (relevanceScore * 0.2) + (packagePriorityScore * 0.1);
    }

    public async Task<Dictionary<int, double>> GetProviderPriorityScoresAsync(
        IEnumerable<int> providerIds,
        bool applySearchBoost)
    {
        var result = new Dictionary<int, double>();
        var distinctProviderIds = providerIds.Distinct().ToList();

        if (!distinctProviderIds.Any())
            return result;

        var providers = await _uow.NhaCungCaps.GetQueryable()
            .Where(p => distinctProviderIds.Contains(p.MaNhaCungCap))
            .ToListAsync();

        var activePackages = await _goiRepository.GetAllAsync();
        var packageMap = activePackages.ToDictionary(g => g.MaGoiNcc, g => g);

        foreach (var pId in distinctProviderIds)
        {
            var provider = providers.FirstOrDefault(p => p.MaNhaCungCap == pId);
            double coeff = 1.0;
            bool isUuTienTimKiem = false;

            if (provider != null && provider.MaGoiNccHienTai.HasValue)
            {
                if (packageMap.TryGetValue(provider.MaGoiNccHienTai.Value, out var pkg))
                {
                    coeff = (double)pkg.HeSoUuTien;
                    isUuTienTimKiem = pkg.UuTienTimKiem;
                }
            }

            // Normal priority mapping: HeSoUuTien * 50.0 (FREE 1.0 -> 50.0, STANDARD 1.5 -> 75.0, PREMIUM 2.0 -> 100.0)
            double score = coeff * 50.0;

            if (applySearchBoost && isUuTienTimKiem)
            {
                score += 20.0;
            }

            // Cap PackagePriorityScore at 100.0 to limit its final contribution to 10%
            if (score > 100.0)
            {
                score = 100.0;
            }

            result[pId] = score;
        }

        return result;
    }
}
