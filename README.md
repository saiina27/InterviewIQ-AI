# InterviewIQ AI

<p align="center">
  <img src="docs/images/banner.jpg" alt="InterviewIQ AI" width="100%" />
</p>

<h3 align="center">Turn a resume into a personalized AI interview — and turn the interview into actionable feedback.</h3>

<p align="center">
  <a href="https://interview-iq-ai-lyart.vercel.app">Live Demo</a> ·
  <a href="https://interviewiq-ai-ctde.onrender.com/docs">API Docs</a> ·
  <a href="https://github.com/saiina27/InterviewIQ-AI">GitHub Repository</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%2B%20Groq-8E75B2?style=flat-square" alt="AI" />
  <img src="https://img.shields.io/badge/Deployment-Vercel%20%2B%20Render-000000?style=flat-square" alt="Deployment" />
</p>

---

## 👋 What is InterviewIQ AI?

**InterviewIQ AI is an end-to-end interview preparation platform.**

Instead of making a candidate use separate tools for resume checking, ATS scoring, interview practice, cheating/integrity monitoring, feedback, analytics, and reports, InterviewIQ brings the complete preparation journey into one application.

### In simple words

> **Upload your resume → understand how strong it is → get a role prediction → take a personalized AI interview → receive answer-by-answer feedback → see your performance → download your report.**

This makes the project easy to understand even if you are **not from a technical background**.

### 🎯 The problem it solves

Job preparation is usually fragmented:

- One tool checks your resume.
- Another checks ATS compatibility.
- Another provides mock interviews.
- Another tracks interview performance.
- Feedback is often generic and disconnected from the candidate's actual resume.

**InterviewIQ connects these steps into one continuous workflow.**

---

## 🌟 Why this project stands out

| Capability | What the user gets |
|---|---|
| 📄 **AI Resume Analysis** | Upload a PDF resume and get structured analysis. |
| 📊 **ATS Scoring** | A 0–100 score based on relevant skills, experience, practical evidence, education and completeness. |
| 🎯 **Role Prediction** | An AI-assisted prediction of the candidate's best-fit role. |
| 🧠 **Resume Review** | Recruiter-style strengths, improvement areas and suggestions. |
| 🎤 **AI Mock Interview** | Role, skills, experience and difficulty are used to generate interview questions. |
| 🤖 **Answer Evaluation** | Answers receive a score, relevance/correctness assessment, feedback and skill tags. |
| 🛡️ **Interview Integrity** | Webcam face detection and browser tab-switch monitoring are used during interviews. |
| 📈 **Performance Analytics** | Interview statistics, question-level performance and skill breakdown. |
| 📑 **PDF Reports** | A downloadable report containing interview results, feedback and integrity information. |
| 🕘 **Interview History** | Previous interviews can be reviewed from the dashboard. |
| 🔐 **Authentication** | JWT-based signup/login and protected user flows. |
| ⚡ **AI Fallbacks** | Built-in fallback question/evaluation logic helps keep the interview flow usable when an AI service is unavailable. |
| 🐳 **Docker Ready** | Frontend, backend and PostgreSQL can be run together with Docker Compose. |

---

## 🚀 See it in action

<p align="center">
  <img src="docs/images/demo-preview.gif" alt="InterviewIQ AI demo" width="92%" />
</p>

---

# 🧭 User Journey

The product is designed as one simple journey:

```text
┌──────────────────────┐
│  1. Create Account   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  2. Upload Resume    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  3. AI Resume Review │
│  ATS + Skills + Role │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  4. Start Interview  │
│  Personalized Qs     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  5. Answer Questions │
│  Text / Voice input  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  6. AI Evaluation    │
│  Score + Feedback    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  7. Final Report     │
│  Analytics + PDF     │
└──────────────────────┘
```

---

# 📸 Product Walkthrough

## 1. Landing page

A clear starting point that explains the platform and its core capabilities.

<p align="center">
  <img src="docs/images/landing.jpg" alt="InterviewIQ AI landing page" width="92%" />
</p>

## 2. Login & Resume Upload

Candidates create an account and upload their resume as a PDF.

<table>
<tr>
<td width="50%" align="center">
<img src="docs/images/login.jpg" alt="Login page" width="100%" />
<br/><sub><b>Secure login</b></sub>
</td>
<td width="50%" align="center">
<img src="docs/images/upload.jpg" alt="Resume upload" width="100%" />
<br/><sub><b>Resume upload</b></sub>
</td>
</tr>
</table>

