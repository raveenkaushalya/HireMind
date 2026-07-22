using RecruitmentPlatform.API.DTOs.Company;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;

namespace RecruitmentPlatform.API.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _repo;
        private readonly Data.AppDbContext _context;
        private readonly IEmailService _emailService;

        public CompanyService(ICompanyRepository repo, Data.AppDbContext context, IEmailService emailService)
        {
            _repo = repo;
            _context = context;
            _emailService = emailService;
        }

        public async Task<IEnumerable<CompanyResponseDto>> GetAllAsync()
        {
            var companies = await _repo.GetAllAsync();
            return companies.Select(MapToDto);
        }

        public async Task<CompanyResponseDto?> GetByIdAsync(int id)
        {
            var company = await _repo.GetByIdAsync(id);
            return company == null ? null : MapToDto(company);
        }

        public async Task<CompanyResponseDto?> GetByUserIdAsync(int userId)
        {
            var company = await _repo.GetByUserIdAsync(userId);
            return company == null ? null : MapToDto(company);
        }

        public async Task<CompanyResponseDto> CreateAsync(CompanyRequestDto dto)
        {
            if (!string.IsNullOrEmpty(dto.Email))
            {
                var isBlacklisted = _context.BlacklistedEmails.Any(b => b.Email == dto.Email);
                if (isBlacklisted)
                    throw new InvalidOperationException("This email has been blacklisted.");
            }

            var company = new Company
            {
                Name = dto.Name,
                Industry = dto.Industry,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Location = dto.Location,
                Size = dto.Size,
                Description = dto.Description,
                ContactPersonName = dto.ContactPersonName,
                ContactPersonNumber = dto.ContactPersonNumber,
                ProofDocumentsMetadataLink = dto.ProofDocumentsMetadataLink,
                UserId = dto.UserId,
                Status = "Pending"
            };

            await _repo.AddAsync(company);
            return MapToDto(company);
        }

        public async Task<CompanyResponseDto?> UpdateAsync(int id, CompanyRequestDto dto)
        {
            var company = await _repo.GetByIdAsync(id);
            if (company == null) return null;

            company.Name = dto.Name;
            company.Industry = dto.Industry;
            company.Email = dto.Email;
            company.PhoneNumber = dto.PhoneNumber;
            company.Location = dto.Location;
            company.Size = dto.Size;
            company.Description = dto.Description;
            company.ContactPersonName = dto.ContactPersonName;
            company.ContactPersonNumber = dto.ContactPersonNumber;
            company.ProofDocumentsMetadataLink = dto.ProofDocumentsMetadataLink;
            company.UserId = dto.UserId;

            await _repo.UpdateAsync(company);
            return MapToDto(company);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var company = await _repo.GetByIdAsync(id);
            if (company == null) return false;

            await _repo.DeleteAsync(company);
            return true;
        }

        public async Task<CompanyResponseDto?> ApproveCompanyAsync(int id)
        {
            var company = await _repo.GetByIdAsync(id);
            if (company == null || company.Status != "Pending") return null;

            company.Status = "Approved";
            company.RegistrationToken = Guid.NewGuid().ToString();
            company.TokenExpiry = DateTime.UtcNow.AddHours(1);

            await _repo.UpdateAsync(company);

            if (!string.IsNullOrEmpty(company.Email))
            {
                string tokenUrl = $"http://localhost:5173/?companySetupToken={company.RegistrationToken}";
                await _emailService.SendPasswordTokenAsync(company.Email, tokenUrl);
            }

            return MapToDto(company);
        }

        public async Task<bool> RejectCompanyAsync(int id, string? reason)
        {
            var company = await _repo.GetByIdAsync(id);
            if (company == null || company.Status != "Pending") return false;

            company.Status = "Rejected";
            await _repo.UpdateAsync(company);

            if (!string.IsNullOrEmpty(company.Email))
            {
                var blacklisted = new BlacklistedEmail
                {
                    Email = company.Email,
                    Reason = reason ?? "Company application rejected",
                    BlacklistedAt = DateTime.UtcNow
                };
                _context.BlacklistedEmails.Add(blacklisted);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<CompanyResponseDto?> GetByRegistrationTokenAsync(string token)
        {
            var companies = await _repo.GetAllAsync();
            var company = companies.FirstOrDefault(c => c.RegistrationToken == token && c.TokenExpiry > DateTime.UtcNow);
            return company == null ? null : MapToDto(company);
        }

        private static CompanyResponseDto MapToDto(Company c) => new()
        {
            Id = c.Id,
            Name = c.Name,
            Industry = c.Industry,
            Email = c.Email,
            PhoneNumber = c.PhoneNumber,
            Location = c.Location,
            Size = c.Size,
            Description = c.Description,
            ContactPersonName = c.ContactPersonName,
            ContactPersonNumber = c.ContactPersonNumber,
            ProofDocumentsMetadataLink = c.ProofDocumentsMetadataLink,
            UserId = c.UserId,
            Status = c.Status,
            RegistrationToken = c.RegistrationToken,
            TokenExpiry = c.TokenExpiry
        };
    }
}
