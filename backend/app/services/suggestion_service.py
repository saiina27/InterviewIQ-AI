def generate_resume_suggestions(
    resume_text: str,
    missing_skills: list,
    predicted_role: str = ""
):

    text = resume_text.lower()
    suggestions = []

    # ---------------------------------------------------------
    # Role-specific technical gaps
    # ---------------------------------------------------------

    if missing_skills:
        suggestions.append(
            f"For a {predicted_role} role, consider strengthening: "
            + ", ".join(missing_skills[:5])
            + "."
        )

    # ---------------------------------------------------------
    # GitHub
    # ---------------------------------------------------------

    if "github" not in text:
        suggestions.append(
            "Add your GitHub profile so recruiters can review your technical work."
        )

    # ---------------------------------------------------------
    # LinkedIn
    # ---------------------------------------------------------

    if "linkedin" not in text:
        suggestions.append(
            "Add your LinkedIn profile to make your professional profile easier to verify."
        )

    # ---------------------------------------------------------
    # Projects
    # ---------------------------------------------------------

    project_markers = [
        "technical projects",
        "projects",
        "project",
        "built and deployed",
        "developed",
    ]

    project_count = text.count("project")

    if not any(marker in text for marker in project_markers) or project_count < 2:
        suggestions.append(
            "Include strong projects with technologies, responsibilities, and measurable outcomes."
        )

    # ---------------------------------------------------------
    # Internship / professional experience
    # ---------------------------------------------------------

    if "intern" not in text and "internship" not in text:
        suggestions.append(
            "If you have internship, freelance, open-source, or other practical experience, "
            "add it with concrete responsibilities and outcomes."
        )

    # ---------------------------------------------------------
    # Achievements / certifications
    # ---------------------------------------------------------

    if (
        "achievement" not in text
        and "award" not in text
        and "certification" not in text
        and "certifications" not in text
    ):
        suggestions.append(
            "Add relevant achievements, certifications, or measurable accomplishments."
        )

    # ---------------------------------------------------------
    # Resume length
    # ---------------------------------------------------------

    if len(text) < 1500:
        suggestions.append(
            "Add more technical detail to project bullets where it improves clarity or demonstrates impact."
        )

    if not suggestions:
        suggestions.append(
            "No major resume improvements were detected for the predicted role."
        )

    return suggestions[:5]
