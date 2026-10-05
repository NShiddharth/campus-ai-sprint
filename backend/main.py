from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import engine, Base
from backend.routers import (
    registrations,
    referrals,
    leaderboard,
    analytics,
    events,
    ats
)

# Auto-create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Campus AI Sprint Growth Engine - API for Registration, Referrals, Leaderboards, ATS Screener, and Real-time Analytics",
    version="1.1.0"
)

# Robust CORS configuration:
# 1. Parse any explicit origins from env
configured_origins = [
    origin.strip()
    for origin in settings.ALLOWED_ORIGINS.split(",")
    if origin.strip() and origin.strip() != "*"
]

# 2. Allow common localhost origins explicitly
default_local_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

all_origins = list(set(configured_origins + default_local_origins))

# Allow any localhost / 127.0.0.1 port in development via regex
app.add_middleware(
    CORSMiddleware,
    allow_origins=all_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(registrations.router)
app.include_router(referrals.router)
app.include_router(leaderboard.router)
app.include_router(analytics.router)
app.include_router(events.router)
app.include_router(ats.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    """Health status endpoint returning ok status and service metadata."""
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "database": "connected",
        "campaign_target": settings.CAMPAIGN_TARGET
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
