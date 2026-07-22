using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public interface ICandidateRepository : IRepository<Candidate>
    {
        Task<IEnumerable<Candidate>> GetByRecruiterIdAsync(int recruiterId);
        Task<Candidate?> GetByUserIdAsync(int userId);
    }
}
