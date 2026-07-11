def predict_job_role(resume_text: str):

    text = resume_text.lower()

    scores = {

        "AI Engineer": 0,

        "Backend Developer": 0,

        "Python Developer": 0,

        "Data Analyst": 0,

        "Full Stack Developer": 0

    }

    # -----------------------------
    # AI Engineer
    # -----------------------------

    ai_keywords = [
        "machine learning",
        "deep learning",
        "tensorflow",
        "pytorch",
        "opencv",
        "nlp",
        "llm",
        "gemini",
        "ai"
    ]

    # -----------------------------
    # Backend
    # -----------------------------

    backend_keywords = [
        "fastapi",
        "django",
        "flask",
        "postgresql",
        "sql",
        "api",
        "docker",
        "redis"
    ]

    # -----------------------------
    # Python
    # -----------------------------

    python_keywords = [
        "python",
        "oop",
        "numpy",
        "pandas"
    ]

    # -----------------------------
    # Data Analyst
    # -----------------------------

    analyst_keywords = [
        "excel",
        "power bi",
        "tableau",
        "pandas",
        "numpy",
        "sql",
        "statistics"
    ]

    # -----------------------------
    # Full Stack
    # -----------------------------

    fullstack_keywords = [
        "react",
        "javascript",
        "html",
        "css",
        "node",
        "mongodb"
    ]

    for word in ai_keywords:
        if word in text:
            scores["AI Engineer"] += 1

    for word in backend_keywords:
        if word in text:
            scores["Backend Developer"] += 1

    for word in python_keywords:
        if word in text:
            scores["Python Developer"] += 1

    for word in analyst_keywords:
        if word in text:
            scores["Data Analyst"] += 1

    for word in fullstack_keywords:
        if word in text:
            scores["Full Stack Developer"] += 1

    best_role = max(scores, key=scores.get)

    return {
        "predicted_role": best_role,
        "role_scores": scores
    }