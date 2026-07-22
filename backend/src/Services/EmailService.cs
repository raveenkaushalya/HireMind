using Microsoft.Extensions.Options;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
    {
        var message = new System.Net.Mail.MailMessage
        {
            From = new System.Net.Mail.MailAddress(_settings.SenderEmail, _settings.SenderName),
            Subject = subject,
            Body = body,
            IsBodyHtml = isHtml
        };
        message.To.Add(new System.Net.Mail.MailAddress(toEmail));

        using var client = new System.Net.Mail.SmtpClient(_settings.SmtpServer, _settings.Port)
        {
            Credentials = new System.Net.NetworkCredential(_settings.SenderEmail, _settings.AppPassword),
            EnableSsl = true
        };

        await client.SendMailAsync(message);
    }
    public async Task SendPasswordTokenAsync(string userEmail, string tokenUrl)
    {
        var subject = "Set Up Your Account Password";
        var body = $"<p>Click <a href='{tokenUrl}'>here</a> to set your password.</p>";
        await SendEmailAsync(userEmail, subject, body, isHtml: true);
    }

    // Feedback method
    public async Task SendFeedbackToAdminAsync(string userEmail, string userName, string rating, string comments)
    {
        var subject = $"New Feedback from {userName}";
        var body = $"<p>Rating: {rating}</p><p>Comments: {comments}</p>";
        await SendEmailAsync(_settings.AdminEmail, subject, body, isHtml: true);
    }
}
