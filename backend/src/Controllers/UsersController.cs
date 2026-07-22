using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.Services;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;
        private readonly IAuditLogService _auditLogService;

        public UsersController(IUserService service, IAuditLogService auditLogService)
        {
            _service = service;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _service.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _service.GetByIdAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPatch("{id}/toggle-active")]
        [Authorize(Roles = "Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> ToggleActive(int id)
        {
            var toggled = await _service.ToggleActiveAsync(id);
            if (toggled)
            {
                var adminUserIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                int? adminUserId = int.TryParse(adminUserIdStr, out var uId) ? uId : (int?)null;
                
                await _auditLogService.LogActionAsync(adminUserId, "TOGGLE_USER_ACTIVE", $"Toggled active status for user {id}");
                return Ok(new { message = "User active status toggled." });
            }
            return NotFound();
        }
    }
}