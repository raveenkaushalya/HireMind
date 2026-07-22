namespace RecruitmentPlatform.API.DTOs.Candidate
{
    public class CandidateResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public string? CurrentJobTitle { get; set; }
        public string? ExperienceLevel { get; set; }
        public string? Education { get; set; }
        public string? Skills { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? ResumeUrl { get; set; }
        public string? Bio { get; set; }
        public int? RecruiterId { get; set; }
        public int? UserId { get; set; }
    }
}
