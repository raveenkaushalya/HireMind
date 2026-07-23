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

    public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true, byte[]? calendarAttachmentContent = null, string? replyToEmail = null, string? replyToName = null)
    {
        var message = new System.Net.Mail.MailMessage
        {
            From = new System.Net.Mail.MailAddress(_settings.SenderEmail, _settings.SenderName),
            Subject = subject,
            Body = body,
            IsBodyHtml = isHtml
        };
        message.To.Add(new System.Net.Mail.MailAddress(toEmail));

        // Set Reply-To header if provided (useful for contact forms)
        if (!string.IsNullOrWhiteSpace(replyToEmail))
        {
            message.ReplyToList.Add(new System.Net.Mail.MailAddress(replyToEmail, replyToName));
        }

        if (calendarAttachmentContent != null)
        {
            var ms = new System.IO.MemoryStream(calendarAttachmentContent);
            var attachment = new System.Net.Mail.Attachment(ms, "invite.ics", "text/calendar");
            message.Attachments.Add(attachment);
        }

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

    // ContactUs Implementation
    public async Task SendContactEmailAsync(string name, string email, string phone, string subject, string message)
    {
        var emailSubject = string.IsNullOrWhiteSpace(subject)
            ? $"New Contact Form Submission from {name}"
            : $"Contact Us: {subject}";

        var phoneDisplay = string.IsNullOrWhiteSpace(phone) ? "N/A" : phone;
        var subjectDisplay = string.IsNullOrWhiteSpace(subject) ? "N/A" : subject;

        var body = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;'>
                <h2 style='color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;'>New Feedback Submission</h2>
                
                <table style='width: 100%; border-collapse: collapse; margin-top: 15px;'>
                    <tr>
                        <td style='padding: 8px 0; font-weight: bold; width: 120px;'>Full Name:</td>
                        <td style='padding: 8px 0;'>{name}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; font-weight: bold;'>Email:</td>
                        <td style='padding: 8px 0;'><a href='mailto:{email}'>{email}</a></td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; font-weight: bold;'>Phone:</td>
                        <td style='padding: 8px 0;'>{phoneDisplay}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; font-weight: bold;'>Subject:</td>
                        <td style='padding: 8px 0;'>{subjectDisplay}</td>
                    </tr>
                </table>

                <div style='margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #4f46e5; border-radius: 4px;'>
                    <p style='margin: 0 0 8px 0; font-weight: bold;'>Message:</p>
                    <p style='margin: 0; white-space: pre-line;'>{message}</p>
                </div>
            </div>";

        // Send to admin email and attach user email/name as Reply-To
        await SendEmailAsync(
            toEmail: _settings.AdminEmail,
            subject: emailSubject,
            body: body,
            isHtml: true,
            replyToEmail: email,
            replyToName: name
        );
    }
}