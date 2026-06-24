import time
import streamlit as st
import os

from modules.questions import load_questions
from modules.resume_parser import extract_resume_text
from modules.skill_detector import detect_skills
from modules.ai_question_generator import generate_ai_questions
from modules.speech import speech_to_text
from modules.webcam import start_camera
from modules.pdf_report import generate_report
from modules.ai_score import evaluate_answer


@st.cache_data(show_spinner=False)
def cached_ai_questions(skills, resume_text):
    return generate_ai_questions(skills, resume_text)
# ----------------------------
# PAGE CONFIG
# ----------------------------
st.set_page_config (
    page_title="InterviewIQ AI",
    page_icon="🎤",
    layout="wide"
)

st.title("🎤 InterviewIQ AI")
# ----------------------------
# LOAD QUESTIONS
# ----------------------------
questions = load_questions()

# ----------------------------
# ROLE + DIFFICULTY
# ----------------------------
role = st.selectbox(
    "Select Interview Role",
    list(questions.keys())
)

difficulty = st.selectbox(
    "Select Difficulty",
    ["Beginner", "Intermediate", "Advanced"]
)

role_questions = questions[role][difficulty]

# ----------------------------
# SESSION STATE
# ----------------------------
if "index" not in st.session_state:
    st.session_state.index = 0

if "answers" not in st.session_state:
    st.session_state.answers = []

if "generated_questions" not in st.session_state:
    st.session_state.generated_questions = None

if "start_time" not in st.session_state:
    st.session_state.start_time = time.time()

if "voice_text" not in st.session_state:
    st.session_state.voice_text = ""   

if "skills" not in st.session_state:
    st.session_state.skills = []  

if "interview_started" not in st.session_state:
    st.session_state.interview_started = False   

# ----------------------------
# RESUME UPLOAD
# ----------------------------
st.subheader("📄 Upload Resume")

uploaded_file = st.file_uploader(
    "Upload Resume PDF",
    type=["pdf"]
)

if uploaded_file:

    resume_text = extract_resume_text(uploaded_file)

    st.success("✅ Resume Uploaded Successfully")

    st.subheader("📄 Resume Preview")

    st.text_area(
        "Resume Text",
        resume_text[:3000],
        height=250
    )

    skills = detect_skills(resume_text)
    st.session_state.skills = skills

    st.subheader("🛠 Detected Skills")

    if skills:
        for skill in skills:
            st.success(skill)
    else:
        st.warning("No skills detected")

# ----------------------------
# AI QUESTION GENERATION
# ----------------------------
if st.button("🤖 Generate AI Questions"):

    with st.spinner("Generating AI Questions..."):

        try:

            st.session_state.generated_questions = cached_ai_questions(
                tuple(skills),
                resume_text
            )

            st.session_state.index = 0
            st.session_state.answers = []
            st.session_state.start_time = time.time()
            st.session_state.interview_started = False

            st.success("Questions Generated Successfully!")

            st.rerun()

        except Exception:

            st.warning("⚠️ AI failed, using offline questions")

            st.session_state.generated_questions = [
                f"Explain your experience with {skills[0] if skills else 'your project'}",
                "Tell me about your final year project",
                "What challenges did you face?",
                "How did you solve them?",
                "Why should we hire you?"
            ]

            st.session_state.index = 0
            st.session_state.answers = []
            st.session_state.start_time = time.time()
            st.session_state.interview_started = False

            st.rerun()

# ----------------------------
# DISPLAY QUESTIONS
# ----------------------------
if st.session_state.generated_questions:

    st.subheader("🤖 AI Generated Questions")

    for q in st.session_state.generated_questions:
        st.write("•", q)

    if st.button("🚀 Start AI Interview"):

        st.session_state.index = 0
        st.session_state.answers = []
        st.session_state.start_time = time.time()
        st.session_state.interview_started = True

        st.rerun()
# ----------------------------
# WEBCAM
# ----------------------------
st.subheader("📷 Webcam Monitoring")
try:
    start_camera()
except Exception as e:
    st.warning(f"Webcam Error: {e}")
