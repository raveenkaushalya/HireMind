using RecruitmentPlatform.API.DTOs.Application;

namespace RecruitmentPlatform.API.Services
{
    public interface IApplicationService
    {
        Task<IEnumerable<ApplicationResponseDto>> GetAllAsync();
        Task<ApplicationResponseDto?> GetByIdAsync(int id);
        Task<IEnumerable<ApplicationResponseDto>> GetByCandidateIdAsync(int candidateId);
        Task<IEnumerable<ApplicationResponseDto>> GetByJobIdAsync(int jobPostingId);
        Task<ApplicationResponseDto> CreateAsync(ApplicationRequestDto dto);
        Task<ApplicationResponseDto?> UpdateStageAsync(int id, string newStage, int userId);
    }
}
