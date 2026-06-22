using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ezTravel.Services.Auth;

public interface IAuthMessageSender
{
    Task SendOtpAsync(string email, string code, string purpose, DateTime expiresAt);
}

public sealed class SmtpAuthMessageSender : IAuthMessageSender
{
    private readonly IConfiguration _configuration;
    private readonly bool _isDevelopment;
    private readonly ILogger<SmtpAuthMessageSender> _logger;

    public SmtpAuthMessageSender(
        IConfiguration configuration,
        ILogger<SmtpAuthMessageSender> logger)
    {
        _configuration = configuration;
        _isDevelopment = string.Equals(
            configuration["ASPNETCORE_ENVIRONMENT"] ?? Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
            "Development",
            StringComparison.OrdinalIgnoreCase);
        _logger = logger;
    }

    public async Task SendOtpAsync(string email, string code, string purpose, DateTime expiresAt)
    {
        var smtp = _configuration.GetSection("AuthEmail:Smtp");
        var host = smtp["Host"];
        if (string.IsNullOrWhiteSpace(host))
        {
            if (_isDevelopment)
            {
                _logger.LogInformation(
                    "Development OTP generated for {Email}; purpose {Purpose}; expires {ExpiresAt:o}.",
                    email,
                    purpose,
                    expiresAt);
                return;
            }

            throw new InvalidOperationException("AuthEmail:Smtp is required outside Development.");
        }

        var fromAddress = smtp["FromAddress"] ?? throw new InvalidOperationException("AuthEmail:Smtp:FromAddress is required.");
        var fromName = smtp["FromName"] ?? "ezTravel";
        var subject = purpose == "RESET" ? "Ma dat lai mat khau ezTravel" : "Ma xac minh ezTravel";
        var body = $"Ma OTP cua ban la {code}. Ma het han luc {expiresAt:O}. Neu ban khong yeu cau thao tac nay, hay bo qua email.";

        using var message = new MailMessage
        {
            From = new MailAddress(fromAddress, fromName),
            Subject = subject,
            Body = body,
            IsBodyHtml = false
        };
        message.To.Add(email);

        using var client = new SmtpClient(host, int.TryParse(smtp["Port"], out var port) ? port : 587)
        {
            EnableSsl = !bool.TryParse(smtp["EnableSsl"], out var enableSsl) || enableSsl
        };

        var username = smtp["Username"];
        var password = smtp["Password"];
        if (!string.IsNullOrWhiteSpace(username))
        {
            client.Credentials = new NetworkCredential(username, password);
        }

        await client.SendMailAsync(message);
    }
}
