def generate_resume_suggestions(resume_text: str, missing_skills: list):

    text = resume_text.lower()

    suggestions = []

    # -------------------------
    # Missing Skills
    # -------------------------

    if missing_skills:
        suggestions.append(
            "Add these important skills: " +
            ", ".join(missing_skills)
        )

    # -------------------------
    # GitHub
    # -------------------------

    if "github" not in text:
        suggestions.append(
            "Add your GitHub profile."
        )

    # -------------------------
    # LinkedIn
    # -------------------------

    if "linkedin" not in text:
        suggestions.append(
            "Add your LinkedIn profile."
        )

    # -------------------------
    # Projects
    # -------------------------

    if "project" not in text:
        suggestions.append(
            "Include at least 2 strong projects."
        )

    # -------------------------
    # Internship
    # -------------------------

    if (
        "intern" not in text and
        "internship" not in text
    ):
        suggestions.append(
            "Mention internships or practical experience."
        )

    # -------------------------
    # Achievements
    # -------------------------

    if (
        "achievement" not in text and
        "award" not in text
    ):
        suggestions.append(
            "Include achievements or certifications."
        )

    # -------------------------
    # Resume Length
    # -------------------------

    if len(text) < 1500:
        suggestions.append(
            "Your resume looks short. Add more technical details."
        )

    return suggestions