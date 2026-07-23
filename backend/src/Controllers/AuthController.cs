using Microsoft.AspNetCore.Mvc;
using RecruitmentPlatform.API.DTOs.Auth;
using RecruitmentPlatform.API.Services;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(new { message = "Registered successfully", token = result.Token, userId = result.UserId, role = result.Role });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            try
            {
                var result = await _authService.LoginAsync(dto);
                return Ok(new { result.Token, result.Role, name = result.Name, result.UserId, result.Email });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("company-setup-password")]
        public async Task<IActionResult> CompanySetupPassword([FromBody] CompanySetupPasswordRequest dto)
        {
            try
            {
                var result = await _authService.CreateCompanyAccountAsync(dto.Token, dto.Password);
                return Ok(new { message = "Account created successfully", result.Token, result.Role, name = result.Name, result.UserId, result.Email });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("recruiter-setup-password")]
        public async Task<IActionResult> RecruiterSetupPassword([FromBody] CompanySetupPasswordRequest dto)
        {
            try
            {
                var result = await _authService.CreateRecruiterAccountAsync(dto.Token, dto.Password);
                return Ok(new { message = "Account created successfully", result.Token, result.Role, name = result.Name, result.UserId, result.Email });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("hiring-manager-setup-password")]
        public async Task<IActionResult> HiringManagerSetupPassword([FromBody] CompanySetupPasswordRequest dto)
        {
            try
            {
                var result = await _authService.CreateHiringManagerAccountAsync(dto.Token, dto.Password);
                return Ok(new { message = "Account created successfully", result.Token, result.Role, name = result.Name, result.UserId, result.Email });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class CompanySetupPasswordRequest
    {
        public string Token { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}