# ----------------------------
# QUESTION SOURCE
# ----------------------------
active_questions = (
    st.session_state.generated_questions
    if st.session_state.generated_questions is not None
    else role_questions
)
if not st.session_state.interview_started:
    st.stop()
# ----------------------------
# INTERVIEW
# ----------------------------
if (
    st.session_state.interview_started
    and
    st.session_state.index < len(active_questions)
):

    question = active_questions[
        st.session_state.index
    ]

    # TIMER
    remaining_time = max(
        0,
        60 - int(time.time() - st.session_state.start_time)
    )

    st.subheader(
        f"Question {st.session_state.index + 1}"
    )

    st.info(question)

    st.subheader("⏳ Time Remaining")
    st.warning(f"{remaining_time} seconds")

    # ----------------------------
    # VOICE INPUT
    # ----------------------------
    if st.button("🎙 Start Voice Input"):

        with st.spinner("Listening..."):

            text = speech_to_text()

            if text.startswith("Error"):
                st.error(text)

            else:
                st.session_state.voice_text = text
                st.success(
                    "Voice Captured Successfully"
                )

                st.rerun()

    # ----------------------------
    # ANSWER BOX
    # ----------------------------
    answer = st.text_area(
        "Your Answer",
        value=st.session_state.voice_text,
        height=150
    )

    # ----------------------------
    # TIME UP
    # ----------------------------
    if remaining_time == 0:

        st.error("⏰ Time Up!")

        if st.button("Skip Question"):

            st.session_state.answers.append({
                "question": question,
                "answer": "Not Answered"
            })

            st.session_state.index += 1
            st.session_state.start_time = time.time()
            st.session_state.voice_text = ""

            st.rerun()

    # ----------------------------
    # NEXT QUESTION
    # ----------------------------
    if st.button("Next Question"):

        if answer.strip() == "":

            st.warning(
                "Please answer the question first"
            )

        else:

            st.session_state.answers.append({
                "question": question,
                "answer": answer
            })

            st.session_state.index += 1
            st.session_state.start_time = time.time()
            st.session_state.voice_text = ""

            st.rerun()
# ----------------------------
# INTERVIEW COMPLETE
# ----------------------------
else:

    st.success("🎉 Interview Completed")

    st.subheader("📋 Interview Summary")

    total_score = 0
    question_count = 0

    for item in st.session_state.answers:

        st.write("Question:")
        st.info(item["question"])

        st.write("Answer:")
        st.write(item["answer"])

        # Score each answer
        answer_score = evaluate_answer(
            item["question"],
            item["answer"],
            st.session_state.skills
        )

        total_score += answer_score
        question_count += 1

    # Overall Score
    overall_score = (
        round(total_score / question_count)
        if question_count > 0
        else 0
    )

    st.subheader("📊 Overall Interview Score")
    st.success(f"{overall_score}/100")

    # Hiring Recommendation
    if overall_score >= 80:
        recommendation = "Strong Hire"

    elif overall_score >= 60:
        recommendation = "Hire"

    elif overall_score >= 40:
        recommendation = "Consider"

    else:
        recommendation = "Reject"

    st.subheader("💼 Hiring Recommendation")
    st.info(recommendation)

    if st.button("📄 Generate Report"):

        file_path = generate_report(
            st.session_state.answers,
            overall_score,
            recommendation
        )

        with open(file_path, "rb") as pdf_file:

            st.download_button(
                label="⬇ Download PDF",
                data=pdf_file,
                file_name="Interview_Report.pdf",
                mime="application/pdf"
            )
# ----------------------------
# RESET
# ----------------------------
if "skills" not in st.session_state:
    st.session_state.skills = []
    st.session_state.interview_started = False

if st.button("🔄 Start New Interview"):

    st.session_state.index = 0
    st.session_state.answers = []
    st.session_state.generated_questions = None
    st.session_state.start_time = time.time()
    st.session_state.voice_text = ""
    st.session_state.skills = []

    try:
        st.cache_data.clear()
    except:
        pass

    st.rerun()