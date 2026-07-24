# HireMind

**AI-Powered Recruitment and Talent Management Platform**

HireMind is a full-stack recruitment platform that uses AI to automate candidate screening, match resumes against job requirements, and surface explainable compatibility scores — while keeping final hiring decisions in the hands of recruiters. Built as a coursework project for SE205.3 – Software Engineering.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributors](#contributors)
- [License](#license)

---

## Overview

Traditional recruitment relies heavily on manual resume review, which is slow, inconsistent, and hard to scale. HireMind addresses this by combining a role-based recruitment platform (Candidate / Recruiter / Admin) with AI-driven resume parsing, candidate scoring, job matching, and an AI chatbot assistant — all backed by a normalized SQL Server database and a secure, stateless ASP.NET Core API.

## Features

- 🔐 **Role-based access** for Candidates, Recruiters, and Admins
- 📄 **Resume upload & AI parsing** with structured data extraction
- 🎯 **AI candidate scoring** with explainable compatibility breakdowns (e.g. *"85% match: strong in Java/Spring Boot, lacks AWS"*)
- 🔍 **Smart job search** matched to skills and experience, not just keywords
- 🤖 **AI chatbot** for candidate assistance with jobs, resumes, and interview prep
- 📊 **Recruitment analytics** dashboard for recruiters and admins
- 🧑‍⚖️ **Human-in-the-loop hiring** — AI ranks and explains, recruiters decide
- 🔒 **JWT authentication**, BCrypt password hashing, and role-based authorization

## Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Frontend       | React (Vite)                        |
| Backend        | ASP.NET Core Web API (C#)           |
| Database       | SQL Server                          |
| ORM            | Entity Framework Core               |
| Auth           | JWT (HMAC-SHA256), BCrypt           |
| AI Integration | External LLM API for scoring & chat |
| API Docs       | Swagger / OpenAPI                   |
| Testing        | Postman, Swagger UI                 |

## Architecture

HireMind follows a **3-tier architecture**:

```
React Frontend  →  ASP.NET Core Web API  →  SQL Server
                        │
          Controllers → Services → Repositories → EF Core DbContext
```

- The API is **stateless** (JWT-based auth), enabling horizontal scaling behind a load balancer.
- Business logic is decoupled from data access via the **Repository + Unit of Work** patterns.
- AI features (resume parsing, scoring, chatbot) are isolated behind service interfaces so the underlying provider can be swapped without touching controllers.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [.NET SDK](https://dotnet.microsoft.com/download) (8.0+)
- [SQL Server](https://www.microsoft.com/sql-server) (local instance via SSMS, or a container)
- Git

### Backend Setup

```bash
cd backend
dotnet restore
dotnet ef database update   # applies migrations
dotnet run
```

The API will be available at `https://localhost:<port>`, with Swagger UI at `/swagger`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Environment Variables

Create a `.env` file in `frontend/` and an `appsettings.Development.json` in `backend/` with values such as:

```
# Backend
ConnectionStrings__DefaultConnection=<your SQL Server connection string>
Jwt__Key=<your JWT signing key>
AI__ApiKey=<your LLM provider API key>

# Frontend
VITE_API_BASE_URL=https://localhost:<port>/api
```

> ⚠️ Never commit real secrets. Use `.env.example` / `appsettings.example.json` as templates.

## Project Structure

```
HireMind/
├── backend/
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Models/
│   ├── DTOs/
│   └── Program.cs
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── vite.config.js
└── README.md
```

## Design Patterns

| Pattern              | Purpose in HireMind                                              |
|-----------------------|--------------------------------------------------------------------|
| Repository            | Abstracts database operations from business logic                |
| Unit of Work          | Groups multiple repository operations into one transaction       |
| Dependency Injection  | Injects services/repositories into controllers                   |
| Factory               | Creates service objects dynamically (e.g. resume parsers)        |
| Strategy              | Swaps matching/scoring algorithms without changing system logic  |

## API Documentation

Once the backend is running, interactive API documentation is available via Swagger:

```
https://localhost:<port>/swagger
```

## Screenshots

> _Add screenshots of the Home page, Job Search, AI Chatbot, and Recruiter dashboard here._

## Contributors

| Name | Contribution |
|------|--------------|
| [Member 01] | Frontend UI development |
| [Member 02] | Backend API & authentication |
| [Member 03] | Database design |
| [Member 04] | AI matching & chatbot |
| [Member 05] | Testing & documentation |

## License

This project was developed for academic purposes as part of SE205.3 – Software Engineering coursework.
