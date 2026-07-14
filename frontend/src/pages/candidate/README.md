# HireMind Frontend

React + Vite frontend for the AI Recruitment Platform.

## Main Areas
- `src/pages/home` - homepage and public landing sections
- `src/pages/auth` - login, register, forgot password, reset password
- `src/pages/about` - about us and company pages
- `src/pages/recruiter` - recruiter portal and dashboard
- `src/pages/hiring-manager` - hiring manager portal and dashboard
- `src/pages/admin` - admin portal and dashboard
- `src/pages/candidate` - candidate portal and dashboard
- `src/components` - reusable UI, layout, and form components
- `src/services` - API clients and data access helpers
- `src/routes` - app routing and protected route wrappers

## Candidate Portal

The Candidate Portal (mounted at `/candidate/*`) covers:

- **Profile builder** — personal info, education, work history, skills (`pages/candidate/ProfileBuilderPage.jsx`)
- **Resume/CV upload** — drag-drop + preview (`components/candidate/profile/ResumeUploadWidget.jsx`)
- **Job search** — filters for location, salary, role, skill tags (`pages/candidate/JobSearchPage.jsx`)
- **AI-recommended jobs feed** (`pages/candidate/RecommendedJobsPage.jsx`)
- **Application tracker** — visual pipeline, Applied → Screened → Interview → Offer (`pages/candidate/ApplicationTrackerPage.jsx`)
- **Interview schedule + confirmation** (`pages/candidate/InterviewSchedulePage.jsx`)
- **Chatbot widget** (bonus) — floating assistant on every candidate page (`components/candidate/chatbot/ChatbotWidget.jsx`)

`backend/src/HireMind.Api` doesn't expose candidate endpoints yet, so
`services/candidateApi.js` currently mocks the network layer (in-memory mock
data + `localStorage` persistence) behind the same function names/shapes a
real implementation would use. Swap the internals of that one file over to
real `fetch` calls once the API is ready — no component changes should be
needed.

Candidate-portal-specific styles live in `src/styles/candidate/` (design
tokens in `tokens.css`, shared layout/components, then one file per feature).
They're only imported by `CandidateLayout.jsx`, so they won't leak into other
sections of the app.
