from backend.app.ai.groq_client import generate_content
from backend.app.services.interview_service import extract_json
# --------------------------------------------------
# Basic Technical Keywords (Fallback Evaluation)
# --------------------------------------------------

TECH_KEYWORDS = [
    "python",
    "sql",
    "fastapi",
    "api",
    "rest",
    "database",
    "mysql",
    "postgresql",
    "pandas",
    "numpy",
    "class",
    "object",
    "function",
    "json",
    "http",
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "join",
    "group by",
    "order by",
    "index",
    "normalization"
]


# --------------------------------------------------
# Local Fallback Evaluation
# --------------------------------------------------

def local_fallback_evaluation(question: str, answer: str):

    answer = answer.strip()

    if len(answer) == 0:
        return {
            "score": 0,
            "relevance": "low",
            "correctness": "low",
            "missing_points": [
                "No answer provided."
            ],
            "feedback": "Candidate did not provide an answer.",
            "skill_tags": []
        }

    answer_lower = answer.lower()

    matched_skills = []

    for keyword in TECH_KEYWORDS:
        if keyword in answer_lower:
            matched_skills.append(keyword)

    score = 0

    # Length Score
    if len(answer) > 20:
        score += 2

    if len(answer) > 80:
        score += 2

    if len(answer) > 150:
        score += 2

    # Technical Keyword Score
    score += min(len(matched_skills), 4)

    score = min(score, 10)

    # Labels
    if score >= 8:
        relevance = "high"
        correctness = "high"

    elif score >= 5:
        relevance = "medium"
        correctness = "medium"

    else:
        relevance = "low"
        correctness = "low"

    return {
        "score": score,
        "relevance": relevance,
        "correctness": correctness,
        "missing_points": [],
        "feedback": (
            "Fallback evaluation used because AI evaluation "
            "was unavailable."
        ),
        "skill_tags": matched_skills
    }


# --------------------------------------------------
# AI Evaluation
# --------------------------------------------------

def evaluate_answer(
    question: str,
    answer: str,
    role: str = None,
    difficulty: str = None
):

    prompt = f"""
You are an expert interviewer evaluating a candidate for a specific job role.

ROLE:
{role or "Not specified"}

DIFFICULTY:
{difficulty or "Not specified"}

QUESTION:
{question}

ANSWER:
{answer}

Evaluate the candidate according to the role and requested difficulty.

Evaluation principles:

1. Score from 0 to 10 based primarily on correctness, relevance, practical understanding, reasoning, and coverage of the core requirements of the question.
2. Respect the requested difficulty level.
3. For Intermediate candidates, do NOT evaluate against senior-level or expert-level expectations.
4. Advanced concepts should not be required for a good score unless they are explicitly necessary for the question.
5. Concepts such as BATNA, anchoring, CAC, CLV, TAM/SAM/SOM, advanced automation, complex analytics, or senior-level strategy should be treated as bonus depth for an Intermediate candidate, not mandatory requirements.
6. Do not heavily penalize grammar, spelling, or speech-to-text/transcription errors when the candidate's intended meaning is understandable.
7. Focus on the meaning and substance of the answer, not perfect wording.
8. A concise but correct practical answer can receive a good score even if it does not mention every possible advanced detail.
9. Give a low score when the answer is genuinely incorrect, irrelevant, incomplete on core requirements, or does not answer the question.
10. Keep the evaluation appropriate to the candidate's role. Do not apply technical-interview standards to non-technical roles.
11. Missing optional advanced details should not by themselves cause a large score reduction for an otherwise correct Intermediate answer.
12. Use the full 0-10 range fairly.

Return ONLY valid JSON in this format:

{{
  "score": <integer out of 10>,
  "relevance": "<high/medium/low>",
  "correctness": "<high/medium/low>",
  "missing_points": ["point1", "point2"],
  "feedback": "<short professional feedback>",
  "skill_tags": ["skill1", "skill2"]
}}

Rules:

- Score must be an integer between 0 and 10.
- Evaluate according to the role and difficulty.
- Missing optional advanced details may be included in missing_points but should not automatically cause a large score reduction.
- Return only JSON.
"""

    try:

        response = generate_content(prompt)

        return extract_json(response)

    except Exception as e:

        print("Gemini Evaluation Failed:", str(e))

        return local_fallback_evaluation(
            question,
            answer
        )