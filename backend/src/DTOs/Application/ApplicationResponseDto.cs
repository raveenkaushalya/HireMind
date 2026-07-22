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
    }
}