## 3. Candidate Dashboard

The dashboard brings the candidate's key information together: ATS score, predicted role, skills and interview activity.

<p align="center">
  <img src="docs/images/dashboard.jpg" alt="InterviewIQ AI dashboard" width="92%" />
</p>

## 4. AI Resume Analysis

The platform extracts resume text, evaluates it and presents the results in a human-readable format.

<p align="center">
  <img src="docs/images/resume-analysis.jpg" alt="AI resume analysis" width="88%" />
</p>

The analysis includes:

- ATS score
- Matched skills
- Skills that need strengthening
- Predicted role
- Resume suggestions
- AI resume review

## 5. AI Hiring-Manager Review

The resume is also reviewed from a recruiter-style perspective.

<p align="center">
  <img src="docs/images/ai-hiring-review.jpg" alt="AI hiring manager review" width="90%" />
</p>

## 6. Personalized Improvement Plan

Instead of only saying "your resume needs improvement", the system provides concrete suggestions based on the candidate's analysis.

<p align="center">
  <img src="docs/images/improvement-plan.jpg" alt="Resume improvement plan" width="88%" />
</p>

## 7. AI Mock Interview

The interview engine generates questions based on the candidate's role, skills, experience and selected difficulty.

<p align="center">
  <img src="docs/images/ai-interview.jpg" alt="AI mock interview" width="92%" />
</p>

Candidates can answer using:

- ⌨️ Typed responses
- 🎙️ Browser speech recognition / voice input

## 8. Interview Integrity Monitoring

During an interview, the application can:

- Monitor the webcam for face presence.
- Detect multiple faces.
- Record integrity events.
- Detect when the interview tab becomes hidden.
- Warn the candidate about tab switching.
- Automatically terminate the interview after the third tab switch.

<p align="center">
  <img src="docs/images/tab-switch-warning.jpg" alt="Tab switch warning" width="68%" />
</p>

<p align="center">
  <img src="docs/images/interview-terminated.jpg" alt="Interview terminated" width="55%" />
</p>

### How the monitoring works

```text
Webcam
   │
   ├── Capture frame
   │
   └── Face detection
          │
          ├── 0 faces → integrity event
          ├── 1 face  → normal
          └── >1 face → integrity event

Browser visibility
   │
   └── Tab becomes hidden
          │
          ├── Warning 1
          ├── Warning 2
          └── Warning 3 → interview terminated
```

The webcam check runs every **3 seconds** during the interview.

> **Note:** This is an integrity/proctoring feature, not a replacement for a professional examination proctoring system.

## 9. Interview Report

After the interview, the candidate receives a consolidated report.

<p align="center">
  <img src="docs/images/interview-report.jpg" alt="Interview report" width="92%" />
</p>

The report can include:

- Overall performance
- Average / highest / lowest score
- Question-wise evaluation
- Strong / average / weak skills
- Executive summary
- Feedback
- Hiring recommendation
- Integrity review

## 10. Integrity Review

Integrity events are presented separately from interview performance.

<p align="center">
  <img src="docs/images/integrity-review.jpg" alt="Integrity review" width="88%" />
</p>

## 11. Interview History

Past interviews can be revisited from the candidate's history.

<p align="center">
  <img src="docs/images/interview-history.jpg" alt="Interview history" width="92%" />
</p>

---

# 🧠 How the AI layer works

InterviewIQ uses different AI responsibilities instead of forcing one model to do everything.

### Resume intelligence

```text
Resume PDF
   ↓
PyMuPDF text extraction
   ↓
Resume analysis service
   ↓
Gemini 2.5 Flash
   ↓
Role prediction + AI review + skill insights
   ↓
Deterministic ATS scoring
   ↓
Candidate dashboard
```

### Interview intelligence

```text
Candidate profile
      +
Predicted role
      +
Skills
      +
Experience
      +
Difficulty
      ↓
Question generation
      ↓
Candidate answer
      ↓
AI evaluation
      ↓
Score + relevance + correctness
      + feedback + missing points + skill tags
```

### AI provider strategy

| AI provider | Responsibility |
|---|---|
| **Google Gemini 2.5 Flash** | Resume analysis, resume review and core AI generation. |
| **Groq — `openai/gpt-oss-120b`** | Interview answer evaluation and interview intelligence. |
| **Local fallback logic** | Keeps core interview evaluation/question flow usable when an AI provider is unavailable. |

