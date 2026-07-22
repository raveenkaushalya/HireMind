namespace RecruitmentPlatform.API.Models
{
    public class Recruiter
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PasswordHash { get; set; }
        public DateTime? JoinedDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Active";
        public string? RegistrationToken { get; set; }
        public DateTime? TokenExpiry { get; set; }
    }
}