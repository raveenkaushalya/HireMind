using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public class HiringManagerRepository : Repository<HiringManager>, IHiringManagerRepository
    {
        public HiringManagerRepository(AppDbContext db) : base(db) { }

        public override async Task<IEnumerable<HiringManager>> GetAllAsync()
        {
            return await _dbSet.OrderByDescending(h => h.Id).ToListAsync();
        }

        public async Task<IEnumerable<HiringManager>> GetByCompanyIdAsync(int companyId)
        {
            return await _dbSet.Where(h => h.CompanyId == companyId)
                               .OrderByDescending(h => h.Id)
                               .ToListAsync();
        }

        public async Task<HiringManager?> GetByUserIdAsync(int userId)
        {
            return await _dbSet.FirstOrDefaultAsync(h => h.UserId == userId);
        }
    }
}
