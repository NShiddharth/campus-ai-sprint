import pytest
import io
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import Base, get_db
from backend.config import settings

# Test database setup in memory or temp file
TEST_DATABASE_URL = "sqlite:///./test_growth.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["campaign_target"] == 500

def test_register_student_success():
    payload = {
        "name": "Arjun Sharma",
        "email": "arjun.sharma@test.edu",
        "phone": "+919876543210",
        "college": "IIT Madras",
        "branch": "Computer Science & Engineering",
        "graduation_year": 2025,
        "source": "direct"
    }
    res = client.post("/api/register", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Arjun Sharma"
    assert data["email"] == "arjun.sharma@test.edu"
    assert data["referral_code"].startswith("NX-")
    assert data["successful_referrals"] == 0
    assert data["referral_tier"] == "Bronze Pioneer"

def test_register_duplicate_prevention():
    # Duplicate email
    payload_email = {
        "name": "Arjun Duplicate",
        "email": "arjun.sharma@test.edu",
        "phone": "+919999999991",
        "college": "IIT Madras",
        "branch": "Computer Science",
        "graduation_year": 2025
    }
    res = client.post("/api/register", json=payload_email)
    assert res.status_code == 409
    assert "email address is already registered" in res.json()["detail"].lower()

    # Duplicate phone
    payload_phone = {
        "name": "Arjun Different Email",
        "email": "different.arjun@test.edu",
        "phone": "+919876543210",
        "college": "IIT Madras",
        "branch": "Computer Science",
        "graduation_year": 2025
    }
    res2 = client.post("/api/register", json=payload_phone)
    assert res2.status_code == 409
    assert "phone number is already registered" in res2.json()["detail"].lower()

def test_referral_attribution_and_tier_upgrade():
    # 1. Fetch Priya's referral code
    reg_res = client.post("/api/register", json={
        "name": "Priya Patel",
        "email": "priya.patel@test.edu",
        "phone": "+919811122233",
        "college": "BITS Pilani",
        "branch": "Information Technology",
        "graduation_year": 2025
    })
    assert reg_res.status_code == 201
    priya_code = reg_res.json()["referral_code"]

    # 2. Register friend 1 using Priya's code
    friend1 = client.post("/api/register", json={
        "name": "Rohan Verma",
        "email": "rohan.v@test.edu",
        "phone": "+919844455566",
        "college": "BITS Pilani",
        "branch": "Electrical",
        "graduation_year": 2025,
        "referral_code": priya_code
    })
    assert friend1.status_code == 201

    # 3. Check Priya's referral info
    ref_info = client.get(f"/api/referral/{priya_code}")
    assert ref_info.status_code == 200
    info_data = ref_info.json()
    assert info_data["total_referrals"] == 1
    assert info_data["referrals_needed"] == 2  # Needs 2 more to reach Silver Builder (3)

def test_leaderboard_endpoints():
    # GET /api/leaderboard
    lb = client.get("/api/leaderboard")
    assert lb.status_code == 200
    lb_data = lb.json()
    assert len(lb_data) > 0
    assert "viral_share" in lb_data[0]
    assert "registrations" in lb_data[0]

    # Verify deterministic sorting (first element has >= registrations than next)
    if len(lb_data) >= 2:
        assert lb_data[0]["registrations"] >= lb_data[1]["registrations"]

    # Campuses endpoint
    campuses = client.get("/api/leaderboard/campuses")
    assert campuses.status_code == 200

    # Ambassadors endpoint
    ambassadors = client.get("/api/leaderboard/ambassadors")
    assert ambassadors.status_code == 200

def test_analytics_endpoints():
    overview = client.get("/api/analytics/overview")
    assert overview.status_code == 200
    ov = overview.json()
    assert ov["campaign_target"] == 500
    assert ov["current_registrations"] >= 3
    assert ov["is_synthetic_data"] is True

    funnel = client.get("/api/analytics/funnel")
    assert funnel.status_code == 200
    assert len(funnel.json()) >= 4

    sources = client.get("/api/analytics/sources")
    assert sources.status_code == 200

    daily = client.get("/api/analytics/registrations")
    assert daily.status_code == 200

def test_admin_authentication():
    # Incorrect key
    bad = client.post("/api/analytics/auth/login", json={"password": "wrong_password"})
    assert bad.status_code == 401

    # Correct key
    good = client.post("/api/analytics/auth/login", json={"password": settings.ADMIN_SECRET_KEY})
    assert good.status_code == 200
    assert good.json()["authenticated"] is True

def test_ats_analyzer_text():
    payload = {
        "resume_text": "Built a scalable REST API using Python, FastAPI, and SQLAlchemy. Integrated Docker and Git for CI/CD.",
        "job_description": "We are seeking a Python / FastAPI engineer with experience in REST APIs, PostgreSQL, Docker, and Git."
    }
    res = client.post("/api/ats/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "match_score" in data
    assert data["match_score"] > 0
    assert "Python" in data["matched_skills"]
    assert "FastAPI" in data["matched_skills"]
    assert "PostgreSQL" in data["missing_skills"]
    assert len(data["interview_pitch"]) > 20
    assert "scoring_breakdown" in data

def test_ats_analyzer_file():
    # Valid text file
    file_content = b"Candidate experience: Developed microservices with Python, FastAPI, React, and REST APIs."
    files = {"resume_file": ("resume.txt", io.BytesIO(file_content), "text/plain")}
    data = {"job_description": "Requirements: Python, FastAPI, Docker, and Git."}
    res = client.post("/api/ats/analyze-file", files=files, data=data)
    assert res.status_code == 200
    res_data = res.json()
    assert "FastAPI" in res_data["matched_skills"]
    assert "Docker" in res_data["missing_skills"]

    # Invalid file type
    bad_files = {"resume_file": ("malicious.exe", io.BytesIO(b"fake binary"), "application/octet-stream")}
    bad_res = client.post("/api/ats/analyze-file", files=bad_files, data=data)
    assert bad_res.status_code == 400
    assert "unsupported file format" in bad_res.json()["detail"].lower()
