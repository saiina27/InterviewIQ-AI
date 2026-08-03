InterviewIQ AI



An AI-powered mock interview platform that helps candidates prepare for technical interviews by combining intelligent resume analysis, ATS scoring, AI-powered resume feedback, role prediction, automated mock interviews, AI proctoring, and detailed performance analytics.

🌟 Why InterviewIQ AI?

Preparing for technical interviews often requires multiple tools for resume review, ATS checking, interview practice, and performance tracking.

InterviewIQ AI combines all these capabilities into one platform, allowing candidates to:

Analyze resumes with AI

Improve ATS compatibility

Predict suitable job roles

Practice AI-generated interviews

Receive detailed AI feedback

Monitor interview integrity using AI proctoring

Download comprehensive interview reports

🌐 Live Demo

Frontend: https://interview-iq-ai-lyart.vercel.app

Backend API: https://interviewiq-ai-ctde.onrender.com

Swagger Docs: https://interviewiq-ai-ctde.onrender.com/docs

✨ Key Highlights

🤖 AI Resume Analysis

📄 ATS Score Calculation

🎯 Job Role Prediction

💡 AI Resume Review

🎤 AI Mock Interviews

🧠 AI Answer Evaluation

🛡️ AI Proctoring

📊 Performance Analytics

📑 PDF Report Generation

⚡ Resume Analysis Cache

🔐 JWT Authentication

🐳 Dockerized Deployment

🧠 AI Workflow

Resume Upload
      │
      ▼
PDF Parsing
      │
      ▼
ATS Score
      │
      ▼
Skill Extraction
      │
      ▼
Role Prediction
      │
      ▼
AI Resume Review
      │
      ▼
Interview Generation
      │
      ▼
Answer Evaluation
      │
      ▼
Analytics & PDF Report

🏗️ Architecture

React + Vite
      │
 REST API
      │
FastAPI
      │
SQLAlchemy ORM
      │
PostgreSQL
      │
Google Gemini API

🚀 Features

Authentication

JWT Authentication

Signup & Login

Protected APIs

Persistent Sessions

User Profile

Resume Analysis

PDF Upload

Resume Parsing

ATS Score

Skill Extraction

Missing Skills Detection

Resume Suggestions

AI Resume Review

Role Prediction

Resume Cache (SHA-256)

AI Interview

AI Question Generation

Role-based Interviews

Automatic Interview Flow

Answer Submission

AI Evaluation

AI Proctoring

Face Detection

Multiple Face Detection

No Face Detection

Tab Switching Detection

Cheating Logs

Automatic Interview Termination

Reports & Analytics

Interview History

Question-wise Evaluation

Performance Analytics

PDF Report Download

🛠️ Tech Stack

Layer

Technology

Frontend

React, Vite, Tailwind CSS

Backend

FastAPI, Python

ORM

SQLAlchemy

Database

PostgreSQL, Neon

AI

Google Gemini

Authentication

JWT

Proctoring

OpenCV

Reports

ReportLab, Matplotlib

Deployment

Docker, Render, Vercel

📂 Project Structure

InterviewIQ-AI/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── config.py
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
├── docker-compose.yml
├── README.md
└── .env.example

⚙️ Local Setup

git clone https://github.com/saiina27/InterviewIQ-AI.git
cd InterviewIQ-AI

Backend

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload

Frontend

cd frontend
npm install
npm run dev

🐳 Docker

docker compose build
docker compose up

Stop:

docker compose down

🔑 Environment Variables

DATABASE_URL=
GEMINI_API_KEY=
SECRET_KEY=
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

📖 API Endpoints

Module

Endpoint

Auth

/auth/signup

Auth

/auth/login

Resume

/candidates/upload-resume

Resume

/candidates/me

Interview

/interview/start

Interview

/interview/questions/{id}

Interview

/interview/answer

Report

/interview/report/{id}

Analytics

/interview/analytics/{id}

🚀 Production Features

Dockerized application

RESTful API architecture

Resume analysis cache

Modular FastAPI structure

Environment-based configuration

SQLAlchemy ORM

JWT authentication

AI-powered interview engine

AI proctoring

PDF reporting

🛣️ Roadmap

AI Voice Interviews

Company-specific Interview Modes

Multi-language Support

Email Notifications

Admin Dashboard

Advanced LLM Evaluation

👩‍💻 Author

Saina Yadav

GitHub: https://github.com/saiina27

📄 License

Licensed under the MIT License.

⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.