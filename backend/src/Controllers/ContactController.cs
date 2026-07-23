using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.Models.Dtos;
using RecruitmentPlatform.API.Models.Dtos.Contact;
using RecruitmentPlatform.API.Services;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public ContactController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<ActionResult<ContactResponseDto>> SendContactEmail([FromBody] ContactRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ContactResponseDto
                {
                    Success = false,
                    Message = "Invalid input data provided."
                });
            }

            try
            {
                // Unpack request fields to match the 5 parameter signature in IEmailService
                await _emailService.SendContactEmailAsync(
                    request.name,
                    request.email,
                    request.phone ?? string.Empty,
                    request.subject ?? string.Empty,
                    request.message
                );

                return Ok(new ContactResponseDto
                {
                    Success = true,
                    Message = "Feedback sent successfully."
                });
            }
            catch (Exception)
            {
                // Catch any SMTP or network dispatch exceptions
                return StatusCode(500, new ContactResponseDto
                {
                    Success = false,
                    Message = "Failed to dispatch email. Please try again later."
                });
            }
        }
    }
}