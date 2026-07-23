using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.DTOs.Application;
using RecruitmentPlatform.API.Services;
using System.Security.Claims;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/applications")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _service;

        public ApplicationsController(IApplicationService service) => _service = service;

        [HttpGet]
        [Authorize(Roles = "Admin,Recruiter,HiringManager")]
        public async Task<IActionResult> GetAll()
        {
            var apps = await _service.GetAllAsync();
            return Ok(apps);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var app = await _service.GetByIdAsync(id);
            return app == null ? NotFound() : Ok(app);
        }

        [HttpGet("by-candidate/{candidateId}")]
        public async Task<IActionResult> GetByCandidateId(int candidateId)
        {
            var apps = await _service.GetByCandidateIdAsync(candidateId);
            return Ok(apps);
        }

        [HttpGet("by-job/{jobPostingId}")]
        public async Task<IActionResult> GetByJobId(int jobPostingId)
        {
            var apps = await _service.GetByJobIdAsync(jobPostingId);
            return Ok(apps);
        }

        [HttpPost]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Create([FromBody] ApplicationRequestDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}/stage")]
        [Authorize(Roles = "Recruiter,HiringManager,Admin")]
        public async Task<IActionResult> UpdateStage(int id, [FromBody] UpdateStageDto dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var result = await _service.UpdateStageAsync(id, dto, userId);
            return result == null ? NotFound() : Ok(result);
        }
    }
}