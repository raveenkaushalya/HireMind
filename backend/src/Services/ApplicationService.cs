using RecruitmentPlatform.API.DTOs.Application;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;

namespace RecruitmentPlatform.API.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _repo;
        private readonly IAuditService _auditService;
        private readonly IJobRepository _jobRepo;

        public ApplicationService(IApplicationRepository repo, IAuditService auditService, IJobRepository jobRepo)
        {
            _repo = repo;
            _auditService = auditService;
            _jobRepo = jobRepo;
        }

        public async Task<IEnumerable<ApplicationResponseDto>> GetAllAsync()
        {
            var apps = await _repo.GetAllWithDetailsAsync();
            return apps.Select(MapToDto);
        }

        public async Task<ApplicationResponseDto?> GetByIdAsync(int id)
        {
            var app = await _repo.GetByIdAsync(id);
            return app == null ? null : MapToDto(app);
        }

        public async Task<IEnumerable<ApplicationResponseDto>> GetByCandidateIdAsync(int candidateId)
        {
            var apps = await _repo.GetByCandidateIdAsync(candidateId);
            return apps.Select(MapToDto);
        }

        public async Task<IEnumerable<ApplicationResponseDto>> GetByJobIdAsync(int jobPostingId)
        {
            var apps = await _repo.GetByJobIdAsync(jobPostingId);
            return apps.Select(MapToDto);
        }

        public async Task<ApplicationResponseDto> CreateAsync(ApplicationRequestDto dto)
        {
            var app = new Application
            {
                CandidateId = dto.CandidateId,
                JobPostingId = dto.JobPostingId,
                Status = "Applied",
                DateSubmitted = DateTime.UtcNow
            };

            await _repo.AddAsync(app);

            // Increment Applicants count on the job
            var job = await _jobRepo.GetByIdAsync(dto.JobPostingId);
            if (job != null)
            {
                job.Applicants += 1;
                await _jobRepo.UpdateAsync(job);
            }

            return MapToDto(app);
        }

        public async Task<ApplicationResponseDto?> UpdateStageAsync(int id, string newStage, int userId)
        {
            var app = await _repo.GetByIdAsync(id);
            if (app == null) return null;

            string oldStage = app.Status;
            app.Status = newStage;
            await _repo.UpdateAsync(app);

            await _auditService.LogAsync(userId, "Application stage changed",
                $"ApplicationId={id}, {oldStage} -> {newStage}");

            return MapToDto(app);
        }

        private static ApplicationResponseDto MapToDto(Application a) => new()
        {
            Id = a.Id,
            CandidateId = a.CandidateId,
            CandidateName = a.Candidate?.Name,
            JobPostingId = a.JobPostingId,
            JobTitle = a.JobPosting?.Title,
            Status = a.Status,
            DateSubmitted = a.DateSubmitted
        };
    }
}
