from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
import json
from database import get_db
from models import User, ChatSession
from auth import get_current_user

router = APIRouter(prefix="/api/chat", tags=["chat"])

CRISIS_KEYWORDS = [
    "suicide", "suicidal", "kill myself", "end my life", "self-harm", "self harm",
    "hurt myself", "cut myself", "hopeless", "can't go on", "cant go on",
    "end it all", "no reason to live", "don't want to live", "dont want to live",
    "worthless", "better off dead", "overdose"
]

SAGE_SYSTEM_PROMPT = """You are Sage, a warm, empathetic, and professional AI mental health companion for MindEase. 

Your approach:
- Warm, compassionate, and non-judgmental at all times
- Use evidence-based techniques from CBT (Cognitive Behavioral Therapy) and DBT (Dialectical Behavior Therapy)
- Help users identify cognitive distortions and reframe negative thoughts (CBT)
- Teach mindfulness, emotion regulation, and distress tolerance (DBT)
- Specializations: anxiety, depression, relationships, stress, grief, trauma, loneliness

Guidelines:
- NEVER diagnose mental health conditions
- ALWAYS recommend professional help for serious issues
- Always end sessions with a calming affirmation
- For users in India, mention iCall helpline: 9152987821
- Be culturally sensitive and inclusive
- Ask thoughtful follow-up questions to better understand the user
- Validate emotions before offering techniques or advice
- Keep responses conversational, warm — not clinical or robotic

IMPORTANT DISCLAIMER: Always include this in your first message and periodically: "Sage is an AI assistant and not a licensed therapist. Please consult a mental health professional for clinical support."

If you detect any crisis signals (suicidal thoughts, self-harm), IMMEDIATELY respond with empathy AND provide crisis resources:
- iCall (India): 9152987821
- Vandrevala Foundation: 1860-2662-345
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

Onboarding context will be provided. Use it to personalize responses."""

def detect_crisis(message: str) -> bool:
    msg_lower = message.lower()
    return any(keyword in msg_lower for keyword in CRISIS_KEYWORDS)

def get_groq_client():
    try:
        from groq import Groq
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return None
        return Groq(api_key=api_key)
    except ImportError:
        return None

class MessageRequest(BaseModel):
    message: str
    session_id: Optional[int] = None
    mood_before: Optional[int] = None

class MessageResponse(BaseModel):
    response: str
    session_id: int
    is_crisis: bool
    crisis_resources: Optional[dict] = None

@router.post("/message", response_model=MessageResponse)
def send_message(
    req: MessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check session limits for basic plan
    if current_user.plan == "basic" and current_user.sessions_used >= 10:
        raise HTTPException(status_code=403, detail="Session limit reached. Please upgrade your plan.")

    is_crisis = detect_crisis(req.message)

    # Get or create session
    session = None
    if req.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == req.session_id,
            ChatSession.user_id == current_user.id
        ).first()

    if not session:
        session = ChatSession(
            user_id=current_user.id,
            messages=[],
            mood_before=req.mood_before
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        # Count new session
        current_user.sessions_used += 1
        current_user.last_active = datetime.utcnow()

    messages = session.messages or []

    # Build conversation history
    history = []
    for msg in messages[-20:]:  # Last 20 messages for context
        history.append({"role": msg["role"], "content": msg["content"]})

    history.append({"role": "user", "content": req.message})

    # Get AI response
    client = get_groq_client()

    if client:
        try:
            # Build system prompt with user context
            system = SAGE_SYSTEM_PROMPT
            if current_user.onboarding_data:
                system += f"\n\nUser context: {json.dumps(current_user.onboarding_data)}"
            if is_crisis:
                system += "\n\nCRITICAL: The user may be in crisis. Respond with immediate empathy and provide crisis resources."

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "system", "content": system}] + history,
                max_tokens=800,
                temperature=0.7
            )
            ai_response = response.choices[0].message.content
        except Exception as e:
            ai_response = get_fallback_response(is_crisis)
    else:
        ai_response = get_fallback_response(is_crisis)

    # Save messages
    messages.append({"role": "user", "content": req.message, "timestamp": datetime.utcnow().isoformat()})
    messages.append({"role": "assistant", "content": ai_response, "timestamp": datetime.utcnow().isoformat()})
    session.messages = messages
    db.commit()

    crisis_resources = None
    if is_crisis:
        crisis_resources = {
            "iCall": "9152987821",
            "Vandrevala Foundation": "1860-2662-345",
            "AASRA": "9820466627",
            "message": "You're not alone. Please reach out to these helplines immediately."
        }

    return MessageResponse(
        response=ai_response,
        session_id=session.id,
        is_crisis=is_crisis,
        crisis_resources=crisis_resources
    )

def get_fallback_response(is_crisis: bool) -> str:
    if is_crisis:
        return """I hear you, and I'm deeply concerned about what you're sharing. You matter, and your life has value.

Please reach out for immediate support:
- **iCall (India)**: 9152987821
- **Vandrevala Foundation**: 1860-2662-345  
- **AASRA**: 9820466627

These counselors are available 24/7 and are trained to help. You don't have to face this alone.

*Sage is an AI assistant and not a licensed therapist. Please consult a mental health professional for clinical support.*"""

    return """Thank you for sharing that with me. I'm here to listen and support you.

It sounds like you're going through a challenging time. That's completely valid, and it takes courage to reach out.

Could you tell me more about what you're experiencing? Understanding more about your situation will help me better support you.

Remember, whatever you're feeling right now is temporary, and there are people and resources ready to help.

*Sage is an AI assistant and not a licensed therapist. Please consult a mental health professional for clinical support.*"""

@router.get("/history")
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.created_at.desc()).limit(20).all()

    return [
        {
            "id": s.id,
            "mood_before": s.mood_before,
            "mood_after": s.mood_after,
            "message_count": len(s.messages or []),
            "created_at": s.created_at.isoformat()
        }
        for s in sessions
    ]

@router.get("/session/{session_id}")
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {
        "id": session.id,
        "messages": session.messages,
        "mood_before": session.mood_before,
        "mood_after": session.mood_after,
        "created_at": session.created_at.isoformat()
    }
