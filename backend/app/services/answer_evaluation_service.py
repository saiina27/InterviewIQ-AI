from backend.app.services.gemini_service import (
    generate_content,
    extract_json
)

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

def evaluate_answer(question: str, answer: str):

    prompt = f"""
You are an expert technical interviewer.

Evaluate the candidate's answer strictly.

QUESTION:
{question}

ANSWER:
{answer}

Return ONLY valid JSON in this format:

{{
  "score": <integer out of 10>,
  "relevance": "<high/medium/low>",
  "correctness": "<high/medium/low>",
  "missing_points": ["point1", "point2"],
  "feedback": "<short professional feedback>",
  "skill_tags": ["python", "fastapi", "sql"]
}}

Rules:

- Score should be between 0 and 10.
- Be strict like a FAANG interviewer.
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