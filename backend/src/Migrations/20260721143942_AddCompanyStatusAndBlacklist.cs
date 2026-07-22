using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitmentPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyStatusAndBlacklist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Details = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BlacklistedEmails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BlacklistedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlacklistedEmails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    userID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    full_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    password_hash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.userID);
                });

            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    CompanyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userID = table.Column<int>(type: "int", nullable: true),
                    Company_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    industry = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    company_email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    company_phone_number = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    company_size = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    company_description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Contact_person_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Contact_person_number = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Proof_documents_metadata_link = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "Pending"),
                    RegistrationToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TokenExpiry = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.CompanyID);
                    table.ForeignKey(
                        name: "FK_Company_users_userID",
                        column: x => x.userID,
                        principalTable: "users",
                        principalColumn: "userID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Recruiter",
                columns: table => new
                {
                    RecruiterID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userID = table.Column<int>(type: "int", nullable: true),
                    Recruiter_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password_hashed = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    joined_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recruiter", x => x.RecruiterID);
                    table.ForeignKey(
                        name: "FK_Recruiter_users_userID",
                        column: x => x.userID,
                        principalTable: "users",
                        principalColumn: "userID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SystemAdmin",
                columns: table => new
                {
                    AdminID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userID = table.Column<int>(type: "int", nullable: false),
                    Admin_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password_hashed = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    joined_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemAdmin", x => x.AdminID);
                    table.ForeignKey(
                        name: "FK_SystemAdmin_users_UserId1",
                        column: x => x.UserId1,
                        principalTable: "users",
                        principalColumn: "userID");
                    table.ForeignKey(
                        name: "FK_SystemAdmin_users_userID",
                        column: x => x.userID,
                        principalTable: "users",
                        principalColumn: "userID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HiringManager",
                columns: table => new
                {
                    HM_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userID = table.Column<int>(type: "int", nullable: true),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    Hiring_Manager_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    department = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password_hashed = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    joined_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HiringManager", x => x.HM_ID);
                    table.ForeignKey(
                        name: "FK_HiringManager_Company_CompanyID",
                        column: x => x.CompanyID,
                        principalTable: "Company",
                        principalColumn: "CompanyID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HiringManager_users_userID",
                        column: x => x.userID,
                        principalTable: "users",
                        principalColumn: "userID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "job",
                columns: table => new
                {
                    JobID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(type: "int", nullable: false),
                    job_title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    salary_range = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    applicants = table.Column<int>(type: "int", nullable: false),
                    years_of_experience_needed = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    posted_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    closing_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    skills_needed = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description_about_the_role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    responsibilities = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    requirements = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description_about_the_company = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_job", x => x.JobID);
                    table.ForeignKey(
                        name: "FK_job_Company_CompanyID",
                        column: x => x.CompanyID,
                        principalTable: "Company",
                        principalColumn: "CompanyID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Candidate",
                columns: table => new
                {
                    CandidateID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecruiterID = table.Column<int>(type: "int", nullable: true),
                    userID = table.Column<int>(type: "int", nullable: true),
                    Candidate_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password_hashed = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    phone_number = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    current_job_title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    experience_level = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    education = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    skills = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    linkedin_url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CV_metadata_link = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Candidate", x => x.CandidateID);
                    table.ForeignKey(
                        name: "FK_Candidate_Recruiter_RecruiterID",
                        column: x => x.RecruiterID,
                        principalTable: "Recruiter",
                        principalColumn: "RecruiterID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Candidate_users_userID",
                        column: x => x.userID,
                        principalTable: "users",
                        principalColumn: "userID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Recruiter_HM_Assignments",
                columns: table => new
                {
                    RecruiterID = table.Column<int>(type: "int", nullable: false),
                    HM_ID = table.Column<int>(type: "int", nullable: false),
                    Assigned_Date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recruiter_HM_Assignments", x => new { x.RecruiterID, x.HM_ID });
                    table.ForeignKey(
                        name: "FK_Recruiter_HM_Assignments_HiringManager_HM_ID",
                        column: x => x.HM_ID,
                        principalTable: "HiringManager",
                        principalColumn: "HM_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Recruiter_HM_Assignments_Recruiter_RecruiterID",
                        column: x => x.RecruiterID,
                        principalTable: "Recruiter",
                        principalColumn: "RecruiterID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Job_application",
                columns: table => new
                {
                    ApplicationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    candidateID = table.Column<int>(type: "int", nullable: false),
                    jobID = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date_Submitted = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CandidateId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Job_application", x => x.ApplicationID);
                    table.ForeignKey(
                        name: "FK_Job_application_Candidate_CandidateId1",
                        column: x => x.CandidateId1,
                        principalTable: "Candidate",
                        principalColumn: "CandidateID");
                    table.ForeignKey(
                        name: "FK_Job_application_Candidate_candidateID",
                        column: x => x.candidateID,
                        principalTable: "Candidate",
                        principalColumn: "CandidateID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Job_application_job_jobID",
                        column: x => x.jobID,
                        principalTable: "job",
                        principalColumn: "JobID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlacklistedEmails_Email",
                table: "BlacklistedEmails",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Candidate_RecruiterID",
                table: "Candidate",
                column: "RecruiterID");

            migrationBuilder.CreateIndex(
                name: "IX_Candidate_userID",
                table: "Candidate",
                column: "userID");

            migrationBuilder.CreateIndex(
                name: "IX_Company_userID",
                table: "Company",
                column: "userID");

            migrationBuilder.CreateIndex(
                name: "IX_HiringManager_CompanyID",
                table: "HiringManager",
                column: "CompanyID");

            migrationBuilder.CreateIndex(
                name: "IX_HiringManager_userID",
                table: "HiringManager",
                column: "userID");

            migrationBuilder.CreateIndex(
                name: "IX_job_CompanyID",
                table: "job",
                column: "CompanyID");

            migrationBuilder.CreateIndex(
                name: "IX_Job_application_candidateID",
                table: "Job_application",
                column: "candidateID");

            migrationBuilder.CreateIndex(
                name: "IX_Job_application_CandidateId1",
                table: "Job_application",
                column: "CandidateId1");

            migrationBuilder.CreateIndex(
                name: "IX_Job_application_jobID",
                table: "Job_application",
                column: "jobID");

            migrationBuilder.CreateIndex(
                name: "IX_Recruiter_userID",
                table: "Recruiter",
                column: "userID");

            migrationBuilder.CreateIndex(
                name: "IX_Recruiter_HM_Assignments_HM_ID",
                table: "Recruiter_HM_Assignments",
                column: "HM_ID");

            migrationBuilder.CreateIndex(
                name: "IX_SystemAdmin_userID",
                table: "SystemAdmin",
                column: "userID");

            migrationBuilder.CreateIndex(
                name: "IX_SystemAdmin_UserId1",
                table: "SystemAdmin",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                table: "users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "BlacklistedEmails");

            migrationBuilder.DropTable(
                name: "Job_application");

            migrationBuilder.DropTable(
                name: "Recruiter_HM_Assignments");

            migrationBuilder.DropTable(
                name: "SystemAdmin");

            migrationBuilder.DropTable(
                name: "Candidate");

            migrationBuilder.DropTable(
                name: "job");

            migrationBuilder.DropTable(
                name: "HiringManager");

            migrationBuilder.DropTable(
                name: "Recruiter");

            migrationBuilder.DropTable(
                name: "Company");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
