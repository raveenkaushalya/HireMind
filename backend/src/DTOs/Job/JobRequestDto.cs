namespace RecruitmentPlatform.API.DTOs.Job
{
    public class JobRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string RequiredSkills { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string SalaryRange { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Category { get; set; } = "Engineering";
        public string SkillsNeeded { get; set; } = string.Empty;
        public int CompanyId { get; set; }
        public string? YearsOfExperienceNeeded { get; set; }
        public DateTime? ClosingDate { get; set; }
        public string? DescriptionAboutTheCompany { get; set; }
        public string? Responsibilities { get; set; }
        public string? Requirements { get; set; }
        public string? MinQualification { get; set; }
        public string? Status { get; set; } = "Open";
    }
}
