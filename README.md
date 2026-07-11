# 🎤 InterviewIQ AI

An AI-powered Mock Interview Platform built using Python and Streamlit that helps candidates prepare for technical interviews through resume analysis, AI-generated questions, answer evaluation, and hiring recommendations.

---

## 🚀 Features

### 📄 Resume Analysis

* PDF Resume Upload
* Resume Parsing
* Automatic Skill Extraction

### 🎥 Webcam Monitoring

* Real-time Webcam Integration using streamlit-webrtc
* Candidate Activity Monitoring during Interviews
* Supports Interview Proctoring Simulation
* Foundation for Future Cheating Detection Features

### 🤖 AI Interview Generation

* AI-Generated Questions based on Resume
* Skill-Based Technical Questions
* Role-Based Interview Practice

### 🎤 Interview Simulation
- Speech-to-Text Answer Capture
- Text-Based Answer Submission
- Question-wise Timer
- Webcam Monitoring
- Real Interview Experience

### 📊 Performance Evaluation

* AI-Based Answer Evaluation
* Overall Interview Score Calculation
* Hiring Recommendation (Strong Hire / Hire / Consider / Reject)

### 📑 Report Generation

* Automated PDF Interview Report
* Question & Answer Summary
* Final Performance Score
* Hiring Recommendation Summary

### 🎥 Additional Features

* Webcam Monitoring Integration
* Streamlit Interactive User Interface

---

## 🧠 Tech Stack

* Python
* Streamlit
* Gemini AI
* SpeechRecognition
* PyPDF2
* ReportLab
* OpenCV
* NLP & LLM-based Evaluation

---

## 📂 Project Structure

```
InterviewIQ/
│
├── app.py                  # UI ONLY
├── main.py                 # ORCHESTRATOR (brain)
│
├── core/
│   ├── resume_parser.py
│   ├── skill_detector.py
│   ├── resume_match.py
│   ├── scoring.py
│   ├── question_engine.py   # MAIN QUESTION SYSTEM
│
├── ai/
│   ├── gemini_client.py     # ONLY AI calls
│
├── fallback/
│   ├── questions.py         # SAFE DEFAULT QUESTIONS
│
├── monitoring/
│   ├── webcam.py
│   ├── speech.py
│   ├── timer.py
│   ├── cheating_detector.py
│
├── reporting/
│   ├── pdf_report.py
│
├── data/
│   ├── skill.json
│
└── config.py

## 💡 Key Highlights

* AI-Powered Mock Interview System
* Resume-Aware Question Generation
* Speech-to-Text Integration
* Automated Candidate Evaluation
* Hiring Recommendation Engine
* PDF Report Generation
* End-to-End Interview Workflow

---

## 👩‍💻 Developer

**Saina Yadav**

B.Tech (Computer Science Engineering)
Amity University, Gurgaon

LinkedIn: https://www.linkedin.com/in/saina-yadav-6b0206354
