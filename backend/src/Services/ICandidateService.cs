using RecruitmentPlatform.API.DTOs.Candidate;

namespace RecruitmentPlatform.API.Services
{
    public interface ICandidateService
    {
        Task<IEnumerable<CandidateResponseDto>> GetAllAsync();
        Task<CandidateResponseDto?> GetByIdAsync(int id);
        Task<CandidateResponseDto?> GetByUserIdAsync(int userId);
        Task<IEnumerable<CandidateResponseDto>> GetByRecruiterIdAsync(int recruiterId);
        Task<CandidateResponseDto> CreateAsync(CandidateRequestDto dto);
        Task<CandidateResponseDto?> UpdateAsync(int id, CandidateRequestDto dto);
        Task<bool> DeleteAsync(int id);

        // ADD THIS:
        Task<CandidateResponseDto?> UpdateResumeAsync(int id, string resumeUrl);
    }
}
