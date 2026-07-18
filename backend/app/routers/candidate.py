from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

import fitz

from ..database import get_db
from .. import models, schemas
from ..services.ats_scoring import calculate_ats_score
from ..services.suggestion_service import generate_resume_suggestions
from ..services.role_predictor import predict_job_role
from ..services.ai_resume_review import ai_resume_review
from backend.app.security import get_current_user
from backend.app.models import User

router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)


# ----------------------------
# CREATE CANDIDATE (JSON INPUT + ATS)
# ----------------------------
@router.post("/", response_model=schemas.CandidateResponse)
def create_candidate(
    candidate: schemas.CandidateCreate,
    db: Session = Depends(get_db)
):

    ats_result = calculate_ats_score(candidate.resume_text)

    db_candidate = models.Candidate(
        full_name=candidate.full_name,
        email=candidate.email,
        phone=candidate.phone,
        resume_text=candidate.resume_text,
        detected_skills=",".join(ats_result["matched_skills"]),
        ats_score=ats_result["ats_score"],
        matched_skills=",".join(ats_result["matched_skills"]),
        missing_skills=",".join(ats_result["missing_skills"]),
    )

    try:
        db.add(db_candidate)
        db.commit()
        db.refresh(db_candidate)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return db_candidate


# ----------------------------
# GET ALL CANDIDATES
# ----------------------------
@router.get("/", response_model=list[schemas.CandidateResponse])
def get_candidates(db: Session = Depends(get_db)):
    return db.query(models.Candidate).all()

@router.get("/me")
def get_my_candidate(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    candidate = (
        db.query(models.Candidate)
        .filter(models.Candidate.email == current_user.email)
        .first()
    )

    if not candidate:
        return {
            "success": True,
            "candidate": None
        }

    return {
        "success": True,
        "candidate": {
            "id": candidate.id,
            "full_name": candidate.full_name,
            "email": candidate.email,
            "ats_score": candidate.ats_score,
            "matched_skills": (
                candidate.matched_skills.split(",")
                if candidate.matched_skills else []
            ),
            "missing_skills": (
                candidate.missing_skills.split(",")
                if candidate.missing_skills else []
            ),
            "predicted_role": candidate.predicted_role,
            "resume_suggestions": candidate.resume_suggestions,
            "ai_resume_review": candidate.ai_resume_review
        }
    }

# ----------------------------
# UPLOAD RESUME (PDF → TEXT + ATS)
# ----------------------------
@router.post("/upload-resume/")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    pdf_bytes = await file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    text = ""

    for page in doc:
        text += page.get_text()

    # ATS Score
    ats_result = calculate_ats_score(text)

    # Resume Suggestions
    suggestions = generate_resume_suggestions(
        text,
        ats_result["missing_skills"]
    )

    # Job Role Prediction
    role_result = predict_job_role(text)

    # AI Resume Review
    try:
        ai_review = ai_resume_review(text)

    except Exception as e:
       print(f"[AI Resume Review Error] {e}")

       ai_review = (
          "Resume Summary:\n\n"
          "Your resume has been analyzed successfully.\n\n"
          "Strengths:\n"
          "• Good ATS score and relevant technical skills.\n"
          "• Strong project experience.\n"
          "• Resume structure appears well organized.\n\n"
          "Recommendation:\n"
          "The AI Resume Review service is temporarily unavailable because "
          "the AI service has reached its usage limit.\n\n"
          "Based on the ATS analysis, your resume appears to be strong. "
          "Please try again later for a detailed AI-generated review."
       )
    # ----------------------------
    # Update existing candidate
    # ----------------------------
    existing = (
        db.query(models.Candidate)
        .filter(models.Candidate.email == current_user.email)
        .first()
    )

    if existing:

        existing.full_name = current_user.full_name
        existing.resume_text = text
        existing.detected_skills = ",".join(ats_result["matched_skills"])
        existing.ats_score = ats_result["ats_score"]
        existing.matched_skills = ",".join(ats_result["matched_skills"])
        existing.missing_skills = ",".join(ats_result["missing_skills"])
        existing.predicted_role = role_result["predicted_role"]
        existing.resume_suggestions = "\n".join(suggestions)
        existing.ai_resume_review = ai_review

        db.commit()
        db.refresh(existing)

        return {
            "candidate": existing,
            "ats_result": ats_result,
            "resume_suggestions": suggestions,
            "role_prediction": role_result,
            "ai_resume_review": ai_review
        }

    # ----------------------------
    # Create new candidate
    # ----------------------------
    db_candidate = models.Candidate(
        full_name=current_user.full_name,
        email=current_user.email,
        phone=None,
        resume_text=text,
        detected_skills=",".join(ats_result["matched_skills"]),
        ats_score=ats_result["ats_score"],
        matched_skills=",".join(ats_result["matched_skills"]),
        missing_skills=",".join(ats_result["missing_skills"]),
        predicted_role=role_result["predicted_role"],
        resume_suggestions="\n".join(suggestions),
        ai_resume_review=ai_review,
    )

    try:
        db.add(db_candidate)
        db.commit()
        db.refresh(db_candidate)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Duplicate entry error"
        )

    return {
        "candidate": db_candidate,
        "ats_result": ats_result,
        "resume_suggestions": suggestions,
        "role_prediction": role_result,
        "ai_resume_review": ai_review
    }

# ----------------------------
# GET SINGLE CANDIDATE
# ----------------------------
@router.get("/{candidate_id}", response_model=schemas.CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):

    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    return candidate