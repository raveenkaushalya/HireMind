namespace RecruitmentPlatform.API.Models
{
    public class JobPosting
    {
        public int Id { get; set; }
        public int? CompanyId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Type { get; set; }
        public string Category { get; set; } = "Engineering";
        public string? Location { get; set; }
        public string? SalaryRange { get; set; }
        public int? Applicants { get; set; }
        public string? YearsOfExperienceNeeded { get; set; }
        public DateTime? PostedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ClosingDate { get; set; }
        public string? SkillsNeeded { get; set; }
        public string? DescriptionAboutTheRole { get; set; }
        public string? Responsibilities { get; set; }
        public string? Requirements { get; set; }
        public string? DescriptionAboutTheCompany { get; set; }
        public string? MinQualification { get; set; }
        public string? Status { get; set; }
        public bool IsUrgent { get; set; } = false;
        public Company? Company { get; set; }
    }
}
