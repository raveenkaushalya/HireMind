namespace RecruitmentPlatform.API.Models
{
    public class JobPosting
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Category { get; set; } = "Engineering";
        public string Location { get; set; } = string.Empty;
        public string SalaryRange { get; set; } = string.Empty;
        public int Applicants { get; set; }
        public string? YearsOfExperienceNeeded { get; set; }
        public DateTime? PostedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ClosingDate { get; set; }
        public string SkillsNeeded { get; set; } = string.Empty;
        public string DescriptionAboutTheRole { get; set; } = string.Empty;
        public string Responsibilities { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string DescriptionAboutTheCompany { get; set; } = string.Empty;
        public string? MinQualification { get; set; }
        public string Status { get; set; } = "Open";
        public bool IsUrgent { get; set; } = false;
        public Company? Company { get; set; }
    }
}
