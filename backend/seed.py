"""
Synthetic Data Seeder for Campus AI Sprint Growth Engine
IMPORTANT: All data generated here is 100% SYNTHETIC & SIMULATED for demonstration purposes.
No real students or contacts are used.
"""

import random
from datetime import datetime, timedelta
import json
from sqlalchemy.orm import Session
from backend.database import SessionLocal, Base, engine
from backend.models import Registration, Referral, Campus, CampaignEvent

DEMO_COLLEGES = [
    ("IIT Madras", "Chennai", "Tamil Nadu", "Tier 1"),
    ("NIT Trichy", "Tiruchirappalli", "Tamil Nadu", "Tier 1"),
    ("BITS Pilani", "Pilani", "Rajasthan", "Tier 1"),
    ("VIT Vellore", "Vellore", "Tamil Nadu", "Tier 2"),
    ("PES University", "Bengaluru", "Karnataka", "Tier 2"),
    ("Delhi Technological University", "New Delhi", "Delhi", "Tier 1"),
    ("RV College of Engineering", "Bengaluru", "Karnataka", "Tier 2"),
    ("SRM Institute of Science and Technology", "Chennai", "Tamil Nadu", "Tier 2"),
    ("JNTU Hyderabad", "Hyderabad", "Telangana", "Tier 2"),
    ("COEP Tech University", "Pune", "Maharashtra", "Tier 1"),
    ("Thapar Institute of Engineering", "Patiala", "Punjab", "Tier 2"),
    ("Anna University CEG", "Chennai", "Tamil Nadu", "Tier 1"),
    ("BMS College of Engineering", "Bengaluru", "Karnataka", "Tier 2"),
    ("Manipal Institute of Technology", "Manipal", "Karnataka", "Tier 2"),
]

FIRST_NAMES = [
    "Aarav", "Aditi", "Akash", "Ananya", "Arjun", "Bhavya", "Chirag", "Deepak",
    "Divya", "Gaurav", "Harsh", "Ishaan", "Kavya", "Manish", "Meera", "Naveen",
    "Neha", "Nikhil", "Pooja", "Pranav", "Priya", "Rahul", "Riya", "Rohan",
    "Sakshi", "Sameer", "Sanjay", "Shreya", "Siddharth", "Sneha", "Tanvi", "Varun",
    "Vikram", "Yash", "Kunal", "Rhea", "Mohit", "Tarun", "Kriti", "Aniket"
]

LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Reddy", "Rao", "Nair", "Iyer", "Kumar",
    "Singh", "Gupta", "Joshi", "Deshmukh", "Choudhury", "Bose", "Mehta", "Das",
    "Kulkarni", "Menon", "Pillai", "Bhat", "Mishra", "Pandey", "Agarwal", "Saxena"
]

BRANCHES = [
    "Computer Science & Engineering",
    "Information Technology",
    "Electronics & Communication Engineering",
    "Electrical & Electronics Engineering",
    "Artificial Intelligence & Data Science",
    "Mechanical Engineering"
]

SOURCES = [
    ("whatsapp_groups", 0.38),
    ("peer_referral", 0.32),
    ("college_clubs", 0.16),
    ("linkedin_posts", 0.10),
    ("direct", 0.04),
]

def generate_code(idx: int) -> str:
    return f"NX-{1000 + idx:04d}"

