namespace RecruitmentPlatform.API.DTOs.HiringManager
{
    public class HiringManagerRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string Email { get; set; } = string.Empty;
        public int? CompanyId { get; set; }
        public int? UserId { get; set; }
    }
}
