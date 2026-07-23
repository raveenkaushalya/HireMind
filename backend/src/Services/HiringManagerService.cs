using RecruitmentPlatform.API.DTOs.HiringManager;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;

namespace RecruitmentPlatform.API.Services
{
    public class HiringManagerService : IHiringManagerService
    {
        private readonly IHiringManagerRepository _repo;
        private readonly IEmailService _emailService;

        public HiringManagerService(IHiringManagerRepository repo, IEmailService emailService)
        {
            _repo = repo;
            _emailService = emailService;
        }

        public async Task<IEnumerable<HiringManagerResponseDto>> GetAllAsync()
        {
            var managers = await _repo.GetAllAsync();
            return managers.Select(MapToDto);
        }

        public async Task<HiringManagerResponseDto?> GetByIdAsync(int id)
        {
            var manager = await _repo.GetByIdAsync(id);
            return manager == null ? null : MapToDto(manager);
        }

        public async Task<HiringManagerResponseDto?> GetByUserIdAsync(int userId)
        {
            var manager = await _repo.GetByUserIdAsync(userId);
            return manager == null ? null : MapToDto(manager);
        }

        public async Task<IEnumerable<HiringManagerResponseDto>> GetByCompanyIdAsync(int companyId)
        {
            var managers = await _repo.GetByCompanyIdAsync(companyId);
            return managers.Select(MapToDto);
        }

        public async Task<HiringManagerResponseDto> CreateAsync(HiringManagerRequestDto dto)
        {
            var manager = new HiringManager
            {
                Name = dto.Name,
                Department = dto.Department,
                Email = dto.Email,
                CompanyId = dto.CompanyId,
                UserId = dto.UserId,
                JoinedDate = DateTime.UtcNow,
                RegistrationToken = Guid.NewGuid().ToString("N"),
                TokenExpiry = DateTime.UtcNow.AddDays(7),
                Status = "Pending"
            };

            await _repo.AddAsync(manager);

            var setupLink = $"http://localhost:5173/?hiringManagerSetupToken={manager.RegistrationToken}";
            
            var emailBody = $@"
                <h2>Welcome to HireMinds, {manager.Name}!</h2>
                <p>You have been added as a hiring manager on our platform.</p>
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
                await _emailService.SendEmailAsync(manager.Email, "HireMinds Hiring Manager Registration", emailBody);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to send SMTP email to {manager.Email}. Error: {ex.Message}", ex);
            }

            return MapToDto(manager);
        }

        public async Task<HiringManagerResponseDto?> UpdateAsync(int id, HiringManagerRequestDto dto)
        {
            var manager = await _repo.GetByIdAsync(id);
            if (manager == null) return null;

            manager.Name = dto.Name;
            manager.Department = dto.Department;
            manager.Email = dto.Email;
            manager.CompanyId = dto.CompanyId;
            manager.UserId = dto.UserId;

            await _repo.UpdateAsync(manager);
            return MapToDto(manager);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var manager = await _repo.GetByIdAsync(id);
            if (manager == null) return false;

            await _repo.DeleteAsync(manager);
            return true;
        }

        private static HiringManagerResponseDto MapToDto(HiringManager h) => new()
        {
            Id = h.Id,
            Name = h.Name,
            Department = h.Department,
            Email = h.Email,
            CompanyId = h.CompanyId,
            UserId = h.UserId,
            JoinedDate = h.JoinedDate,
            Status = h.Status,
            CompanyName = h.Company?.Name
        };
    }
}
