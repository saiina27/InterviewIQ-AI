import json
from datetime import datetime

from sqlalchemy.orm import Session

from backend.app.crud import get_interview_report_data
from backend.app.services.analytics_service import (
    get_interview_analysis,
    generate_score_graph,
)


def build_interview_report(db: Session, interview_id: int):
    """
    Build complete interview report.
    """

    data = get_interview_report_data(db, interview_id)

    if not data:
        return None

    analysis = get_interview_analysis(db, interview_id)
    graph = generate_score_graph(db, interview_id)

    candidate = data["candidate"]
    interview = data["interview"]
    answers = data["answers"]
    cheating_events = data.get("cheating_events", [])

    strong_skills = set()
    weak_skills = set()
    medium_skills = set()

    feedback = []

    total_score = 0
    answered_questions = 0

    # -----------------------------
    # Process Answers
    # -----------------------------
    for ans in answers:

        if ans.score is not None:
            total_score += ans.score
            answered_questions += 1

        if ans.feedback and ans.feedback.strip():
            feedback.append(ans.feedback)

        skills = []

        if ans.skill_tags:
            try:
                skills = json.loads(ans.skill_tags)
            except Exception:
                skills = []

        if ans.score is None:
            continue

        if ans.score >= 8:
            strong_skills.update(skills)

        elif ans.score >= 5:
            medium_skills.update(skills)

        else:
            weak_skills.update(skills)

    # -----------------------------
    # Statistics
    # -----------------------------
    total_questions = analysis["total_questions"]

    unanswered_questions = max(
        total_questions - answered_questions,
        0
    )

    percentage = round(
        (total_score / (total_questions * 10)) * 100,
        2
    ) if total_questions else 0

    average = analysis["average_score"]

    if average >= 8:
        recommendation = "Strong Hire"
        performance = "Excellent"

    elif average >= 6:
        recommendation = "Hire"
        performance = "Good"

    elif average >= 4:
        recommendation = "Consider"
        performance = "Average"

    else:
        recommendation = "Not Recommended"
        performance = "Needs Improvement"

    # -----------------------------
    # Integrity Score
    # -----------------------------
    total_events = len(cheating_events)

    integrity_score = max(
        100 - (total_events * 5),
        0
    )

    integrity = {
        "integrity_score": integrity_score,
        "total_events": total_events,
        "events": [
            {
                "type": event.event_type,
                "status": event.status,
                "time": (
                    event.created_at.isoformat()
                    if event.created_at
                    else None
                ),
            }
            for event in cheating_events
        ],
    }

    # -----------------------------
    # Executive Summary
    # -----------------------------
    summary = (
        f"The candidate scored {total_score} marks "
        f"across {answered_questions} answered questions "
        f"with an average score of "
        f"{average:.2f}/10. "
        f"Overall performance was classified as "
        f"{performance}."
    )

    # -----------------------------
    # Final Report
    # -----------------------------
    report = {

        "candidate": {
            "id": candidate.id,
            "name": candidate.full_name,
            "email": candidate.email,
            "phone": candidate.phone,
            "ats_score": candidate.ats_score,
        },

        "interview": {
            "id": interview.id,
            "role": interview.role,
            "difficulty": interview.difficulty,
            "status": interview.status,
        },

        "statistics": {
            "overall_score": total_score,
            "average_score": average,
            "max_score": analysis["max_score"],
            "min_score": analysis["min_score"],
            "total_questions": total_questions,
            "answered_questions": answered_questions,
            "unanswered_questions": unanswered_questions,
            "percentage": percentage,
            "performance": performance,
        },

        "integrity": integrity,

        "strong_skills": sorted(strong_skills),
        "medium_skills": sorted(medium_skills),
        "weak_skills": sorted(weak_skills),

        "overall_feedback": list(dict.fromkeys(feedback)),

        "executive_summary": summary,

        "hiring_recommendation": recommendation,

        "graph_file": graph,

        "generated_at": datetime.now().isoformat(),
    }

    return report