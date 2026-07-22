using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.Services;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public DashboardController(IDashboardService service) => _service = service;

        [HttpGet("admin")]
        [Authorize(Roles = "Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> GetAdminDashboard()
        {
            var stats = await _service.GetAdminDashboardAsync();
            return Ok(stats);
        }
    }
}
