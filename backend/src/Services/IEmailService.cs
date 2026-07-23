namespace RecruitmentPlatform.API.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(
            string toEmail,
            string subject,
            string body,
            bool isHtml = true,
            byte[]? calendarAttachmentContent = null,
            string? replyToEmail = null,
            string? replyToName = null
        );

        Task SendPasswordTokenAsync(string userEmail, string tokenUrl);

        Task SendFeedbackToAdminAsync(string userEmail, string userName, string rating, string comments);

        Task SendContactEmailAsync(string name, string email, string phone, string subject, string message);
    }
}