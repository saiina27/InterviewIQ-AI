def generate_questions(skills):

    base_questions = []

    for skill in skills:

        base_questions.append(f"What is {skill}?")
        base_questions.append(f"Explain real-world use of {skill}.")
        base_questions.append(f"What are challenges in {skill}?")

    # AI style enhancement
    if "python" in skills:
        base_questions.append("Explain Python memory management.")

    if "sql" in skills:
        base_questions.append("Difference between JOIN types in SQL.")

    return base_questions