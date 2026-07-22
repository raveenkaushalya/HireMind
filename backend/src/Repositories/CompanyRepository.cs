using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public class CompanyRepository : Repository<Company>, ICompanyRepository
    {
        public CompanyRepository(AppDbContext db) : base(db) { }

        public override async Task<IEnumerable<Company>> GetAllAsync()
        {
            return await _dbSet.OrderByDescending(c => c.Id).ToListAsync();
        }

        public async Task<Company?> GetByUserIdAsync(int userId)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.UserId == userId);
        }
    }
}
