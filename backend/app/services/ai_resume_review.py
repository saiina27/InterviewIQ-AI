from backend.app.ai.gemini_client import generate_content, extract_json

def ai_resume_review(resume_text: str):

    prompt = f"""
You are an expert ATS recruiter and Senior Technical Hiring Manager.

Analyze the following resume.

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT wrap the JSON in markdown code fences.
Return only raw JSON.
Do NOT explain anything.
Do NOT write any text before or after the JSON.

Required JSON format:

{{
    "summary": "",

    "strengths": [
        ""
    ],

    "weaknesses": [
        ""
    ],

    "recommendation": "",

    "rating": 0.0,

    "resume_suggestions": [
        ""
    ]
}}

Rules:

- Summary should be 2-3 sentences.
- Give exactly 4 strengths.
- Give exactly 3 weaknesses.
- Recommendation should be one short sentence.
- Rating must be a number between 1 and 10.
- Give exactly 5 resume suggestions.

Resume:

{resume_text}
"""

    response = generate_content(prompt)

    print("\n========== AI RESPONSE ==========")
    print(response)
    print("================================\n")

    return extract_json(response)