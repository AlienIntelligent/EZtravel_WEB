using ezTravel.DTO.Requests;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.AI;

public interface IAITripGenerationService
{
    Task<object> GenerateTripAsync(GenerateTripRequest request, int userId);
}

public class AITripGenerationService : AiServiceBase, IAITripGenerationService
{
    public AITripGenerationService(IUnitOfWork uow) : base(uow)
    {
    }

    public async Task<object> GenerateTripAsync(GenerateTripRequest request, int userId)
    {
        var destination = ResolveDestination(request);
        var (startDate, endDate) = ResolveDateRange(request);
        var dayCount = Math.Clamp(endDate.DayNumber - startDate.DayNumber + 1, 1, 7);

        var places = await LoadPlacesAsync(destination);
        var placeIds = places.Select(p => p.Id).ToList();
        var services = await LoadServicesAsync(placeIds);
        
        var days = await BuildDaysWithAIAsync(startDate, dayCount, request, places, services);
        var estimatedBudget = EstimateBudget(request.BudgetMode, dayCount, services);
        var summary = BuildSummary(request, destination, dayCount, places, services, estimatedBudget);

        var response = new
        {
            trip = new
            {
                title = $"Lich trinh {destination}",
                tenLichTrinh = $"Lich trinh {destination}",
                destination,
                startDate = startDate.ToString("yyyy-MM-dd"),
                endDate = endDate.ToString("yyyy-MM-dd"),
                budgetMode = TrimToNull(request.BudgetMode) ?? "STANDARD",
                estimatedBudget,
                tongChiPhiUocTinh = estimatedBudget,
                visibility = "PRIVATE"
            },
            summary,
            days,
            places = places.Select(MapPlace).ToList(),
            services = services.Select(MapService).ToList(),
            source = "gemini-ai-planner",
            historyId = (int?)null,
            maLichSuAi = (int?)null
        };

        var historyId = await SaveHistoryAsync(userId, "SINH_LICH_TRINH", request, summary);

        return new
        {
            response.trip,
            response.summary,
            response.days,
            response.places,
            response.services,
            response.source,
            historyId,
            maLichSuAi = historyId
        };
    }

    private async Task<List<object>> BuildDaysWithAIAsync(
        DateOnly startDate, 
        int dayCount, 
        GenerateTripRequest request, 
        IReadOnlyList<AiPlace> places, 
        IReadOnlyList<AiServiceItem> services)
    {
        var placesJson = System.Text.Json.JsonSerializer.Serialize(places.Select(p => new { p.Id, p.Name, p.Description, p.Rating }));
        var servicesJson = System.Text.Json.JsonSerializer.Serialize(services.Select(s => new { s.Id, s.PlaceId, s.Name, s.Type, s.Price, s.Rating }));
        
        var preferences = request.Preferences.Count > 0 ? string.Join(", ", request.Preferences) : "Trải nghiệm cân bằng";

        var systemPrompt = @"Bạn là một AI chuyên thiết kế lịch trình du lịch chuyên nghiệp của ezTravel.
Nhiệm vụ của bạn là nhận dữ liệu các Địa điểm (Places) và Dịch vụ (Services) có sẵn từ Database, sau đó sắp xếp chúng thành một lịch trình hợp lý theo từng ngày.
YÊU CẦU BẮT BUỘC:
- CHỈ sử dụng các ID (PlaceId, ServiceId) có trong danh sách được cung cấp. Tuyệt đối KHÔNG tự bịa ra ID mới.
- Đầu ra phải là định dạng JSON hợp lệ tuân thủ chính xác Schema sau:
{
  ""days"": [
    {
      ""dayNumber"": 1,
      ""summary"": ""Tóm tắt ngày 1"",
      ""items"": [
        {
          ""placeId"": 1,
          ""time"": ""09:00"",
          ""note"": ""Ghi chú cho địa điểm này"",
          ""serviceIds"": [10, 11]
        }
      ]
    }
  ]
}";

        var userPrompt = $"Tạo lịch trình {dayCount} ngày.\nSở thích: {preferences}\n\nPlaces:\n{placesJson}\n\nServices:\n{servicesJson}";

        try 
        {
            var jsonResponse = await CallGeminiJsonAsync(systemPrompt, userPrompt);
            using var doc = System.Text.Json.JsonDocument.Parse(jsonResponse);
            var daysArray = doc.RootElement.GetProperty("days");
            
            var resultDays = new List<object>();
            for (int i = 0; i < daysArray.GetArrayLength(); i++)
            {
                var dayNode = daysArray[i];
                int dayNumber = dayNode.GetProperty("dayNumber").GetInt32();
                string daySummary = dayNode.GetProperty("summary").GetString() ?? "";
                
                var itemsArray = dayNode.GetProperty("items");
                var resultItems = new List<object>();
                
                for (int j = 0; j < itemsArray.GetArrayLength(); j++)
                {
                    var itemNode = itemsArray[j];
                    int placeId = itemNode.GetProperty("placeId").GetInt32();
                    string time = itemNode.GetProperty("time").GetString() ?? "09:00";
                    string note = itemNode.GetProperty("note").GetString() ?? "";
                    
                    var place = places.FirstOrDefault(p => p.Id == placeId);
                    if (place == null) continue;

                    var serviceIdsList = new List<int>();
                    if (itemNode.TryGetProperty("serviceIds", out var svcArray))
                    {
                        for (int k = 0; k < svcArray.GetArrayLength(); k++)
                            serviceIdsList.Add(svcArray[k].GetInt32());
                    }
                    
                    var relatedServices = services.Where(s => serviceIdsList.Contains(s.Id)).Select(MapService).ToList();

                    resultItems.Add(new
                    {
                        id = $"day-{dayNumber}-place-{placeId}",
                        type = "place",
                        order = j + 1,
                        time,
                        place = MapPlace(place),
                        services = relatedServices,
                        note
                    });
                }
                
                resultDays.Add(new
                {
                    id = $"day-{dayNumber}",
                    dayNumber = dayNumber,
                    date = startDate.AddDays(dayNumber - 1).ToString("yyyy-MM-dd"),
                    title = $"Ngày {dayNumber}",
                    summary = daySummary,
                    items = resultItems
                });
            }
            return resultDays;
        }
        catch (Exception ex)
        {
            // Fallback về logic cũ nếu có lỗi gọi AI (để tránh lỗi cho user)
            Console.WriteLine("AI Trip Generation Failed, falling back. " + ex.Message);
            return BuildDays(startDate, dayCount, places, services);
        }
    }

