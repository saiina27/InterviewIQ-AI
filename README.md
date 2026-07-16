# 🚀 InterviewIQ AI

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Framework-green)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)
![License](https://img.shields.io/badge/License-MIT-yellow)

An AI-powered mock interview platform that analyzes resumes, predicts suitable job roles, conducts AI-driven interviews, monitors interview integrity using AI proctoring, and generates detailed performance reports with analytics.

---

# 🌐 Live Demo

- **Frontend:** https://interview-iq-ai-lyart.vercel.app
- **Backend API:** https://interviewiq-ai-ctde.onrender.com

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- User Signup & Login
- Protected Routes
- Persistent Login Sessions
- User Profile Management

---

## 📄 Resume Analysis

- PDF Resume Upload
- Resume Parsing
- ATS Score Calculation
- Skills Extraction
- Matched & Missing Skills Detection
- AI Resume Review
- Resume Improvement Suggestions
- Job Role Prediction

---

## 🎤 AI Interview

- AI Generated Technical Questions
- Role-based Interviews
- Automatic Interview Flow
- Answer Submission
- Speech-to-Text Support
- AI Answer Evaluation

---

## 🛡️ AI Proctoring

- Webcam Face Detection
- No Face Detection
- Multiple Face Detection
- Tab Switching Detection
- Cheating Event Logging
- Automatic Interview Termination after Multiple Violations

---

## 📊 Dashboard

- Personalized Dashboard
- ATS Score Overview
- Predicted Job Role
- Matched Skills
- Missing Skills
- Resume Suggestions
- AI Resume Review
- Interview Performance Analytics

---

## 📜 Interview History

- View Previous Interviews
- Interview Scores
- Completion Status
- Report Access

---

## 📑 Performance Reports

- Question-wise Evaluation
- Overall Interview Score
- Percentage Calculation
- Performance Analytics
- Cheating Summary
- PDF Report Download

---

# 🏗️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API

## Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- JWT Authentication

## Database

- PostgreSQL
- Neon PostgreSQL

## Artificial Intelligence

- Google Gemini API
- OpenCV
- Speech Recognition

## Deployment

- Vercel
- Render
- Docker
- Docker Compose

---

# 🏛️ Architecture

```text
               React + Vite
                    │
                    ▼
            FastAPI REST APIs
                    │
                    ▼
              SQLAlchemy ORM
                    │
                    ▼
        PostgreSQL (Neon Database)
                    │
                    ▼
             Google Gemini API
```

---

# 📁 Project Structure

```text
InterviewIQ-AI
│
├── backend
│   ├── app
│   │   ├── routers
│   │   ├── services
│   │   ├── models
│   │   ├── schemas
│   │   ├── security.py
│   │   └── main.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   └── services
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# ⚙️ Local Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/saiina27/InterviewIQ-AI.git

cd InterviewIQ-AI
```

---

## 2️⃣ Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate      # macOS/Linux

# OR

venv\Scripts\activate         # Windows

pip install -r requirements.txt

uvicorn backend.app.main:app --reload
```

Backend runs on:

```
http://localhost:8000
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🐳 Docker

Run the complete application using Docker Compose.

```bash
docker compose up --build
```

Services:

- Frontend → http://localhost:5173
- Backend → http://localhost:8000
- PostgreSQL → localhost:5432

---

# 🔑 Environment Variables

## Backend (.env)

```env
DATABASE_URL=your_database_url

GEMINI_API_KEY=your_gemini_api_key

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Frontend (.env)

```env
VITE_API_URL=https://interviewiq-ai-ctde.onrender.com
```

---

# 🔗 Main API Endpoints

## Authentication

- POST `/auth/signup`
- POST `/auth/login`
- GET `/auth/me`
- PUT `/auth/me`

---

## Candidate

- POST `/candidates/upload-resume`
- GET `/candidates/me`

---

## Interview

- POST `/interview/start`
- GET `/interview/questions/{id}`
- POST `/interview/answer`
- GET `/interview/history`
- GET `/interview/analytics/{id}`
- GET `/interview/report/{id}`
- GET `/interview/report/{id}/pdf`

---

# 📈 Future Improvements

- AI Voice Interviewer
- Company-specific Interview Sets
- Multi-language Interviews
- Role-based Admin Dashboard
- Email Notifications
- Resume Version Management
- Video Recording
- Advanced LLM Evaluation
- Leaderboard & Analytics

---

# 👩‍💻 Author

**Saina Yadav**

- GitHub: https://github.com/saiina27
- LinkedIn: *(Add your LinkedIn profile here)*

---

# ⭐ Support

If you found this project useful, please consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates further development.