using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.DTOs.Company;
using RecruitmentPlatform.API.Services;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/companies")]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _service;

        public CompaniesController(ICompanyService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var companies = await _service.GetAllAsync();
            return Ok(companies);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var company = await _service.GetByIdAsync(id);
            return company == null ? NotFound() : Ok(company);
        }

        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var company = await _service.GetByUserIdAsync(userId);
            return company == null ? NotFound() : Ok(company);
        }

        [HttpPost]
        [Authorize(Roles = "Company,Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> Create([FromBody] CompanyRequestDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Company,Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CompanyRequestDto dto)
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

        [HttpPost("register")]
        public async Task<IActionResult> RegisterCompany([FromBody] CompanyRequestDto dto)
        {
            try
            {
                var result = await _service.CreateAsync(dto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> Approve(int id)
        {
            var result = await _service.ApproveCompanyAsync(id);
            return result == null ? BadRequest("Company not found or not in Pending state.") : Ok(result);
        }

        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Admin,admin,SystemAdmin,System Admin")]
        public async Task<IActionResult> Reject(int id, [FromBody] string? reason)
        {
            var success = await _service.RejectCompanyAsync(id, reason);
            return success ? Ok() : BadRequest("Company not found or not in Pending state.");
        }
    }
}