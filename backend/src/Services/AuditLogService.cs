using RecruitmentPlatform.API.Models;
using RecruitmentPlatform.API.Data;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services
{
    public interface IAuditLogService
    {
        Task LogActionAsync(int? userId, string action, string details);
    }

    public class AuditLogService : IAuditLogService
    {
        private readonly AppDbContext _context;

        public AuditLogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task LogActionAsync(int? userId, string action, string details)
        {
            var log = new AuditLog
            {
                UserId = userId,
                Action = action,
                Details = details,
                Timestamp = System.DateTime.UtcNow
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
