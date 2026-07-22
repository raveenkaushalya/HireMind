using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public class CandidateRepository : Repository<Candidate>, ICandidateRepository
    {
        public CandidateRepository(AppDbContext db) : base(db) { }

        public override async Task<IEnumerable<Candidate>> GetAllAsync()
        {
            return await _dbSet.OrderByDescending(c => c.Id).ToListAsync();
        }

        public async Task<IEnumerable<Candidate>> GetByRecruiterIdAsync(int recruiterId)
        {
            return await _dbSet.Where(c => c.RecruiterId == recruiterId)
                               .OrderByDescending(c => c.Id)
                               .ToListAsync();
        }

        public async Task<Candidate?> GetByUserIdAsync(int userId)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.UserId == userId);
        }
    }
}
