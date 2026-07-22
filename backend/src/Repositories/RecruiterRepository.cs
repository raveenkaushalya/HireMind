using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public class RecruiterRepository : Repository<Recruiter>, IRecruiterRepository
    {
        public RecruiterRepository(AppDbContext db) : base(db) { }

        public override async Task<IEnumerable<Recruiter>> GetAllAsync()
        {
            return await _dbSet.OrderByDescending(r => r.Id).ToListAsync();
        }

        public async Task<Recruiter?> GetByUserIdAsync(int userId)
        {
            return await _dbSet.FirstOrDefaultAsync(r => r.UserId == userId);
        }

        public async Task<IEnumerable<Recruiter>> GetByStatusAsync(string status)
        {
            return await _dbSet.Where(r => r.Status == status)
                               .OrderByDescending(r => r.Id)
                               .ToListAsync();
        }
    }
}
