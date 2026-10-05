# Campus AI Sprint Growth Engine 🚀
### NxtWave Growth Intern Round 1 — Growth Challenge Submission

> A complete, working full-stack growth platform designed to acquire **500 final-year engineering students** for a free 60-minute workshop under a **₹2,000 budget** in **7 days** through viral referral loops and inter-campus competition.

---

## 1. Product Overview

The **Campus AI Sprint Growth Engine** is an end-to-end web application that replaces conventional, passive landing pages with an active viral acquisition engine. 

### Core Workshop Proposition
- **Workshop Title**: *"Build Your First AI Project in 60 Minutes"*
- **Target Audience**: Final-year engineering students (2025/2026 batches across CSE, IT, ECE, EEE, and transitioning core branches).
- **Core Hook**: *"Go from 'I want an AI project' to a working project you can explain in your next interview."*
- **Key Deliverables**: Verified GitHub repository, 3 resume bullet points, live cloud URL, and technical interview talking points.

---

## 2. The Growth Problem & Context

- **Registration Goal**: 500 engineering student registrations.
- **Campaign Window**: 7 days.
- **Budget Constraint**: ₹2,000 total (₹4.00 target CAC).
- **Key Insight**: At ₹4 per acquisition, paid social ads (Google/Meta) cannot achieve the 500-student threshold. To achieve scale, the digital asset itself must generate self-sustaining viral coefficient ($K > 0.4$) through peer referrals and inter-college competition.

---

## 3. Why This Asset Was Selected

| Approach | Limitations / Trade-offs | Verdict |
| :--- | :--- | :--- |
| **Static Landing Page** | Passive bucket. Zero viral loops. Requires constant paid traffic injection. | ❌ Rejected |
| **WhatsApp Chatbot** | Fragile dependencies on paid Meta Business API tokens and template approvals. | ❌ Rejected |
| **Campus AI Sprint Growth Engine** | Self-contained, full-stack application coupling registration with automatic referral attribution, campus leaderboards, and real-time SQL analytics. | ✅ **Selected** |

---

## 4. System Architecture

Built as a clean full-stack architecture with REST API contracts:

```mermaid
flowchart LR
    FE["Next.js 16 + React 19 Client<br/>(Tailwind CSS, Recharts)"]
    API["FastAPI Backend<br/>(Pydantic v2, RESTful)"]
    DB[(SQLite / PostgreSQL<br/>SQLAlchemy 2.0)]

    FE -->|JSON REST Requests| API
    API -->|ORM Transactions| DB
    DB -->|Aggregated Data| API
    API -->|Dynamic Telemetry & KPIs| FE
```

- **Frontend**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, and Recharts.
- **Backend**: FastAPI, Python 3.14, Pydantic v2, SQLAlchemy 2.0 ORM.
- **Database**: SQLite with WAL mode (zero-config local run), 100% compatible with PostgreSQL for production deployment.

