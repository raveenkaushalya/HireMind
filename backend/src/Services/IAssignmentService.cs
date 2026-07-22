using RecruitmentPlatform.API.DTOs.Assignment;

namespace RecruitmentPlatform.API.Services
{
    public interface IAssignmentService
    {
        Task<IEnumerable<AssignmentResponseDto>> GetAllAsync();
        Task<AssignmentResponseDto> CreateAsync(AssignmentRequestDto dto);
        Task<bool> DeleteAsync(int recruiterId, int hiringManagerId);
    }
}