---

# 📊 ATS Scoring

The ATS score is intentionally based on more than simply counting keywords.

The scoring system considers:

| Component | Weight |
|---|---:|
| Relevant skill coverage | **40** |
| Professional experience | **20** |
| Practical application / evidence | **15** |
| Education & qualifications | **10** |
| Resume completeness | **15** |
| **Total** | **100** |

The goal is to make the score more explainable than a simple keyword counter.

---

# 🏗️ Architecture

```mermaid
flowchart TB

    U[Candidate]

    subgraph FE["Frontend — React 19 + Vite"]
        UI[Dashboard / Resume / Interview / Report]
        CAM[Webcam + Browser Speech + Tab Visibility]
    end

    subgraph BE["Backend — FastAPI"]
        AUTH[Authentication]
        CAND[Candidate / Resume APIs]
        INT[Interview APIs]
        SERVICES[AI / ATS / Analytics / Reporting Services]
    end

    DB[(PostgreSQL)]

    GEM[Google Gemini 2.5 Flash]
    GROQ[Groq — gpt-oss-120b]
    CV[OpenCV Face Detection]
    PDF[ReportLab + Matplotlib]

    U --> UI
    UI --> AUTH
    UI --> CAND
    UI --> INT
    CAM --> INT

    AUTH --> DB
    CAND --> SERVICES
    INT --> SERVICES

    SERVICES --> DB
    SERVICES --> GEM
    SERVICES --> GROQ
    INT --> CV
    SERVICES --> PDF
```

---

# 🧩 Backend architecture

The backend is organized around API routers, services, models and AI clients.

```text
backend/
├── app/
│   ├── ai/
│   │   ├── ai_gateway.py
│   │   ├── gemini_client.py
│   │   ├── groq_client.py
│   │   └── ai_resume_analyzer.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── candidate.py
│   │   └── interview.py
│   │
│   ├── services/
│   │   ├── resume_analysis_service.py
│   │   ├── resume_parser.py
│   │   ├── ats_scoring.py
│   │   ├── role_predictor.py
│   │   ├── role_skill_gap.py
│   │   ├── ai_resume_review.py
│   │   ├── suggestion_service.py
│   │   ├── interview_service.py
│   │   ├── answer_evaluation_service.py
│   │   ├── analytics_service.py
│   │   ├── report_service.py
│   │   ├── pdf_report_service.py
│   │   ├── face_detection.py
│   │   ├── resume_cache_service.py
│   │   └── fallback_questions.py
│   │
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── security.py
│   ├── database.py
│   ├── config.py
│   └── main.py
│
├── Dockerfile
└── requirements.txt
```

### Frontend structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   └── dashboard/
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── UploadResume.jsx
│   │   ├── ResumeResult.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Interview.jsx
│   │   ├── Report.jsx
│   │   ├── InterviewHistory.jsx
│   │   └── Profile.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── Dockerfile
```

---

# 🛠️ Tech Stack

| Layer | Technology | Why it is used |
|---|---|---|
| Frontend | **React 19** | Component-based web application UI |
| Frontend tooling | **Vite** | Fast development/build tooling |
| Routing | **React Router** | Application page navigation |
| UI / animation | **Tailwind CSS + Framer Motion** | Styling and UI interactions |
| API client | **Axios** | Frontend-to-backend HTTP communication |
| Backend | **FastAPI** | Python REST API framework |
| Database | **PostgreSQL** | Persistent relational data |
| ORM | **SQLAlchemy 2** | Database models and queries |
| Validation | **Pydantic / Pydantic Settings** | Request and configuration validation |
| AI | **Google Gemini 2.5 Flash** | Resume analysis and AI generation |
| AI | **Groq / gpt-oss-120b** | Interview answer evaluation |
| Resume parsing | **PyMuPDF** | Extracting text from PDF resumes |
| Computer vision | **OpenCV** | Webcam face detection |
| Authentication | **JWT + Passlib** | Login sessions and password hashing |
| Reports | **ReportLab** | PDF generation |
| Charts | **Matplotlib** | Performance visualizations |
| Containerization | **Docker + Docker Compose** | Reproducible local environment |
| Production frontend | **Vercel** | Frontend hosting |
| Production backend | **Render** | API hosting |
| Production database | **Neon PostgreSQL** | Managed PostgreSQL |

---

# 🔐 Authentication & Security

InterviewIQ uses a conventional token-based authentication flow:

```text
Signup / Login
     ↓