For detailed sequence diagrams and database schemas, see [ARCHITECTURE.md](file:///c:/Users/Shidd/.gemini/antigravity/playground/Nxtwave/ARCHITECTURE.md).

---

## 5. The Growth Loop

```text
Student Discovers Workshop (WhatsApp / Club / LinkedIn)
        ↓
Registers in 30 seconds (/register)
        ↓
Receives unique referral code & share link (/referral/[code])
        ↓
Shares pre-filled invite to department WhatsApp & LinkedIn
        ↓
Classmates register using the invite link
        ↓
Referral attributed & milestones unlocked (AI Interview Toolkit)
        ↓
College rises on the Live Campus Leaderboard (/leaderboard)
        ↓
Inter-campus competitive pride drives more registrations!
```

---

## 6. Directory Structure

```text
Nxtwave/
├── backend/
│   ├── config.py              # Environment configuration & settings
│   ├── database.py            # SQLAlchemy engine & session factory
│   ├── models.py              # Declarative database tables
│   ├── schemas.py             # Pydantic validation & response schemas
│   ├── crud.py                # Business logic, referral & analytics queries
│   ├── seed.py                # Synthetic campaign data generator
│   ├── main.py                # FastAPI entrypoint with CORS & middleware
│   ├── routers/
│   │   ├── registrations.py   # Student registration & lookup
│   │   ├── referrals.py       # Referral card & tier progression
│   │   ├── leaderboard.py     # Campus & ambassador rankings
│   │   ├── analytics.py       # Real-time funnel & overview metrics
│   │   └── events.py          # Growth telemetry event tracker
│   ├── tests/
│   │   └── test_api.py        # Automated test suite (Pytest)
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Local backend environment file
│   └── .env.example           # Environment template
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Landing page with live target & roadmap
│   │   │   ├── register/      # Registration page with UTM & ref capture
│   │   │   ├── referral/      # Referral dashboard & sharing center
│   │   │   ├── leaderboard/   # Campus & ambassador standings
│   │   │   ├── admin/         # Admin growth dashboard & experiments
│   │   │   ├── layout.tsx     # Root layout with SEO & navigation
│   │   │   └── globals.css    # Modern dark mode design tokens
│   │   ├── components/
│   │   │   ├── Navbar.tsx     # Top navigation
│   │   │   ├── Footer.tsx     # Bottom footer with disclaimer
│   │   │   ├── CampaignTargetWidget.tsx # Dynamic 500-target tracker
│   │   │   └── LiveDemoCard.tsx # Interactive 60-min project preview
│   │   └── lib/
│   │       └── api.ts         # Typed API client for FastAPI backend
│   ├── package.json           # Frontend dependencies
│   └── .env.local             # Frontend environment file
├── ARCHITECTURE.md            # System architecture & Mermaid diagrams
├── GROWTH_PLAN.md             # 2-page growth acquisition plan & model
├── AI_LEARNING_NOTES.md       # Documented AI usage, rejections & rationale
├── DECISION_LOG.md            # Iteration history & trade-off analysis
├── VIDEO_SCRIPT.md            # 3-minute video presentation script
└── README.md                  # Complete product documentation
```

---

## 7. Quickstart: How to Run Locally

### Prerequisites
- **Python**: Version 3.10+ (tested on Python 3.14)
- **Node.js**: Version 18+ (tested on Node v24.15)
- **npm**: Version 9+

### Step 1: Clone & Open Workspace
```bash
cd Nxtwave
```

### Step 2: Backend Setup & Database Seeding
```bash
# Optional: create a virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install Python backend dependencies
python -m pip install -r backend/requirements.txt

# Seed the database with realistic synthetic campaign data
python -m backend.seed

# Run the FastAPI server on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
*The backend API will be live at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.*

### Step 3: Frontend Setup & Dev Server
Open a second terminal window:
```bash
cd frontend

# Install npm dependencies
npm install

# Start the Next.js development server
npm run dev
```
*The web application will be live at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).*

---

## 8. Automated Test Suite

Run the full backend test suite covering registration, duplicate prevention, referral attribution, self-referral checks, and admin auth:
```bash
python -m pytest backend/tests/test_api.py -v
```

---

## 9. Environment Variables & Demo Credentials

### Backend (`backend/.env`)
```ini
DATABASE_URL=sqlite:///./campus_growth.db
ADMIN_SECRET_KEY=nxtwave_growth_2026_secure
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,*
CAMPAIGN_TARGET=500
```

### Frontend (`frontend/.env.local`)
```ini
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Demo Admin Portal Credentials
- **URL**: `http://localhost:3000/admin` (or `/admin` on active port)
- **Admin Secret Key**: `nxtwave_growth_2026_secure`
- *Notice*: The dashboard clearly labels all metrics as synthetic simulation data for prototype evaluation.

---

## 10. Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & campaign target verification |
| `POST` | `/api/register` | Register student, attribute referral, generate unique code |
| `GET` | `/api/registration/{id}` | Retrieve student registration details |
| `GET` | `/api/referral/{code}` | Retrieve public referral card, tier, and campus standings |
| `GET` | `/api/leaderboard/campuses` | Ranked colleges by registrations & viral referral share |
| `GET` | `/api/leaderboard/ambassadors` | Top student ambassadors (with privacy-masked names) |
| `GET` | `/api/analytics/overview` | High-level KPIs: target, remaining, velocity, referral rate |
| `GET` | `/api/analytics/funnel` | 5-step conversion funnel (Landing View → Referral Conversion) |
| `GET` | `/api/analytics/sources` | Registrations breakdown by acquisition channel |
| `GET` | `/api/analytics/registrations`| Day-by-day registrations split by direct vs referral |
| `GET` | `/api/analytics/colleges` | Top 10 colleges breakdown |
| `POST` | `/api/analytics/auth/login` | Verify admin secret key for dashboard access |
| `POST` | `/api/events` | Telemetry event logger for funnel drop-off analysis |

---

## 11. Production Deployment Guide

### Deploying the Backend (e.g. Render, Railway, AWS EC2)
1. Set environment variables:
   - `DATABASE_URL`: Your managed PostgreSQL connection URI (e.g., `postgresql://user:pass@host:5432/db`).
   - `ADMIN_SECRET_KEY`: A cryptographically secure secret string.
   - `ALLOWED_ORIGINS`: Your production frontend domain (e.g., `https://campus-ai-sprint.vercel.app`).
2. Run database migration / tables creation:
   ```bash
   python -m backend.seed
   ```
3. Start command:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

### Deploying the Frontend (e.g. Vercel)
1. Import the repository into Vercel and set the Root Directory to `frontend`.
2. Configure Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://campus-ai-api.onrender.com`).
3. Deploy! Vercel automatically runs `npm run build` and serves edge-cached static pages.

---

## 12. Known Limitations & Future Improvements

### Current Prototype Limitations
1. **SMS / WhatsApp Direct Dispatch**: Uses pre-filled browser intent URLs (`api.whatsapp.com/send?text=...`) instead of an enterprise WhatsApp Business API to eliminate billing and API key setup barriers during evaluation.
2. **Prototype Admin Auth**: Uses a secure shared environment secret key rather than a multi-user role-based OAuth / JWT system.

### Future High-Leverage Improvements
1. **Automated WhatsApp Attendance Webhooks**: Send automated reminder messages 24 hours, 2 hours, and 15 minutes before the workshop via Meta Cloud API to boost registration-to-showup conversion (>65%).
2. **Dynamic College QR Flyers**: Auto-generate downloadable, high-resolution printable PDF posters with college-specific QR codes for student ambassadors to pin on campus notice boards.
3. **Automated GitHub Classroom Integration**: Auto-invite registered students to a private GitHub organization repository containing the workshop starter code upon hitting Tier 1 ambassador status.
