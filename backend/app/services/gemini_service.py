import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

from backend.app.services.fallback_questions import (
    BACKEND_QUESTIONS,
    AI_ENGINEER_QUESTIONS,
    SOFTWARE_ENGINEER_QUESTIONS,
)

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize Gemini model
model = genai.GenerativeModel("gemini-2.5-flash")


def generate_content(prompt: str) -> str:
    """
    Sends a prompt to Gemini and returns the generated response.
    """
    response = model.generate_content(prompt)
    return response.text.strip()


def extract_json(response: str):
    """
    Extract JSON from Gemini response.
    Supports:
    - ```json ... ```
    - ``` ... ```
    - Plain JSON
    """

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
    skills: list,
    role: str,
    experience: str,
    difficulty: str,
    count: int,
):
    """
    Generate interview questions using Gemini.
    Falls back to predefined questions if Gemini fails.
    """

    skills_text = ", ".join(skills)

    prompt = f"""
You are an expert technical interviewer.

Generate exactly {count} interview questions.

Candidate Details:

Role: {role}
Experience: {experience}
Skills: {skills_text}
Difficulty: {difficulty}

Instructions:

1. Return ONLY valid JSON.
2. Do NOT use markdown.
3. Do NOT write explanations.
4. Do NOT wrap the JSON inside ```json```.
5. Output must be a JSON array.
6. Every object must contain:
   - question_number
   - question

Example:

[
    {{
        "question_number": 1,
        "question": "Explain REST APIs."
    }},
    {{
        "question_number": 2,
        "question": "What is FastAPI?"
    }}
]
"""

    try:
        response = generate_content(prompt)
        questions = extract_json(response)

        # Ensure only required number of questions are returned
        return questions[:count]

    except Exception as e:

        print("\n" + "=" * 70)
        print("⚠ Gemini unavailable. Using fallback interview questions.")
        print("Reason:", str(e))
        print("=" * 70 + "\n")

        role_lower = role.lower()

        if "backend" in role_lower:
            return BACKEND_QUESTIONS[:count]

        elif (
            "ai" in role_lower
            or "artificial intelligence" in role_lower
            or "machine learning" in role_lower
            or "ml" in role_lower
            or "llm" in role_lower
            or "genai" in role_lower
        ):
            return AI_ENGINEER_QUESTIONS[:count]

        else:
            return SOFTWARE_ENGINEER_QUESTIONS[:count]