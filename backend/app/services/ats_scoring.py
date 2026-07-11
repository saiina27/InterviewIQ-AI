import re


# -----------------------------
# Required Skills
# -----------------------------
REQUIRED_SKILLS = [
    "python",
    "fastapi",
    "sql",
    "postgresql",
    "api",
    "git",
    "docker",
    "numpy",
    "pandas"
]


# -----------------------------
# Skill Score (30 Marks)
# -----------------------------
def calculate_skill_score(text):
    matched_skills = []

    for skill in REQUIRED_SKILLS:
        if skill in text:
            matched_skills.append(skill)

    score = int((len(matched_skills) / len(REQUIRED_SKILLS)) * 30)

    missing_skills = list(set(REQUIRED_SKILLS) - set(matched_skills))

    return score, matched_skills, missing_skills


# -----------------------------
# Project Score (20 Marks)
# -----------------------------
def calculate_project_score(text):
    project_keywords = [
        "project",
        "github",
        "developed",
        "built",
        "application"
    ]

    count = 0

    for word in project_keywords:
        if word in text:
            count += 1

    if count == 0:
        score = 0
    elif count == 1:
        score = 8
    elif count == 2:
        score = 14
    else:
        score = 20

    return score


# -----------------------------
# Experience Score (20 Marks)
# -----------------------------
def calculate_experience_score(text):

    if "3 years" in text or "4 years" in text or "5 years" in text:
        return 20

    elif (
        "2 years" in text
        or "1 year" in text
        or "intern" in text
        or "internship" in text
        or "experience" in text
    ):
        return 15

    return 0


# -----------------------------
# Education Score (10 Marks)
# -----------------------------
def calculate_education_score(text):

    education_keywords = [
        "b.tech",
        "btech",
        "bachelor",
        "master",
        "m.tech",
        "mtech",
        "college",
        "university"
    ]

    for word in education_keywords:
        if word in text:
            return 10

    return 0


# -----------------------------
# Keyword Score (20 Marks)
# -----------------------------
def calculate_keyword_score(text):

    keywords = [
        "python",
        "api",
        "sql",
        "database",
        "backend",
        "machine learning",
        "docker",
        "git",
        "fastapi",
        "postgresql"
    ]

    matched = 0

    for word in keywords:
        if word in text:
            matched += 1

    score = int((matched / len(keywords)) * 20)

    return score


# -----------------------------
# Main ATS Score Function
# -----------------------------
def calculate_ats_score(resume_text: str):

    text = resume_text.lower()

    skill_score, matched_skills, missing_skills = calculate_skill_score(text)

    project_score = calculate_project_score(text)

    experience_score = calculate_experience_score(text)

    education_score = calculate_education_score(text)

    keyword_score = calculate_keyword_score(text)

    overall_score = (
        skill_score
        + project_score
        + experience_score
        + education_score
        + keyword_score
    )

    if overall_score > 100:
        overall_score = 100

    return {

        "ats_score": overall_score,

        "breakdown": {

            "skills": skill_score,

            "projects": project_score,

            "experience": experience_score,

            "education": education_score,

            "keywords": keyword_score

        },

        "matched_skills": matched_skills,

        "missing_skills": missing_skills

    }