using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public interface IApplicationRepository : IRepository<Application>
    {
        Task<IEnumerable<Application>> GetByCandidateIdAsync(int candidateId);
        Task<IEnumerable<Application>> GetByJobIdAsync(int jobPostingId);
        Task<IEnumerable<Application>> GetAllWithDetailsAsync();
    }
}
