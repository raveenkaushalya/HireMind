namespace RecruitmentPlatform.API.DTOs.Candidate
{
    public class CreateCandidateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? ResumeUrl { get; set; }
    }
}
