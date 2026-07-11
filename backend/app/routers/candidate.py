from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

import fitz
import uuid

from ..database import get_db
from .. import models, schemas
from ..services.ats_scoring import calculate_ats_score
from ..services.suggestion_service import generate_resume_suggestions
from ..services.role_predictor import predict_job_role
from ..services.ai_resume_review import ai_resume_review

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
        missing_skills=",".join(ats_result["missing_skills"])
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


# ----------------------------
# UPLOAD RESUME (PDF → TEXT + ATS)
# ----------------------------
@router.post("/upload-resume/")
async def upload_resume(
    file: UploadFile = File(...),
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
        ai_review = {
            "error": str(e)
        }

    db_candidate = models.Candidate(
        full_name=file.filename,
        email=f"{uuid.uuid4()}@temp.com",
        phone=None,
        resume_text=text,
        detected_skills=",".join(ats_result["matched_skills"]),
        ats_score=ats_result["ats_score"],
        matched_skills=",".join(ats_result["matched_skills"]),
        missing_skills=",".join(ats_result["missing_skills"])
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