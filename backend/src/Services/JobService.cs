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
                SkillsNeeded = dto.RequiredSkills,
                Location = dto.Location,
                SalaryRange = dto.SalaryRange,
                Type = dto.Type,
                CompanyId = dto.CompanyId,
                YearsOfExperienceNeeded = dto.YearsOfExperienceNeeded,
                ClosingDate = dto.ClosingDate,
                DescriptionAboutTheCompany = dto.DescriptionAboutTheCompany ?? string.Empty,
                Responsibilities = dto.Responsibilities ?? string.Empty,
                Requirements = dto.Requirements ?? string.Empty,
                Status = "Open",
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
            job.SkillsNeeded = dto.RequiredSkills;
            job.Location = dto.Location;
            job.SalaryRange = dto.SalaryRange;
            job.Type = dto.Type;
            job.CompanyId = dto.CompanyId;
            job.YearsOfExperienceNeeded = dto.YearsOfExperienceNeeded;
            job.ClosingDate = dto.ClosingDate;
            job.DescriptionAboutTheCompany = dto.DescriptionAboutTheCompany ?? job.DescriptionAboutTheCompany;
            job.Responsibilities = dto.Responsibilities ?? job.Responsibilities;
            job.Requirements = dto.Requirements ?? job.Requirements;

            await _repo.UpdateAsync(job);
            return MapToDto(job);
        }

        public async Task<bool> CloseAsync(int id)
        {
            var job = await _repo.GetByIdAsync(id);
            if (job == null) return false;

            job.Status = "Closed";
            await _repo.UpdateAsync(job);
            return true;
        }

        private static JobResponseDto MapToDto(JobPosting j) => new()
        {
            Id = j.Id,
            CompanyId = j.CompanyId,
            Title = j.Title,
            Type = j.Type,
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
            DescriptionAboutTheCompany = j.DescriptionAboutTheCompany,
            Status = j.Status,
            CompanyName = j.Company?.Name
        };
    }
}
