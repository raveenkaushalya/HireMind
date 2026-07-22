using RecruitmentPlatform.API.DTOs.User;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;

namespace RecruitmentPlatform.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo) => _repo = repo;

        public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
        {
            var users = await _repo.GetAllAsync();
            return users.Select(MapToDto);
        }

        public async Task<UserResponseDto?> GetByIdAsync(int id)
        {
            var user = await _repo.GetByIdAsync(id);
            return user == null ? null : MapToDto(user);
        }

        public async Task<bool> ToggleActiveAsync(int id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null) return false;

            user.IsActive = !user.IsActive;
            await _repo.UpdateAsync(user);
            return true;
        }

        private static UserResponseDto MapToDto(User u) => new()
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt
        };
    }
}
