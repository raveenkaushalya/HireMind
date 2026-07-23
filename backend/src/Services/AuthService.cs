using Microsoft.IdentityModel.Tokens;
using RecruitmentPlatform.API.DTOs.Auth;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;
using RecruitmentPlatform.API.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RecruitmentPlatform.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly ICompanyRepository _companyRepo;
        private readonly IRecruiterRepository _recruiterRepo;
        private readonly IHiringManagerRepository _hiringManagerRepo;
        private readonly IConfiguration _config;

        public AuthService(IUserRepository userRepo, ICompanyRepository companyRepo, IRecruiterRepository recruiterRepo, IHiringManagerRepository hiringManagerRepo, IConfiguration config)
        {
            _userRepo = userRepo;
            _companyRepo = companyRepo;
            _recruiterRepo = recruiterRepo;
            _hiringManagerRepo = hiringManagerRepo;
            _config = config;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
        {
            bool exists = await _userRepo.EmailExistsAsync(dto.Email);
            if (exists)
                throw new InvalidOperationException("Email already registered.");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Role = dto.Role.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            await _userRepo.AddAsync(user);

            string token = GenerateJwtToken(user);
            return new AuthResponseDto
            {
                Token = token,
                Role = user.Role,
                Name = user.FullName ?? string.Empty,
                UserId = user.Id,
                Email = user.Email
            };
        }

        public async Task<AuthResponseDto> CreateCompanyAccountAsync(string token, string password)
        {
            var companies = await _companyRepo.GetAllAsync();
            var company = companies.FirstOrDefault(c => c.RegistrationToken == token && c.TokenExpiry > DateTime.UtcNow && c.Status == "Approved");
            
            if (company == null)
                throw new InvalidOperationException("Invalid or expired token.");
            if (string.IsNullOrEmpty(company.Email))
                throw new InvalidOperationException("Company email is not set.");
                
            bool exists = await _userRepo.EmailExistsAsync(company.Email);
            if (exists)
                throw new InvalidOperationException("Email already registered for a user account.");
                
            var user = new User
            {
                FullName = company.Name,
                Email = company.Email,
                Role = "Company",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };
            
            await _userRepo.AddAsync(user);
            
            company.UserId = user.Id;
            company.RegistrationToken = null;
            company.TokenExpiry = null;
            await _companyRepo.UpdateAsync(company);
            
            string jwtToken = GenerateJwtToken(user);
            return new AuthResponseDto
            {
                Token = jwtToken,
                Role = user.Role,
                Name = user.FullName ?? string.Empty,
                UserId = user.Id,
                Email = user.Email
            };
        }

        public async Task<AuthResponseDto> CreateRecruiterAccountAsync(string token, string password)
        {
            var recruiters = await _recruiterRepo.GetAllAsync();
            var recruiter = recruiters.FirstOrDefault(r => r.RegistrationToken == token && r.TokenExpiry > DateTime.UtcNow && r.Status == "Pending");
            
            if (recruiter == null)
                throw new InvalidOperationException("Invalid or expired token.");
            if (string.IsNullOrEmpty(recruiter.Email))
                throw new InvalidOperationException("Recruiter email is not set.");
                
            bool exists = await _userRepo.EmailExistsAsync(recruiter.Email);
            if (exists)
                throw new InvalidOperationException("Email already registered for a user account.");
                
            var user = new User
            {
                FullName = recruiter.Name,
                Email = recruiter.Email,
                Role = "Recruiter",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };
            
            await _userRepo.AddAsync(user);
            
            recruiter.UserId = user.Id;
            recruiter.RegistrationToken = null;
            recruiter.TokenExpiry = null;
            recruiter.Status = "Active";
            await _recruiterRepo.UpdateAsync(recruiter);
            
            string jwtToken = GenerateJwtToken(user);
            return new AuthResponseDto
            {
                Token = jwtToken,
                Role = user.Role,
                Name = user.FullName ?? string.Empty,
                UserId = user.Id,
                Email = user.Email
            };
        }

        public async Task<AuthResponseDto> CreateHiringManagerAccountAsync(string token, string password)
        {
            var managers = await _hiringManagerRepo.GetAllAsync();
            var manager = managers.FirstOrDefault(m => m.RegistrationToken == token && m.TokenExpiry > DateTime.UtcNow && m.Status == "Pending");
            
            if (manager == null)
                throw new InvalidOperationException("Invalid or expired token.");
            if (string.IsNullOrEmpty(manager.Email))
                throw new InvalidOperationException("Hiring Manager email is not set.");
                
            bool exists = await _userRepo.EmailExistsAsync(manager.Email);
            if (exists)
                throw new InvalidOperationException("Email already registered for a user account.");
                
            var user = new User
            {
                FullName = manager.Name,
                Email = manager.Email,
                Role = "HiringManager", // Or whatever the role is defined as
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };
            
            await _userRepo.AddAsync(user);
            
            manager.UserId = user.Id;
            manager.RegistrationToken = null;
            manager.TokenExpiry = null;
            manager.Status = "Active";
            await _hiringManagerRepo.UpdateAsync(manager);
            
            string jwtToken = GenerateJwtToken(user);
            return new AuthResponseDto
            {
                Token = jwtToken,
                Role = user.Role,
                Name = user.FullName ?? string.Empty,
                UserId = user.Id,
                Email = user.Email
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password.");

            string token = GenerateJwtToken(user);
            return new AuthResponseDto
            {
                Token = token,
                Role = user.Role,
                Name = user.FullName ?? string.Empty,
                UserId = user.Id,
                Email = user.Email
            };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
