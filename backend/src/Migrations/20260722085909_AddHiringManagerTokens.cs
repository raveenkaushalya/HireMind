using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitmentPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class AddHiringManagerTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Job_application_Candidate_CandidateId1",
                table: "Job_application");

            migrationBuilder.DropIndex(
                name: "IX_Job_application_CandidateId1",
                table: "Job_application");

            migrationBuilder.DropColumn(
                name: "CandidateId1",
                table: "Job_application");

            migrationBuilder.RenameColumn(
                name: "CV_metadata_link",
                table: "Candidate",
                newName: "ResumeUrl");

            migrationBuilder.AddColumn<string>(
                name: "RegistrationToken",
                table: "Recruiter",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TokenExpiry",
                table: "Recruiter",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegistrationToken",
                table: "HiringManager",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "HiringManager",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "TokenExpiry",
                table: "HiringManager",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RegistrationToken",
                table: "Recruiter");

            migrationBuilder.DropColumn(
                name: "TokenExpiry",
                table: "Recruiter");

            migrationBuilder.DropColumn(
                name: "RegistrationToken",
                table: "HiringManager");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "HiringManager");

            migrationBuilder.DropColumn(
                name: "TokenExpiry",
                table: "HiringManager");

            migrationBuilder.RenameColumn(
                name: "ResumeUrl",
                table: "Candidate",
                newName: "CV_metadata_link");

            migrationBuilder.AddColumn<int>(
                name: "CandidateId1",
                table: "Job_application",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Job_application_CandidateId1",
                table: "Job_application",
                column: "CandidateId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Job_application_Candidate_CandidateId1",
                table: "Job_application",
                column: "CandidateId1",
                principalTable: "Candidate",
                principalColumn: "CandidateID");
        }
    }
}
