using System.Text.Json;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Services.AI;

public abstract class AiServiceBase
{
    protected readonly IUnitOfWork Uow;

    protected AiServiceBase(IUnitOfWork uow)
    {
        Uow = uow;
    }

    protected async Task<int?> SaveHistoryAsync(int userId, string type, object prompt, string summary)
    {
        if (userId <= 0)
        {
            return null;
        }

        var userExists = await Uow.NguoiDungs.AnyAsync(u => u.MaNguoiDung == userId);
        if (!userExists)
        {
            return null;
        }

        var promptText = prompt is string text ? text : JsonSerializer.Serialize(prompt);
        var summaryText = TrimToLength(summary, 4000);
        var history = new LichSuAi
        {
            MaNguoiDung = userId,
            LoaiAi = TrimToLength(type, 50),
            Prompt = promptText,
            KetQuaTomTat = summaryText,
            SoToken = EstimateTokens(promptText) + EstimateTokens(summaryText),
            NgayTao = DateTime.UtcNow
        };

        await Uow.LichSuAis.AddAsync(history);
        await Uow.SaveChangesAsync();

        return history.MaLichSuAi;
    }

    protected async Task<string> CallGeminiAsync(string systemInstruction, string promptText)
    {
        var payload = new
        {
            system_instruction = new { parts = new[] { new { text = systemInstruction } } },
            contents = new[] { new { parts = new[] { new { text = promptText } } } }
        };

        var root = await CallGeminiRawAsync(payload);
        return ExtractTextFromGeminiResponse(root);
    }

    protected async Task<string> CallGeminiJsonAsync(string systemInstruction, string promptText)
    {
        var payload = new
        {
            system_instruction = new { parts = new[] { new { text = systemInstruction } } },
            contents = new[] { new { parts = new[] { new { text = promptText } } } },
            generationConfig = new { responseMimeType = "application/json" }
        };

        var root = await CallGeminiRawAsync(payload);
        return ExtractTextFromGeminiResponse(root);
    }

    protected async Task<JsonElement> CallGeminiRawAsync(object payload)
    {
        var apiKey = "AIzaSyDEWImld1OCkx2zVnPW2Teh1HMbaZvyk_s";
        var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

        using var httpClient = new System.Net.Http.HttpClient();
        var jsonOptions = new JsonSerializerOptions 
        { 
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };
        var jsonPayload = JsonSerializer.Serialize(payload, jsonOptions);
        var content = new System.Net.Http.StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json");

        var response = await httpClient.PostAsync(endpoint, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Gemini API error: {response.StatusCode} - {responseBody}");
        }

        using var document = JsonDocument.Parse(responseBody);
        return document.RootElement.Clone();
    }

    protected static string ExtractTextFromGeminiResponse(JsonElement root)
    {
        try 
        {
            var textResult = root
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return textResult ?? string.Empty;
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to parse Gemini response: {root}", ex);
        }
    }

    protected static int EstimateTokens(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return 0;
        }

        return Math.Max(1, (int)Math.Ceiling(value.Length / 4.0));
    }

    protected static string TrimToLength(string? value, int maxLength)
    {
        var normalized = string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim();
        return normalized.Length <= maxLength ? normalized : normalized[..maxLength];
    }

    protected static string? TrimToNull(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    protected static string FormatCurrency(decimal? amount)
    {
        if (!amount.HasValue || amount.Value <= 0)
        {
            return "chua co gia";
        }

        return $"{amount.Value.ToString("N0", System.Globalization.CultureInfo.GetCultureInfo("vi-VN"))} VND";
    }
}

internal sealed record AiPlace(
    int Id,
    string Name,
    string? Description,
    string? Address,
    string? Thumbnail,
    decimal Rating,
    int ReviewCount);

internal sealed record AiServiceItem(
    int Id,
    int PlaceId,
    string Name,
    string Type,
    string? Description,
    decimal? Price,
    decimal Rating);
