using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services
{
    public class OpenRouterResumeScorer
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        // Changed to a working model because "google/gemini-2.5-flash:free" was deprecated.
        private const string ModelName = "google/gemini-2.5-flash";

        public OpenRouterResumeScorer(string freeApiKey)
        {
            _apiKey = freeApiKey;
            _httpClient = new HttpClient();
        }

        // This is the method that your portal controller endpoints will call
        public async Task<string> ScoreAndSummarizeResumeAsync(string resumeText, string jobDescription)
        {
            var systemPrompt = @"
                You are an expert ATS recruitment algorithm and talent analyst.
                Analyze the provided Resume text against the Job Description.
                You must return ONLY a raw JSON object matching this exact combined structure:
                {
                    ""overallScore"": 0-100,
                    ""skillsMatchScore"": 0-100,
                    ""experienceMatchScore"": 0-100,
                    ""matchingSkills"": [],
                    ""missingSkills"": [],
                    ""justification"": ""Summary of how well they fit the role."",
                    ""improvingFeedbacks"": [],
                    ""candidateProfile"": {
                        ""candidateName"": ""Extract name or 'Unknown'"",
                        ""professionalHeadline"": ""e.g., Senior Full-Stack Engineer"",
                        ""yearsOfExperience"": 0,
                        ""executiveSummary"": ""A concise 2-sentence career summary."",
                        ""experience"": [ { ""title"": """", ""company"": """", ""duration"": """", ""highlights"": [] } ],
                        ""education"": [ { ""degree"": """", ""school"": """", ""year"": """" } ],
                        ""certifications"": [],
                        ""languages"": []
                    }
                }";

            var userPrompt = $"[Job Description]\n{jobDescription}\n\n[Resume Text]\n{resumeText}";

            var requestBody = new
            {
                model = ModelName,
                messages = new[]
                {
                    new { role = "system", content = systemPrompt },
                    new { role = "user", content = userPrompt }
                },
                max_tokens = 4000,
                response_format = new { type = "json_object" }
            };

            var jsonPayload = JsonSerializer.Serialize(requestBody);

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
            request.Headers.Add("Authorization", $"Bearer {_apiKey}");
            request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"OpenRouter API call failed: {response.StatusCode} - {errorDetails}");
            }

            var responseString = await response.Content.ReadAsStringAsync();

            using var jsonDocument = JsonDocument.Parse(responseString);
            var root = jsonDocument.RootElement;
            var aiMessageContent = root.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

            return aiMessageContent ?? "{}";
        }
    }
}
