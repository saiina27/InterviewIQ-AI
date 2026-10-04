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
    Safely extract and parse a JSON object from a Gemini response.

    Supports:
    - Plain JSON
    - ```json ... ```
    - ``` ... ```
    - JSON surrounded by explanatory text

    Does not silently repair malformed JSON.
    """

    if not isinstance(response, str):
        raise TypeError(
            f"Gemini response must be a string, got {type(response).__name__}"
        )

    response = response.strip()

    if not response:
        raise ValueError("Gemini returned an empty response")

    # Remove only obvious markdown code fences.
    if response.startswith("```json"):
        response = response[len("```json"):].strip()

    elif response.startswith("```"):
        response = response[len("```"):].strip()

    if response.endswith("```"):
        response = response[:-3].strip()

    # First try the clean response directly.
    try:
        return json.loads(response)

    except json.JSONDecodeError as direct_error:
        # Gemini may occasionally add explanatory text around the JSON.
        # Find a candidate JSON object without regex-based extraction.
        start = response.find("{")

        if start == -1:
            print("\n========== GEMINI JSON PARSE ERROR ==========")
            print("No JSON object found in Gemini response.")
            print(f"Response length: {len(response)}")
            print(f"Response preview: {response[:500]!r}")
            print("=============================================\n")

            raise ValueError(
                "Gemini response did not contain a JSON object"
            ) from direct_error

        # Walk through the response and find the matching closing brace.
        # This respects strings and escaped quotes.
        depth = 0
        in_string = False
        escaped = False
        end = None

        for index in range(start, len(response)):
            char = response[index]

            if in_string:
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == '"':
                    in_string = False

                continue

            if char == '"':
                in_string = True

            elif char == "{":
                depth += 1

            elif char == "}":
                depth -= 1

                if depth == 0:
                    end = index + 1
                    break

        if end is None:
            print("\n========== GEMINI JSON PARSE ERROR ==========")
            print("JSON object appears to be incomplete.")
            print(f"Response length: {len(response)}")
            print(f"Response preview: {response[:1000]!r}")
            print("=============================================\n")

            raise ValueError(
                "Gemini response contained an incomplete JSON object"
            ) from direct_error

        candidate = response[start:end].strip()

        try:
            return json.loads(candidate)

        except json.JSONDecodeError as candidate_error:
            print("\n========== GEMINI JSON PARSE ERROR ==========")
            print("Gemini returned malformed JSON.")
            print(f"Response length: {len(response)}")
            print(f"JSON candidate length: {len(candidate)}")
            print(f"Candidate preview: {candidate[:1000]!r}")
            print(
                f"Parser error: "
                f"{candidate_error.msg} "
                f"(line {candidate_error.lineno}, "
                f"column {candidate_error.colno})"
            )
            print("=============================================\n")

            raise ValueError(
                "Gemini returned malformed JSON"
            ) from candidate_error

