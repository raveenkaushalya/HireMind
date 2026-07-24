namespace RecruitmentPlatform.API.Models
{
    public class Application
    {
        public int Id { get; set; }
        public int? CandidateId { get; set; }
        public int? JobPostingId { get; set; }
        public string? Status { get; set; } = "Applied";
        public DateTime? DateSubmitted { get; set; } = DateTime.UtcNow;
        public string? RecruiterNotes { get; set; }

        public Candidate? Candidate { get; set; }
        public JobPosting? JobPosting { get; set; }
    }
}
