namespace RecruitmentPlatform.API.DTOs.HiringManager
{
    public class HiringManagerResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string Email { get; set; } = string.Empty;
        public int? CompanyId { get; set; }
        public int? UserId { get; set; }
        public DateTime? JoinedDate { get; set; }
        public string Status { get; set; } = "Pending";
        public string? CompanyName { get; set; }
    }
}
