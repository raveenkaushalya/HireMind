using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;

namespace RecruitmentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public ChatController(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        public class ChatMessageRequest
        {
            public string role { get; set; } = string.Empty;
            public string content { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] ChatMessageRequest[] messages)
        {
            try
            {
                var apiKey = _configuration["OpenRouter:ApiKey"] ?? "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";
                var modelName = "google/gemini-2.5-flash";

                // inject system prompt at the beginning
                var systemPrompt = new ChatMessageRequest
                {
                    role = "system",
                    content = @"You are HireMinds AI, a helpful HR assistant. Help users discover jobs, improve resumes, and prepare for interviews.
CRITICAL INSTRUCTIONS:
1. Format your answers clearly using Markdown (bold topics and bulleted lists).
2. BASE YOUR BASIC ANSWERS ON HIREMINDS PLATFORM DATA: All jobs on our platform are strictly based in Sri Lanka (Remote, Hybrid, or Onsite). You MUST NOT ask the user what country they want to work in. NEVER mention New York, California, Canada, or any international location.
3. The platform only supports the following job industries/categories: IT / Technology, Engineering, Healthcare, Education, Finance, Marketing, Sales, Media & Design, E-commerce, Manufacturing, Consulting, and Other.
4. Your name is strictly ""HireMinds AI"". DO NOT refer to yourself or the platform as ""HireMind"" under any circumstances. Always use ""HireMinds"".
Always be concise, friendly, and highly professional."
                };

                var openRouterMessages = new[] { systemPrompt }.Concat(messages).ToArray();

                var requestBody = new
                {
                    model = modelName,
                    messages = openRouterMessages,
                    max_tokens = 500
                };

                var jsonPayload = JsonSerializer.Serialize(requestBody);

                using var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
                request.Headers.Add("Authorization", $"Bearer {apiKey}");
                request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var errorDetails = await response.Content.ReadAsStringAsync();
                    return StatusCode(500, $"OpenRouter API Error: {errorDetails}");
                }

                var responseString = await response.Content.ReadAsStringAsync();
                
                using var jsonDocument = JsonDocument.Parse(responseString);
                var root = jsonDocument.RootElement;
                var aiMessageContent = root.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? string.Empty;

                return Ok(new { text = aiMessageContent });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
