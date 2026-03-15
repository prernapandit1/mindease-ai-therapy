from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

from database import get_db, create_tables
from models import User
from auth import router as auth_router, get_current_user
from chat import router as chat_router
from mood import router as mood_router
from journal import router as journal_router
from payment import router as payment_router

app = FastAPI(
    title="MindEase API",
    description="Mental health platform API with AI therapist Sage",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(mood_router)
app.include_router(journal_router)
app.include_router(payment_router)

@app.on_event("startup")
def startup():
    create_tables()
    print("✅ MindEase API started successfully")
    print("📡 API docs: http://localhost:8000/docs")

@app.get("/")
def root():
    return {
        "message": "MindEase API",
        "version": "1.0.0",
        "status": "running",
        "disclaimer": "Sage is an AI assistant and not a licensed therapist."
    }

# User profile endpoints
class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None

@app.get("/api/user/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "plan": current_user.plan,
        "sessions_used": current_user.sessions_used,
        "streak": current_user.streak,
        "onboarding_data": current_user.onboarding_data,
        "created_at": current_user.created_at.isoformat()
    }

@app.put("/api/user/profile")
def update_profile(
    req: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if req.name:
        current_user.name = req.name
    db.commit()
    return {"message": "Profile updated"}

# Onboarding endpoint
class OnboardingRequest(BaseModel):
    answers: dict

@app.post("/api/onboarding/submit")
def submit_onboarding(
    req: OnboardingRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.onboarding_data = req.answers
    db.commit()
    return {"message": "Onboarding complete", "personalized": True}

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
