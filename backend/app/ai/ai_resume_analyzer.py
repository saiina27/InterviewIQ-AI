from backend.app.ai.ai_gateway import ai_gateway
from backend.app.ai.gemini_client import extract_json
from datetime import date


def analyze_resume_with_ai(resume_text: str):
    """
    Analyze a resume using the central AI gateway.

    The model infers the candidate's likely role/domain and produces
    evidence-based skills, gaps, strengths, weaknesses, and suggestions.
    """

    current_date = date.today().isoformat()

    prompt = f"""
You are an expert resume analyst, ATS specialist, and hiring manager.

Analyze the resume below using ONLY evidence contained in the resume.

This is a GENERAL resume analysis system. It must work across different
professional domains such as technology, engineering, design, business,
finance, marketing, HR, operations, and internships.

Do NOT assume the candidate is a developer unless the resume supports it.

==================================================
CORE EVIDENCE RULES
==================================================

1. Only treat a skill as demonstrated when the resume provides reasonable
   evidence of actual use, application, or knowledge beyond merely listing
   the skill.

   A skill appearing only in a "Skills", "Core Skills", "Technical Skills",
   "Technologies", or similar keyword list is considered MENTIONED, not
   demonstrated.

   A listed skill can be considered demonstrated when the resume also
   provides supporting evidence such as actual use in work experience,
   projects, research, coursework, certifications, or another concrete
   context.

   Do not treat a skill as demonstrated solely because it appears in a
   skills/technologies list.

2. A skill that is not mentioned or not sufficiently demonstrated should
   be considered "not demonstrated", NOT something the candidate definitely
   does not know.

3. Missing skills must be relevant to the inferred role.

4. Do not generate random industry buzzwords just to create missing skills.

5. Do not invent:
   - experience
   - employers
   - projects
   - metrics
   - responsibilities
   - qualifications
   - technologies
   - achievements

6. Preserve the factual meaning and strength of resume evidence.

   You may paraphrase a resume statement for clarity, but do NOT strengthen,
   extend, convert, or reinterpret it into a more specific claim than the
   resume supports.

   In particular:
   - Preserve exact metrics and units when mentioning measurable outcomes.
   - Do not convert one metric into a different metric or percentage.
   - Do not turn a general activity into a stronger action such as "deployed",
     "led", "architected", "managed", or "implemented" unless the resume
     explicitly supports that action.
   - Do not infer an outcome, impact, technology usage, responsibility, or
     level of ownership that is not supported by the resume.
   - If the resume says "worked on", do not automatically describe it as
     "led" or "owned".
   - If the resume says "developed" or "built", do not automatically add
     deployment, production usage, scale, or business impact.
   - If a claim is not explicitly supported, either omit it or describe only
     the narrower fact that is supported.

   Example:
   Resume evidence: "saved 15 hours per week through automated reporting."
   Valid: "Automated reporting that saved 15 hours per week."
   Invalid: "Improved strategic planning speed by 30%."

   Resume evidence: "developed predictive ML models."
   Valid: "Developed predictive ML models."
   Invalid: "Deployed predictive ML models."

7. Do not reinterpret or "correct" facts that are clearly stated in the
   resume.

8. In particular, do NOT flag graduation status, degree wording, dates,
   employment periods, or education as inconsistent unless the resume
   contains a genuine contradiction between two statements.

   Interpret employment dates using the current date provided below.

   - A role with a start date in the past and an end date of "Present" is
     a normal ongoing employment period.
   - Do NOT describe a past start date as a "future start date".
   - Do NOT flag "Present" as a timeline inconsistency.
   - Only identify a future start date when the stated start date is actually
     later than the current date.
   - Do not invent a timeline error merely because a date looks unusual.

   Current date: {current_date}

9. Do not create a weakness merely because the resume does not contain
   something. A weakness should represent a meaningful limitation or gap
   relevant to the inferred role.

10. Distinguish explicitly between:
   - a skill being mentioned only in a skills/technologies list
   - a skill being demonstrated through concrete evidence elsewhere in the resume
   - a skill being absent or not sufficiently demonstrated

   A skill mentioned only in a skills list must NOT be placed in
   "skills_match" solely because it is listed there.

11. If the resume says the candidate built, implemented, deployed, tested,
    integrated, used, analyzed, configured, or otherwise applied something
    in a project, work experience, research, coursework, certification, or
    other concrete context, treat that as stronger evidence than a skill
    appearing only in a skills list.

    If a skill appears only in a skills list and there is no supporting
    evidence of its use or application elsewhere, treat it as mentioned but
    not sufficiently demonstrated.

12. Do NOT infer lack of professional or internship experience solely from
    the graduation year, degree status, or the fact that the resume is
    project-focused.

    Only describe professional or internship experience as limited or absent
    when the resume itself provides sufficient evidence for that conclusion.

    If the resume contains projects, freelance work, internships, employment,
    or other practical experience, describe those based on what is explicitly
    stated rather than treating them as evidence of no professional experience.

    Do not use phrases such as:
    - "lacks professional experience"
    - "no industry experience"
    - "no internship experience"

    unless the resume explicitly supports that conclusion.


12A. Do not turn generic industry expectations into candidate weaknesses.

    A skill, tool, framework, platform, library, or methodology that is not
    mentioned in the resume must NOT automatically be classified as missing,
    weak, or recommended merely because it is common in the inferred
    profession.

    Only classify an unmentioned capability as a meaningful missing skill
    when it is materially relevant to the inferred role, supported by the
    role-specific skill framework, and the resume provides enough context
    to justify identifying it as an evidence gap.

    Do not invent specific technologies as missing requirements merely
    because they are popular in the industry.

    Do not automatically flag technologies such as Git, TensorFlow,
    scikit-learn, SageMaker, Azure ML, or similar tools unless the actual
    role/context and resume evidence make that specific capability
    materially relevant.

12B. Do not convert keyword absence into a weakness.

    A weakness must describe a meaningful limitation, lack of evidence,
    or area for improvement that is actually visible from the resume.

    Do NOT create a weakness solely because:
    - a common industry tool is absent,
    - a keyword is not present,
    - a technology is not listed,
    - or a specific implementation detail is not named.

    "Not sufficiently demonstrated" may be used for a materially relevant
    capability, but absence alone must not automatically become a negative
    weakness.

12C. Keep recommendations evidence-grounded.

    Do not recommend adding a technology, framework, platform, library,
    certification, or tool merely to improve keyword matching.

    Recommendations must be grounded in the candidate's actual experience,
    demonstrated work, or a meaningful role-relevant evidence gap.

    Never encourage the candidate to claim a technology or skill that the
    resume does not establish they have actually used.

12D. Prefer capability-level evidence gaps over technology-specific assumptions.

    When the resume demonstrates a broader capability but does not identify
    the specific tool, framework, platform, or methodology used, do NOT
    automatically name a popular technology as the missing skill.

    First identify the underlying role-relevant capability.

    Only name a specific technology, framework, platform, or methodology as
    a missing skill when:
    - that specific technology is materially relevant to the inferred role,
    - the role/context provides a strong reason to evaluate that technology,
    - and the resume provides enough contextual evidence to make that
      technology-specific gap meaningful.

    Otherwise, describe the gap at the capability level.

    Example:
    Resume evidence: "processed 5 million+ customer profiles."
    Better gap: "Large-scale data processing methods are not sufficiently
    detailed."
    Invalid inference: "Spark is missing."

    Example:
    Resume evidence: "designed user interfaces."
    Better gap: "The design workflow and tools used are not sufficiently
    demonstrated."
    Invalid inference: "Figma is missing."

    Do not use a popular industry technology as a proxy for an underlying
    capability unless the resume and role context specifically justify it.

13. Keep career and timeline recommendations temporally appropriate.

    Consider the candidate's stated graduation date, employment status,
    employment dates, and the current date when generating suggestions.

    A role with a start date in the past and an end date of "Present"
    represents ongoing employment and must not be treated as a future,
    invalid, or inconsistent employment period.

    Do not recommend internships, graduation-related actions, or
    time-specific opportunities that conflict with the candidate's
    stated timeline.

    For example, do not suggest a "summer internship" to a candidate
    who has already graduated unless the resume or context clearly
    indicates that such an opportunity is appropriate.

    Current date: {current_date}

14. When discussing professional experience, describe what the resume
    actually emphasizes rather than overstating what it does not contain.

    If the resume primarily demonstrates experience through independent
    projects, freelance work, academic work, or other practical work,
    describe that emphasis factually.

    Do not turn an absence of traditional employment into a stronger
    claim than the evidence supports.

15. Every resume suggestion must be directly actionable and grounded
    in evidence from the resume.

    Before generating each suggestion, identify the resume evidence or
    missing evidence that justifies it.

    Do not introduce arbitrary career advice, unrelated job-search advice,
    or speculative recommendations merely to reach five suggestions.

==================================================
ROLE AND DOMAIN
==================================================

Infer:

- the most appropriate specific professional role
- the broader professional domain

Examples of possible roles include, but are not limited to:

Backend Developer
Frontend Developer
Full Stack Developer
Software Engineer
Data Analyst
Data Engineer
AI Engineer
ML Engineer
DevOps Engineer
Cloud Engineer
QA Engineer
Cybersecurity Analyst
Mechanical Engineer
Civil Engineer
Electrical Engineer
UI/UX Designer
Product Designer
Graphic Designer
Business Analyst
Product Manager
Project Manager
HR Specialist
Recruiter
Marketing Specialist
Financial Analyst
Operations Analyst
Software Intern
Data Intern
Design Intern
HR Intern

These are examples only.

You may infer another role when the resume evidence supports it.

==================================================
SKILLS ANALYSIS
==================================================

First determine the important skills for the inferred role.

Return a "relevant_skills" list containing the important role-relevant
skills that should reasonably be considered when evaluating this resume.

This must be a balanced set of approximately 8-15 skills.

Do not create an exhaustive list of every possible industry skill.

Do not include obscure technologies or unnecessary buzzwords.

Then determine which of those relevant skills are actually demonstrated
by evidence in the resume.

Return those as "skills_match".

Then identify important relevant skills that are NOT sufficiently
demonstrated in the resume.

Return those as "missing_skills".

IMPORTANT:

- Every item in "skills_match" must come from "relevant_skills".
- Every item in "missing_skills" must come from "relevant_skills".
- Do not put the same skill in both lists.
- "missing_skills" means "not sufficiently demonstrated on the resume",
  NOT "the candidate definitely does not know this skill".
- Do not penalize a candidate for every possible technology in the field.
- Prioritize skills that are genuinely relevant to the inferred role.
- Prefer specific, meaningful skills over generic buzzwords.

Example:

"relevant_skills": [
    "Python",
    "REST API Development",
    "PostgreSQL",
    "Docker",
    "Cloud Deployment",
    "CI/CD",
    "Caching",
    "Monitoring"
]

"skills_match": [
    "Python",
    "REST API Development",
    "PostgreSQL",
    "Docker"
]

"missing_skills": [
    "Cloud Deployment",
    "CI/CD",
    "Caching",
    "Monitoring"
]

==================================================
SKILLS TO STRENGTHEN
==================================================

The "missing_skills" list should contain approximately 3-6 of the most
important relevant skills that are not sufficiently demonstrated.

Do not generate random missing skills merely to make the resume appear
incomplete.

==================================================
OVERVIEW
==================================================

Write ONE concise sentence summarizing the candidate's profile.

Maximum approximately 25 words.

Do not repeat the entire resume.

Do not mention unsupported assumptions.

==================================================
STRENGTHS
==================================================

Give exactly 4 concise strengths.

Focus on the strongest evidence in the resume.

==================================================
WEAKNESSES
==================================================

Give exactly 3 concise weaknesses.

Only include meaningful, role-relevant limitations visible from the resume.

Do not turn simple absence of a keyword into a weakness.

A missing skill may appear in "missing_skills" without necessarily being
listed as a "weakness". Keep weaknesses focused on meaningful evidence-based
limitations rather than simply repeating the missing_skills list.

==================================================
RATING
==================================================

Give a rating from 1.0 to 10.0.

Base it on the quality and relevance of the evidence in the resume for the
inferred role.

Do not use a rating as a substitute for explaining strengths or weaknesses.

==================================================
RESUME SUGGESTIONS
==================================================

Give exactly 5 actionable suggestions specific to this resume.

Suggestions may address:

- technical depth
- project clarity
- measurable impact
- role relevance
- missing evidence
- structure
- keyword coverage
- explanation of specialized technologies

Do NOT give generic suggestions simply to fill five slots.

Do NOT suggest changing a clearly stated degree, graduation year, or
education status unless there is a genuine contradiction.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT use ```json.
Do NOT write explanations before or after the JSON.

Required structure:

{{
    "role": "",
    "domain": "",

    "relevant_skills": [
        ""
    ],

    "skills_match": [
        ""
    ],

    "missing_skills": [
        ""
    ],

    "overview": "",

    "strengths": [
        ""
    ],

    "weaknesses": [
        ""
    ],

    "rating": 0.0,

    "resume_suggestions": [
        ""
    ]
}}

Resume:

{resume_text}
"""

    response = ai_gateway.generate(prompt)

    return extract_json(response)
