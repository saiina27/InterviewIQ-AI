from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from fastapi import UploadFile, File
from backend.app.services.face_detection import detect_faces
import os

from backend.app.database import get_db

from backend.app.schemas import (
    InterviewCreate,
    InterviewQuestionRequest,
    AnswerCreate,
    CheatingEventCreate,
)

from backend.app.models import (
    Candidate,
    Interview,
    InterviewAnswer,
    InterviewQuestion,
)

from backend.app.crud import (
    create_interview,
    save_questions,
    get_interview_questions,
    save_answer,
    update_answer_evaluation,
    save_cheating_event,
)

from backend.app.services.gemini_service import (
    generate_interview_questions,
)

from backend.app.services.answer_evaluation_service import (
    evaluate_answer,
)

from backend.app.services.analytics_service import (
    get_interview_analysis,
    generate_score_graph,
)

from backend.app.services.report_service import (
    build_interview_report,
)

from backend.app.services.pdf_report_service import (
    generate_interview_report_pdf,
)

from backend.app.crud import get_interviews_by_candidate
from backend.app.security import get_current_user
from backend.app.models import User

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)

# ----------------------------
# START INTERVIEW
# ----------------------------
@router.post("/start")
def start_interview(
    request: InterviewCreate,
    db: Session = Depends(get_db)
):

    interview = create_interview(
        db=db,
        candidate_id=request.candidate_id,
        role=request.role,
        difficulty=request.difficulty
    )

    questions = generate_interview_questions(
        skills=request.skills,
        role=request.role,
        experience=request.experience,
        difficulty=request.difficulty,
        count=request.count
    )

    save_questions(
        db=db,
        interview_id=interview.id,
        questions=questions
    )

    return {
        "success": True,
        "message": "Interview started successfully",
        "interview_id": interview.id
    }


# ----------------------------
# GENERATE QUESTIONS (TEST ONLY)
# ----------------------------
@router.post("/generate-questions")
def generate_questions(request: InterviewQuestionRequest):

    questions = generate_interview_questions(
        skills=request.skills,
        role=request.role,
        experience=request.experience,
        difficulty=request.difficulty,
        count=request.count,
    )

    return {
        "success": True,
        "questions": questions
    }


# ----------------------------
# GET ALL QUESTIONS
# ----------------------------
@router.get("/{interview_id}/questions")
def fetch_questions(
    interview_id: int,
    db: Session = Depends(get_db)
):

    questions = get_interview_questions(
        db=db,
        interview_id=interview_id
    )

    return {
        "success": True,
        "interview_id": interview_id,
        "total_questions": len(questions),
        "questions": [
            {
                "id": q.id,
                "question": q.question,
                "type": q.question_type
            }
            for q in questions
        ]
    }


# ----------------------------
# SUBMIT ANSWER
# ----------------------------
@router.post("/answer")
def submit_answer(
    request: AnswerCreate,
    db: Session = Depends(get_db)
):

    # ----------------------------
    # Save Answer
    # ----------------------------
    answer = save_answer(
        db=db,
        interview_id=request.interview_id,
        question_id=request.question_id,
        answer=request.answer
    )

    if not answer:
        raise HTTPException(
            status_code=409,
            detail="Answer already exists for this question"
        )

    # ----------------------------
    # Fetch Question
    # ----------------------------
    question = db.query(InterviewQuestion).filter(
        InterviewQuestion.id == request.question_id
    ).first()

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    # ----------------------------
    # AI Evaluation
    # ----------------------------
    try:
        evaluation = evaluate_answer(
            question=question.question,
            answer=request.answer
        )

    except Exception as e:

        print("Gemini Evaluation Error:", str(e))

        evaluation = {
            "score": 0,
            "relevance": "unknown",
            "correctness": "unknown",
            "feedback": "AI evaluation unavailable because the Gemini API quota was exceeded.",
            "missing_points": [],
            "skill_tags": []
        }

    # ----------------------------
    # Save Evaluation
    # ----------------------------
    update_answer_evaluation(
        db=db,
        answer_id=answer.id,
        evaluation=evaluation
    )

    # ----------------------------
    # Check Interview Completion
    # ----------------------------
    total_questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.interview_id == request.interview_id
    ).count()

    answered_questions = db.query(InterviewAnswer).filter(
        InterviewAnswer.interview_id == request.interview_id
    ).count()

    completed = False

    if answered_questions >= total_questions:

        interview = db.query(Interview).filter(
            Interview.id == request.interview_id
        ).first()

        if interview:
            interview.status = "Completed"
            db.commit()
            completed = True

    # ----------------------------
    # Response
    # ----------------------------
    return {
        "success": True,
        "message": "Answer submitted successfully",
        "answer_id": answer.id,
        "evaluation": evaluation,
        "progress": {
            "answered": answered_questions,
            "total": total_questions
        },
        "interview_completed": completed
    }

