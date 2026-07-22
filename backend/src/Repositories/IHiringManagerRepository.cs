using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public interface IHiringManagerRepository : IRepository<HiringManager>
    {
        Task<IEnumerable<HiringManager>> GetByCompanyIdAsync(int companyId);
        Task<HiringManager?> GetByUserIdAsync(int userId);
    }
}
