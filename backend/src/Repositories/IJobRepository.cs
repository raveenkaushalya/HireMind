using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public interface IJobRepository : IRepository<JobPosting>
    {
        Task<IEnumerable<JobPosting>> SearchAsync(string? location, string? keyword, string? status);
        Task<IEnumerable<JobPosting>> GetByCompanyIdAsync(int companyId);
    }
}