def seed_database(target_count: int = 368):
    print("[INFO] Resetting and seeding synthetic growth data...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # 1. Seed Campuses
        campus_objs = []
        for name, city, state, tier in DEMO_COLLEGES:
            c = Campus(name=name, city=city, state=state, tier=tier)
            db.add(c)
            campus_objs.append(c)
        db.flush()

        now = datetime.utcnow()
        # 7-day campaign simulation: Day 0 (6 days ago) to Day 6 (today)
        start_date = now - timedelta(days=6)

        # Weighting registrations per day to simulate growing momentum
        # Day 1: 25, Day 2: 38, Day 3: 45, Day 4: 55, Day 5: 64, Day 6: 69, Day 7: 72 = 368
        daily_distribution = [25, 38, 45, 55, 64, 69, 72]

        all_registrations: list[Registration] = []
        ambassador_pool: list[Registration] = []
        reg_index = 1

        for day_offset, daily_count in enumerate(daily_distribution):
            day_time = start_date + timedelta(days=day_offset)

            for _ in range(daily_count):
                fname = random.choice(FIRST_NAMES)
                lname = random.choice(LAST_NAMES)
                name = f"{fname} {lname}"
                email = f"demo.{fname.lower()}.{lname.lower()}{reg_index}@campus.demo.in"
                phone = f"+9198{random.randint(10000000, 99999999)}"
                college_info = random.choice(DEMO_COLLEGES)
                college_name = college_info[0]
                branch = random.choice(BRANCHES)
                grad_year = random.choice([2025, 2026, 2025, 2025])  # heavily final year

                ref_code = generate_code(reg_index)
                created_ts = day_time + timedelta(
                    hours=random.randint(0, 23),
                    minutes=random.randint(0, 59),
                    seconds=random.randint(0, 59)
                )

                # Determine if this user was referred by an existing ambassador/peer
                referred_by_code = None
                referrer_reg = None
                # Allow referrals from day 2 onwards (day_offset > 0)
                if day_offset > 0 and ambassador_pool and random.random() < 0.44:
                    referrer_reg = random.choice(ambassador_pool)
                    referred_by_code = referrer_reg.referral_code
                    source = "peer_referral"
                else:
                    r = random.random()
                    cumulative = 0.0
                    source = "whatsapp_groups"
                    for s_name, weight in SOURCES:
                        cumulative += weight
                        if r <= cumulative:
                            source = s_name
                            break

                new_reg = Registration(
                    name=name,
                    email=email,
                    phone=phone,
                    college=college_name,
                    branch=branch,
                    graduation_year=grad_year,
                    source=source,
                    utm_source=source if source in ["whatsapp_groups", "linkedin_posts", "college_clubs"] else "organic",
                    utm_medium="community_share",
                    utm_campaign="campus_ai_sprint_7d",
                    referral_code=ref_code,
                    referred_by=referred_by_code,
                    created_at=created_ts
                )
                db.add(new_reg)
                db.flush()

                # If this user was referred by an existing student, record in referrals table
                if referrer_reg and referrer_reg.id != new_reg.id:
                    ref_entry = Referral(
                        referrer_id=referrer_reg.id,
                        referred_user_id=new_reg.id,
                        created_at=created_ts
                    )
                    db.add(ref_entry)

                all_registrations.append(new_reg)

                # Early registrants join the ambassador pool with higher likelihood
                if len(ambassador_pool) < 45 or random.random() < 0.25:
                    ambassador_pool.append(new_reg)

                reg_index += 1

        db.flush()

        # 2. Seed synthetic campaign events for realistic funnel tracking
        total_regs = len(all_registrations)
        landing_views_count = int(total_regs * 2.85) + 80
        reg_started_count = int(total_regs * 1.32) + 20

        # Log sample event batches
        for _ in range(landing_views_count):
            ev_ts = start_date + timedelta(seconds=random.randint(0, 6 * 86400))
            db.add(CampaignEvent(
                user_id=None,
                event_type="LANDING_PAGE_VIEW",
                metadata_json=json.dumps({"device": random.choice(["mobile", "mobile", "desktop"])}),
                created_at=ev_ts
            ))

        for _ in range(reg_started_count):
            ev_ts = start_date + timedelta(seconds=random.randint(0, 6 * 86400))
            db.add(CampaignEvent(
                user_id=None,
                event_type="REGISTRATION_STARTED",
                metadata_json=json.dumps({"source": "organic"}),
                created_at=ev_ts
            ))

        for reg in all_registrations:
            db.add(CampaignEvent(
                user_id=reg.id,
                event_type="REGISTRATION_COMPLETED",
                metadata_json=json.dumps({"college": reg.college, "code": reg.referral_code}),
                created_at=reg.created_at
            ))
            # 80% view referral dashboard
            if random.random() < 0.82:
                db.add(CampaignEvent(
                    user_id=reg.id,
                    event_type="REFERRAL_PAGE_VIEW",
                    metadata_json=json.dumps({"code": reg.referral_code}),
                    created_at=reg.created_at + timedelta(seconds=random.randint(2, 60))
                ))
            # 55% copy link or click whatsapp share
            if random.random() < 0.58:
                db.add(CampaignEvent(
                    user_id=reg.id,
                    event_type="REFERRAL_LINK_COPIED",
                    metadata_json=json.dumps({"code": reg.referral_code}),
                    created_at=reg.created_at + timedelta(seconds=random.randint(65, 300))
                ))
            if random.random() < 0.45:
                db.add(CampaignEvent(
                    user_id=reg.id,
                    event_type="WHATSAPP_SHARE_CLICKED",
                    metadata_json=json.dumps({"code": reg.referral_code}),
                    created_at=reg.created_at + timedelta(seconds=random.randint(120, 600))
                ))

        db.commit()

        total_seeded = db.query(Registration).count()
        ref_seeded = db.query(Referral).count()
        direct_seeded = total_seeded - ref_seeded
        print(f"[SUCCESS] Successfully seeded database!")
        print(f"   Total Registrations: {total_seeded} / 500 target ({round(total_seeded/500*100, 1)}%)")
        print(f"   Direct Registrations: {direct_seeded}")
        print(f"   Referral Registrations: {ref_seeded}")
        print(f"   Active Campuses: {db.query(Campus).count()}")
        print(f"   Campaign Events: {db.query(CampaignEvent).count()}")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
