using RecruitmentPlatform.API.DTOs.Auth;

namespace RecruitmentPlatform.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
        Task<AuthResponseDto> CreateCompanyAccountAsync(string token, string password);
        Task<AuthResponseDto> CreateRecruiterAccountAsync(string token, string password);
        Task<AuthResponseDto> CreateHiringManagerAccountAsync(string token, string password);
    }
}
