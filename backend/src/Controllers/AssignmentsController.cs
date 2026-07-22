using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.DTOs.Assignment;
using RecruitmentPlatform.API.Services;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/assignments")]
    public class AssignmentsController : ControllerBase
    {
        private readonly IAssignmentService _service;

        public AssignmentsController(IAssignmentService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var assignments = await _service.GetAllAsync();
            return Ok(assignments);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Company")]
        public async Task<IActionResult> Create([FromBody] AssignmentRequestDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [HttpDelete]
        [Authorize(Roles = "Admin,Company")]
        public async Task<IActionResult> Delete([FromQuery] int recruiterId, [FromQuery] int hiringManagerId)
        {
            var deleted = await _service.DeleteAsync(recruiterId, hiringManagerId);
            return deleted ? NoContent() : NotFound();
        }
    }
}