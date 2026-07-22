using RecruitmentPlatform.API.DTOs.HiringManager;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;

namespace RecruitmentPlatform.API.Services
{
    public class HiringManagerService : IHiringManagerService
    {
        private readonly IHiringManagerRepository _repo;

        public HiringManagerService(IHiringManagerRepository repo) => _repo = repo;

        public async Task<IEnumerable<HiringManagerResponseDto>> GetAllAsync()
        {
            var managers = await _repo.GetAllAsync();
            return managers.Select(MapToDto);
        }

        public async Task<HiringManagerResponseDto?> GetByIdAsync(int id)
        {
            var manager = await _repo.GetByIdAsync(id);
            return manager == null ? null : MapToDto(manager);
        }

        public async Task<IEnumerable<HiringManagerResponseDto>> GetByCompanyIdAsync(int companyId)
        {
            var managers = await _repo.GetByCompanyIdAsync(companyId);
            return managers.Select(MapToDto);
        }

        public async Task<HiringManagerResponseDto> CreateAsync(HiringManagerRequestDto dto)
        {
            var manager = new HiringManager
            {
                Name = dto.Name,
                Department = dto.Department,
                Email = dto.Email,
                CompanyId = dto.CompanyId,
                UserId = dto.UserId,
                JoinedDate = DateTime.UtcNow
            };

            await _repo.AddAsync(manager);
            return MapToDto(manager);
        }

        public async Task<HiringManagerResponseDto?> UpdateAsync(int id, HiringManagerRequestDto dto)
        {
            var manager = await _repo.GetByIdAsync(id);
            if (manager == null) return null;

            manager.Name = dto.Name;
            manager.Department = dto.Department;
            manager.Email = dto.Email;
            manager.CompanyId = dto.CompanyId;
            manager.UserId = dto.UserId;

            await _repo.UpdateAsync(manager);
            return MapToDto(manager);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var manager = await _repo.GetByIdAsync(id);
            if (manager == null) return false;

            await _repo.DeleteAsync(manager);
            return true;
        }

        private static HiringManagerResponseDto MapToDto(HiringManager h) => new()
        {
            Id = h.Id,
            Name = h.Name,
            Department = h.Department,
            Email = h.Email,
            CompanyId = h.CompanyId,
            UserId = h.UserId,
            JoinedDate = h.JoinedDate
        };
    }
}
