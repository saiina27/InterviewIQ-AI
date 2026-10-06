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
    # Professional experience is based on actual date-range
    # evidence rather than section-heading keywords.
    # Practical evidence is role-neutral and rewards
    # demonstrated work/actions across different professions.
    # -------------------------------------------------

    import re

    date_ranges = re.findall(
        r"\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|"
        r"may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|"
        r"oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)?\s*"
        r"20\d{2}\s*(?:-|–|—|to)\s*"
        r"(?:present|current|(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|"
        r"apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|"
        r"sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)?\s*20\d{2})",
        text,
    )

    if len(date_ranges) >= 3:
        professional_score = 20
    elif len(date_ranges) >= 2:
        professional_score = 17
    elif len(date_ranges) >= 1:
        professional_score = 10
    else:
        professional_score = 0

    # Count distinct evidence categories rather than repeated
    # generic action verbs. This prevents repeated words such as
    # "performed" or "collaborated" from inflating the score.

    practical_categories = {
        "technical_or_domain_work": [
            "built", "developed", "designed", "implemented",
            "deployed", "integrated", "created", "tested",
            "architected", "administered", "treated",
        ],
        "management_or_ownership": [
            "managed", "coordinated", "supervised", "led",
            "organized", "handled",
        ],
        "analysis_or_monitoring": [
            "analyzed", "monitored", "assessed", "conducted",
        ],
        "training_or_support": [
            "trained", "supported", "provided", "maintained",
            "delivered",
        ],
        "collaboration": [
            "collaborated",
        ],
    }

    evidence_categories = sum(
        any(keyword in text for keyword in indicators)
        for indicators in practical_categories.values()
    )

    practical_evidence = sum(
        text.count(keyword)
        for indicators in practical_categories.values()
        for keyword in indicators
    )

    # Experience receives a modest bonus for demonstrated practical
    # work, without allowing repeated generic verbs to dominate.
    if evidence_categories >= 4:
        practical_score = 8
    elif evidence_categories >= 3:
        practical_score = 7
    elif evidence_categories >= 2:
        practical_score = 5
    elif evidence_categories >= 1:
        practical_score = 3
    else:
        practical_score = 0

    experience_score = professional_score

    # -------------------------------------------------
    # 3. Projects / practical application — 15 points
    #
    # Kept under the existing "projects" response key for
    # compatibility. The score reflects breadth of demonstrated
    # practical application rather than requiring software projects.
    # -------------------------------------------------

    if evidence_categories >= 5 and practical_evidence >= 8:
        project_score = 15
    elif evidence_categories >= 4 and practical_evidence >= 6:
        project_score = 13
    elif evidence_categories >= 3 and practical_evidence >= 4:
        project_score = 10
    elif evidence_categories >= 1 and practical_evidence >= 1:
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
        "bsn",
        "b.s.",
        "bs",
        "b.a.",
        "ba",
        "ms",
        "m.s.",
        "ma",
        "m.a.",
        "mba",
        "phd",
        "ph.d.",
        "md",
        "jd",
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
