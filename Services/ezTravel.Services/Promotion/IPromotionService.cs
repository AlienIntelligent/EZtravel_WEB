using System.Collections.Generic;
using System.Threading.Tasks;
using ezTravel.DTO.Providers;

namespace ezTravel.Services.Promotion;

public interface IPromotionService
{
    Task<IEnumerable<ProviderPromotionDto>> GetFeaturedProvidersAsync(int topN = 10);
    Task<IEnumerable<ProviderPromotionDto>> GetExplorePromotedProvidersAsync();
    Task<IEnumerable<AdminPromotionPreviewDto>> GetAdminPromotionsPreviewAsync();
    double CalculatePromotionScore(double heSoUuTien, double rating, double popularity);
    string DetermineBadgeType(bool coBadgeDoiTac, double heSoUuTien);
}
