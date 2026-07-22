using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.DTOs.Dashboard;

namespace RecruitmentPlatform.API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _db;

        public DashboardService(AppDbContext db) => _db = db;

        public async Task<AdminDashboardDto> GetAdminDashboardAsync()
        {
            return new AdminDashboardDto
            {
                TotalUsers = await _db.Users.CountAsync(),
                TotalCandidates = await _db.Candidates.CountAsync(),
                TotalRecruiters = await _db.Recruiters.CountAsync(),
                TotalCompanies = await _db.Companies.CountAsync(),
                TotalHiringManagers = await _db.HiringManagers.CountAsync(),
                TotalJobs = await _db.JobPostings.CountAsync(),
                OpenJobs = await _db.JobPostings.CountAsync(j => j.Status == "Open"),
                ClosedJobs = await _db.JobPostings.CountAsync(j => j.Status == "Closed"),
                TotalApplications = await _db.Applications.CountAsync(),
                ActiveRecruiters = await _db.Recruiters.CountAsync(r => r.Status == "Active"),
                PendingRecruiters = await _db.Recruiters.CountAsync(r => r.Status == "Pending")
            };
        }
    }
}
