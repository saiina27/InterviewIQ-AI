import os
import numpy as np

import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt

from sqlalchemy.orm import Session

from backend.app.models import InterviewAnswer


# --------------------------------------------------
# Interview Analytics
# --------------------------------------------------

def get_interview_analysis(db: Session, interview_id: int):

    answers = (
        db.query(InterviewAnswer)
        .filter(InterviewAnswer.interview_id == interview_id)
        .all()
    )

    total_questions = len(answers)

    if total_questions == 0:
        return {
            "average_score": 0,
            "max_score": 0,
            "min_score": 0,
            "total_score": 0,
            "percentage": 0,
            "answered_questions": 0,
            "total_questions": 0,
        }

    scores = [
        answer.score
        for answer in answers
        if answer.score is not None
    ]

    answered_questions = len(scores)

    if answered_questions == 0:
        return {
            "average_score": 0,
            "max_score": 0,
            "min_score": 0,
            "total_score": 0,
            "percentage": 0,
            "answered_questions": 0,
            "total_questions": total_questions,
        }

    total_score = int(np.sum(scores))

    average_score = round(float(np.mean(scores)), 2)

    max_score = int(np.max(scores))

    min_score = int(np.min(scores))

    percentage = round(
        (total_score / (total_questions * 10)) * 100,
        2,
    )

    return {
        "average_score": average_score,
        "max_score": max_score,
        "min_score": min_score,
        "total_score": total_score,
        "percentage": percentage,
        "answered_questions": answered_questions,
        "total_questions": total_questions,
    }


# --------------------------------------------------
# Performance Graph
# --------------------------------------------------

def generate_score_graph(db: Session, interview_id: int):

    answers = (
        db.query(InterviewAnswer)
        .filter(InterviewAnswer.interview_id == interview_id)
        .order_by(InterviewAnswer.question_id)
        .all()
    )

    scores = [
        answer.score if answer.score is not None else 0
        for answer in answers
    ]

    if not scores:
        return None

    os.makedirs("reports", exist_ok=True)

    plt.figure(figsize=(9, 4.5))

    plt.plot(
        range(1, len(scores) + 1),
        scores,
        marker="o",
        linewidth=2,
    )

    plt.xticks(range(1, len(scores) + 1))

    plt.ylim(0, 10)

    plt.title("Interview Performance")
    plt.xlabel("Question Number")
    plt.ylabel("Score (Out of 10)")

    plt.grid(True)

    graph_path = f"reports/interview_{interview_id}_graph.png"

    plt.tight_layout()

    plt.savefig(graph_path)

    plt.close()

    return graph_path