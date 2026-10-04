import json

from backend.app.ai.groq_client import generate_content
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
You are an expert interviewer conducting a realistic job interview.

Generate exactly {count} interview questions for this candidate.

Candidate Details:

Role: {role}
Experience: {experience}
Skills: {skills_text}
Difficulty: {difficulty}

Interview Rules:

1. Questions MUST be relevant to the candidate's target role.
2. Use the candidate's listed skills and experience as the primary basis for questions.
3. Strictly respect the requested difficulty level: {difficulty}.
4. Do NOT ask senior-level, expert-level, or highly specialized questions when the requested difficulty is Intermediate.
5. Do NOT test unrelated technologies or concepts that are not relevant to the role or listed skills.
6. Prefer practical, realistic job-interview questions over obscure definitions or theoretical terminology.
7. For business/sales roles, focus on practical areas such as prospecting, lead generation, CRM usage, client communication, sales process, negotiation, market research, pipeline management, objection handling, and relevant metrics when applicable.
8. Questions should allow the candidate to demonstrate reasoning and practical understanding.
9. Keep the difficulty consistent across all questions.
10. Return exactly {count} questions.

Return ONLY valid JSON.

Example:

[
    {{
        "question_number": 1,
        "question": "How would you approach generating and qualifying new B2B leads for a business?"
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