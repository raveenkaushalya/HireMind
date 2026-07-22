namespace RecruitmentPlatform.API.DTOs.Assignment
{
    public class AssignmentResponseDto
    {
        public int RecruiterId { get; set; }
        public string? RecruiterName { get; set; }
        public int HiringManagerId { get; set; }
        public string? HiringManagerName { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string Status { get; set; } = "Active";
    }
}
