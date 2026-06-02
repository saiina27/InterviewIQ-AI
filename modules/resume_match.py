def calculate_match(resume_skills, role):

    role_skills = {
        "Python Developer": [
            "python",
            "oop",
            "sql",
            "django",
            "flask"
        ],

        "Web Developer": [
            "html",
            "css",
            "javascript",
            "react",
            "php"
        ],

        "Data Analyst": [
            "python",
            "pandas",
            "excel",
            "sql",
            "data analysis"
        ]
    }

    required = role_skills.get(role, [])

    matched = []

    for skill in resume_skills:
        if skill.lower() in [s.lower() for s in required]:
            matched.append(skill)

    if len(required) == 0:
        return 0, matched, required

    percentage = round(
        (len(matched) / len(required)) * 100
    )

    return percentage, matched, required