# ----------------------------
# GET NEXT QUESTION (CORE ENGINE)
# ----------------------------
@router.get("/next-question/{interview_id}")
def get_next_question(interview_id: int, db: Session = Depends(get_db)):

    interview = db.query(Interview).filter(
        Interview.id == interview_id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if interview.status == "Completed":
        return {
            "status": "completed",
            "message": "Interview already finished"
        }

    questions = get_interview_questions(db=db, interview_id=interview_id)

    answered = db.query(InterviewAnswer.question_id).filter(
        InterviewAnswer.interview_id == interview_id
    ).all()

    answered_ids = {a[0] for a in answered}

    for q in questions:
        if q.id not in answered_ids:
            return {
                "status": "success",
                "interview_id": interview_id,
                "question_id": q.id,
                "question": q.question,
                "progress": f"{len(answered_ids)+1}/{len(questions)}"
            }

    interview.status = "Completed"
    db.commit()

    return {
        "status": "completed",
        "message": "All questions completed"
    }

@router.post("/evaluate-answer/{answer_id}")
def evaluate_answer_api(answer_id: int, db: Session = Depends(get_db)):

    from backend.app.models import InterviewAnswer, InterviewQuestion, Interview

    answer = db.query(InterviewAnswer).filter(
        InterviewAnswer.id == answer_id
    ).first()

    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")

    # 🔥 FIX: fetch question properly via question_id
    question = db.query(InterviewQuestion).filter(
        InterviewQuestion.id == answer.question_id
    ).first()

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    question_text = question.question   # or question.question_text (depending on model)
    answer_text = answer.answer_text

    evaluation = evaluate_answer(question_text, answer_text)

    updated = update_answer_evaluation(db, answer_id, evaluation)

    return {
        "success": True,
        "evaluation": evaluation,
        "updated": updated.id if updated else None
    }

@router.get("/analytics/{interview_id}")
def interview_analytics(interview_id: int, db: Session = Depends(get_db)):

    # 1. get score stats
    analysis = get_interview_analysis(db, interview_id)

    # 2. generate graph image
    graph_path = generate_score_graph(db, interview_id)

    return {
        "success": True,
        "analysis": analysis,
        "graph_file": graph_path
    }

@router.get("/report/{interview_id}")
def final_interview_report(
    interview_id: int,
    db: Session = Depends(get_db)
):

    report = build_interview_report(db, interview_id)

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    return {
        "success": True,
        "report": report
    }

@router.get("/report/{interview_id}/pdf")
def create_pdf_report(
    interview_id: int,
    db: Session = Depends(get_db)
):

    report = build_interview_report(db, interview_id)

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    os.makedirs("reports", exist_ok=True)

    file_path = f"reports/interview_{interview_id}_report.pdf"

    pdf_data = {

        "candidate": report["candidate"],

        "interview": report["interview"],

        "statistics": report["statistics"],

        "integrity": report["integrity"],

        "ats_score": report["candidate"]["ats_score"],

        "chart_path": report["graph_file"],

        "skills": {
            "strong": report["strong_skills"],
            "medium": report["medium_skills"],
            "weak": report["weak_skills"]
        },

        "executive_summary": report["executive_summary"],

        "feedback": "\n\n".join(report["overall_feedback"]),

        "recommendation": report["hiring_recommendation"]
    }

    generate_interview_report_pdf(
        file_path=file_path,
        data=pdf_data
    )

    return FileResponse(
        path=file_path,
        filename=f"Interview_Report_{interview_id}.pdf",
        media_type="application/pdf"
    )

@router.post("/cheating")
def record_cheating_event(
    request: CheatingEventCreate,
    db: Session = Depends(get_db)
):

    event = save_cheating_event(
        db=db,
        interview_id=request.interview_id,
        event_type=request.event_type,
        status=request.status
    )

    return {
        "success": True,
        "message": "Cheating event recorded",
        "event_id": event.id
    }

# ----------------------------
# FACE DETECTION
# ----------------------------
@router.post("/detect-face")
async def detect_face(
    interview_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    image_bytes = await image.read()

    result = detect_faces(image_bytes)

    if result == 0:

        save_cheating_event(
            db=db,
            interview_id=interview_id,
            event_type="NO_FACE",
            status="CHEATING"
        )

        return {
            "success": True,
            "status": "NO_FACE"
        }

    elif result > 1:

        save_cheating_event(
            db=db,
            interview_id=interview_id,
            event_type="MULTIPLE_FACES",
            status="CHEATING"
        )

        return {
            "success": True,
            "status": "MULTIPLE_FACES"
        }

    return {
        "success": True,
        "status": "OK"
    }

@router.get("/history")
def interview_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    candidate = (
        db.query(Candidate)
        .filter(Candidate.email == current_user.email)
        .first()
    )

    if not candidate:
        return {
            "success": True,
            "history": []
        }

    interviews = get_interviews_by_candidate(
        db,
        candidate.id
    )

    history = []

    for interview in interviews:

        report = build_interview_report(db, interview.id)

        history.append({
            "id": interview.id,
            "role": interview.role,
            "difficulty": interview.difficulty,
            "status": interview.status,
            "created_at": interview.created_at,

            "overall_score": report["statistics"]["overall_score"] if report else 0,
            "average_score": report["statistics"]["average_score"] if report else 0,
            "percentage": report["statistics"]["percentage"] if report else 0,

            "total_questions": report["statistics"]["total_questions"] if report else 0,
            "answered_questions": report["statistics"]["answered_questions"] if report else 0,

            "cheating_events": report["integrity"]["total_events"] if report else 0,

            "recommendation": report["hiring_recommendation"] if report else None
        })

    return {
        "success": True,
        "history": history
    }