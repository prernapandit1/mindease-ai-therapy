from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os
from database import get_db
from models import User, JournalEntry
from auth import get_current_user

router = APIRouter(prefix="/api/journal", tags=["journal"])

JOURNAL_PROMPTS = [
    "What's one thing you're grateful for today, no matter how small?",
    "Describe a moment today when you felt at peace. What made it special?",
    "What emotion has been most present for you lately? Where do you feel it in your body?",
    "Write about a challenge you're facing. What would you tell a close friend in the same situation?",
    "What boundaries do you need to set to protect your mental health?",
    "Describe your ideal day. What would make you feel truly alive?",
    "What negative thought keeps returning? How might you challenge it?",
    "Write a letter of compassion to your younger self.",
    "What are three things you did well this week?",
    "What does your inner critic say most often? What would your inner supporter say instead?",
    "Who in your life makes you feel truly seen and understood?",
    "What are you holding on to that might be worth letting go?",
    "Describe a time you felt truly proud of yourself.",
    "What self-care practices help you feel most restored?",
    "If your anxiety/sadness could speak, what would it say it needs from you?"
]

class JournalRequest(BaseModel):
    title: str
    content: str
    ai_prompt: Optional[str] = None

def get_ai_prompt() -> str:
    from datetime import date
    day_index = date.today().timetuple().tm_yday % len(JOURNAL_PROMPTS)
    return JOURNAL_PROMPTS[day_index]

@router.post("/entry")
def create_entry(
    req: JournalRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Journal only available on standard/premium
    if current_user.plan not in ["standard", "premium"]:
        raise HTTPException(status_code=403, detail="Journal is available on Standard and Premium plans")

    entry = JournalEntry(
        user_id=current_user.id,
        title=req.title,
        content=req.content,
        ai_prompt=req.ai_prompt
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"id": entry.id, "message": "Journal entry saved"}

@router.get("/entries")
def get_entries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id
    ).order_by(JournalEntry.created_at.desc()).all()

    return [
        {
            "id": e.id,
            "title": e.title,
            "content": e.content,
            "ai_prompt": e.ai_prompt,
            "created_at": e.created_at.isoformat()
        }
        for e in entries
    ]

@router.get("/prompt")
def get_prompt(current_user: User = Depends(get_current_user)):
    return {"prompt": get_ai_prompt()}

@router.delete("/entry/{entry_id}")
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted"}
