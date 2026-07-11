def get_fallback_questions(skills):

    base = [
        "Tell me about yourself",
        "Explain your final year project",
        "Why should we hire you?"
    ]

    skill_based = []

    for skill in skills:
        skill_based.append(f"Explain your experience with {skill}")
        skill_based.append(f"What challenges did you face with {skill}?")

    return base + skill_based