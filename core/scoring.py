import numpy as np
import pandas as pd


def evaluate_candidate(skills, answers):
    """
    Evaluate candidate answers and generate interview analytics.
    """

    # ------------------------
    # Make Equal Length
    # ------------------------
    answers = answers[:len(skills)]

    while len(answers) < len(skills):
        answers.append("")

    # ------------------------
    # Create DataFrame
    # ------------------------
    df = pd.DataFrame({
        "skill": skills,
        "answer": answers
    })

    # ------------------------
    # Answer Length
    # ------------------------
    df["answer_length"] = df["answer"].apply(
        lambda x: len(str(x).strip())
    )

    # ------------------------
    # Skill Mentioned?
    # ------------------------
    df["skill_match"] = df.apply(
        lambda row: row["skill"].lower() in str(row["answer"]).lower(),
        axis=1
    )

    # ------------------------
    # Score Calculation
    # ------------------------
    scores = []

    for _, row in df.iterrows():

        score = 0

        # Length Score (0-50)
        score += min(row["answer_length"] / 2, 50)

        # Skill Match Score (0 or 50)
        if row["skill_match"]:
            score += 50

        scores.append(round(score, 2))

    df["score"] = np.array(scores)

    # ------------------------
    # Performance Status
    # ------------------------
    df["status"] = np.where(
        df["score"] >= 70,
        "Strong",
        np.where(
            df["score"] >= 40,
            "Average",
            "Weak"
        )
    )

    # ------------------------
    # Overall Analytics
    # ------------------------
    scores = df["score"].to_numpy()

    ats_score = round(np.mean(scores), 2)
    average_score = round(np.mean(scores), 2)
    highest_score = round(np.max(scores), 2)
    lowest_score = round(np.min(scores), 2)
    consistency = round(np.std(scores), 2)

    # ------------------------
    # Rating
    # ------------------------
    if ats_score >= 90:
        rating = "Excellent"
    elif ats_score >= 75:
        rating = "Very Good"
    elif ats_score >= 60:
        rating = "Good"
    elif ats_score >= 40:
        rating = "Average"
    else:
        rating = "Needs Improvement"

    # ------------------------
    # Hiring Recommendation
    # ------------------------
    if ats_score >= 80:
        recommendation = "Strong Hire"
    elif ats_score >= 60:
        recommendation = "Hire"
    elif ats_score >= 40:
        recommendation = "Consider"
    else:
        recommendation = "Reject"

    # ------------------------
    # Return Results
    # ------------------------
    return {
        "df": df,
        "ats_score": ats_score,
        "average_score": average_score,
        "highest_score": highest_score,
        "lowest_score": lowest_score,
        "consistency": consistency,
        "rating": rating,
        "recommendation": recommendation,
        "strong_skills": df[df["status"] == "Strong"]["skill"].tolist(),
        "weak_skills": df[df["status"] == "Weak"]["skill"].tolist(),
    }