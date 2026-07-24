namespace RecruitmentPlatform.API.Models
{
    public class RecruiterHmAssignment
    {
        public int RecruiterId { get; set; }
        public int HiringManagerId { get; set; }
        public DateTime? AssignedDate { get; set; } = DateTime.UtcNow;
        public string? Status { get; set; } = "Active";
    }
}