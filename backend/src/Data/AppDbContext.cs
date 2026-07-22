using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Models;

namespace RecruitmentPlatform.API.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Recruiter> Recruiters { get; set; }
        public DbSet<HiringManager> HiringManagers { get; set; }
        public DbSet<Candidate> Candidates { get; set; }
        public DbSet<JobPosting> JobPostings { get; set; }
        public DbSet<Application> Applications { get; set; }   // added — was missing, caused CS1061 in ApplicationsController
        public DbSet<RecruiterHmAssignment> RecruiterHmAssignments { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<SystemAdmin> SystemAdmins { get; set; }
        public DbSet<BlacklistedEmail> BlacklistedEmails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<User>().Property(u => u.Id).HasColumnName("userID");
            modelBuilder.Entity<User>().Property(u => u.FullName).HasColumnName("full_name");
            modelBuilder.Entity<User>().Property(u => u.Email).HasColumnName("email");
            modelBuilder.Entity<User>().Property(u => u.PasswordHash).HasColumnName("password_hash");
            modelBuilder.Entity<User>().Property(u => u.Role).HasColumnName("role");
            modelBuilder.Entity<User>().Property(u => u.IsActive).HasColumnName("is_active");
            modelBuilder.Entity<User>().Property(u => u.CreatedAt).HasColumnName("created_at");
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<Company>().ToTable("Company");
            modelBuilder.Entity<Company>().HasKey(c => c.Id);
            modelBuilder.Entity<Company>().Property(c => c.Id).HasColumnName("CompanyID");
            modelBuilder.Entity<Company>().Property(c => c.UserId).HasColumnName("userID");
            modelBuilder.Entity<Company>().Property(c => c.Name).HasColumnName("Company_Name");
            modelBuilder.Entity<Company>().Property(c => c.Industry).HasColumnName("industry");
            modelBuilder.Entity<Company>().Property(c => c.Email).HasColumnName("company_email");
            modelBuilder.Entity<Company>().Property(c => c.PhoneNumber).HasColumnName("company_phone_number");
            modelBuilder.Entity<Company>().Property(c => c.Location).HasColumnName("location");
            modelBuilder.Entity<Company>().Property(c => c.Size).HasColumnName("company_size");
            modelBuilder.Entity<Company>().Property(c => c.Description).HasColumnName("company_description");
            modelBuilder.Entity<Company>().Property(c => c.ContactPersonName).HasColumnName("Contact_person_name");
            modelBuilder.Entity<Company>().Property(c => c.ContactPersonNumber).HasColumnName("Contact_person_number");
            modelBuilder.Entity<Company>().Property(c => c.ProofDocumentsMetadataLink).HasColumnName("Proof_documents_metadata_link");
            modelBuilder.Entity<Company>().Property(c => c.Status).HasColumnName("Status").HasDefaultValue("Pending");
            modelBuilder.Entity<Company>().Property(c => c.RegistrationToken).HasColumnName("RegistrationToken");
            modelBuilder.Entity<Company>().Property(c => c.TokenExpiry).HasColumnName("TokenExpiry");

            modelBuilder.Entity<BlacklistedEmail>().ToTable("BlacklistedEmails");
            modelBuilder.Entity<BlacklistedEmail>().HasKey(b => b.Id);
            modelBuilder.Entity<BlacklistedEmail>().HasIndex(b => b.Email).IsUnique();

            modelBuilder.Entity<Recruiter>().ToTable("Recruiter");
            modelBuilder.Entity<Recruiter>().HasKey(r => r.Id);
            modelBuilder.Entity<Recruiter>().Property(r => r.Id).HasColumnName("RecruiterID");
            modelBuilder.Entity<Recruiter>().Property(r => r.UserId).HasColumnName("userID");
            modelBuilder.Entity<Recruiter>().Property(r => r.Name).HasColumnName("Recruiter_Name");
            modelBuilder.Entity<Recruiter>().Property(r => r.Email).HasColumnName("email");
            modelBuilder.Entity<Recruiter>().Property(r => r.PasswordHash).HasColumnName("password_hashed");
            modelBuilder.Entity<Recruiter>().Property(r => r.JoinedDate).HasColumnName("joined_date");
            modelBuilder.Entity<Recruiter>().Property(r => r.Status).HasColumnName("status");
            modelBuilder.Entity<Recruiter>().Property(r => r.RegistrationToken).HasColumnName("RegistrationToken");
            modelBuilder.Entity<Recruiter>().Property(r => r.TokenExpiry).HasColumnName("TokenExpiry");

            modelBuilder.Entity<HiringManager>().ToTable("HiringManager");
            modelBuilder.Entity<HiringManager>().HasKey(h => h.Id);
            modelBuilder.Entity<HiringManager>().Property(h => h.Id).HasColumnName("HM_ID");
            modelBuilder.Entity<HiringManager>().Property(h => h.UserId).HasColumnName("userID");
            modelBuilder.Entity<HiringManager>().Property(h => h.CompanyId).HasColumnName("CompanyID");
            modelBuilder.Entity<HiringManager>().Property(h => h.Name).HasColumnName("Hiring_Manager_Name");
            modelBuilder.Entity<HiringManager>().Property(h => h.Department).HasColumnName("department");
            modelBuilder.Entity<HiringManager>().Property(h => h.Email).HasColumnName("email");
            modelBuilder.Entity<HiringManager>().Property(h => h.PasswordHash).HasColumnName("password_hashed");
            modelBuilder.Entity<HiringManager>().Property(h => h.JoinedDate).HasColumnName("joined_date");

            modelBuilder.Entity<Candidate>().ToTable("Candidate");
            modelBuilder.Entity<Candidate>().HasKey(c => c.Id);
            modelBuilder.Entity<Candidate>().Property(c => c.Id).HasColumnName("CandidateID");
            modelBuilder.Entity<Candidate>().Property(c => c.RecruiterId).HasColumnName("RecruiterID");
            modelBuilder.Entity<Candidate>().Property(c => c.UserId).HasColumnName("userID");
            modelBuilder.Entity<Candidate>().Property(c => c.Name).HasColumnName("Candidate_Name");
            modelBuilder.Entity<Candidate>().Property(c => c.Email).HasColumnName("email");
            modelBuilder.Entity<Candidate>().Property(c => c.PasswordHash).HasColumnName("password_hashed");
            modelBuilder.Entity<Candidate>().Property(c => c.PhoneNumber).HasColumnName("phone_number");
            modelBuilder.Entity<Candidate>().Property(c => c.Location).HasColumnName("location");
            modelBuilder.Entity<Candidate>().Property(c => c.CurrentJobTitle).HasColumnName("current_job_title");
            modelBuilder.Entity<Candidate>().Property(c => c.ExperienceLevel).HasColumnName("experience_level");
            modelBuilder.Entity<Candidate>().Property(c => c.Education).HasColumnName("education");
            modelBuilder.Entity<Candidate>().Property(c => c.Skills).HasColumnName("skills");
            modelBuilder.Entity<Candidate>().Property(c => c.LinkedinUrl).HasColumnName("linkedin_url");
            modelBuilder.Entity<Candidate>().Property(c => c.ResumeUrl).HasColumnName("ResumeUrl");
            modelBuilder.Entity<Candidate>().Property(c => c.Bio).HasColumnName("Bio");

            modelBuilder.Entity<JobPosting>().ToTable("job");
            modelBuilder.Entity<JobPosting>().HasKey(j => j.Id);
            modelBuilder.Entity<JobPosting>().Property(j => j.Id).HasColumnName("JobID");
            modelBuilder.Entity<JobPosting>().Property(j => j.CompanyId).HasColumnName("CompanyID");
            modelBuilder.Entity<JobPosting>().Property(j => j.Title).HasColumnName("job_title");
            modelBuilder.Entity<JobPosting>().Property(j => j.Type).HasColumnName("type");
            modelBuilder.Entity<JobPosting>().Property(j => j.Location).HasColumnName("location");
            modelBuilder.Entity<JobPosting>().Property(j => j.SalaryRange).HasColumnName("salary_range");
            modelBuilder.Entity<JobPosting>().Property(j => j.Applicants).HasColumnName("applicants");
            modelBuilder.Entity<JobPosting>().Property(j => j.YearsOfExperienceNeeded).HasColumnName("years_of_experience_needed");
            modelBuilder.Entity<JobPosting>().Property(j => j.PostedDate).HasColumnName("posted_date");
            modelBuilder.Entity<JobPosting>().Property(j => j.ClosingDate).HasColumnName("closing_date");
            modelBuilder.Entity<JobPosting>().Property(j => j.SkillsNeeded).HasColumnName("skills_needed");
            modelBuilder.Entity<JobPosting>().Property(j => j.DescriptionAboutTheRole).HasColumnName("description_about_the_role");
            modelBuilder.Entity<JobPosting>().Property(j => j.Responsibilities).HasColumnName("responsibilities");
            modelBuilder.Entity<JobPosting>().Property(j => j.Requirements).HasColumnName("requirements");
            modelBuilder.Entity<JobPosting>().Property(j => j.DescriptionAboutTheCompany).HasColumnName("description_about_the_company");
            modelBuilder.Entity<JobPosting>().Property(j => j.Status).HasColumnName("status");

            modelBuilder.Entity<Application>().ToTable("Job_application");
            modelBuilder.Entity<Application>().HasKey(a => a.Id);
            modelBuilder.Entity<Application>().Property(a => a.Id).HasColumnName("ApplicationID");
            modelBuilder.Entity<Application>().Property(a => a.CandidateId).HasColumnName("candidateID");
            modelBuilder.Entity<Application>().Property(a => a.JobPostingId).HasColumnName("jobID");
            modelBuilder.Entity<Application>().Property(a => a.DateSubmitted).HasColumnName("Date_Submitted");
            modelBuilder.Entity<Application>().Property(a => a.Status).HasColumnName("Status");

            modelBuilder.Entity<RecruiterHmAssignment>().ToTable("Recruiter_HM_Assignments");
            modelBuilder.Entity<RecruiterHmAssignment>().HasKey(x => new { x.RecruiterId, x.HiringManagerId });
            modelBuilder.Entity<RecruiterHmAssignment>().Property(x => x.RecruiterId).HasColumnName("RecruiterID");
            modelBuilder.Entity<RecruiterHmAssignment>().Property(x => x.HiringManagerId).HasColumnName("HM_ID");
            modelBuilder.Entity<RecruiterHmAssignment>().Property(x => x.AssignedDate).HasColumnName("Assigned_Date");
            modelBuilder.Entity<RecruiterHmAssignment>().Property(x => x.Status).HasColumnName("Status");

            modelBuilder.Entity<AuditLog>().ToTable("AuditLogs");
            modelBuilder.Entity<AuditLog>().HasKey(a => a.Id);
            
            // Relationships
            modelBuilder.Entity<JobPosting>()
                .HasOne(j => j.Company)
                .WithMany()
                .HasForeignKey(j => j.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.JobPosting)
                .WithMany()
                .HasForeignKey(a => a.JobPostingId);

            modelBuilder.Entity<Company>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Recruiter>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<HiringManager>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SystemAdmin>().ToTable("SystemAdmin");
            modelBuilder.Entity<SystemAdmin>().HasKey(s => s.Id);
            modelBuilder.Entity<SystemAdmin>().Property(s => s.Id).HasColumnName("AdminID");
            modelBuilder.Entity<SystemAdmin>().Property(s => s.UserId).HasColumnName("userID");
            modelBuilder.Entity<SystemAdmin>().Property(s => s.Name).HasColumnName("Admin_Name");
            modelBuilder.Entity<SystemAdmin>().Property(s => s.Email).HasColumnName("email");
            modelBuilder.Entity<SystemAdmin>().Property(s => s.PasswordHash).HasColumnName("password_hashed");
            modelBuilder.Entity<SystemAdmin>().Property(s => s.JoinedDate).HasColumnName("joined_date");

            modelBuilder.Entity<SystemAdmin>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<HiringManager>()
                .HasOne<Company>()
                .WithMany()
                .HasForeignKey(h => h.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Candidate>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Candidate>()
                .HasOne<Recruiter>()
                .WithMany()
                .HasForeignKey(c => c.RecruiterId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.Candidate)
                .WithMany()
                .HasForeignKey(a => a.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RecruiterHmAssignment>()
                .HasOne<Recruiter>()
                .WithMany()
                .HasForeignKey(x => x.RecruiterId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RecruiterHmAssignment>()
                .HasOne<HiringManager>()
                .WithMany()
                .HasForeignKey(x => x.HiringManagerId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
