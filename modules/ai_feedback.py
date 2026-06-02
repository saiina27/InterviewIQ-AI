import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")


def get_feedback(question, answer):

    if not answer or answer.strip() == "":
        return "⚠️ No answer provided"

    prompt = f"""
You are an expert technical interviewer.

Question:
{question}

Answer:
{answer}

Give structured feedback:
- Accuracy (10)
- Communication (10)
- Completeness (10)
- Strengths
- Weaknesses
- Ideal Answer
"""

    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return f"Error: {str(e)}"