    private async Task<List<AiPlace>> LoadPlacesAsync(string destination)
    {
        var normalizedDestination = destination.Trim();
        var query = Uow.DiaDiems.GetQueryable()
            .Where(p => p.TrangThai == "ACTIVE");

        if (!string.IsNullOrWhiteSpace(normalizedDestination))
        {
            query = query.Where(p =>
                p.TenDiaDiem.Contains(normalizedDestination) ||
                (p.DiaChi != null && p.DiaChi.Contains(normalizedDestination)) ||
                (p.MoTa != null && p.MoTa.Contains(normalizedDestination)));
        }

        var places = await query
            .OrderByDescending(p => p.DanhGiaTrungBinh)
            .ThenByDescending(p => p.LuotXem)
            .Take(6)
            .Select(p => new AiPlace(
                p.MaDiaDiem,
                p.TenDiaDiem,
                p.MoTa,
                p.DiaChi,
                p.Thumbnail,
                p.DanhGiaTrungBinh,
                p.TongDanhGia))
            .ToListAsync();

        if (places.Count > 0)
        {
            return places;
        }

        return await Uow.DiaDiems.GetQueryable()
            .Where(p => p.TrangThai == "ACTIVE")
            .OrderByDescending(p => p.DanhGiaTrungBinh)
            .ThenByDescending(p => p.LuotXem)
            .Take(6)
            .Select(p => new AiPlace(
                p.MaDiaDiem,
                p.TenDiaDiem,
                p.MoTa,
                p.DiaChi,
                p.Thumbnail,
                p.DanhGiaTrungBinh,
                p.TongDanhGia))
            .ToListAsync();
    }

    private async Task<List<AiServiceItem>> LoadServicesAsync(IReadOnlyCollection<int> placeIds)
    {
        var query = Uow.DichVus.GetQueryable()
            .Where(s => s.TrangThai == "ACTIVE");

        if (placeIds.Count > 0)
        {
            query = query.Where(s => placeIds.Contains(s.MaDiaDiem));
        }

        return await query
            .OrderByDescending(s => s.DanhGiaTrungBinh)
            .ThenBy(s => s.GiaTu ?? decimal.MaxValue)
            .Take(10)
            .Select(s => new AiServiceItem(
                s.MaDichVu,
                s.MaDiaDiem,
                s.TenDichVu,
                s.LoaiDichVu,
                s.MoTa,
                s.GiaTu,
                s.DanhGiaTrungBinh))
            .ToListAsync();
    }

