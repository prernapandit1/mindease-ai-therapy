from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from database import get_db
from models import User, MoodEntry
from auth import get_current_user

router = APIRouter(prefix="/api/mood", tags=["mood"])

class MoodLogRequest(BaseModel):
    score: int  # 1-10
    emotion_tags: Optional[List[str]] = []
    note: Optional[str] = None

@router.post("/log")
def log_mood(
    req: MoodLogRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if req.score < 1 or req.score > 10:
        raise HTTPException(status_code=400, detail="Score must be between 1 and 10")

    entry = MoodEntry(
        user_id=current_user.id,
        score=req.score,
        emotion_tags=req.emotion_tags,
        note=req.note
    )
    db.add(entry)

    # Update streak
    yesterday = datetime.utcnow() - timedelta(days=1)
    recent_entry = db.query(MoodEntry).filter(
        MoodEntry.user_id == current_user.id,
        MoodEntry.created_at >= yesterday
    ).first()
    if recent_entry:
        current_user.streak += 1
    else:
        current_user.streak = 1

    db.commit()
    db.refresh(entry)
    return {"id": entry.id, "score": entry.score, "message": "Mood logged successfully"}

@router.get("/history")
def get_mood_history(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    since = datetime.utcnow() - timedelta(days=days)
    entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == current_user.id,
        MoodEntry.created_at >= since
    ).order_by(MoodEntry.created_at.asc()).all()

    return [
        {
            "id": e.id,
            "score": e.score,
            "emotion_tags": e.emotion_tags,
            "note": e.note,
            "created_at": e.created_at.isoformat()
        }
        for e in entries
    ]

@router.get("/stats")
def get_mood_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == current_user.id
    ).all()

    if not entries:
        return {"average": 0, "total": 0, "streak": current_user.streak}

    avg = sum(e.score for e in entries) / len(entries)
    return {
        "average": round(avg, 1),
        "total": len(entries),
        "streak": current_user.streak,
        "highest": max(e.score for e in entries),
        "lowest": min(e.score for e in entries)
    }
