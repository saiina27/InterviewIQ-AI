def evaluate_answer(question, answer, skills):
    answer = answer.lower().strip()

    if not answer:
        return 0

    score = 0

    # Length Score (20)
    words = len(answer.split())

    if words >= 30:
        score += 20
    elif words >= 15:
        score += 15
    elif words >= 5:
        score += 10

    # Skill Match Score (40)
    matched_skills = 0

    for skill in skills:
        if skill.lower() in answer:
            matched_skills += 1

    score += min(matched_skills * 10, 40)

    # Completeness (20)
    if "." in answer or "," in answer:
        score += 20
    elif words > 10:
        score += 10

    # Communication (20)
    if words > 20:
        score += 20
    elif words > 10:
        score += 10

    return min(score, 100)