from sqlalchemy.orm import Session
import json
from backend.app.models import Interview
from backend.app.models import InterviewQuestion
from backend.app.models import Candidate
from backend.app.models import InterviewAnswer, CheatingEvent
from backend.app.models import User
from backend.app.security import hash_password, verify_password

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

def get_user_by_email(db: Session, email: str):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def create_user(
    db: Session,
    full_name: str,
    email: str,
    password: str
):

    existing = get_user_by_email(db, email)

    if existing:
        return None

    user = User(
        full_name=full_name,
        email=email,
        hashed_password=hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str
):

    user = get_user_by_email(db, email)

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user

def get_interviews_by_candidate(
    db: Session,
    candidate_id: int
):
    return (
        db.query(Interview)
        .filter(Interview.candidate_id == candidate_id)
        .order_by(Interview.created_at.desc())
        .all()
    )

def update_user(db, user, data):

    if data.full_name is not None:
        user.full_name = data.full_name

    if data.bio is not None:
        user.bio = data.bio

    if data.profile_image is not None:
        user.profile_image = data.profile_image

    db.commit()
    db.refresh(user)

    return user
