using System.ComponentModel.DataAnnotations;

namespace RecruitmentPlatform.API.Models.Dtos.Contact
{
    public class ContactRequestDto
    {
        [Required(ErrorMessage = "Full name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email address is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string email { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Invalid phone number format.")]
        public string? phone { get; set; }

        [StringLength(150, ErrorMessage = "Subject cannot exceed 150 characters.")]
        public string? subject { get; set; }

        [Required(ErrorMessage = "Message body is required.")]
        [StringLength(2000, ErrorMessage = "Message cannot exceed 2000 characters.")]
        public string message { get; set; } = string.Empty;
    }
}