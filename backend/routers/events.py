from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas import EventCreate
from backend.crud import record_event

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.post("", status_code=status.HTTP_201_CREATED)
def track_event(payload: EventCreate, db: Session = Depends(get_db)):
    """
    Log growth telemetry events:
    LANDING_PAGE_VIEW, REGISTRATION_STARTED, REGISTRATION_COMPLETED,
    REFERRAL_PAGE_VIEW, REFERRAL_LINK_COPIED, WHATSAPP_SHARE_CLICKED, LINKEDIN_SHARE_CLICKED.
    """
    event = record_event(db, payload)
    return {"status": "success", "event_id": event.id, "event_type": event.event_type}
