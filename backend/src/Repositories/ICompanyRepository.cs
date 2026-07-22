using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public interface ICompanyRepository : IRepository<Company>
    {
        Task<Company?> GetByUserIdAsync(int userId);
    }
}
