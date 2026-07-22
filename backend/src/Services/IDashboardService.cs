using RecruitmentPlatform.API.DTOs.Dashboard;
using RecruitmentPlatform.API.DTOs.User;

namespace RecruitmentPlatform.API.Services
{
    public interface IDashboardService
    {
        Task<AdminDashboardDto> GetAdminDashboardAsync();
    }
}
