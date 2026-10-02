def calculate_ats_score(
    resume_text: str,
    ai_analysis: dict | None = None
):
    """
    Calculate an explainable ATS-style score using AI-generated
    role and skill intelligence.

    The score evaluates:
    - relevant skill coverage
    - professional + practical experience
    - project evidence
    - education / qualifications
    - resume completeness

    The scoring is deterministic; AI provides the role-specific
    resume intelligence.
    """

    text = resume_text.lower()
    ai_analysis = ai_analysis or {}

    matched_skills = ai_analysis.get("skills_match", [])
    missing_skills = ai_analysis.get("missing_skills", [])
    relevant_skills = ai_analysis.get("relevant_skills", [])

    # -------------------------------------------------
    # 1. Relevant skill coverage — 40 points
    # -------------------------------------------------

    if relevant_skills:
        matched_count = len(matched_skills)

        skill_coverage = (
            matched_count / len(relevant_skills)
        )

        skill_score = round(
            skill_coverage * 40
        )
    else:
        total_skills = (
            len(matched_skills)
            + len(missing_skills)
        )

        if total_skills:
            skill_score = round(
                (len(matched_skills) / total_skills) * 40
            )
        else:
            skill_score = 0

    # -------------------------------------------------
    # 2. Experience & practical evidence — 20 points
    #
    # Professional experience: up to 12
    # Practical/project evidence: up to 8
    # -------------------------------------------------

    professional_indicators = [
        "work experience",
        "professional experience",
        "employment",
        "internship",
        "internships",
        "intern ",
        "freelance",
        "freelancer",
        "contract work",
        "contractor",
        "consultant",
        "consulting",
    ]

    professional_evidence = sum(
        text.count(keyword)
        for keyword in professional_indicators
    )

    if professional_evidence >= 4:
        professional_score = 12
    elif professional_evidence >= 2:
        professional_score = 10
    elif professional_evidence >= 1:
        professional_score = 8
    else:
        professional_score = 0

    practical_indicators = [
        "built",
        "developed",
        "designed",
        "implemented",
        "deployed",
        "integrated",
        "created",
        "tested",
        "architected",
    ]

    practical_evidence = sum(
        text.count(keyword)
        for keyword in practical_indicators
    )

    if practical_evidence >= 8:
        practical_score = 8
    elif practical_evidence >= 5:
        practical_score = 7
    elif practical_evidence >= 3:
        practical_score = 5
    elif practical_evidence >= 1:
        practical_score = 3
    else:
        practical_score = 0

    experience_score = min(
        20,
        professional_score + practical_score
    )

    # -------------------------------------------------
    # 3. Projects / practical application — 15 points
    # -------------------------------------------------

    project_indicators = [
        "project",
        "projects",
        "github",
        "built",
        "developed",
        "implemented",
        "deployed",
    ]

    project_evidence = sum(
        text.count(keyword)
        for keyword in project_indicators
    )

    if project_evidence >= 8:
        project_score = 15
    elif project_evidence >= 5:
        project_score = 13
    elif project_evidence >= 3:
        project_score = 10
    elif project_evidence >= 1:
        project_score = 6
    else:
        project_score = 0

    # -------------------------------------------------
    # 4. Education / qualifications — 10 points
    # -------------------------------------------------

    education_indicators = [
        "b.tech",
        "btech",
        "bachelor",
        "master",
        "m.tech",
        "mtech",
        "degree",
        "university",
        "college",
        "certification",
        "certifications",
    ]

    education_evidence = sum(
        text.count(keyword)
        for keyword in education_indicators
    )

    if education_evidence >= 3:
        education_score = 10
    elif education_evidence >= 2:
        education_score = 9
    elif education_evidence >= 1:
        education_score = 7
    else:
        education_score = 0

    # -------------------------------------------------
    # 5. Resume completeness — 15 points
    # -------------------------------------------------

    sections = [
        "professional summary",
        "summary",
        "technical skills",
        "skills",
        "professional experience",
        "experience",
        "technical projects",
        "projects",
        "education",
        "certifications",
    ]

    section_evidence = sum(
        section in text
        for section in sections
    )

    if section_evidence >= 7:
        completeness_score = 15
    elif section_evidence >= 5:
        completeness_score = 13
    elif section_evidence >= 3:
        completeness_score = 10
    elif section_evidence >= 2:
        completeness_score = 7
    else:
        completeness_score = 3

    # -------------------------------------------------
    # Final score
    # -------------------------------------------------

    overall_score = (
        skill_score
        + experience_score
        + project_score
        + education_score
        + completeness_score
    )

    overall_score = max(
        0,
        min(100, overall_score)
    )

    return {
        "ats_score": overall_score,

        "breakdown": {
            "skills": skill_score,
            "projects": project_score,
            "experience": experience_score,
            "education": education_score,
            "keywords": completeness_score,
        },

        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
    }
