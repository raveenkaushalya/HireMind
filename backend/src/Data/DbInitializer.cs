using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;

using RecruitmentPlatform.API.Data; // Update with your actual namespace

public class DbInitializer
{
    private readonly string _connectionString;

    public DbInitializer(IConfiguration configuration)
    {
        // Ensure you have a "DefaultConnection" in your appsettings.json 
        // Example: "Server=localhost;Database=hiremindsdb;Trusted_Connection=True;TrustServerCertificate=True;"
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    public void Initialize()
    {
        CreateDatabaseIfNotExists();
        CreateTablesIfNotExists();
    }

    private void CreateDatabaseIfNotExists()
    {
        var connectionBuilder = new SqlConnectionStringBuilder(_connectionString);
        var databaseName = string.IsNullOrWhiteSpace(connectionBuilder.InitialCatalog)
            ? "RecruitmentPlatformDB"
            : connectionBuilder.InitialCatalog;

        try
        {
            // First check if we can connect to the target database directly
            using var targetConn = new SqlConnection(_connectionString);
            targetConn.Open();
            // If we successfully opened it, the database already exists!
            Console.WriteLine($"Database '{databaseName}' already exists. Skipping creation.");
            return;
        }
        catch (SqlException)
        {
            // Database might not exist, proceed to try creating it via master
            Console.WriteLine($"Database '{databaseName}' may not exist. Trying to create it via master...");
        }

        // Temporarily swap the database name to 'master' to check whether the target database exists.
        connectionBuilder.InitialCatalog = "master";

        try
        {
            using var connection = new SqlConnection(connectionBuilder.ConnectionString);
            connection.Open();

            var checkDbCommand = new SqlCommand($"SELECT db_id('{databaseName}')", connection);
            var dbId = checkDbCommand.ExecuteScalar();

            if (dbId == DBNull.Value || dbId == null)
            {
                var createDbCommand = new SqlCommand($"CREATE DATABASE [{databaseName}]", connection);
                createDbCommand.ExecuteNonQuery();
                Console.WriteLine($"Database '{databaseName}' created successfully.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Could not check/create database via master (this is normal for hosted DBs if the DB already exists): {ex.Message}");
        }
    }

    private void CreateTablesIfNotExists()
    {
        // The order is critical here to ensure Foreign Key constraints are respected
        string[] tableCreationScripts = {
            @"IF OBJECT_ID(N'dbo.users', N'U') IS NULL 
            CREATE TABLE users (
                userID INT IDENTITY(1,1) PRIMARY KEY,
                full_name NVARCHAR(255) NULL,
                email NVARCHAR(255) NOT NULL,
                password_hash NVARCHAR(255) NOT NULL,
                role NVARCHAR(50) NOT NULL,
                is_active BIT NOT NULL DEFAULT 1,
                created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
            );",

            @"IF OBJECT_ID(N'dbo.Company', N'U') IS NULL 
            CREATE TABLE Company (
                CompanyID INT IDENTITY(1,1) PRIMARY KEY,
                userID INT FOREIGN KEY REFERENCES users(userID),
                Company_Name NVARCHAR(255),
                industry NVARCHAR(255),
                company_email NVARCHAR(255),
                company_phone_number NVARCHAR(50),
                location NVARCHAR(255),
                company_size NVARCHAR(50),
                company_description NVARCHAR(MAX),
                Contact_person_name NVARCHAR(255),
                Contact_person_number NVARCHAR(50),
                Proof_documents_metadata_link NVARCHAR(MAX),
                RegistrationToken NVARCHAR(MAX),
                TokenExpiry DATETIME2,
                Status NVARCHAR(50) NOT NULL DEFAULT 'Pending'
            );",

            @"IF OBJECT_ID(N'dbo.Recruiter', N'U') IS NULL 
            CREATE TABLE Recruiter (
                RecruiterID INT IDENTITY(1,1) PRIMARY KEY,
                userID INT FOREIGN KEY REFERENCES users(userID),
                Recruiter_Name NVARCHAR(255) NOT NULL,
                email NVARCHAR(255) NOT NULL,
                password_hashed NVARCHAR(255),
                joined_date DATETIME2,
                status NVARCHAR(50),
                RegistrationToken NVARCHAR(MAX),
                TokenExpiry DATETIME2
            );",

            @"IF OBJECT_ID(N'dbo.HiringManager', N'U') IS NULL 
            CREATE TABLE HiringManager (
                HM_ID INT IDENTITY(1,1) PRIMARY KEY,
                userID INT FOREIGN KEY REFERENCES users(userID),
                CompanyID INT FOREIGN KEY REFERENCES Company(CompanyID),
                Hiring_Manager_Name NVARCHAR(255) NOT NULL,
                department NVARCHAR(255),
                email NVARCHAR(255) NOT NULL,
                password_hashed NVARCHAR(255),
                joined_date DATETIME2,
                RegistrationToken NVARCHAR(MAX),
                TokenExpiry DATETIME2,
                Status NVARCHAR(50) NOT NULL DEFAULT 'Pending'
            );",

            @"IF OBJECT_ID(N'dbo.Candidate', N'U') IS NULL 
            CREATE TABLE Candidate (
                CandidateID INT IDENTITY(1,1) PRIMARY KEY,
                RecruiterID INT NULL FOREIGN KEY REFERENCES Recruiter(RecruiterID),
                userID INT FOREIGN KEY REFERENCES users(userID),
                Candidate_Name NVARCHAR(255) NOT NULL,
                email NVARCHAR(255) NOT NULL,
                password_hashed NVARCHAR(255),
                phone_number NVARCHAR(50),
                location NVARCHAR(255),
                current_job_title NVARCHAR(255),
                experience_level NVARCHAR(100),
                education NVARCHAR(255),
                skills NVARCHAR(MAX),
                linkedin_url NVARCHAR(255),
                CV_metadata_link NVARCHAR(MAX),
                Bio NVARCHAR(MAX)
            );",

            @"IF OBJECT_ID(N'dbo.job', N'U') IS NULL 
            CREATE TABLE job (
                JobID INT IDENTITY(1,1) PRIMARY KEY,
                CompanyID INT FOREIGN KEY REFERENCES Company(CompanyID),
                job_title NVARCHAR(255) NOT NULL,
                type NVARCHAR(50),
                category NVARCHAR(100) NOT NULL DEFAULT 'Engineering',
                location NVARCHAR(255),
                salary_range NVARCHAR(100),
                applicants INT DEFAULT 0,
                years_of_experience_needed NVARCHAR(50),
                posted_date DATETIME2,
                closing_date DATETIME2,
                skills_needed NVARCHAR(MAX),
                description_about_the_role NVARCHAR(MAX),
                responsibilities NVARCHAR(MAX),
                requirements NVARCHAR(MAX),
                description_about_the_company NVARCHAR(MAX),
                status NVARCHAR(50)
            );",

            // Add category column to existing job table if it doesn't exist
            @"IF OBJECT_ID(N'dbo.job', N'U') IS NOT NULL AND NOT EXISTS (
                SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'job' AND COLUMN_NAME = 'category'
            )
            BEGIN
                ALTER TABLE job ADD category NVARCHAR(100) NOT NULL DEFAULT 'Engineering';
            END",

            @"IF OBJECT_ID(N'dbo.Recruiter_HM_Assignments', N'U') IS NULL 
            CREATE TABLE Recruiter_HM_Assignments (
                RecruiterID INT FOREIGN KEY REFERENCES Recruiter(RecruiterID),
                HM_ID INT FOREIGN KEY REFERENCES HiringManager(HM_ID),
                Assigned_Date DATETIME2,
                Status NVARCHAR(50),
                PRIMARY KEY (RecruiterID, HM_ID)
            );",

            @"IF OBJECT_ID(N'dbo.Job_application', N'U') IS NULL 
            CREATE TABLE Job_application (
                ApplicationID INT IDENTITY(1,1) PRIMARY KEY,
                candidateID INT FOREIGN KEY REFERENCES Candidate(CandidateID),
                jobID INT FOREIGN KEY REFERENCES job(JobID),
                Date_Submitted DATETIME2,
                Status NVARCHAR(50)
            );",

            @"IF OBJECT_ID(N'dbo.AuditLogs', N'U') IS NULL 
            CREATE TABLE AuditLogs (
                Id INT IDENTITY(1,1) PRIMARY KEY,
                UserId INT NULL,
                Action NVARCHAR(255) NOT NULL,
                Details NVARCHAR(MAX) NULL,
                Timestamp DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
            );",

            @"IF OBJECT_ID(N'dbo.SystemAdmin', N'U') IS NULL 
            CREATE TABLE SystemAdmin (
                AdminID INT IDENTITY(1,1) PRIMARY KEY,
                userID INT FOREIGN KEY REFERENCES users(userID),
                Admin_Name NVARCHAR(255) NOT NULL,
                email NVARCHAR(255) NOT NULL,
                password_hashed NVARCHAR(255),
                joined_date DATETIME2
            );"
        };

        using var connection = new SqlConnection(_connectionString);
        connection.Open();

        foreach (var sql in tableCreationScripts)
        {
            using var command = new SqlCommand(sql, connection);
            command.ExecuteNonQuery();
        }

        Console.WriteLine("All tables verified/created successfully.");
    }
}