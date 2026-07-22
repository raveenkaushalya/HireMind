using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using RecruitmentPlatform.API.Services;
using Microsoft.Extensions.Configuration;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/portal")]
    public class PortalController : ControllerBase
    {
        private readonly DocumentExtractor _extractor = new DocumentExtractor();
        private readonly OpenRouterResumeScorer _scorer;

        public PortalController(IConfiguration configuration)
        {
            var apiKey = configuration["OpenRouter:ApiKey"] ?? "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";
            _scorer = new OpenRouterResumeScorer(apiKey);
        }

        // Helper to extract text safely across endpoints
        private string GetExtractedText(IFormFile file)
        {
            string extension = Path.GetExtension(file.FileName).ToLower();
            using var stream = file.OpenReadStream();
            if (extension == ".pdf") return _extractor.ExtractTextFromPdf(stream);
            if (extension == ".docx") return _extractor.ExtractTextFromDocx(stream);
            throw new Exception("Unsupported file format.");
        }

        // 1. RECRUITER PORTAL ENDPOINT: Returns only profile summaries for rapid screening
        [HttpPost("recruiter/analyze")]
        public async Task<IActionResult> GetRecruiterDashboardData(IFormFile file, [FromForm] string jobDescription)
        {
            try
            {
                string text = GetExtractedText(file);
                string rawAiJson = await _scorer.ScoreAndSummarizeResumeAsync(text, jobDescription);

                using var doc = JsonDocument.Parse(rawAiJson);
                var root = doc.RootElement;

                // Strip out manager data, return only candidate biographical profiles
                var recruiterResponse = new
                {
                    candidateProfile = root.GetProperty("candidateProfile").Clone(),
                    overallMatchScore = root.GetProperty("overallScore").Clone(),
                    matchingSkills = root.GetProperty("matchingSkills").Clone()
                };

                return Ok(recruiterResponse);
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

        // 2. HIRING MANAGER PORTAL ENDPOINT: Returns in-depth technical alignment metrics
        [HttpPost("manager/analyze")]
        public async Task<IActionResult> GetHiringManagerDashboardData(IFormFile file, [FromForm] string jobDescription)
        {
            try
            {
                string text = GetExtractedText(file);
                string rawAiJson = await _scorer.ScoreAndSummarizeResumeAsync(text, jobDescription);

                using var doc = JsonDocument.Parse(rawAiJson);
                var root = doc.RootElement;

                // Strip out biographical info, return only analytical metrics and coaching feedback
                var managerResponse = new
                {
                    overallScore = root.GetProperty("overallScore").Clone(),
                    skillsMatchScore = root.GetProperty("skillsMatchScore").Clone(),
                    experienceMatchScore = root.GetProperty("experienceMatchScore").Clone(),
                    missingSkills = root.GetProperty("missingSkills").Clone(),
                    justification = root.GetProperty("justification").Clone(),
                    improvingFeedbacks = root.GetProperty("improvingFeedbacks").Clone()
                };

                return Ok(managerResponse);
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

        // 3. CANDIDATE PORTAL ENDPOINT: Returns skills extraction, summary, and feedback against their own title/bio
        [HttpPost("candidate/analyze")]
        public async Task<IActionResult> GetCandidateDashboardData(IFormFile? file, [FromForm] string? resumeUrl, [FromForm] string jobDescription)
        {
            try
            {
                string text;
                if (file != null)
                {
                    text = GetExtractedText(file);
                }
                else if (!string.IsNullOrWhiteSpace(resumeUrl))
                {
                    using var client = new System.Net.Http.HttpClient();
                    using var stream = await client.GetStreamAsync(resumeUrl);
                    string extension = Path.GetExtension(new Uri(resumeUrl).LocalPath).ToLower();
                    
                    if (extension == ".pdf") text = _extractor.ExtractTextFromPdf(stream);
                    else if (extension == ".docx") text = _extractor.ExtractTextFromDocx(stream);
                    else throw new Exception("Unsupported file format.");
                }
                else
                {
                    return BadRequest("Provide either a file or a resumeUrl.");
                }

                // We use their title or bio as the "jobDescription" so the AI evaluates their resume against what they claim to be
                string assumedTitle = string.IsNullOrWhiteSpace(jobDescription) ? "General Professional" : jobDescription;
                string rawAiJson = await _scorer.ScoreAndSummarizeResumeAsync(text, assumedTitle);

                // Since candidate portal needs all fields, we can bypass doc disposal entirely and return the raw JSON content!
                return Content(rawAiJson, "application/json");
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }
    }
}
