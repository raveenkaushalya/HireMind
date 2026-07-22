namespace RecruitmentPlatform.API.Models
{
    public class Company
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Industry { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public string? Size { get; set; }
        public string? Description { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactPersonNumber { get; set; }
        public string? ProofDocumentsMetadataLink { get; set; }
        public string Status { get; set; } = "Pending";
        public string? RegistrationToken { get; set; }
        public DateTime? TokenExpiry { get; set; }
    }
}