using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.DTOs.HiringManager;
using RecruitmentPlatform.API.Services;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/hiring-managers")]
    public class HiringManagersController : ControllerBase
    {
        private readonly IHiringManagerService _service;

        public HiringManagersController(IHiringManagerService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var managers = await _service.GetAllAsync();
            return Ok(managers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var manager = await _service.GetByIdAsync(id);
            return manager == null ? NotFound() : Ok(manager);
        }

        [HttpGet("by-company/{companyId}")]
        public async Task<IActionResult> GetByCompanyId(int companyId)
        {
            var managers = await _service.GetByCompanyIdAsync(companyId);
            return Ok(managers);
        }

        [HttpPost]
        [Authorize(Roles = "Company,Admin")]
        public async Task<IActionResult> Create([FromBody] HiringManagerRequestDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Company,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] HiringManagerRequestDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Company,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}