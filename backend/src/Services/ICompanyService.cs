using RecruitmentPlatform.API.DTOs.Company;

namespace RecruitmentPlatform.API.Services
{
    public interface ICompanyService
    {
        Task<IEnumerable<CompanyResponseDto>> GetAllAsync();
        Task<CompanyResponseDto?> GetByIdAsync(int id);
        Task<CompanyResponseDto?> GetByUserIdAsync(int userId);
        Task<CompanyResponseDto> CreateAsync(CompanyRequestDto dto);
        Task<CompanyResponseDto?> UpdateAsync(int id, CompanyRequestDto dto);
        Task<bool> DeleteAsync(int id);
        
        Task<CompanyResponseDto?> ApproveCompanyAsync(int id);
        Task<bool> RejectCompanyAsync(int id, string? reason);
        Task<CompanyResponseDto?> GetByRegistrationTokenAsync(string token);
    }
}
