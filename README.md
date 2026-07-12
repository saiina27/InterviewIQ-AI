# 🚀 InterviewIQ AI

An AI-powered mock interview platform that analyzes resumes, predicts suitable job roles, conducts technical interviews, monitors interview integrity using AI proctoring, and generates detailed performance reports.

## 🌐 Live Demo

* **Frontend:** https://interview-iq-ai-lyart.vercel.app
* **Backend API:** https://interviewiq-ai-ctde.onrender.com

---

## ✨ Features

### 📄 Resume Analysis

* PDF Resume Upload
* Resume Parsing
* ATS Score Calculation
* Skills Extraction
* Missing Skills Detection
* AI Resume Review
* Resume Improvement Suggestions
* Role Prediction

### 🎤 AI Interview

* AI Generated Interview Questions
* Role-based Questions
* Difficulty Levels
* Answer Submission
* Speech-to-Text Support
* Automatic Interview Flow

### 🛡️ AI Proctoring

* Webcam Face Detection
* No Face Detection
* Multiple Face Detection
* Tab Switching Detection
* Cheating Event Logging
* Automatic Interview Termination after Multiple Violations

### 📊 Performance Report

* Question-wise Evaluation
* Overall Score
* Analytics Dashboard
* Cheating Summary
* PDF Report Download

---

# 🏗️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* FastAPI
* SQLAlchemy
* Python

### Database

* PostgreSQL
* Neon PostgreSQL (Production)

### AI

* Google Gemini API
* OpenCV
* Speech Recognition

### Deployment

* Vercel
* Render
* Docker
* Docker Compose

---

# 📁 Project Structure

```
InterviewIQ-AI
│
├── backend
│   ├── app
│   ├── routers
│   ├── services
│   ├── models
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
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

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn backend.app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🐳 Docker

Start the complete application using Docker Compose.

```bash
docker compose up --build
```

Services:

* Frontend → http://localhost:5173
* Backend → http://localhost:8000
* PostgreSQL → localhost:5432

---

# 🔑 Environment Variables

Create a `.env` file inside the backend.

```env
DATABASE_URL=your_database_url

GEMINI_API_KEY=your_gemini_api_key
```

Create a `.env` file inside the frontend.

```env
VITE_API_URL=https://interviewiq-ai-ctde.onrender.com
```

---

# 📈 Future Improvements

* Gemini SDK Migration
* Authentication
* Interview History
* HR Dashboard
* Email Reports
* Video Recording
* Company-specific Interview Sets
* LLM Evaluation Improvements

---

# 👩‍💻 Author

**Saina Yadav**

* GitHub: https://github.com/saiina27
* LinkedIn: Add your LinkedIn profile here.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
