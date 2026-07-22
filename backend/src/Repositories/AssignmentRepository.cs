using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public class AssignmentRepository : IAssignmentRepository
    {
        private readonly AppDbContext _db;

        public AssignmentRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RecruiterHmAssignment>> GetAllAsync()
        {
            return await _db.RecruiterHmAssignments.ToListAsync();
        }

        public async Task<RecruiterHmAssignment?> GetByIdAsync(int recruiterId, int hiringManagerId)
        {
            return await _db.RecruiterHmAssignments.FindAsync(recruiterId, hiringManagerId);
        }

        public async Task<IEnumerable<RecruiterHmAssignment>> GetByRecruiterIdAsync(int recruiterId)
        {
            return await _db.RecruiterHmAssignments
                .Where(a => a.RecruiterId == recruiterId)
                .ToListAsync();
        }

        public async Task<IEnumerable<RecruiterHmAssignment>> GetByHiringManagerIdAsync(int hiringManagerId)
        {
            return await _db.RecruiterHmAssignments
                .Where(a => a.HiringManagerId == hiringManagerId)
                .ToListAsync();
        }

        public async Task<RecruiterHmAssignment> AddAsync(RecruiterHmAssignment entity)
        {
            await _db.RecruiterHmAssignments.AddAsync(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(RecruiterHmAssignment entity)
        {
            _db.RecruiterHmAssignments.Remove(entity);
            await _db.SaveChangesAsync();
        }
    }
}
