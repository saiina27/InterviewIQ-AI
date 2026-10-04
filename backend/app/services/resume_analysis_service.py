from sqlalchemy.orm import Session

from backend.app.logger import logger

from .ats_scoring import calculate_ats_score
from backend.app.ai.ai_resume_analyzer import analyze_resume_with_ai

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

    # -------------------------------------------------
    # AI-powered resume analysis
    # -------------------------------------------------

    try:
        ai_analysis = analyze_resume_with_ai(text)

    except Exception:
        logger.exception(
            "AI Resume Analyzer failed."
        )

        # Do not return a fake zero-score analysis.
        # The caller must preserve the candidate's existing valid analysis
        # when the AI provider is temporarily unavailable.
        raise

    # -------------------------------------------------
    # AI-driven ATS score
    # -------------------------------------------------

    ats_result = calculate_ats_score(
        text,
        ai_analysis
    )

    # -------------------------------------------------
    # Role information
    # -------------------------------------------------

    role_result = {
        "predicted_role": ai_analysis.get(
            "role",
            "Unknown"
        ),
        "domain": ai_analysis.get(
            "domain",
            "Unknown"
        )
    }

    # -------------------------------------------------
    # AI Hiring Manager Review
    # -------------------------------------------------

    ai_review = {
        "summary": ai_analysis.get(
            "overview",
            ""
        ),

        "strengths": ai_analysis.get(
            "strengths",
            []
        ),

        "weaknesses": ai_analysis.get(
            "weaknesses",
            []
        ),

        "rating": ai_analysis.get(
            "rating",
            0
        ),

        "resume_suggestions": ai_analysis.get(
            "resume_suggestions",
            []
        )
    }

    # -------------------------------------------------
    # Final response
    # -------------------------------------------------

    analysis_result = {

        "ats_result": ats_result,

        "resume_suggestions": ai_analysis.get(
            "resume_suggestions",
            []
        ),

        "role_prediction": role_result,

        "ai_resume_review": ai_review
    }

    # 3. Save result for future uploads

    save_analysis_to_cache(
        db,
        resume_hash,
        analysis_result
    )

    logger.info(
        "[AI] Resume analysis completed successfully."
    )

    return analysis_result
