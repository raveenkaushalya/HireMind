using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.DTOs.Job;
using RecruitmentPlatform.API.Repositories;
using RecruitmentPlatform.API.Services;
using System.Security.Claims;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _service;
        private readonly IHiringManagerRepository _hmRepo;

        public JobsController(IJobService service, IHiringManagerRepository hmRepo)
        {
            _service = service;
            _hmRepo = hmRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? location, [FromQuery] string? keyword, [FromQuery] string? status)
        {
            var jobs = await _service.SearchAsync(location, keyword, status);
            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var job = await _service.GetByIdAsync(id);
            return job == null ? NotFound() : Ok(job);
        }

        [HttpGet("by-company/{companyId}")]
        public async Task<IActionResult> GetByCompanyId(int companyId)
        {
            var jobs = await _service.GetByCompanyIdAsync(companyId);
            return Ok(jobs);
        }

        [HttpPost]
        [Authorize(Roles = "Recruiter,Admin,HiringManager")]
        public async Task<IActionResult> Create([FromBody] JobRequestDto dto)
        {
            // For HiringManagers: auto-resolve their company ID from JWT to prevent FK errors
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
            if (role == "HiringManager")
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdStr, out int userId))
                {
                    var hm = await _hmRepo.GetByUserIdAsync(userId);
                    if (hm?.CompanyId != null)
                        dto.CompanyId = hm.CompanyId.Value;
                }
            }

            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Recruiter,Admin,HiringManager")]
        public async Task<IActionResult> Update(int id, [FromBody] JobRequestDto dto)
        {
            // For HiringManagers: auto-resolve their company ID from JWT
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
            if (role == "HiringManager")
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdStr, out int userId))
                {
                    var hm = await _hmRepo.GetByUserIdAsync(userId);
                    if (hm?.CompanyId != null)
                        dto.CompanyId = hm.CompanyId.Value;
                }
            }

            var result = await _service.UpdateAsync(id, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Recruiter,Admin,HiringManager")]
        public async Task<IActionResult> Close(int id)
        {
            var closed = await _service.CloseAsync(id);
            return closed ? NoContent() : NotFound();
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Recruiter,Admin,HiringManager")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var updated = await _service.ChangeStatusAsync(id, status);
            return updated ? Ok() : NotFound();
        }
    }
}
