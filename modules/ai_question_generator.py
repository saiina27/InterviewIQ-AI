import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)
model = genai.GenerativeModel("gemini-2.5-flash")


def offline_questions(skills):

    skill = skills[0] if skills else "programming"

    return [
        f"Explain your experience with {skill}.",
        "Tell me about your final year project.",
        "What challenges did you face during development?",
        "How did you debug a difficult issue?",
        "What are your strengths?",
        "What are your weaknesses?",
        "Why should we hire you?",
        "Explain OOP concepts.",
        "What is the difference between SQL and NoSQL?",
        "Where do you see yourself in 5 years?"
    ]


def generate_ai_questions(skills, resume_text=""):

    prompt = f"""
    You are an expert technical interviewer.

    Candidate Skills:
    {', '.join(skills)}

    Resume:
    {resume_text}

    Generate exactly 10 interview questions.

    Rules:
    - Mix technical, project-based and problem-solving questions.
    - Suitable for a fresher software developer.
    - Return only questions.
    - One question per line.
    """

    try:

        response = model.generate_content(prompt)

        questions = []

        for line in response.text.split("\n"):

            line = line.strip()

            if not line:
                continue

            if line[0].isdigit():
                parts = line.split(".", 1)
                if len(parts) > 1:
                    line = parts[1].strip()

            questions.append(line)

        if len(questions) >= 5:
            return questions[:10]

        return offline_questions(skills)

    except Exception:

        # Quota exceeded / API failed
        return offline_questions(skills)