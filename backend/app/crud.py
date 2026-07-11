from sqlalchemy.orm import Session
import json
from backend.app.models import Interview
from backend.app.models import InterviewQuestion
from backend.app.models import Candidate
from backend.app.models import InterviewAnswer, CheatingEvent

def create_interview(
    db: Session,
    candidate_id: int,
    role: str,
    difficulty: str
):
    """
    Creates a new interview record.
    """

    interview = Interview(
        candidate_id=candidate_id,
        role=role,
        difficulty=difficulty
    )

    db.add(interview)

    db.commit()

    db.refresh(interview)

    return interview

def save_questions(
    db: Session,
    interview_id: int,
    questions: list
):

    for item in questions:

        db_question = InterviewQuestion(
            interview_id=interview_id,
            question=item["question"],   
            question_type="Technical"
        )

        db.add(db_question)

    db.commit()

def get_candidate_by_id(
    db: Session,
    candidate_id: int
):
    return (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )    

def get_interview_questions(
    db: Session,
    interview_id: int
):
    return (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview_id
        )
        .order_by(InterviewQuestion.id)
        .all()
    )

def save_answer(db: Session, interview_id: int, question_id: int, answer: str):

    # check duplicate
    existing = db.query(InterviewAnswer).filter(
        InterviewAnswer.interview_id == interview_id,
        InterviewAnswer.question_id == question_id
    ).first()

    if existing:
        return None  # already answered

    db_answer = InterviewAnswer(
        interview_id=interview_id,
        question_id=question_id,
        answer_text=answer
    )

    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)

    return db_answer


def update_answer_evaluation(db: Session, answer_id: int, evaluation: dict):
    answer = db.query(InterviewAnswer).filter(InterviewAnswer.id == answer_id).first()

    if not answer:
        return None

    answer.score = evaluation.get("score")
    answer.relevance = evaluation.get("relevance")
    answer.correctness = evaluation.get("correctness")
    answer.feedback = evaluation.get("feedback")
    answer.skill_tags = json.dumps(evaluation.get("skill_tags", []))
    answer.missing_points = json.dumps(evaluation.get("missing_points", []))

    db.commit()
    db.refresh(answer)
    return answer

def get_interview_report_data(db: Session, interview_id: int):

    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        return None

    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == interview.candidate_id)
        .first()
    )

    answers = (
        db.query(InterviewAnswer)
        .filter(InterviewAnswer.interview_id == interview_id)
        .all()
    )

    cheating_events = (
        db.query(CheatingEvent)
        .filter(CheatingEvent.interview_id == interview_id)
        .all()
    )

    return {
        "interview": interview,
        "candidate": candidate,
        "answers": answers,
        "cheating_events": cheating_events
    }

def save_cheating_event(
    db: Session,
    interview_id: int,
    event_type: str,
    status: str
):

    event = CheatingEvent(
        interview_id=interview_id,
        event_type=event_type,
        status=status
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event