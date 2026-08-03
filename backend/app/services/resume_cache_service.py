import hashlib
import json
from sqlalchemy.orm import Session

from .. import models
from backend.app.logger import logger


# ---------------------------------
# Generate unique hash for resume
# ---------------------------------
def generate_resume_hash(text: str):

    return hashlib.sha256(
        text.encode("utf-8")
    ).hexdigest()


# ---------------------------------
# Check existing resume analysis
# ---------------------------------
def get_cached_analysis(
    db: Session,
    resume_hash: str
):

    cached = (
        db.query(models.ResumeAnalysisCache)
        .filter(
            models.ResumeAnalysisCache.resume_hash == resume_hash
        )
        .first()
    )
    logger.info(f"Cache Object: {cached}")
    if cached:
        logger.info("========== Resume Cache ==========")
        logger.info("[CACHE HIT] Returning saved analysis")

        return {
            "ats_result": {
                "ats_score": cached.ats_score,
                "matched_skills": cached.matched_skills.split(",")
                if cached.matched_skills else [],
                "missing_skills": cached.missing_skills.split(",")
                if cached.missing_skills else []
            },
            "resume_suggestions": (
                cached.resume_suggestions.split("\n")
                if cached.resume_suggestions else []
            ),
            "role_prediction": {
                "predicted_role": cached.predicted_role
            },
            "ai_resume_review": (
                json.loads(cached.ai_resume_review)
                if cached.ai_resume_review
                else {}
            )
        }

    logger.info("========== Resume Cache ==========")
    logger.info("[CACHE MISS] New resume analysis required")

    return None


# ---------------------------------
# Save analysis result
# ---------------------------------
def save_analysis_to_cache(
    db: Session,
    resume_hash: str,
    analysis: dict
):

    existing = (
        db.query(models.ResumeAnalysisCache)
        .filter(
            models.ResumeAnalysisCache.resume_hash == resume_hash
        )
        .first()
    )

    if existing:
        logger.info("[CACHE] Already exists")
        return existing

    ats_result = analysis["ats_result"]

    cache_data = models.ResumeAnalysisCache(

        resume_hash=resume_hash,

        ats_score=ats_result["ats_score"],

        matched_skills=",".join(
            ats_result["matched_skills"]
        ),

        missing_skills=",".join(
            ats_result["missing_skills"]
        ),

        predicted_role=analysis["role_prediction"]["predicted_role"],

        resume_suggestions="\n".join(
            analysis["resume_suggestions"]
        ),

        ai_resume_review=json.dumps(
            analysis["ai_resume_review"]
        )
    )

    db.add(cache_data)
    db.commit()
    db.refresh(cache_data)

    logger.info("[CACHE SAVE] Analysis stored successfully")

    return cache_data