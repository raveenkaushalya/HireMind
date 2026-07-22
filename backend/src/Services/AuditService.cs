using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Services
{
    // Concrete implementation: writes directly to the AuditLogs table
    public class AuditService : IAuditService
    {
        private readonly AppDbContext _db; // injected database context
        public AuditService(AppDbContext db) => _db = db;

        public async Task LogAsync(int? userId, string action, string? details = null)
        {
            // "AuditLog" here now correctly resolves to RecruitmentPlatform.API.Models.AuditLog
            // via the "using RecruitmentPlatform.API.Models;" line above, since the conflicting
            // duplicate class that used to live in THIS file/namespace has been removed.
            _db.AuditLogs.Add(new AuditLog
            {
                UserId = userId,               // null means a system/automated action
                Action = action,                // short description, e.g. "Application stage changed"
                Details = details,              // optional longer JSON/text with specifics
                Timestamp = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();       // commit immediately so the log survives even if later code fails
        }
    }

    // The duplicate "internal class AuditLog { ... }" that used to be here has been deleted.
    // The real AuditLog model lives in Models/Auditlog.cs and is shared by AppDbContext + this service.
}