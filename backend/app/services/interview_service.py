import json

from backend.app.ai.gemini_client import generate_content
from backend.app.services.fallback_questions import (
    BACKEND_QUESTIONS,
    AI_ENGINEER_QUESTIONS,
    SOFTWARE_ENGINEER_QUESTIONS,
)


def extract_json(response: str):
    response = response.strip()

    if response.startswith("```json"):
        response = response.replace("```json", "", 1)

    if response.startswith("```"):
        response = response.replace("```", "", 1)

    if response.endswith("```"):
        response = response[:-3]

    response = response.strip()

    return json.loads(response)


def generate_interview_questions(
    skills,
    role,
    experience,
    difficulty,
    count,
):

    skills_text = ", ".join(skills)

    prompt = f"""
You are an expert technical interviewer.

Generate exactly {count} interview questions.

Candidate Details:

Role: {role}
Experience: {experience}
Skills: {skills_text}
Difficulty: {difficulty}

Return ONLY valid JSON.

Example:

[
    {{
        "question_number": 1,
        "question": "Explain REST APIs."
    }}
]
"""

    try:

        response = generate_content(prompt)

        questions = extract_json(response)

        return questions[:count]

    except Exception as e:

        print("Using fallback questions:", e)

        role_lower = role.lower()

        if "backend" in role_lower:
            return BACKEND_QUESTIONS[:count]

        elif (
            "ai" in role_lower
            or "machine learning" in role_lower
            or "llm" in role_lower
            or "genai" in role_lower
        ):
            return AI_ENGINEER_QUESTIONS[:count]

        return SOFTWARE_ENGINEER_QUESTIONS[:count]