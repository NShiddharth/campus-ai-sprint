from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.database import Base

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    phone = Column(String(30), index=True, nullable=False)
    college = Column(String(180), index=True, nullable=False)
    branch = Column(String(100), nullable=False)
    graduation_year = Column(Integer, nullable=False)
    source = Column(String(100), default="direct", nullable=False)
    utm_source = Column(String(100), nullable=True)
    utm_medium = Column(String(100), nullable=True)
    utm_campaign = Column(String(100), nullable=True)
    referral_code = Column(String(32), unique=True, index=True, nullable=False)
    referred_by = Column(String(32), index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    referrals_made = relationship(
        "Referral",
        foreign_keys="Referral.referrer_id",
        back_populates="referrer",
        cascade="all, delete-orphan"
    )
    referral_received = relationship(
        "Referral",
        foreign_keys="Referral.referred_user_id",
        back_populates="referred_user",
        uselist=False
    )
    events = relationship(
        "CampaignEvent",
        back_populates="user",
        cascade="all, delete-orphan"
    )


class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    referrer_id = Column(Integer, ForeignKey("registrations.id", ondelete="CASCADE"), nullable=False, index=True)
    referred_user_id = Column(Integer, ForeignKey("registrations.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Constraints
    __table_args__ = (
        CheckConstraint("referrer_id != referred_user_id", name="check_prevent_self_referral"),
        UniqueConstraint("referred_user_id", name="unique_referred_user"),
    )

    referrer = relationship("Registration", foreign_keys=[referrer_id], back_populates="referrals_made")
    referred_user = relationship("Registration", foreign_keys=[referred_user_id], back_populates="referral_received")


class Campus(Base):
    __tablename__ = "campuses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), unique=True, index=True, nullable=False)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    tier = Column(String(50), nullable=True)


class CampaignEvent(Base):
    __tablename__ = "campaign_events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("registrations.id", ondelete="SET NULL"), nullable=True, index=True)
    event_type = Column(String(80), index=True, nullable=False)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    user = relationship("Registration", back_populates="events")
