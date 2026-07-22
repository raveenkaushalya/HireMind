using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.DTOs.Job;
using RecruitmentPlatform.API.Services;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _service;

        public JobsController(IJobService service) => _service = service;

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
        [Authorize(Roles = "Recruiter,Admin")]
        public async Task<IActionResult> Create([FromBody] JobRequestDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Recruiter,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] JobRequestDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Recruiter,Admin")]
        public async Task<IActionResult> Close(int id)
        {
            var closed = await _service.CloseAsync(id);
            return closed ? NoContent() : NotFound();
        }
    }
}
