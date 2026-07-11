from ai.gemini_client import get_ai_questions
from modules.questions import get_fallback_questions


def generate_questions(skills, resume_text):

    prompt = f"""
You are an expert technical interviewer.

Generate 8 interview questions.

Skills: {skills}

Resume:
{resume_text[:1000]}

Rules:
- mix of easy, medium, hard
- practical + theory
- short questions only
"""

    ai_output = get_ai_questions(prompt)

    if ai_output:
        questions = ai_output.split("\n")
        questions = [q.strip("-• ") for q in questions if q.strip()]

        if len(questions) > 0:
            return questions

    return get_fallback_questions(skills)