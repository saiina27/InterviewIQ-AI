from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from backend.app.routers import candidate, interview, auth

app = FastAPI(
    title="InterviewIQ API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://interview-iq-ai-lyart.vercel.app",
        "https://interview-iq-imw3gvvzs-saiina28.vercel.app",
        "https://interview-iq-hv3wm5qux-saiina28.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(candidate.router)
app.include_router(interview.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "InterviewIQ Backend Running 🚀"}