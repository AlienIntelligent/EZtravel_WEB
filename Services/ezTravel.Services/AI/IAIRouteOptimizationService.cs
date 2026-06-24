using ezTravel.DTO.Requests;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.AI;

public interface IAIRouteOptimizationService
{
    Task<object> OptimizeRouteAsync(OptimizeRouteRequest request, int userId);
}

public class AIRouteOptimizationService : AiServiceBase, IAIRouteOptimizationService
{
    public AIRouteOptimizationService(IUnitOfWork uow) : base(uow)
    {
    }

    public async Task<object> OptimizeRouteAsync(OptimizeRouteRequest request, int userId)
    {
        var trip = await Uow.LichTrinhs.GetQueryable()
            .Include(t => t.NgayLichTrinh)
                .ThenInclude(d => d.DiaDiemLichTrinh)
                    .ThenInclude(p => p.MaDiaDiemNavigation)
            .FirstOrDefaultAsync(t =>
                t.MaLichTrinh == request.TripId &&
                t.MaNguoiDung == userId &&
                t.TrangThai != "ARCHIVED");

        if (trip == null)
        {
            return new
            {
                success = false,
                message = "Khong tim thay lich trinh thuoc nguoi dung hien tai.",
                optimizedOrder = Array.Empty<int>(),
                source = "eztravel-db-route"
            };
        }

        var orderedPlaces = trip.NgayLichTrinh
            .OrderBy(d => d.SoThuTu)
            .ThenBy(d => d.Ngay)
            .SelectMany(d => d.DiaDiemLichTrinh
                .OrderBy(p => p.ThuTu)
                .ThenBy(p => p.GioBatDau ?? TimeOnly.MinValue)
                .Select(p => new
                {
                    p.MaDiaDiemLichTrinh,
                    p.MaDiaDiem,
                    placeName = p.MaDiaDiemNavigation.TenDiaDiem,
                    address = p.MaDiaDiemNavigation.DiaChi,
                    dayNumber = d.SoThuTu,
                    order = p.ThuTu
                }))
            .ToList();

        if (orderedPlaces.Count == 0)
        {
            return new
            {
                success = true,
                optimizedOrder = Array.Empty<int>(),
                places = orderedPlaces,
                summary = "Lich trinh chua co diem den de toi uu.",
                source = "gemini-ai-route",
                historyId = (int?)null,
                maLichSuAi = (int?)null
            };
        }

        var placesJson = System.Text.Json.JsonSerializer.Serialize(orderedPlaces);
        var systemPrompt = @"Bạn là chuyên gia quy hoạch tuyến đường và logistics. Nhiệm vụ của bạn là giải bài toán Tối ưu hóa lộ trình.
Dựa vào danh sách các địa điểm người dùng dự định đi (có kèm địa chỉ và ngày đi), hãy sắp xếp lại danh sách sao cho hợp lý nhất về mặt quãng đường di chuyển và trải nghiệm.
YÊU CẦU:
- Trả về danh sách 'optimizedOrder' là một mảng các 'MaDiaDiemLichTrinh' đã được sắp xếp lại.
- Trả về 'summary' tóm tắt lý do bạn sắp xếp như vậy.
- Đầu ra phải là định dạng JSON hợp lệ tuân thủ Schema sau:
{
  ""optimizedOrder"": [1, 2, 3],
  ""summary"": ""Lý do...""
}";

        var userPrompt = $"Tối ưu lộ trình cho các điểm đến sau:\n{placesJson}";

        string summary = "";
        List<int> finalOrder;

        try
        {
            var jsonResponse = await CallGeminiJsonAsync(systemPrompt, userPrompt);
            using var doc = System.Text.Json.JsonDocument.Parse(jsonResponse);
            
            var orderArray = doc.RootElement.GetProperty("optimizedOrder");
            finalOrder = new List<int>();
            for (int i = 0; i < orderArray.GetArrayLength(); i++)
            {
                finalOrder.Add(orderArray[i].GetInt32());
            }
            summary = doc.RootElement.GetProperty("summary").GetString() ?? "Đã tối ưu lộ trình.";
        }
        catch (Exception ex)
        {
            Console.WriteLine("AI Route Optimization Failed, falling back. " + ex.Message);
            finalOrder = orderedPlaces.Select(p => p.MaDiaDiemLichTrinh).ToList();
            summary = $"Da sap xep {orderedPlaces.Count} diem den theo ngay va thu tu hien co de giu hanh trinh on dinh.";
        }

        var historyId = await SaveHistoryAsync(userId, "TOI_UU_LO_TRINH", request, summary);

        return new
        {
            success = true,
            optimizedOrder = finalOrder,
            places = orderedPlaces,
            summary,
            source = "gemini-ai-route",
            historyId,
            maLichSuAi = historyId
        };
    }
}
