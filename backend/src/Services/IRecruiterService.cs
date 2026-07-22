using RecruitmentPlatform.API.DTOs.Recruiter;

namespace RecruitmentPlatform.API.Services
{
    public interface IRecruiterService
    {
        Task<IEnumerable<RecruiterResponseDto>> GetAllAsync();
        Task<RecruiterResponseDto?> GetByIdAsync(int id);
        Task<RecruiterResponseDto> CreateAsync(RecruiterRequestDto dto);
        Task<RecruiterResponseDto?> UpdateAsync(int id, RecruiterRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