Password hashing
     ↓
JWT access token
     ↓
Frontend stores token
     ↓
Axios request interceptor
     ↓
Authorization: Bearer <token>
     ↓
Protected FastAPI endpoint
```

The backend also uses:

- Protected user routes
- Environment variables for secrets
- Password hashing
- JWT authentication
- CORS configuration
- SQLAlchemy ORM for database access

---

# ⚡ Resume Analysis Cache

InterviewIQ includes a resume analysis cache.

The system can fingerprint a resume and reuse an existing analysis instead of unnecessarily repeating expensive AI work.

```text
Resume
  ↓
SHA-256 fingerprint
  ↓
Already analyzed?
  ├── Yes → Reuse saved analysis
  └── No  → Run analysis → Save result
```

This improves:

- Response time
- Consistency
- AI API efficiency
- User experience

---

# 📑 Reporting Pipeline

The reporting layer turns interview data into both visual analytics and a downloadable PDF.

```text
Interview Answers
       ↓
Answer Scores
       ↓
Analytics Service
       ↓
Performance Summary
       ↓
Skill Breakdown
       ↓
Hiring Recommendation
       ↓
Chart + ReportLab PDF
```

---

# 🔌 API Overview

The FastAPI backend exposes endpoints around three main domains.

### Authentication

```text
POST /auth/signup
POST /auth/login
```

### Resume / Candidate

```text
POST /candidates/
GET  /candidates/
GET  /candidates/me
POST /candidates/upload-resume/
GET  /candidates/{candidate_id}
```

### Interview

```text
POST /interview/start
POST /interview/generate-questions
GET  /interview/{interview_id}/questions
GET  /interview/next-question/{interview_id}
POST /interview/answer
POST /interview/evaluate-answer/{answer_id}
GET  /interview/analytics/{interview_id}
GET  /interview/report/{interview_id}
GET  /interview/report/{interview_id}/pdf
POST /interview/cheating
POST /interview/detect-face
GET  /interview/history
```

Full interactive documentation:

**https://interviewiq-ai-ctde.onrender.com/docs**

---

# 🌐 Live Deployment

| Service | URL |
|---|---|
| 🌐 **Frontend** | https://interview-iq-ai-lyart.vercel.app |
| ⚙️ **Backend API** | https://interviewiq-ai-ctde.onrender.com |
| 📖 **Swagger / OpenAPI** | https://interviewiq-ai-ctde.onrender.com/docs |
| 💻 **GitHub** | https://github.com/saiina27/InterviewIQ-AI |

### Production flow

```text
Candidate
   ↓
Vercel — React Frontend
   ↓
Render — FastAPI Backend
   ↓
Neon PostgreSQL
   ↓
Gemini / Groq / OpenCV / Reporting
   ↓
Results
   ↓
Candidate Dashboard
```

---

# 💻 Run Locally

## Prerequisites

You can run InterviewIQ locally with Docker, or run the frontend/backend separately.

Recommended:

- Python 3.11
- Node.js 20+
- Docker Desktop
- PostgreSQL 16 (only needed for a non-Docker setup)
- Gemini API key
- Groq API key

---

## 1. Clone the repository

```bash
git clone https://github.com/saiina27/InterviewIQ-AI.git
cd InterviewIQ-AI
```

---

## 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/interviewiq
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
SECRET_KEY=replace-with-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

> Never commit real API keys or production secrets to GitHub.

---

# 🐳 Option A — Docker Compose

From the project root:

```bash
docker compose up --build
```

Services:

| Service | Local URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |

Stop the stack:

```bash
docker compose down
```

---

# 🐍 Option B — Run manually

## Backend

From the project root:

```bash
python -m venv venv
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

Start FastAPI:

```bash
uvicorn backend.app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

## Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🗃️ Database

The Docker setup starts PostgreSQL 16 automatically.

The application uses:

- PostgreSQL
- SQLAlchemy 2 ORM
- Relational models for users, candidates, interviews, questions, answers, integrity events and cached resume analysis

Core relationships:

```text
User
 │
 └── Candidate
       │
       └── Interview
            ├── Interview Questions
            │      └── Answers
            │
            └── Integrity Events
