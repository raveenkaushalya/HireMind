using RecruitmentPlatform.API.DTOs.Job;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;

namespace RecruitmentPlatform.API.Services
{
    public class JobService : IJobService
    {
        private readonly IJobRepository _repo;

        public JobService(IJobRepository repo) => _repo = repo;

        public async Task<IEnumerable<JobResponseDto>> SearchAsync(string? location, string? keyword, string? status)
        {
            var jobs = await _repo.SearchAsync(location, keyword, status);
            return jobs.Select(MapToDto);
        }

        public async Task<JobResponseDto?> GetByIdAsync(int id)
        {
            var job = await _repo.GetByIdAsync(id);
            return job == null ? null : MapToDto(job);
        }

        public async Task<IEnumerable<JobResponseDto>> GetByCompanyIdAsync(int companyId)
        {
            var jobs = await _repo.GetByCompanyIdAsync(companyId);
            return jobs.Select(MapToDto);
        }

        public async Task<JobResponseDto> CreateAsync(JobRequestDto dto)
        {
            var job = new JobPosting
            {
                Title = dto.Title,
                DescriptionAboutTheRole = dto.Description,
                Category = dto.Category,
                SkillsNeeded = dto.SkillsNeeded,
                Location = dto.Location,
                SalaryRange = dto.SalaryRange,
                Type = dto.Type,
                CompanyId = dto.CompanyId,
                YearsOfExperienceNeeded = dto.YearsOfExperienceNeeded,
                ClosingDate = dto.ClosingDate,
                DescriptionAboutTheCompany = dto.DescriptionAboutTheCompany ?? string.Empty,
                Responsibilities = dto.Responsibilities ?? string.Empty,
                Requirements = dto.Requirements ?? string.Empty,
                MinQualification = dto.MinQualification ?? string.Empty,
                Status = dto.Status ?? "Open",
                IsUrgent = dto.IsUrgent,
                PostedDate = DateTime.UtcNow
            };

            await _repo.AddAsync(job);
            return MapToDto(job);
        }

        public async Task<JobResponseDto?> UpdateAsync(int id, JobRequestDto dto)
        {
            var job = await _repo.GetByIdAsync(id);
            if (job == null) return null;

            job.Title = dto.Title;
            job.DescriptionAboutTheRole = dto.Description;
            job.Category = dto.Category;
            job.SkillsNeeded = dto.SkillsNeeded;
            job.Location = dto.Location;
            job.SalaryRange = dto.SalaryRange;
            job.Type = dto.Type;
            job.CompanyId = dto.CompanyId;
            job.YearsOfExperienceNeeded = dto.YearsOfExperienceNeeded;
            job.ClosingDate = dto.ClosingDate;
            job.DescriptionAboutTheCompany = dto.DescriptionAboutTheCompany ?? job.DescriptionAboutTheCompany;
            job.Responsibilities = dto.Responsibilities ?? job.Responsibilities;
            job.Requirements = dto.Requirements ?? job.Requirements;
            job.MinQualification = dto.MinQualification ?? job.MinQualification;
            job.Status = dto.Status ?? job.Status;
            job.IsUrgent = dto.IsUrgent;

            await _repo.UpdateAsync(job);
            return MapToDto(job);
        }

        public async Task<bool> CloseAsync(int id)
        {
            var job = await _repo.GetByIdAsync(id);
            if (job == null) return false;

            await _repo.DeleteAsync(job);
            return true;
        }

        public async Task<bool> ChangeStatusAsync(int id, string status)
        {
            var job = await _repo.GetByIdAsync(id);
            if (job == null) return false;

            job.Status = status;
            await _repo.UpdateAsync(job);
            return true;
        }

        private static JobResponseDto MapToDto(JobPosting j) => new()
        {
            Id = j.Id,
            CompanyId = j.CompanyId,
            Title = j.Title,
            Type = j.Type,
            Category = j.Category,
            Location = j.Location,
            SalaryRange = j.SalaryRange,
            Applicants = j.Applicants,
            YearsOfExperienceNeeded = j.YearsOfExperienceNeeded,
            PostedDate = j.PostedDate,
            ClosingDate = j.ClosingDate,
            SkillsNeeded = j.SkillsNeeded,
            DescriptionAboutTheRole = j.DescriptionAboutTheRole,
            Responsibilities = j.Responsibilities,
            Requirements = j.Requirements,
            MinQualification = j.MinQualification,
            DescriptionAboutTheCompany = j.DescriptionAboutTheCompany,
            Status = j.Status,
            IsUrgent = j.IsUrgent,
            CompanyName = j.Company?.Name
        };
    }
}
