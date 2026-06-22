using ezTravel.DTO.Requests;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.AI;

public interface IAIBudgetAnalysisService
{
    Task<object> AnalyzeBudgetAsync(AnalyzeBudgetRequest request, int userId);
}

public class AIBudgetAnalysisService : AiServiceBase, IAIBudgetAnalysisService
{
    public AIBudgetAnalysisService(IUnitOfWork uow) : base(uow)
    {
    }

    public async Task<object> AnalyzeBudgetAsync(AnalyzeBudgetRequest request, int userId)
    {
        var trip = await Uow.LichTrinhs.GetQueryable()
            .Include(t => t.NgayLichTrinh)
                .ThenInclude(d => d.DiaDiemLichTrinh)
                    .ThenInclude(p => p.DichVuLichTrinh)
                        .ThenInclude(s => s.MaDichVuNavigation)
            .Include(t => t.NgayLichTrinh)
                .ThenInclude(d => d.DiaDiemLichTrinh)
                    .ThenInclude(p => p.DichVuLichTrinh)
                        .ThenInclude(s => s.ChiPhiDichVuLichTrinh)
            .FirstOrDefaultAsync(t =>
                t.MaLichTrinh == request.TripId &&
                t.MaNguoiDung == userId &&
                t.TrangThai != "ARCHIVED");

        if (trip == null)
        {
            return new
            {
                success = false,
                analysisText = "Khong tim thay lich trinh thuoc nguoi dung hien tai.",
                totalEstimated = 0,
                budgetLimit = 0,
                source = "eztravel-db-budget"
            };
        }

        var services = trip.NgayLichTrinh
            .SelectMany(d => d.DiaDiemLichTrinh)
            .SelectMany(p => p.DichVuLichTrinh)
            .ToList();

        var explicitCost = services
            .SelectMany(s => s.ChiPhiDichVuLichTrinh)
            .Sum(c => c.SoTien);
        var serviceEstimate = services
            .Where(s => s.ChiPhiDichVuLichTrinh.Count == 0)
            .Sum(s => s.MaDichVuNavigation.GiaTu ?? 0m);
        var totalEstimated = explicitCost + serviceEstimate;

        if (totalEstimated <= 0)
        {
            totalEstimated = trip.TongChiPhiUocTinh;
        }

        var budgetLimit = trip.NganSachToiDa ?? 0m;
        var status = budgetLimit <= 0
            ? "NO_LIMIT"
            : totalEstimated <= budgetLimit ? "ON_TRACK" : "OVER_BUDGET";
        var difference = budgetLimit > 0 ? budgetLimit - totalEstimated : 0m;
        var analysisText = BuildAnalysisText(totalEstimated, budgetLimit, status, difference, services.Count);
        var historyId = await SaveHistoryAsync(userId, "BUDGET_ANALYSIS", request, analysisText);

        return new
        {
            success = true,
            analysisText,
            totalEstimated,
            budgetLimit,
            difference,
            status,
            serviceCount = services.Count,
            source = "eztravel-db-budget",
            historyId,
            maLichSuAi = historyId
        };
    }

    private static string BuildAnalysisText(
        decimal totalEstimated,
        decimal budgetLimit,
        string status,
        decimal difference,
        int serviceCount)
    {
        if (budgetLimit <= 0)
        {
            return $"Tong chi phi uoc tinh hien tai la {FormatCurrency(totalEstimated)} cho {serviceCount} dich vu. Lich trinh chua dat ngan sach toi da, nen hay them budget limit de AI canh bao chinh xac hon.";
        }

        return status switch
        {
            "ON_TRACK" => $"Tong chi phi uoc tinh {FormatCurrency(totalEstimated)} dang nam trong ngan sach {FormatCurrency(budgetLimit)}. Ban con du khoang {FormatCurrency(difference)}.",
            "OVER_BUDGET" => $"Tong chi phi uoc tinh {FormatCurrency(totalEstimated)} dang vuot ngan sach {FormatCurrency(budgetLimit)} khoang {FormatCurrency(Math.Abs(difference))}. Nen giam dich vu gia cao hoac tang ngan sach.",
            _ => $"Tong chi phi uoc tinh {FormatCurrency(totalEstimated)}."
        };
    }
}
