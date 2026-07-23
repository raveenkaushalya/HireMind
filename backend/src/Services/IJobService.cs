using RecruitmentPlatform.API.DTOs.Job;

namespace RecruitmentPlatform.API.Services
{
    public interface IJobService
    {
        Task<IEnumerable<JobResponseDto>> SearchAsync(string? location, string? keyword, string? status);
        Task<JobResponseDto?> GetByIdAsync(int id);
        Task<IEnumerable<JobResponseDto>> GetByCompanyIdAsync(int companyId);
        Task<JobResponseDto> CreateAsync(JobRequestDto dto);
        Task<JobResponseDto?> UpdateAsync(int id, JobRequestDto dto);
        Task<bool> CloseAsync(int id);
        Task<bool> ChangeStatusAsync(int id, string status);
    }
}
