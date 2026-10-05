from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.config import settings
from backend.schemas import (
    AnalyticsOverview,
    FunnelStage,
    SourceBreakdown,
    DailyRegistration,
    CollegeBreakdown
)
from backend.crud import (
    get_analytics_overview,
    get_growth_funnel,
    get_sources_breakdown,
    get_daily_registrations,
    get_college_breakdown
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

class AdminAuthRequest(BaseModel):
    password: str

class AdminAuthResponse(BaseModel):
    authenticated: bool
    token: str
    message: str

@router.post("/auth/login", response_model=AdminAuthResponse)
def admin_login(payload: AdminAuthRequest):
    """Authenticate admin for prototype growth analytics dashboard."""
    if payload.password == settings.ADMIN_SECRET_KEY:
        return AdminAuthResponse(
            authenticated=True,
            token=f"growth_auth_{settings.ADMIN_SECRET_KEY[:8]}",
            message="Authenticated successfully to growth dashboard."
        )
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin secret key.")

@router.get("/overview", response_model=AnalyticsOverview)
def get_overview(db: Session = Depends(get_db)):
    """Fetch high-level campaign KPIs, velocity, target completion."""
    return get_analytics_overview(db)

@router.get("/funnel", response_model=List[FunnelStage])
def get_funnel(db: Session = Depends(get_db)):
    """Fetch growth conversion funnel from Landing View to Referral Conversion."""
    return get_growth_funnel(db)

@router.get("/sources", response_model=List[SourceBreakdown])
def get_sources(db: Session = Depends(get_db)):
    """Fetch breakdown of registrations by acquisition channel."""
    return get_sources_breakdown(db)

@router.get("/registrations", response_model=List[DailyRegistration])
def get_registrations_trend(db: Session = Depends(get_db)):
    """Fetch daily registration trends (direct vs referral)."""
    return get_daily_registrations(db)

@router.get("/colleges", response_model=List[CollegeBreakdown])
def get_colleges_trend(db: Session = Depends(get_db)):
    """Fetch top colleges breakdown."""
    return get_college_breakdown(db, limit=10)
