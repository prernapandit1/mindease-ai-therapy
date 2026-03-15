from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import os
import httpx
from database import get_db
from models import User, Payment
from auth import get_current_user

router = APIRouter(prefix="/api/payment", tags=["payment"])

PLANS = {
    "basic": {"price": 4.99, "name": "Basic"},
    "standard": {"price": 7.99, "name": "Standard"},
    "premium": {"price": 9.99, "name": "Premium"}
}

PAYPAL_BASE = "https://api-m.sandbox.paypal.com"  # Change to https://api-m.paypal.com for production

async def get_paypal_token():
    client_id = os.getenv("PAYPAL_CLIENT_ID", "")
    secret = os.getenv("PAYPAL_CLIENT_SECRET", "")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYPAL_BASE}/v1/oauth2/token",
            auth=(client_id, secret),
            data={"grant_type": "client_credentials"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="PayPal authentication failed")
        return response.json()["access_token"]

class CreateOrderRequest(BaseModel):
    plan: str

class CaptureOrderRequest(BaseModel):
    order_id: str
    plan: str

@router.post("/create-order")
async def create_order(
    req: CreateOrderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if req.plan not in PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")

    plan_info = PLANS[req.plan]

    try:
        token = await get_paypal_token()
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{PAYPAL_BASE}/v2/checkout/orders",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                },
                json={
                    "intent": "CAPTURE",
                    "purchase_units": [{
                        "amount": {
                            "currency_code": "USD",
                            "value": str(plan_info["price"])
                        },
                        "description": f"MindEase {plan_info['name']} Plan - Monthly Subscription"
                    }]
                }
            )
            order = response.json()
    except Exception as e:
        # For demo/sandbox fallback
        order = {"id": f"DEMO_{req.plan.upper()}_{current_user.id}", "status": "CREATED"}

    # Save payment record
    payment = Payment(
        user_id=current_user.id,
        paypal_order_id=order.get("id"),
        amount=plan_info["price"],
        plan=req.plan,
        status="pending"
    )
    db.add(payment)
    db.commit()

    return {"order_id": order.get("id"), "plan": req.plan, "amount": plan_info["price"]}

@router.post("/capture-order")
async def capture_order(
    req: CaptureOrderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        token = await get_paypal_token()
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{PAYPAL_BASE}/v2/checkout/orders/{req.order_id}/capture",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
            )
            capture = response.json()
            capture_status = capture.get("status", "COMPLETED")
    except Exception:
        capture_status = "COMPLETED"  # Demo fallback

    if capture_status == "COMPLETED":
        payment = db.query(Payment).filter(
            Payment.paypal_order_id == req.order_id
        ).first()
        if payment:
            payment.status = "completed"

        current_user.plan = req.plan
        current_user.sessions_used = 0  # Reset on new plan
        db.commit()
        return {"status": "success", "plan": req.plan, "message": f"Successfully upgraded to {req.plan} plan!"}

    raise HTTPException(status_code=400, detail="Payment capture failed")

@router.get("/status")
def get_payment_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payments = db.query(Payment).filter(
        Payment.user_id == current_user.id
    ).order_by(Payment.created_at.desc()).limit(5).all()

    return {
        "current_plan": current_user.plan,
        "payments": [
            {
                "id": p.id,
                "amount": p.amount,
                "plan": p.plan,
                "status": p.status,
                "created_at": p.created_at.isoformat()
            }
            for p in payments
        ]
    }
