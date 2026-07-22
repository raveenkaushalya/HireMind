namespace RecruitmentPlatform.API.DTOs.Recruiter
{
    public class RecruiterResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime? JoinedDate { get; set; }
        public string Status { get; set; } = "Active";
        public int? UserId { get; set; }
    }
}
