using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.DTOs.Candidate;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Services;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/candidates")]
    public class CandidatesController : ControllerBase
    {
        private readonly ICandidateService _service;

        public CandidatesController(ICandidateService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var candidates = await _service.GetAllAsync();
            return Ok(candidates);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var candidate = await _service.GetByIdAsync(id);
            return candidate == null ? NotFound() : Ok(candidate);
        }

        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var candidate = await _service.GetByUserIdAsync(userId);
            return candidate == null ? NotFound() : Ok(candidate);
        }

        [HttpGet("by-recruiter/{recruiterId}")]
        public async Task<IActionResult> GetByRecruiterId(int recruiterId)
        {
            var candidates = await _service.GetByRecruiterIdAsync(recruiterId);
            return Ok(candidates);
        }

        // Handles NEW candidates (make sure CandidateRequestDto has a ResumeUrl property!)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CandidateRequestDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Candidate,Admin,admin,SystemAdmin,System Admin,Recruiter")]
        public async Task<IActionResult> Update(int id, [FromBody] CandidateRequestDto dto)
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

        // Updates ONLY the resume URL for an EXISTING candidate
        [HttpPatch("{id}/resume")]
        [Authorize(Roles = "Candidate,Admin,admin,SystemAdmin,System Admin,Recruiter")]
        public async Task<IActionResult> UpdateResume(int id, [FromBody] UpdateResumeDto dto)
        {
            var updatedCandidate = await _service.UpdateResumeAsync(id, dto.ResumeUrl);

            if (updatedCandidate == null)
            {
                return NotFound($"Candidate with ID {id} not found.");
            }

            return Ok(updatedCandidate);
        }
    }
}