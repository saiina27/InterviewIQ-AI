from sqlalchemy.orm import Session

from backend.app.logger import logger

from .ats_scoring import calculate_ats_score
from .suggestion_service import generate_resume_suggestions
from .role_predictor import predict_job_role
from .ai_resume_review import ai_resume_review

from .resume_cache_service import (
    generate_resume_hash,
    get_cached_analysis,
    save_analysis_to_cache
)


def analyze_resume(
    text: str,
    db: Session
):

    # 1. Generate unique resume hash
    resume_hash = generate_resume_hash(text)
    logger.info(f"Resume Hash: {resume_hash}")

    # 2. Check database cache
    cached_result = get_cached_analysis(
        db,
        resume_hash
    )

    if cached_result:
        return cached_result

    logger.info("[AI] Cache miss. Starting resume analysis.")

    # ----------------------------
    # Normal AI pipeline
    # ----------------------------

    ats_result = calculate_ats_score(text)

    suggestions = generate_resume_suggestions(
        text,
        ats_result["missing_skills"]
    )

    role_result = predict_job_role(text)

    try:
        ai_review = ai_resume_review(text)

    except Exception:

        logger.exception(
            "AI Resume Review failed. Using fallback response."
        )

        ai_review = (
            "AI service temporarily unavailable."
        )

    analysis_result = {

        "ats_result": ats_result,

        "resume_suggestions": suggestions,

        "role_prediction": role_result,

        "ai_resume_review": ai_review
    }

    # 3. Save result for future uploads

    save_analysis_to_cache(
        db,
        resume_hash,
        analysis_result
    )

    logger.info("[AI] Resume analysis completed successfully.")

    return analysis_result