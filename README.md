# 🚀 InterviewIQ AI

<p align="center">
  <b>AI-Powered Mock Interview Platform with Resume Intelligence, Automated Interviews, and AI Proctoring</b>
</p>

<p align="center">
  <a href="https://interview-iq-ai-lyart.vercel.app">Live Demo</a> •
  <a href="https://interviewiq-ai-ctde.onrender.com">Backend API</a>
</p>

---

## 📌 Overview

InterviewIQ AI is an end-to-end AI-powered interview preparation platform that analyzes resumes, calculates ATS compatibility, predicts suitable job roles, generates personalized technical interviews, evaluates candidate responses, monitors interview integrity using AI proctoring, and generates detailed performance reports.

The platform combines **Generative AI, Natural Language Processing, Speech Recognition, Computer Vision, and Full Stack Development** to simulate a real interview environment.

---

# ✨ Features

## 📄 Resume Intelligence

* PDF Resume Upload
* Resume Text Extraction
* ATS Compatibility Score
* Skills Extraction
* Missing Skills Identification
* AI Resume Review
* Resume Improvement Suggestions
* AI-based Role Prediction

---

## 🎤 AI Interview System

* Role-based Interview Generation
* AI-generated Technical Questions
* Difficulty-based Questions
* Automated Interview Flow
* Answer Submission
* Speech-to-Text Support
* AI Answer Evaluation

---

## 🛡️ AI Interview Proctoring

* Real-time Webcam Monitoring
* Face Detection
* No Face Detection
* Multiple Face Detection
* Tab Switch Detection
* Cheating Event Logging
* Automatic Interview Termination After Multiple Violations

---

## 📊 Performance Analytics

* Question-wise Evaluation
* Overall Interview Score
* Strength & Weakness Analysis
* Cheating Activity Summary
* Interactive Analytics Dashboard
* PDF Performance Report Generation

---

# 🏗️ System Architecture

![InterviewIQ Architecture](screenshots/architecture.png)

Workflow:

```
Resume Upload
      |
      ↓
Resume Parser
      |
      ↓
ATS Analyzer + AI Review
      |
      ↓
Role Prediction
      |
      ↓
AI Interview Generator
      |
      ↓
Interview Session
      |
      ├── Speech Recognition
      ├── Face Detection
      ├── Tab Monitoring
      └── Answer Evaluation
      |
      ↓
Analytics Dashboard
      |
      ↓
PDF Report
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

## Backend

* Python
* FastAPI
* SQLAlchemy

## AI & ML

* Google Gemini API
* NLP
* OpenCV
* Speech Recognition

## Database

* PostgreSQL
* Neon PostgreSQL

## Deployment & DevOps

* Docker
* Docker Compose
* Vercel
* Render

---

# 📂 Project Structure

```
InterviewIQ-AI

├── backend
│   ├── app
│   ├── routers
│   ├── services
│   └── models
│
├── frontend
│   ├── src
│   └── public
│
├── ai
├── modules
├── reporting
├── core
├── data
│
├── docs
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# ⚙️ Local Installation

## Clone Repository

```bash
git clone https://github.com/saiina27/InterviewIQ-AI.git

cd InterviewIQ-AI
```

---

# Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn backend.app.main:app --reload
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🐳 Docker Deployment

Run the complete application:

```bash
docker compose up --build
```

Services:

```
Frontend  → localhost:5173

Backend   → localhost:8000

Database  → PostgreSQL
```

---

# 🔐 Environment Variables

Backend:

```env
DATABASE_URL=your_database_url

GEMINI_API_KEY=your_gemini_api_key
```

Frontend:

```env
VITE_API_URL=your_backend_url
```

---

# 📸 Screenshots

Coming soon:

* Dashboard
* Resume Analysis
* ATS Score
* AI Interview
* AI Proctoring
* Analytics Report

---

# 📚 Documentation

Detailed documentation:

* API Documentation → `docs/API.md`
* Architecture → `docs/ARCHITECTURE.md`
* Database Design → `docs/DATABASE.md`
* Deployment Guide → `docs/DEPLOYMENT.md`

---

# 🚀 Future Improvements

* User Authentication
* Interview History
* HR Dashboard
* Company-specific Interview Preparation
* Email Report Delivery
* Video Interview Recording
* Advanced LLM Evaluation

---

# 👩‍💻 Author

**Saina Yadav**

GitHub:
https://github.com/saiina27

LinkedIn:
Add your LinkedIn profile

---

⭐ If you found InterviewIQ AI useful, consider giving the repository a star.
