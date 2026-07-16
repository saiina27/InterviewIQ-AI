from pydantic import BaseModel, EmailStr
from datetime import datetime


class CandidateCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    resume_text: str
    detected_skills: str | None = None

    predicted_role: str | None = None
    resume_suggestions: str | None = None
    ai_resume_review: str | None = None


class CandidateResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None
    resume_text: str

    detected_skills: str | None

    # ✅ STEP 4 ADDITIONS
    ats_score: int | None = None
    matched_skills: str | None = None
    missing_skills: str | None = None

    predicted_role: str | None = None
    resume_suggestions: str | None = None
    ai_resume_review: str | None = None

    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class InterviewQuestionRequest(BaseModel):
    skills: list[str]
    role: str
    experience: str
    difficulty: str
    count: int    

class InterviewCreate(BaseModel):
    candidate_id: int
    role: str
    difficulty: str

    skills: list[str]
    experience: str
    count: int = 10

class AnswerCreate(BaseModel):
    interview_id: int
    question_id: int
    answer: str

class CheatingEventCreate(BaseModel):
    interview_id: int
    event_type: str
    status: str

class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr

    bio: str | None = None
    profile_image: str | None = None

    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class UserUpdate(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    profile_image: str | None = None    

class Token(BaseModel):
    access_token: str
    token_type: str    
