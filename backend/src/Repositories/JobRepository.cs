using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public class JobRepository : Repository<JobPosting>, IJobRepository
    {
        public JobRepository(AppDbContext db) : base(db) { }

        public async Task<IEnumerable<JobPosting>> SearchAsync(string? location, string? keyword, string? status)
        {
            var query = _dbSet.Include(j => j.Company).AsQueryable();

            if (!string.IsNullOrEmpty(location))
                query = query.Where(j => j.Location.Contains(location));

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(j => j.Title.Contains(keyword)
                    || j.SkillsNeeded.Contains(keyword)
                    || j.DescriptionAboutTheRole.Contains(keyword));

            if (!string.IsNullOrEmpty(status))
                query = query.Where(j => j.Status == status);
            else
                query = query.Where(j => j.Status == "Open");

            return await query.OrderByDescending(j => j.PostedDate).ToListAsync();
        }

        public async Task<IEnumerable<JobPosting>> GetByCompanyIdAsync(int companyId)
        {
            return await _dbSet.Where(j => j.CompanyId == companyId)
                               .Include(j => j.Company)
                               .OrderByDescending(j => j.PostedDate)
                               .ToListAsync();
        }
    }
}
