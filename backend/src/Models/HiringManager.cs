namespace RecruitmentPlatform.API.Models
{
    public class HiringManager
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? PasswordHash { get; set; }
        public DateTime? JoinedDate { get; set; } = DateTime.UtcNow;
        public string? RegistrationToken { get; set; }
        public DateTime? TokenExpiry { get; set; }
        public string Status { get; set; } = "Pending";
    }
}