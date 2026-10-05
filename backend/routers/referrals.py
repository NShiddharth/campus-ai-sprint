from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas import ReferralInfoResponse
from backend.crud import get_registration_by_code, get_referral_stats

router = APIRouter(prefix="/api", tags=["Referrals"])

@router.get("/referral/{code}", response_model=ReferralInfoResponse)
def get_referral_info(code: str, db: Session = Depends(get_db)):
    """Fetch public referral card details and tier progress by referral code."""
    reg = get_registration_by_code(db, code)
    if not reg:
        raise HTTPException(status_code=404, detail="Invalid referral code.")

    stats = get_referral_stats(db, reg)
    return ReferralInfoResponse(
        referral_code=stats["referral_code"],
        referrer_name=stats["referrer_name"],
        referrer_college=stats["referrer_college"],
        total_referrals=stats["total_referrals"],
        campus_name=stats["campus_name"],
        campus_rank=stats["campus_rank"],
        referral_tier=stats["referral_tier"],
        next_tier_target=stats["next_tier_target"],
        referrals_needed=stats["referrals_needed"],
        referral_url=stats["referral_url"]
    )
