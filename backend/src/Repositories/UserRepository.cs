using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext db) : base(db) { }

        public override async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbSet.OrderByDescending(u => u.Id).ToListAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email == email);
        }
    }
}
