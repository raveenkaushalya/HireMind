using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Middleware;
using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Repositories;
using RecruitmentPlatform.API.Services;
using System.Text;

// 1. Create the builder first
var builder = WebApplication.CreateBuilder(args);

// ──────────────────────────────────────────────
// Database
// ──────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register the custom DbInitializer service so it can be resolved from the DI container
builder.Services.AddTransient<DbInitializer>();

// ──────────────────────────────────────────────
// Repositories (Data Access Layer)
// ──────────────────────────────────────────────
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICandidateRepository, CandidateRepository>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<IRecruiterRepository, RecruiterRepository>();
builder.Services.AddScoped<IHiringManagerRepository, HiringManagerRepository>();
builder.Services.AddScoped<IJobRepository, JobRepository>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();
builder.Services.AddScoped<IAssignmentRepository, AssignmentRepository>();

// ──────────────────────────────────────────────
// Services (Business Logic Layer)
// ──────────────────────────────────────────────
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICandidateService, CandidateService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IRecruiterService, RecruiterService>();
builder.Services.AddScoped<IHiringManagerService, HiringManagerService>();
builder.Services.AddScoped<IJobService, JobService>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, EmailService>();


// ──────────────────────────────────────────────
// Authentication & Authorization
// ──────────────────────────────────────────────
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ──────────────────────────────────────────────
// CORS setup for the React frontend
// ──────────────────────────────────────────────
builder.Services.AddCors(o => o.AddPolicy("AllowFrontend", policy =>
    policy.WithOrigins("http://localhost:5173")
          .AllowAnyHeader()
          .AllowAnyMethod()));

// 2. Build the application
var app = builder.Build();

// 3. Execution Setup: Run the Database Initializer before starting the app
using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
    try
    {
        initializer.Initialize();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred during database initialization: {ex.Message}");
    }
}

// 4. Configure the HTTP request pipeline

// Global exception handling middleware (must be first in the pipeline)
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");   // Must come BEFORE Authentication and Authorization

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();