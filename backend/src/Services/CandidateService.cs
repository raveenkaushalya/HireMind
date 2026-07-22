using RecruitmentPlatform.API.DTOs.Candidate;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;

namespace RecruitmentPlatform.API.Services
{
    public class CandidateService : ICandidateService
    {
        private readonly ICandidateRepository _repo;

        public CandidateService(ICandidateRepository repo) => _repo = repo;

        public async Task<IEnumerable<CandidateResponseDto>> GetAllAsync()
        {
            var candidates = await _repo.GetAllAsync();
            return candidates.Select(MapToDto);
        }

        public async Task<CandidateResponseDto?> GetByIdAsync(int id)
        {
            var candidate = await _repo.GetByIdAsync(id);
            return candidate == null ? null : MapToDto(candidate);
        }

        public async Task<CandidateResponseDto?> GetByUserIdAsync(int userId)
        {
            var candidate = await _repo.GetByUserIdAsync(userId);
            return candidate == null ? null : MapToDto(candidate);
        }

        public async Task<IEnumerable<CandidateResponseDto>> GetByRecruiterIdAsync(int recruiterId)
        {
            var candidates = await _repo.GetByRecruiterIdAsync(recruiterId);
            return candidates.Select(MapToDto);
        }

        public async Task<CandidateResponseDto> CreateAsync(CandidateRequestDto dto)
        {
            var candidate = new Candidate
            {
                Name = dto.Name,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Location = dto.Location,
                CurrentJobTitle = dto.CurrentJobTitle,
                ExperienceLevel = dto.ExperienceLevel,
                Education = dto.Education,
                Skills = dto.Skills,
                LinkedinUrl = dto.LinkedinUrl,
                ResumeUrl = dto.ResumeUrl,
                Bio = dto.Bio,
                RecruiterId = dto.RecruiterId,
                UserId = dto.UserId
            };

            await _repo.AddAsync(candidate);
            return MapToDto(candidate);
        }

        public async Task<CandidateResponseDto?> UpdateAsync(int id, CandidateRequestDto dto)
        {
            var candidate = await _repo.GetByIdAsync(id);
            if (candidate == null) return null;

            candidate.Name = dto.Name;
            candidate.Email = dto.Email;
            candidate.PhoneNumber = dto.PhoneNumber;
            candidate.Location = dto.Location;
            candidate.CurrentJobTitle = dto.CurrentJobTitle;
            candidate.ExperienceLevel = dto.ExperienceLevel;
            candidate.Education = dto.Education;
            candidate.Skills = dto.Skills;
            candidate.LinkedinUrl = dto.LinkedinUrl;
            candidate.ResumeUrl = dto.ResumeUrl;
            candidate.Bio = dto.Bio;
            candidate.RecruiterId = dto.RecruiterId;
            candidate.UserId = dto.UserId;

            await _repo.UpdateAsync(candidate);
            return MapToDto(candidate);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var candidate = await _repo.GetByIdAsync(id);
            if (candidate == null) return false;

            await _repo.DeleteAsync(candidate);
            return true;
        }

        private static CandidateResponseDto MapToDto(Candidate c) => new()
        {
            Id = c.Id,
            Name = c.Name,
            Email = c.Email,
            PhoneNumber = c.PhoneNumber,
            Location = c.Location,
            CurrentJobTitle = c.CurrentJobTitle,
            ExperienceLevel = c.ExperienceLevel,
            Education = c.Education,
            Skills = c.Skills,
            LinkedinUrl = c.LinkedinUrl,
            ResumeUrl = c.ResumeUrl,
            Bio = c.Bio,
            RecruiterId = c.RecruiterId,
            UserId = c.UserId
        };
        public async Task<CandidateResponseDto?> UpdateResumeAsync(int id, string resumeUrl)
        {
            var candidate = await _repo.GetByIdAsync(id);
            if (candidate == null)
            {
                return null;
            }

            candidate.ResumeUrl = resumeUrl;

            await _repo.UpdateAsync(candidate);

            return MapToDto(candidate);
        }
    }
}
