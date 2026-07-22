namespace RecruitmentPlatform.API.Models
{
    public class Candidate
    {
        public int Id { get; set; }
        public int? RecruiterId { get; set; }
        public int? UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PasswordHash { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public string? CurrentJobTitle { get; set; }
        public string? ExperienceLevel { get; set; }
        public string? Education { get; set; }
        public string? Skills { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? ResumeUrl { get; set; }
        public string? Bio { get; set; }
    }
}