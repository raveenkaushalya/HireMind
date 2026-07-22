namespace RecruitmentPlatform.API.DTOs.Recruiter
{
    public class RecruiterRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Status { get; set; }
        public int? UserId { get; set; }
    }
}
