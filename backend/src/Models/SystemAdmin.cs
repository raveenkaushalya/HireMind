namespace RecruitmentPlatform.API.Models
{
    public class SystemAdmin
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public string? PasswordHash { get; set; }
        public DateTime? JoinedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public User? User { get; set; }
    }
}
