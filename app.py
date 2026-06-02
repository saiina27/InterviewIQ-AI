import json
import streamlit as st
import plotly.graph_objects as go

from modules.webcam import start_camera
from modules.questions import load_questions
from modules.ai_feedback import get_feedback
from modules.resume_parser import extract_resume_text
from modules.skill_detector import detect_skills
from modules.question_generator import generate_questions
from modules.pdf_report import generate_report
from modules.speech import speech_to_text
from modules.ai_score import evaluate_answer
from streamlit_autorefresh import st_autorefresh
from modules.resume_match import calculate_match

# ----------------------------
# PAGE CONFIG
# ----------------------------
st.set_page_config(
    page_title="InterviewIQ AI",
    page_icon="🎤",
    layout="wide"
)

st.title("🎤 InterviewIQ AI")
# ----------------------------
# LOAD DATA
# ----------------------------
questions = load_questions()

with open("data/keywords.json", "r") as file:
    keywords = json.load(file)
# ----------------------------
# ROLE + DIFFICULTY
# ----------------------------
role = st.selectbox("Select Interview Role", list(questions.keys()))

difficulty = st.selectbox(
    "Select Difficulty",
    ["Beginner", "Intermediate", "Advanced"]
)

role_questions = questions[role][difficulty]
# ----------------------------
# SESSION STATE INIT
# ----------------------------
if "index" not in st.session_state:
    st.session_state.index = 0

if "answers" not in st.session_state:
    st.session_state.answers = []

if "feedback_index" not in st.session_state:
    st.session_state.feedback_index = None

if "voice_text" not in st.session_state:
    st.session_state.voice_text = ""

if "time_left" not in st.session_state:
    st.session_state.time_left = 60

if "camera_on" not in st.session_state:
    st.session_state.camera_on = False

# reset on role change
current_selection = f"{role}_{difficulty}"

if "last_selection" not in st.session_state:
    st.session_state.last_selection = current_selection

if st.session_state.last_selection != current_selection:
    st.session_state.index = 0
    st.session_state.answers = []
    st.session_state.feedback_index = None
    st.session_state.time_left = 60
    st.session_state.last_selection = current_selection
# ----------------------------
# WEBCAM
# ----------------------------
st.subheader("📷 Webcam Monitoring")

if st.button("Start Webcam"):
    st.session_state.camera_on = True

if st.session_state.camera_on:
    start_camera()
# ----------------------------
# RESUME UPLOAD
# ----------------------------
uploaded_file = st.file_uploader("Upload Resume (PDF)", type=["pdf"])

if uploaded_file:
    resume_text = extract_resume_text(uploaded_file)
    skills = detect_skills(resume_text)

    st.subheader("Detected Skills")
    st.write(skills)

    match_score, matched_skills, required_skills = calculate_match(skills, role)

    st.subheader("🎯 Resume Match Analysis")
    st.metric("Resume Match Score", f"{match_score}%")

    st.write("Matched Skills")
    for s in matched_skills:
        st.success(s)

    st.write("Missing Skills")
    for s in required_skills:
        if s not in matched_skills:
            st.warning(s)

    st.subheader("Resume-Based Questions")
    for q in generate_questions(skills):
        st.write("•", q)
# ----------------------------
# TIMER
# ----------------------------
st_autorefresh(interval=1000, key="timer")

if st.session_state.time_left > 0:
    st.session_state.time_left -= 1
else:
    st.warning("⏰ Time Up!")


st.subheader("⏳ Time Remaining")
st.info(f"{st.session_state.time_left} sec")
# ----------------------------
# QUESTION
# ----------------------------
if st.session_state.index >= len(role_questions):
    st.session_state.index = 0

question = role_questions[st.session_state.index]

st.subheader("Question")
st.info(question)
# ----------------------------
# VOICE INPUT
# ----------------------------
if st.button("🎙 Start Voice Input"):
    text = speech_to_text()

    if "Error" in text:
        st.error(text)
    else:
        st.session_state.voice_text = text
        st.success("Voice Captured")
        st.rerun()


answer = st.text_area(
    "Your Answer",
    value=st.session_state.voice_text,
    height=150
)
# ----------------------------
# NEXT QUESTION
# ----------------------------
if st.button("Next Question"):

    if answer.strip() == "":
        st.warning("Write answer first")
        st.stop()

    st.session_state.answers.append({
        "question": question,
        "answer": answer
    })

    st.session_state.time_left = 60
    st.session_state.voice_text = ""

    if st.session_state.index < len(role_questions) - 1:
        st.session_state.index += 1
        st.rerun()
    else:
        st.success("Interview Completed")
# ----------------------------
# FEEDBACK
# ----------------------------
if len(st.session_state.answers) > 0:

    st.subheader("Interview Summary")

    for i, item in enumerate(st.session_state.answers):

        st.write(item["question"])
        st.write(item["answer"])

        if st.button(f"Get AI Feedback {i}", key=f"fb_{i}"):
            st.session_state.feedback_index = i


if st.session_state.feedback_index is not None:
    item = st.session_state.answers[st.session_state.feedback_index]
    feedback = get_feedback(item["question"], item["answer"])

    st.subheader("AI Feedback")
    st.write(feedback)
# ----------------------------
# ANALYSIS
# ----------------------------
percentage = 0
scores = []
total_ai_score = 0

if len(st.session_state.answers) > 0:

    st.subheader("📊 Analysis")

    total_score = 0
    total_keywords = 0

    for item in st.session_state.answers:

        q = item["question"]
        a = item["answer"].lower()

        expected = keywords.get(q, [])
        found = [k for k in expected if k.lower() in a]

        total_score += len(found)
        total_keywords += len(expected)

        score = (len(found) / len(expected) * 100) if expected else 0
        scores.append(score)

        ai_score = evaluate_answer(q, item["answer"])
        total_ai_score += ai_score

        st.write(q)
        st.info(f"AI Score: {ai_score}%")

    if total_keywords > 0:
        percentage = round((total_score / total_keywords) * 100)

        st.metric("Keyword Score", f"{percentage}%")

        st.metric(
            "AI Score",
            f"{round(total_ai_score / len(st.session_state.answers))}%"
        )
# ----------------------------
# HIRING DECISION
# ----------------------------
if len(st.session_state.answers) == len(role_questions):

    st.subheader("🎯 Hiring Recommendation")

    if percentage >= 80:
        st.success("Recommended")
    elif percentage >= 60:
        st.warning("Average Candidate")
    else:
        st.error("Not Recommended")
# ----------------------------
# GRAPH
# ----------------------------
if len(scores) > 0:

    fig = go.Figure()
    fig.add_trace(go.Scatter(y=scores, mode="lines+markers"))

    st.plotly_chart(fig)
# ----------------------------
# PDF
# ----------------------------
if len(st.session_state.answers) > 0:

    if st.button("Generate Report"):

        file = generate_report(st.session_state.answers, percentage)

        with open(file, "rb") as f:
            st.download_button(
                "Download PDF",
                f,
                file_name="InterviewIQ_Report.pdf"
            )
# ----------------------------
# RESET
# ----------------------------
if st.button("Start New Interview"):
    st.session_state.index = 0
    st.session_state.answers = []
    st.session_state.feedback_index = None
    st.session_state.time_left = 60
    st.session_state.voice_text = ""
    st.rerun()