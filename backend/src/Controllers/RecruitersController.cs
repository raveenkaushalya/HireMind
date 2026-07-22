using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.DTOs.Recruiter;
using RecruitmentPlatform.API.Services;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/recruiters")]
    public class RecruitersController : ControllerBase
    {
        private readonly IRecruiterService _service;

        public RecruitersController(IRecruiterService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var recruiters = await _service.GetAllAsync();
            return Ok(recruiters);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var recruiter = await _service.GetByIdAsync(id);
            return recruiter == null ? NotFound() : Ok(recruiter);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> Create([FromBody] RecruiterRequestDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] RecruiterRequestDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}