namespace RecruitmentPlatform.API.DTOs.Application
{
    public class ApplicationResponseDto
    {
        public int Id { get; set; }
        public int CandidateId { get; set; }
        public string? CandidateName { get; set; }
        public int JobPostingId { get; set; }
        public string? JobTitle { get; set; }
        public string Status { get; set; } = "Applied";
        public DateTime DateSubmitted { get; set; }

        public string? CandidateEmail { get; set; }
        public string? CandidatePhone { get; set; }
        public string? CandidateLocation { get; set; }
        public string? CandidateCurrentJobTitle { get; set; }
        public string? CandidateExperienceLevel { get; set; }
        public string? CandidateEducation { get; set; }
        public string? CandidateSkills { get; set; }
        public string? CandidateResumeUrl { get; set; }
    }
}
