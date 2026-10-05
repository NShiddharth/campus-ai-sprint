from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas import RegistrationCreate, RegistrationResponse
from backend.crud import (
    create_registration,
    get_registration_by_id,
    get_referral_stats
)

router = APIRouter(prefix="/api", tags=["Registrations"])

@router.post("/register", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
def register_student(payload: RegistrationCreate, db: Session = Depends(get_db)):
    """
    Register a student for the 60-Minute AI Workshop.
    Generates a unique referral code and attributes referral if invited.
    Rejects duplicate email or phone with HTTP 409.
    """
    reg, is_new, msg = create_registration(db, payload)
    if reg is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=msg
        )

    stats = get_referral_stats(db, reg)

    return RegistrationResponse(
        id=reg.id,
        name=reg.name,
        email=reg.email,
        phone=reg.phone,
        college=reg.college,
        branch=reg.branch,
        graduation_year=reg.graduation_year,
        referral_code=reg.referral_code,
        referral_url=f"/register?ref={reg.referral_code}",
        successful_referrals=stats["total_referrals"],
        campus_rank=stats["campus_rank"],
        referral_tier=stats["referral_tier"],
        created_at=reg.created_at
    )

@router.get("/registration/{reg_id}", response_model=RegistrationResponse)
def get_registration(reg_id: int, db: Session = Depends(get_db)):
    """Fetch registration details by student ID."""
    reg = get_registration_by_id(db, reg_id)
    if not reg:
        raise HTTPException(status_code=404, detail="Registration record not found.")

    stats = get_referral_stats(db, reg)
    return RegistrationResponse(
        id=reg.id,
        name=reg.name,
        email=reg.email,
        phone=reg.phone,
        college=reg.college,
        branch=reg.branch,
        graduation_year=reg.graduation_year,
        referral_code=reg.referral_code,
        referral_url=f"/register?ref={reg.referral_code}",
        successful_referrals=stats["total_referrals"],
        campus_rank=stats["campus_rank"],
        referral_tier=stats["referral_tier"],
        created_at=reg.created_at
    )
