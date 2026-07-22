using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public class ApplicationRepository : Repository<Application>, IApplicationRepository
    {
        public ApplicationRepository(AppDbContext db) : base(db) { }

        public async Task<IEnumerable<Application>> GetAllWithDetailsAsync()
        {
            return await _dbSet
                .Include(a => a.Candidate)
                .Include(a => a.JobPosting)
                .OrderByDescending(a => a.DateSubmitted)
                .ToListAsync();
        }

        public async Task<IEnumerable<Application>> GetByCandidateIdAsync(int candidateId)
        {
            return await _dbSet.Where(a => a.CandidateId == candidateId)
                               .Include(a => a.JobPosting)
                               .OrderByDescending(a => a.DateSubmitted)
                               .ToListAsync();
        }

        public async Task<IEnumerable<Application>> GetByJobIdAsync(int jobPostingId)
        {
            return await _dbSet.Where(a => a.JobPostingId == jobPostingId)
                               .Include(a => a.Candidate)
                               .OrderByDescending(a => a.DateSubmitted)
                               .ToListAsync();
        }
    }
}
