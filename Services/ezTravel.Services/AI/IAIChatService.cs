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
        var systemInstruction = "Bạn là trợ lý du lịch AI của ezTravel. Hãy tư vấn tự nhiên, thân thiện và hữu ích. CÓ THỂ sử dụng công cụ SearchPlaces để tìm kiếm thông tin địa điểm và dịch vụ có trong hệ thống nếu người dùng hỏi cụ thể về nơi chốn, khách sạn, nhà hàng, v.v.";
        
        string reply;
        try 
        {
            reply = await ChatWithToolsAsync(systemInstruction, userMessage);
        }
        catch (Exception ex)
        {
            reply = "Xin lỗi, hệ thống AI đang gặp sự cố kết nối. Chi tiết: " + ex.Message;
        }

        var historyId = await SaveHistoryAsync(userId, "CHATBOT", request, reply);

        return new
        {
            reply,
            message = new
            {
                role = "assistant",
                content = reply
            },
            source = "gemini-ai-assistant",
            historyId,
            maLichSuAi = historyId
        };
    }

    private async Task<string> ChatWithToolsAsync(string systemInstruction, string userMessage)
    {
        var tools = new[]
        {
            new
            {
                function_declarations = new[]
                {
                    new
                    {
                        name = "SearchPlaces",
                        description = "Tìm kiếm thông tin các địa điểm và dịch vụ du lịch (nhà hàng, khách sạn, tour) trong hệ thống ezTravel.",
                        parameters = new
                        {
                            type = "OBJECT",
                            properties = new
                            {
                                keyword = new { type = "STRING", description = "Từ khoá tìm kiếm (vd: Vũng Tàu, Đà Lạt, khách sạn, nhà hàng...)" }
                            },
                            required = new[] { "keyword" }
                        }
                    }
                }
            }
        };

        var contents = new List<object>
        {
            new { role = "user", parts = new[] { new { text = userMessage } } }
        };

        var payload = new Dictionary<string, object>
        {
            { "system_instruction", new { parts = new[] { new { text = systemInstruction } } } },
            { "contents", contents },
            { "tools", tools }
        };

        var root = await CallGeminiRawAsync(payload);
        var parts = root.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0];

        if (parts.TryGetProperty("functionCall", out var functionCall))
        {
            var functionName = functionCall.GetProperty("name").GetString();
            var args = functionCall.GetProperty("args");
            
            if (functionName == "SearchPlaces")
            {
                var keyword = args.TryGetProperty("keyword", out var kw) ? kw.GetString() ?? "" : "";
                var searchResults = await ExecuteSearchPlacesAsync(keyword);

                // Thêm model's functionCall vào lịch sử
                contents.Add(new { role = "model", parts = new[] { new { functionCall = functionCall.Clone() } } });

                // Thêm functionResponse của hệ thống
                contents.Add(new
                {
                    role = "user",
                    parts = new[]
                    {
                        new
                        {
                            functionResponse = new
                            {
                                name = "SearchPlaces",
                                response = new { name = "SearchPlaces", content = searchResults }
                            }
                        }
                    }
                });

                var payload2 = new Dictionary<string, object>
                {
                    { "system_instruction", new { parts = new[] { new { text = systemInstruction } } } },
                    { "contents", contents }
                };

                var root2 = await CallGeminiRawAsync(payload2);
                return ExtractTextFromGeminiResponse(root2);
            }
        }

        return ExtractTextFromGeminiResponse(root);
    }

    private async Task<object> ExecuteSearchPlacesAsync(string keyword)
    {
        var normalizedKw = keyword.ToLower();
        var places = await Uow.DiaDiems.GetQueryable()
            .Where(p => p.TrangThai == "ACTIVE" && (p.TenDiaDiem.ToLower().Contains(normalizedKw) || (p.DiaChi != null && p.DiaChi.ToLower().Contains(normalizedKw))))
            .OrderByDescending(p => p.DanhGiaTrungBinh)
            .Take(5)
            .Select(p => new { p.TenDiaDiem, p.MoTa, p.DiaChi, p.DanhGiaTrungBinh })
            .ToListAsync();

        var services = await Uow.DichVus.GetQueryable()
            .Where(s => s.TrangThai == "ACTIVE" && (s.TenDichVu.ToLower().Contains(normalizedKw) || s.LoaiDichVu.ToLower().Contains(normalizedKw)))
            .OrderByDescending(s => s.DanhGiaTrungBinh)
            .Take(5)
            .Select(s => new { s.TenDichVu, s.LoaiDichVu, s.GiaTu, s.DanhGiaTrungBinh })
            .ToListAsync();

        return new
        {
            placesFound = places,
            servicesFound = services
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
}
