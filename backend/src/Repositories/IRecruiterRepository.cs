using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public interface IRecruiterRepository : IRepository<Recruiter>
    {
        Task<Recruiter?> GetByUserIdAsync(int userId);
        Task<IEnumerable<Recruiter>> GetByStatusAsync(string status);
    }
}
