namespace RecruitmentPlatform.API.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true);
        Task SendPasswordTokenAsync(string userEmail, string tokenUrl);
        Task SendFeedbackToAdminAsync(string userEmail, string userName, string rating, string comments);
    }

}
