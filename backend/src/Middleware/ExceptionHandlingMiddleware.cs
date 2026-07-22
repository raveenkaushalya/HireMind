using System.Net;
using System.Text.Json;

namespace RecruitmentPlatform.API.Middleware
{
    /// <summary>
    /// Global exception handling middleware.
    /// Catches all unhandled exceptions, maps them to appropriate HTTP status codes,
    /// and returns a consistent JSON error response.
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            _logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);

            var (statusCode, message) = exception switch
            {
                UnauthorizedAccessException => (HttpStatusCode.Unauthorized, exception.Message),
                InvalidOperationException => (HttpStatusCode.BadRequest, exception.Message),
                KeyNotFoundException => (HttpStatusCode.NotFound, exception.Message),
                ArgumentException => (HttpStatusCode.BadRequest, exception.Message),
                _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again later.")
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                status = (int)statusCode,
                error = statusCode.ToString(),
                message,
                timestamp = DateTime.UtcNow
            };

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);
        }
    }
}
