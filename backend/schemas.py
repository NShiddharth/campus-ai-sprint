from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
import re

class RegistrationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120, description="Student full name")
    email: EmailStr = Field(..., description="Valid college or personal email")
    phone: str = Field(..., description="10-digit mobile number")
    college: str = Field(..., min_length=2, max_length=180, description="College name")
    branch: str = Field(..., min_length=2, max_length=100, description="Engineering branch")
    graduation_year: int = Field(..., ge=2024, le=2028, description="Graduation year")
    source: Optional[str] = Field("direct", max_length=100)
    utm_source: Optional[str] = Field(None, max_length=100)
    utm_medium: Optional[str] = Field(None, max_length=100)
    utm_campaign: Optional[str] = Field(None, max_length=100)
    referral_code: Optional[str] = Field(None, max_length=32, description="Referral code of referrer if joined via invite")

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[^\d+]", "", v)
        digits_only = re.sub(r"\D", "", cleaned)
        if len(digits_only) < 10 or len(digits_only) > 13:
            raise ValueError("Phone number must contain a valid 10-digit mobile number")
        # Check standard Indian mobile prefix (starts with 6,7,8,9 if 10 digits, or 91 prefix)
        if len(digits_only) == 10 and digits_only[0] not in "6789":
            raise ValueError("Please provide a valid Indian mobile number starting with 6, 7, 8, or 9")
        if len(digits_only) == 12 and digits_only.startswith("91") and digits_only[2] not in "6789":
            raise ValueError("Please provide a valid Indian mobile number starting with 6, 7, 8, or 9")
        return cleaned

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v_stripped = v.strip()
        if len(v_stripped) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v_stripped


class RegistrationResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    college: str
    branch: str
    graduation_year: int
    referral_code: str
    referral_url: str
    successful_referrals: int
    campus_rank: Optional[int] = None
    referral_tier: str = "Bronze Pioneer"
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReferralInfoResponse(BaseModel):
    referral_code: str
    referrer_name: str
    referrer_college: str
    total_referrals: int
    campus_name: str
    campus_rank: int
    referral_tier: str
    next_tier_target: int
    referrals_needed: int
    referral_url: str


class CampusLeaderboardItem(BaseModel):
    rank: int
    college: str
    registrations: int
    referrals: int
    growth_rate: float
    viral_share: str
    is_top_performer: bool


class AmbassadorLeaderboardItem(BaseModel):
    rank: int
    name: str
    college: str
    referrals: int
    tier: str


class EventCreate(BaseModel):
    user_id: Optional[int] = None
    event_type: str = Field(..., min_length=2, max_length=80)
    metadata: Optional[Dict[str, Any]] = None


class AnalyticsOverview(BaseModel):
    campaign_target: int
    current_registrations: int
    remaining_registrations: int
    progress_percentage: float
    direct_registrations: int
    referral_registrations: int
    referral_share_percentage: float
    total_campuses: int
    average_referrals_per_participant: float
    best_performing_source: str
    best_performing_college: str
    registration_velocity: float
    is_synthetic_data: bool = True


class FunnelStage(BaseModel):
    stage: str
    count: int
    conversion_from_prev: float
    dropoff_rate: float


class SourceBreakdown(BaseModel):
    source: str
    count: int
    percentage: float


class DailyRegistration(BaseModel):
    date: str
    total: int
    direct: int
    referral: int


class CollegeBreakdown(BaseModel):
    college: str
    registrations: int
    referrals: int
    percentage: float
