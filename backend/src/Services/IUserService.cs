using RecruitmentPlatform.API.DTOs.User;

namespace RecruitmentPlatform.API.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponseDto>> GetAllAsync();
        Task<UserResponseDto?> GetByIdAsync(int id);
        Task<bool> ToggleActiveAsync(int id);
    }
}
