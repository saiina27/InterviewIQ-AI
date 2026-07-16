from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .database import Base


# ------------------------
# Candidate
# ------------------------
class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)

    resume_text = Column(Text, nullable=False)

    detected_skills = Column(Text, nullable=True)
    ats_score = Column(Integer, nullable=True)

    matched_skills = Column(Text, nullable=True)
    missing_skills = Column(Text, nullable=True)

    predicted_role = Column(String, nullable=True)

    resume_suggestions = Column(Text, nullable=True)

    ai_resume_review = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    interviews = relationship(
        "Interview",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )


# ------------------------
# Interview
# ------------------------
class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)

    role = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)

    status = Column(String, default="In Progress", nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    candidate = relationship("Candidate", back_populates="interviews")

    questions = relationship(
        "InterviewQuestion",
        back_populates="interview",
        cascade="all, delete-orphan"
    )

    answers = relationship(
        "InterviewAnswer",
        back_populates="interview",
        cascade="all, delete-orphan"
    )

    cheating_events = relationship(
    "CheatingEvent",
    back_populates="interview",
    cascade="all, delete-orphan"
    )


# ------------------------
# Interview Question
# ------------------------
class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)

    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=False)

    question = Column(Text, nullable=False)

    question_type = Column(String, default="Technical")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    interview = relationship("Interview", back_populates="questions")

    answers = relationship(
        "InterviewAnswer",
        back_populates="question",
        cascade="all, delete-orphan"
    )

# ------------------------
# Interview Answer
# ------------------------
class InterviewAnswer(Base):

    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)

    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=False)

    question_id = Column(Integer, ForeignKey("interview_questions.id"), nullable=False)

    answer_text = Column(Text, nullable=False)

    # AI evaluation fields
    score = Column(Integer, nullable=True)
    relevance = Column(String, nullable=True)
    correctness = Column(String, nullable=True)
    feedback = Column(Text, nullable=True)
    missing_points = Column(Text, nullable=True)
    skill_tags = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    interview = relationship("Interview", back_populates="answers")

    question = relationship("InterviewQuestion", back_populates="answers")

class CheatingEvent(Base):
    __tablename__ = "cheating_events"

    id = Column(Integer, primary_key=True, index=True)

    interview_id = Column(
        Integer,
        ForeignKey("interviews.id"),
        nullable=False
    )

    event_type = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    interview = relationship(
        "Interview",
        back_populates="cheating_events"
    )    

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    hashed_password = Column(String, nullable=False)

    # NEW
    bio = Column(Text, nullable=True)

    # NEW
    profile_image = Column(String, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )