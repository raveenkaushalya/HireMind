using RecruitmentPlatform.API.DTOs.Assignment;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;

namespace RecruitmentPlatform.API.Services
{
    public class AssignmentService : IAssignmentService
    {
        private readonly IAssignmentRepository _repo;

        public AssignmentService(IAssignmentRepository repo) => _repo = repo;

        public async Task<IEnumerable<AssignmentResponseDto>> GetAllAsync()
        {
            var assignments = await _repo.GetAllAsync();
            return assignments.Select(MapToDto);
        }

        public async Task<AssignmentResponseDto> CreateAsync(AssignmentRequestDto dto)
        {
            var assignment = new RecruiterHmAssignment
            {
                RecruiterId = dto.RecruiterId,
                HiringManagerId = dto.HiringManagerId,
                AssignedDate = DateTime.UtcNow,
                Status = "Active"
            };

            await _repo.AddAsync(assignment);
            return MapToDto(assignment);
        }

        public async Task<bool> DeleteAsync(int recruiterId, int hiringManagerId)
        {
            var assignment = await _repo.GetByIdAsync(recruiterId, hiringManagerId);
            if (assignment == null) return false;

            await _repo.DeleteAsync(assignment);
            return true;
        }

        private static AssignmentResponseDto MapToDto(RecruiterHmAssignment a) => new()
        {
            RecruiterId = a.RecruiterId,
            HiringManagerId = a.HiringManagerId,
            AssignedDate = a.AssignedDate,
            Status = a.Status
        };
    }
}
