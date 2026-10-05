import urllib.request
import urllib.error
import json
import io

print("=== 1. HEALTH ENDPOINT ===")
req = urllib.request.Request("http://127.0.0.1:8000/api/health")
health = json.loads(urllib.request.urlopen(req).read().decode())
print("Health Response:", health)
assert health["status"] == "ok", "Health status must be ok"

print("\n=== 2. CORS PREFLIGHT FROM localhost:3001 ===")
for path in ["/api/register", "/api/events", "/api/ats/analyze", "/api/analytics/auth/login"]:
    req_opt = urllib.request.Request(f"http://127.0.0.1:8000{path}", headers={
        "Origin": "http://localhost:3001",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"
    }, method="OPTIONS")
    with urllib.request.urlopen(req_opt) as resp:
        allow_origin = resp.headers.get("access-control-allow-origin")
        print(f"OPTIONS {path} -> {resp.status} (Allow-Origin: {allow_origin})")
        assert resp.status == 200, f"Preflight failed for {path}"

print("\n=== 3. REGISTRATION VALID & DUPLICATE TESTS ===")
def post_json(url, data):
    r = urllib.request.Request(url, data=json.dumps(data).encode(), headers={"Content-Type": "application/json", "Origin": "http://localhost:3001"})
    return json.loads(urllib.request.urlopen(r).read().decode())

def post_json_expect_error(url, data, expected_code):
    r = urllib.request.Request(url, data=json.dumps(data).encode(), headers={"Content-Type": "application/json", "Origin": "http://localhost:3001"})
    try:
        urllib.request.urlopen(r)
        raise AssertionError("Expected HTTP error but succeeded")
    except urllib.error.HTTPError as e:
        assert e.code == expected_code, f"Expected {expected_code} but got {e.code}"
        err_body = json.loads(e.read().decode())
        print(f"Got expected {e.code} error: {err_body['detail']}")
        return err_body

reg1 = post_json("http://127.0.0.1:8000/api/register", {
    "name": "Audit Tester One",
    "email": "audit.tester1@bits.edu",
    "phone": "+919876541234",
    "college": "BITS Pilani",
    "branch": "Computer Science & Engineering",
    "graduation_year": 2025
})
code1 = reg1["referral_code"]
print("Registered successfully! Name:", reg1["name"], "Code:", code1)

# Duplicate email
post_json_expect_error("http://127.0.0.1:8000/api/register", {
    "name": "Audit Duplicate Email",
    "email": "audit.tester1@bits.edu",
    "phone": "+919876549999",
    "college": "BITS Pilani",
    "branch": "CSE",
    "graduation_year": 2025
}, 409)

# Duplicate phone
post_json_expect_error("http://127.0.0.1:8000/api/register", {
    "name": "Audit Duplicate Phone",
    "email": "another.audit@bits.edu",
    "phone": "+919876541234",
    "college": "BITS Pilani",
    "branch": "CSE",
    "graduation_year": 2025
}, 409)

print("\n=== 4. REFERRAL ATTRIBUTION ===")
reg2 = post_json("http://127.0.0.1:8000/api/register", {
    "name": "Audit Tester Two",
    "email": "audit.tester2@bits.edu",
    "phone": "+919876541235",
    "college": "BITS Pilani",
    "branch": "Information Technology",
    "graduation_year": 2025,
    "referral_code": code1
})
ref_stats = json.loads(urllib.request.urlopen(f"http://127.0.0.1:8000/api/referral/{code1}").read().decode())
print("Referrer Stats after attribution:", ref_stats["total_referrals"], "tier:", ref_stats["referral_tier"])
assert ref_stats["total_referrals"] == 1, "Referral attribution failed"

print("\n=== 5. LEADERBOARD DETERMINISTIC SORT & VIRAL SHARE ===")
lb = json.loads(urllib.request.urlopen("http://127.0.0.1:8000/api/leaderboard").read().decode())
top_col = lb[0]
print(f"Top Campus: {top_col['college']} | Regs: {top_col['registrations']} | Refs: {top_col['referrals']} | Viral Share: {top_col.get('viral_share')}")
assert len(lb) > 0
if len(lb) > 1:
    assert lb[0]["registrations"] >= lb[1]["registrations"], "Leaderboard not sorted by registrations desc"

print("\n=== 6. ATS RESUME SCREENER ===")
ats_res = post_json("http://127.0.0.1:8000/api/ats/analyze", {
    "resume_text": "Software Engineer with experience building microservices using Python, FastAPI, and SQLAlchemy. Deployed Docker containers with Git.",
    "job_description": "Seeking an engineer proficient in Python, FastAPI, REST APIs, Docker, and PostgreSQL."
})
print("ATS Match Score:", ats_res["match_score"], "%")
print("Matched Skills:", ats_res["matched_skills"])
print("Missing Skills:", ats_res["missing_skills"])
print("Scoring Breakdown:", ats_res["scoring_breakdown"])
assert ats_res["match_score"] > 0
assert "Python" in ats_res["matched_skills"]
assert "PostgreSQL" in ats_res["missing_skills"]

print("\n=== 7. ADMIN AUTHENTICATION ===")
post_json_expect_error("http://127.0.0.1:8000/api/analytics/auth/login", {"password": "wrong"}, 401)
adm = post_json("http://127.0.0.1:8000/api/analytics/auth/login", {"password": "nxtwave_growth_2026_secure"})
print("Admin Login Success:", adm["authenticated"])

print("\n=== 8. FRONTEND SERVER STATUS ===")
for route in ["/", "/register", "/leaderboard", "/admin"]:
    res = urllib.request.urlopen(f"http://localhost:3001{route}")
    print(f"Frontend {route} -> HTTP {res.status}")
    assert res.status == 200

print("\n>>> ALL AUDIT AND VERIFICATION TESTS PASSED SUCCESSFULLY! <<<")
