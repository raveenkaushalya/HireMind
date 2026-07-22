using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Repositories
{
    /// <summary>
    /// Generic repository interface providing common CRUD operations for all entities.
    /// </summary>
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task<bool> ExistsAsync(int id);
    }
}
