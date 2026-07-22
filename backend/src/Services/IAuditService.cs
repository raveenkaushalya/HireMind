namespace RecruitmentPlatform.API.Services
{
    public interface IAuditService
    {
        // Records one audit entry: who did what, with optional extra detail
        Task LogAsync(int? userId, string action, string? details = null);
    }
}
