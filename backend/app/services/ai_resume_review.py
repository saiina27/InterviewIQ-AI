
from backend.app.services.gemini_service import generate_content

def ai_resume_review(resume_text: str):

    prompt = f"""
You are an experienced technical recruiter.

Analyze the following resume.

Return your response in this format only:

Resume Summary:
...

Strengths:
- ...
- ...

Weaknesses:
- ...
- ...

Hiring Recommendation:
...

Overall Rating:
X/10

Resume:

{resume_text}
"""

    return generate_content(prompt)