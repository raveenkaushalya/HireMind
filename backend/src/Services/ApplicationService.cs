using RecruitmentPlatform.API.DTOs.Application;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;
using Ical.Net;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Ical.Net.Serialization;

namespace RecruitmentPlatform.API.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _repo;
        private readonly IAuditService _auditService;
        private readonly IJobRepository _jobRepo;
        private readonly IEmailService _emailService;
        private readonly RecruitmentPlatform.API.Data.AppDbContext _db;

        public ApplicationService(IApplicationRepository repo, IAuditService auditService, IJobRepository jobRepo, IEmailService emailService, RecruitmentPlatform.API.Data.AppDbContext db)
        {
            _repo = repo;
            _auditService = auditService;
            _jobRepo = jobRepo;
            _emailService = emailService;
            _db = db;
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

        public async Task<ApplicationResponseDto?> UpdateStageAsync(int id, UpdateStageDto dto, int userId)
        {
            var app = await _repo.GetByIdAsync(id);
            if (app == null) return null;

            if (app.Candidate == null)
            {
                app.Candidate = await _db.Candidates.FindAsync(app.CandidateId);
            }

            string oldStage = app.Status;
            app.Status = dto.NewStage;
            await _repo.UpdateAsync(app);

            await _auditService.LogAsync(userId, "Application stage changed",
                $"ApplicationId={id}, {oldStage} -> {dto.NewStage}");

            if ((dto.NewStage == "Interview" || dto.NewStage == "Phone Screen" || dto.NewStage == "Technical" || dto.NewStage == "Onsite") && app.Candidate != null && !string.IsNullOrEmpty(app.Candidate.Email))
            {
                byte[]? icsBytes = null;
                if (!string.IsNullOrEmpty(dto.Date) && !string.IsNullOrEmpty(dto.Time))
                {
                    if (DateTime.TryParse($"{dto.Date} {dto.Time}", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out DateTime parsedLocalDatetime))
                    {
                        var e = new CalendarEvent
                        {
                            Start = new CalDateTime(parsedLocalDatetime),
                            End = new CalDateTime(parsedLocalDatetime.AddMinutes(60)),
                            Summary = $"HireMinds {dto.NewStage} Interview",
                            Description = string.IsNullOrEmpty(dto.Notes) ? $"You are invited for a {dto.NewStage} interview." : dto.Notes
                        };

                        var calendar = new Calendar();
                        calendar.Events.Add(e);

                        var serializer = new CalendarSerializer();
                        var serializedCalendar = serializer.SerializeToString(calendar);
                        icsBytes = System.Text.Encoding.UTF8.GetBytes(serializedCalendar);
                    }
                }

                string subject = $"{dto.NewStage} Interview Scheduled";
                string body = $"<p>Hi {app.Candidate.Name},</p><p>We are delighted to move your application forward. We have scheduled a {dto.NewStage} interview for you. <br/>Date: {dto.Date}<br/>Time: {dto.Time}{(string.IsNullOrEmpty(dto.Notes) ? "" : $"<br/>Note: {dto.Notes}")}</p>";
                await _emailService.SendEmailAsync(app.Candidate.Email, subject, body, true, icsBytes);
            }

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
            DateSubmitted = a.DateSubmitted,
            CandidateEmail = a.Candidate?.Email,
            CandidatePhone = a.Candidate?.PhoneNumber,
            CandidateLocation = a.Candidate?.Location,
            CandidateCurrentJobTitle = a.Candidate?.CurrentJobTitle,
            CandidateExperienceLevel = a.Candidate?.ExperienceLevel,
            CandidateEducation = a.Candidate?.Education,
            CandidateSkills = a.Candidate?.Skills,
            CandidateResumeUrl = a.Candidate?.ResumeUrl
        };
    }
}