    private static List<object> BuildDays(
        DateOnly startDate,
        int dayCount,
        IReadOnlyList<AiPlace> places,
        IReadOnlyList<AiServiceItem> services)
    {
        var days = new List<object>();
        for (var i = 0; i < dayCount; i++)
        {
            var dayPlaces = places
                .Skip(i * 2)
                .Take(2)
                .DefaultIfEmpty(places.FirstOrDefault())
                .Where(p => p != null)
                .Cast<AiPlace>()
                .ToList();

            var items = dayPlaces.Select((place, index) =>
            {
                var relatedServices = services
                    .Where(s => s.PlaceId == place.Id)
                    .Take(2)
                    .Select(MapService)
                    .ToList();

                return new
                {
                    id = $"day-{i + 1}-place-{place.Id}",
                    type = "place",
                    order = index + 1,
                    time = index == 0 ? "09:00" : "14:00",
                    place = MapPlace(place),
                    services = relatedServices,
                    note = index == 0 ? "Bat dau ngay bang diem noi bat." : "Danh thoi gian nhe hon de trai nghiem."
                };
            }).ToList();

            days.Add(new
            {
                id = $"day-{i + 1}",
                dayNumber = i + 1,
                date = startDate.AddDays(i).ToString("yyyy-MM-dd"),
                title = $"Ngay {i + 1}",
                summary = items.Count > 0
                    ? $"Tham quan {string.Join(", ", dayPlaces.Select(p => p.Name))}."
                    : "Ngay linh hoat de bo sung diem den.",
                items
            });
        }

        return days;
    }

    private static decimal EstimateBudget(string? budgetMode, int dayCount, IReadOnlyList<AiServiceItem> services)
    {
        var serviceAverage = services
            .Where(s => s.Price.HasValue && s.Price.Value > 0)
            .Select(s => s.Price!.Value)
            .DefaultIfEmpty(450_000m)
            .Average();

        var multiplier = (TrimToNull(budgetMode) ?? "STANDARD").ToUpperInvariant() switch
        {
            "ECONOMY" => 0.8m,
            "LUXURY" => 1.8m,
            _ => 1.2m
        };

        return Math.Round(serviceAverage * dayCount * multiplier, 0);
    }

    private static string BuildSummary(
        GenerateTripRequest request,
        string destination,
        int dayCount,
        IReadOnlyList<AiPlace> places,
        IReadOnlyList<AiServiceItem> services,
        decimal estimatedBudget)
    {
        var preferences = request.Preferences.Count > 0
            ? string.Join(", ", request.Preferences)
            : "trai nghiem can bang";

        return $"Da tao lich trinh {dayCount} ngay cho {destination} voi uu tien {preferences}. "
            + $"He thong de xuat {places.Count} diem den va {services.Count} dich vu tu du lieu ezTravel. "
            + $"Ngan sach uoc tinh: {FormatCurrency(estimatedBudget)}.";
    }

    private static object MapPlace(AiPlace place)
    {
        return new
        {
            id = place.Id,
            maDiaDiem = place.Id,
            name = place.Name,
            tenDiaDiem = place.Name,
            description = place.Description,
            moTa = place.Description,
            address = place.Address,
            diaChi = place.Address,
            thumbnail = place.Thumbnail,
            rating = place.Rating,
            averageRating = place.Rating,
            totalReviews = place.ReviewCount
        };
    }

    private static object MapService(AiServiceItem service)
    {
        return new
        {
            id = service.Id,
            maDichVu = service.Id,
            maDiaDiem = service.PlaceId,
            name = service.Name,
            tenDichVu = service.Name,
            type = service.Type,
            loaiDichVu = service.Type,
            description = service.Description,
            moTa = service.Description,
            price = service.Price,
            giaTu = service.Price,
            rating = service.Rating
        };
    }

    private static string ResolveDestination(GenerateTripRequest request)
    {
        return TrimToNull(request.Destination)
            ?? TrimToNull(request.Prompt)
            ?? "Viet Nam";
    }

    private static (DateOnly StartDate, DateOnly EndDate) ResolveDateRange(GenerateTripRequest request)
    {
        var startDate = TryParseDate(request.StartDate) ?? DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(7));
        var endDate = TryParseDate(request.EndDate) ?? startDate.AddDays(2);

        if (endDate < startDate)
        {
            endDate = startDate.AddDays(2);
        }

        return (startDate, endDate);
    }

    private static DateOnly? TryParseDate(string? value)
    {
        return DateOnly.TryParse(value, out var parsed) ? parsed : null;
    }
}
