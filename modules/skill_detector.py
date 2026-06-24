import re

SKILLS = [
    "Python",
    "Java",
    "C++",
    "C",
    "SQL",
    "DBMS",
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "PHP",
    "MongoDB",
    "MySQL",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "Data Structures",
    "Algorithms",
    "OOP",
    "Streamlit",
    "OpenCV",
    "Git",
    "GitHub",
    "Flask",
    "Django",
    "REST API"
]

def detect_skills(text):

    detected = []

    text = text.lower()

    for skill in SKILLS:

        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, text):
            detected.append(skill)

    return sorted(list(set(detected)))