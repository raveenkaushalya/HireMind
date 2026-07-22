using RecruitmentPlatform.API.DTOs.Recruiter;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;

namespace RecruitmentPlatform.API.Services
{
    public class RecruiterService : IRecruiterService
    {
        private readonly IRecruiterRepository _repo;
        private readonly IEmailService _emailService;

        public RecruiterService(IRecruiterRepository repo, IEmailService emailService)
        {
            _repo = repo;
            _emailService = emailService;
        }

        public async Task<IEnumerable<RecruiterResponseDto>> GetAllAsync()
        {
            var recruiters = await _repo.GetAllAsync();
            return recruiters.Select(MapToDto);
        }

        public async Task<RecruiterResponseDto?> GetByIdAsync(int id)
        {
            var recruiter = await _repo.GetByIdAsync(id);
            return recruiter == null ? null : MapToDto(recruiter);
        }

        public async Task<RecruiterResponseDto> CreateAsync(RecruiterRequestDto dto)
        {
            var recruiter = new Recruiter
            {
                Name = dto.Name,
                Email = dto.Email,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Pending" : dto.Status,
                UserId = dto.UserId,
                JoinedDate = DateTime.UtcNow,
                RegistrationToken = Guid.NewGuid().ToString("N"),
                TokenExpiry = DateTime.UtcNow.AddDays(7)
            };

            await _repo.AddAsync(recruiter);

            // Send password setup email to recruiter
            var setupLink = $"http://localhost:5173/?recruiterSetupToken={recruiter.RegistrationToken}";
            
            var emailBody = $@"
                <h2>Welcome to HireMinds, {recruiter.Name}!</h2>
                <p>You have been added as a recruiter on our platform.</p>
                <p>Please click the link below to set up your password and complete your registration:</p>
                <p><a href='{setupLink}'>Set Up Password</a></p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p>{setupLink}</p>
                <p>This link will expire in 7 days.</p>
                <br/>
                <p>Best regards,<br/>The HireMinds Team</p>
            ";

            try
            {
                await _emailService.SendEmailAsync(recruiter.Email, "HireMinds Recruiter Registration", emailBody);
            }
            catch (Exception ex)
            {
                // Rethrow to bubble up the 500 error!
                throw new InvalidOperationException($"Failed to send SMTP email to {recruiter.Email}. Error: {ex.Message}", ex);
            }

            return MapToDto(recruiter);
        }

        public async Task<RecruiterResponseDto?> UpdateAsync(int id, RecruiterRequestDto dto)
        {
            var recruiter = await _repo.GetByIdAsync(id);
            if (recruiter == null) return null;

            recruiter.Name = dto.Name;
            recruiter.Email = dto.Email;
            recruiter.Status = string.IsNullOrWhiteSpace(dto.Status) ? recruiter.Status : dto.Status;
            recruiter.UserId = dto.UserId;

            await _repo.UpdateAsync(recruiter);
            return MapToDto(recruiter);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var recruiter = await _repo.GetByIdAsync(id);
            if (recruiter == null) return false;

            await _repo.DeleteAsync(recruiter);
            return true;
        }

        private static RecruiterResponseDto MapToDto(Recruiter r) => new()
        {
            Id = r.Id,
            Name = r.Name,
            Email = r.Email,
            JoinedDate = r.JoinedDate,
            Status = r.Status,
            UserId = r.UserId
        };
    }
}
