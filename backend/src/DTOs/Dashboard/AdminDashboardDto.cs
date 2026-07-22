namespace RecruitmentPlatform.API.DTOs.Dashboard
{
    /// <summary>
    /// Aggregated statistics returned by the admin dashboard endpoint.
    /// </summary>
    public class AdminDashboardDto
    {
        public int TotalUsers { get; set; }
        public int TotalCandidates { get; set; }
        public int TotalRecruiters { get; set; }
        public int TotalCompanies { get; set; }
        public int TotalHiringManagers { get; set; }
        public int TotalJobs { get; set; }
        public int OpenJobs { get; set; }
        public int ClosedJobs { get; set; }
        public int TotalApplications { get; set; }
        public int ActiveRecruiters { get; set; }
        public int PendingRecruiters { get; set; }
    }
}
