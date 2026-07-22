namespace RecruitmentPlatform.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string Role { get; set; } // Admin, Candidate, Recruiter, HiringManager
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
