SKILLS = [
    "python",
    "java",
    "sql",
    "machine learning",
    "html",
    "css",
    "javascript",
    "react",
    "php",
    "dbms",
    "c++",
    "data structures"
]

def detect_skills(text):

    found_skills = []

    text = text.lower()

    for skill in SKILLS:

        if skill.lower() in text:
            found_skills.append(skill)

    return found_skills