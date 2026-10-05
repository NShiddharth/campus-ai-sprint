from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas import CampusLeaderboardItem, AmbassadorLeaderboardItem
from backend.crud import get_campus_leaderboard, get_ambassador_leaderboard

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])

@router.get("", response_model=List[CampusLeaderboardItem])
@router.get("/", response_model=List[CampusLeaderboardItem])
def get_leaderboard(limit: int = Query(25, ge=1, le=100), db: Session = Depends(get_db)):
    """
    Fetch top colleges ranked deterministically by:
    1. registrations descending
    2. referrals descending
    3. college name ascending
    """
    return get_campus_leaderboard(db, limit=limit)

@router.get("/campuses", response_model=List[CampusLeaderboardItem])
def get_campuses(limit: int = Query(25, ge=1, le=100), db: Session = Depends(get_db)):
    """Fetch top colleges ranked by registrations and viral referral share."""
    return get_campus_leaderboard(db, limit=limit)

@router.get("/ambassadors", response_model=List[AmbassadorLeaderboardItem])
def get_ambassadors(limit: int = Query(15, ge=1, le=50), db: Session = Depends(get_db)):
    """Fetch top student growth ambassadors with privacy-masked names."""
    return get_ambassador_leaderboard(db, limit=limit)
