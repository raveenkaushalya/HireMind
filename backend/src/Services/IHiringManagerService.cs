using RecruitmentPlatform.API.DTOs.HiringManager;

namespace RecruitmentPlatform.API.Services
{
    public interface IHiringManagerService
    {
        Task<IEnumerable<HiringManagerResponseDto>> GetAllAsync();
        Task<HiringManagerResponseDto?> GetByIdAsync(int id);
        Task<IEnumerable<HiringManagerResponseDto>> GetByCompanyIdAsync(int companyId);
        Task<HiringManagerResponseDto> CreateAsync(HiringManagerRequestDto dto);
        Task<HiringManagerResponseDto?> UpdateAsync(int id, HiringManagerRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
