import hashlib
import json
from sqlalchemy.orm import Session

from .. import models
from backend.app.logger import logger


# ---------------------------------
# Resume analysis version
# ---------------------------------
#
# Increment this whenever the analysis logic/prompt changes
# enough that an old cached result should no longer be reused.
#
CURRENT_ANALYSIS_VERSION = 8


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
            models.ResumeAnalysisCache.resume_hash == resume_hash,
            models.ResumeAnalysisCache.prompt_version
            == CURRENT_ANALYSIS_VERSION
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
        logger.info(
            "[CACHE] Existing resume found. Updating analysis version."
        )

        ats_result = analysis["ats_result"]

        existing.prompt_version = CURRENT_ANALYSIS_VERSION
        existing.ats_score = ats_result["ats_score"]

        existing.matched_skills = ",".join(
            ats_result["matched_skills"]
        )

        existing.missing_skills = ",".join(
            ats_result["missing_skills"]
        )

        existing.predicted_role = analysis["role_prediction"]["predicted_role"]

        existing.resume_suggestions = "\n".join(
            analysis["resume_suggestions"]
        )

        existing.ai_resume_review = json.dumps(
            analysis["ai_resume_review"]
        )

        db.commit()
        db.refresh(existing)

        logger.info("[CACHE UPDATE] Analysis updated successfully")

        return existing

    ats_result = analysis["ats_result"]

    cache_data = models.ResumeAnalysisCache(

        resume_hash=resume_hash,

        prompt_version=CURRENT_ANALYSIS_VERSION,

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