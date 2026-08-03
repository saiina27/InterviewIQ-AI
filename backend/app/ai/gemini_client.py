import traceback
import json

from google import genai

from backend.app.config import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


MODEL_NAME = "gemini-2.5-flash"


def generate_content(prompt: str) -> str:
    """
    Central Gemini API client.

    All AI features should call this function:
    - Resume Review
    - Interview Questions
    - Answer Evaluation
    """

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        if not response.text:
            raise Exception("Empty response from Gemini")

        return response.text.strip()

    except Exception as e:

        print("\n========== GEMINI ERROR ==========")
        print(str(e))
        traceback.print_exc()
        print("==================================\n")

        raise e

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