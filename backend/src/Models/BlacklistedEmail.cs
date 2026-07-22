namespace RecruitmentPlatform.API.Models
{
    public class BlacklistedEmail
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public DateTime BlacklistedAt { get; set; } = DateTime.UtcNow;
        public string? Reason { get; set; }
    }
}
