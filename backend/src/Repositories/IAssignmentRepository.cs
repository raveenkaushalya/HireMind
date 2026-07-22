using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public interface IAssignmentRepository
    {
        Task<IEnumerable<RecruiterHmAssignment>> GetAllAsync();
        Task<RecruiterHmAssignment?> GetByIdAsync(int recruiterId, int hiringManagerId);
        Task<IEnumerable<RecruiterHmAssignment>> GetByRecruiterIdAsync(int recruiterId);
        Task<IEnumerable<RecruiterHmAssignment>> GetByHiringManagerIdAsync(int hiringManagerId);
        Task<RecruiterHmAssignment> AddAsync(RecruiterHmAssignment entity);
        Task DeleteAsync(RecruiterHmAssignment entity);
    }
}
