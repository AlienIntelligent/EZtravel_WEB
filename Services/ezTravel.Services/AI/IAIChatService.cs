using ezTravel.DTO.Requests;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.AI;

public interface IAIChatService
{
    Task<object> SendMessageAsync(ChatMessageRequest request, int userId);
}

public class AIChatService : AiServiceBase, IAIChatService
{
    public AIChatService(IUnitOfWork uow) : base(uow)
    {
    }

    public async Task<object> SendMessageAsync(ChatMessageRequest request, int userId)
    {
        var userMessage = ResolveUserMessage(request);
        var destinations = await Uow.DiaDiems.GetQueryable()
            .Where(p => p.TrangThai == "ACTIVE")
            .OrderByDescending(p => p.DanhGiaTrungBinh)
            .ThenByDescending(p => p.LuotXem)
            .Take(3)
            .Select(p => new ChatDestination(p.TenDiaDiem, p.MoTa, p.DiaChi, p.DanhGiaTrungBinh))
            .ToListAsync();

        var services = await Uow.DichVus.GetQueryable()
            .Where(s => s.TrangThai == "ACTIVE")
            .OrderByDescending(s => s.DanhGiaTrungBinh)
            .ThenByDescending(s => s.LuotXem)
            .Take(3)
            .Select(s => new ChatServiceSuggestion(s.TenDichVu, s.LoaiDichVu, s.GiaTu))
            .ToListAsync();

        var reply = BuildReply(userMessage, destinations, services);
        var historyId = await SaveHistoryAsync(userId, "CHAT", request, reply);

        return new
        {
            reply,
            message = new
            {
                role = "assistant",
                content = reply
            },
            source = "eztravel-db-assistant",
            historyId,
            maLichSuAi = historyId
        };
    }

    private static string ResolveUserMessage(ChatMessageRequest request)
    {
        var directMessage = TrimToNull(request.Message);
        if (directMessage != null)
        {
            return directMessage;
        }

        return request.Messages
            .LastOrDefault(m => string.Equals(m.Role, "user", StringComparison.OrdinalIgnoreCase))
            ?.Content
            ?? string.Empty;
    }

    private static string BuildReply(
        string userMessage,
        IEnumerable<ChatDestination> destinations,
        IEnumerable<ChatServiceSuggestion> services)
    {
        var destinationLines = destinations
            .Select((d, index) =>
                $"{index + 1}. {d.Name} ({d.Rating:0.0}/5) - {TrimToLength(d.Description ?? d.Address ?? "Dang cap nhat mo ta.", 120)}")
            .ToList();

        var serviceLines = services
            .Select((s, index) =>
                $"{index + 1}. {s.Name} - {s.Type}, gia tu {FormatCurrency(s.Price)}")
            .ToList();

        var parts = new List<string>
        {
            string.IsNullOrWhiteSpace(userMessage)
                ? "Minh co the goi y nhanh dua tren du lieu hien co trong ezTravel."
                : $"Minh da doc yeu cau: \"{TrimToLength(userMessage, 160)}\".",
            "Goi y diem den noi bat:",
            destinationLines.Count > 0 ? string.Join("\n", destinationLines) : "Chưa có điểm đến ACTIVE trong dữ liệu.",
            "Dich vu nen tham khao:",
            serviceLines.Count > 0 ? string.Join("\n", serviceLines) : "Chưa có dịch vụ ACTIVE trong dữ liệu.",
            "Ban co the cho minh biet ngay di, ngan sach va kieu trai nghiem de minh goi y sat hon."
        };

        return string.Join("\n\n", parts);
    }

    private sealed record ChatDestination(string Name, string? Description, string? Address, decimal Rating);

    private sealed record ChatServiceSuggestion(string Name, string Type, decimal? Price);
}