```

---

# 🧪 Fallback & Reliability

AI-powered products should not assume that an external model will always respond perfectly.

InterviewIQ includes defensive logic such as:

- JSON extraction/validation around AI responses
- Local fallback evaluation for interview answers
- Fallback interview questions
- Resume analysis caching
- Error handling around AI calls
- Persistent database records for interviews and evaluations

This means the project demonstrates not only **"calling an LLM"**, but also thinking about what happens when the LLM or an external service fails.

---

# 🧑‍💻 What this project demonstrates

For a technical reviewer, InterviewIQ demonstrates experience across multiple areas:

### Full-stack engineering
React frontend + FastAPI backend + PostgreSQL database.

### Applied AI
LLM-powered resume analysis, role prediction, question generation and answer evaluation.

### AI reliability
Structured JSON extraction, validation, fallback logic and cached analysis.

### Computer vision
OpenCV-based face detection integrated into an interview workflow.

### Authentication
JWT-based protected APIs and password hashing.

### Data modelling
Relational entities for candidates, interviews, questions, answers and integrity events.

### Analytics & reporting
Score calculations, performance analytics, charts and generated PDF reports.

### Product thinking
The project is organized around a real user problem instead of being only a collection of isolated AI demos.

### Deployment
Dockerized application with a production frontend/backend/database architecture.

---

# 👀 For a non-technical recruiter

If you only have **30 seconds**, this is the project:

> **InterviewIQ AI is a complete AI-powered interview preparation platform. A candidate uploads their resume, receives an ATS-style analysis and role recommendation, then takes a personalized mock interview. The system evaluates each answer, monitors basic interview integrity, and generates a detailed performance report that the candidate can download as a PDF.**

### Why that matters

It shows the ability to take an idea from:

**Problem → Product → AI → Backend → Database → Frontend → Deployment → Reporting**

rather than building only a single AI feature.

---

# 🎓 Example use case

Imagine a candidate applying for a **Python Backend Developer** role.

### Step 1 — Resume

They upload their resume.

InterviewIQ identifies:

- Python
- FastAPI
- PostgreSQL
- Docker
- REST APIs

and calculates an ATS-style score.

### Step 2 — Role

The system predicts the candidate's likely role and highlights strengths and missing areas.

### Step 3 — Interview

The candidate starts an interview at the selected difficulty.

Questions are generated around the candidate's role and skills.

### Step 4 — Evaluation

After every answer, the platform evaluates:

- Score
- Relevance
- Correctness
- Missing points
- Feedback
- Skill tags

### Step 5 — Report

At the end, the candidate gets:

- Overall performance
- Skill breakdown
- Interview summary
- Hiring recommendation
- Integrity information
- Downloadable PDF report

---

# 🛣️ Potential Next Improvements

Possible future directions include:

- 🎙️ More advanced real-time voice interviews
- 🏢 Company-specific interview modes
- 🌍 Multi-language interviews
- 📧 Email-based report delivery
- 👨‍💼 Recruiter/admin dashboard
- 📚 Larger role-specific question banks
- 🧠 More advanced LLM evaluation and rubric customization
- 📊 Long-term candidate progress tracking
- 🔎 More explainable ATS scoring

---

# 📂 Repository at a glance

```text
InterviewIQ-AI/
│
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── ai/           # AI provider clients/gateway
│   │   ├── routers/      # API routes
│   │   ├── services/     # Business logic
│   │   ├── models.py     # SQLAlchemy models
│   │   ├── schemas.py    # Pydantic schemas
│   │   ├── crud.py       # Database operations
│   │   ├── security.py   # JWT/auth helpers
│   │   └── main.py       # FastAPI entry point
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── core/                 # Core scoring logic
├── modules/              # Supporting modules
├── reporting/            # PDF/report helpers
├── data/                 # Skills/keyword data
├── reports/              # Generated report output
├── docker-compose.yml
└── README.md
```

---

# 👩‍💻 Author

**Saina Yadav**

- GitHub: https://github.com/saiina27

---

## ⭐ If you find this project interesting

Feel free to explore the repository, try the live application, or open the Swagger documentation to see how the backend is structured.

<p align="center">
  <a href="https://interview-iq-ai-lyart.vercel.app"><b>🚀 Try InterviewIQ AI</b></a>
  &nbsp; • &nbsp;
  <a href="https://github.com/saiina27/InterviewIQ-AI"><b>⭐ View on GitHub</b></a>
</p>
