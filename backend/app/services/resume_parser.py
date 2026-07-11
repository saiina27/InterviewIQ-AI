import re

def extract_email(text: str):
    match = re.findall(r'[\w\.-]+@[\w\.-]+', text)
    return match[0] if match else None


def extract_phone(text: str):
    match = re.findall(r'\b\d{10}\b', text)
    return match[0] if match else None


def extract_name(text: str):
    # very simple heuristic (first line assumption)
    lines = text.strip().split("\n")
    return lines[0] if lines else None


def extract_skills(text: str):
    skills_db = [
        "python", "fastapi", "sql", "postgresql",
        "numpy", "pandas", "api", "docker", "git"
    ]

    text_lower = text.lower()
    found = [skill for skill in skills_db if skill in text_lower]

    return found