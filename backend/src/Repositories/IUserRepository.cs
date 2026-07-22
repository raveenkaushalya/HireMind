using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
    }
}
