import io
import re
import os
import math
from typing import List, Dict, Any, Tuple
from pypdf import PdfReader
from backend.config import settings

# Curated taxonomy of software & AI skills
SKILL_TAXONOMY = [
    "Python", "FastAPI", "SQL", "SQLAlchemy", "PostgreSQL", "SQLite",
    "Docker", "REST APIs", "Prompt Engineering", "Git", "GitHub",
    "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS",
    "Machine Learning", "PyTorch", "TensorFlow", "Pandas", "NumPy",
    "OpenAI API", "Vector Embeddings", "FAISS", "Scikit-Learn",
    "CI/CD", "Redis", "Linux", "Data Structures", "Algorithms",
    "Object-Oriented Programming", "Microservices"
]

ACTION_VERBS = [
    "built", "developed", "deployed", "implemented", "designed",
    "engineered", "optimized", "created", "architected", "integrated",
    "tested", "configured", "maintained", "scaled"
]

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract readable text from PDF bytes using pypdf."""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text_parts = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
        extracted = "\n".join(text_parts).strip()
        if not extracted:
            raise ValueError("PDF contains no extractable text (it might be scanned or image-based).")
        return extracted
    except Exception as e:
        raise ValueError(f"Unable to parse PDF file: {str(e)}")

def extract_skills(text: str) -> List[str]:
    """Identify skills from the skill taxonomy present in the text."""
    found = []
    text_lower = text.lower()
    for skill in SKILL_TAXONOMY:
        # Check boundary or case-insensitive phrase
        pattern = r"(?i)(?:\b|_)" + re.escape(skill) + r"(?:\b|_)"
        if re.search(pattern, text_lower):
            found.append(skill)
    return found

def tokenize(text: str) -> set:
    """Extract clean lowercase alphabetic words."""
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    stopwords = {
        "the", "and", "for", "with", "this", "that", "from", "have",
        "will", "your", "about", "into", "some", "more", "then", "them"
    }
    return {w for w in words if w not in stopwords}

def calculate_jaccard_similarity(set_a: set, set_b: set) -> float:
    """Calculate token-based Jaccard similarity."""
    if not set_a or not set_b:
        return 0.0
    intersection = len(set_a.intersection(set_b))
    union = len(set_a.union(set_b))
    return (intersection / union) * 100.0 if union > 0 else 0.0

def calculate_transparent_ats_score(
    resume_text: str, job_description: str
) -> Dict[str, Any]:
    """
    Transparent, deterministic ATS scoring formula:
    - 50% Explicit Skill Overlap (Matched vs Required Job Skills)
    - 30% Semantic / Vocabulary Overlap (Token similarity)
    - 20% Project & Engineering Action Relevance (Presence of action verbs & metrics)
    """
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)

    # If job description mentions no specific skills from taxonomy, default to common ones
    if not job_skills:
        job_skills = ["Python", "FastAPI", "REST APIs", "SQL", "Git"]

    matched_skills = [s for s in job_skills if s in resume_skills]
    missing_skills = [s for s in job_skills if s not in resume_skills]

    # Additional bonus skills present in resume
    additional_skills = [s for s in resume_skills if s not in job_skills]

    # 1. Skill overlap score (0 - 100)
    skill_overlap_score = (len(matched_skills) / max(len(job_skills), 1)) * 100.0

    # 2. Semantic token similarity (0 - 100)
    resume_tokens = tokenize(resume_text)
    job_tokens = tokenize(job_description)
    semantic_score = min(100.0, calculate_jaccard_similarity(resume_tokens, job_tokens) * 3.5)

    # 3. Action and engineering delivery score (0 - 100)
    action_count = sum(1 for verb in ACTION_VERBS if re.search(r"\b" + verb + r"\b", resume_text.lower()))
    metric_count = len(re.findall(r"\b\d+[%+kKmM]?\b", resume_text))
    experience_score = min(100.0, (action_count * 15.0) + (metric_count * 5.0))

    # Weighted calculation
    final_score = round(
        (0.50 * skill_overlap_score) +
        (0.30 * semantic_score) +
        (0.20 * experience_score)
    )
    final_score = max(5, min(98, final_score))  # realistic bounds

    # Pitch Generation (attempt OpenAI if key available, else deterministic template)
    interview_pitch = generate_pitch(matched_skills, missing_skills, job_description)

    return {
        "match_score": final_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "candidate_skills": resume_skills,
        "job_skills": job_skills,
        "interview_pitch": interview_pitch,
        "scoring_breakdown": {
            "skill_overlap_score": round(skill_overlap_score, 1),
            "semantic_similarity_score": round(semantic_score, 1),
            "experience_delivery_score": round(experience_score, 1),
            "weights": "50% Skill Match + 30% Semantic Overlap + 20% Action Relevance"
        }
    }

def generate_pitch(matched_skills: List[str], missing_skills: List[str], job_description: str) -> str:
    """Generate interview pitch via OpenAI if key is configured, else fallback template."""
    api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "")
    if api_key and len(api_key) > 10:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            prompt = (
                f"Candidate matched skills: {', '.join(matched_skills)}.\n"
                f"Target Job Description: {job_description[:300]}.\n"
                "Write a concise, 2-sentence technical interview pitch for a campus placement interview. "
                "The candidate should articulate how they built an end-to-end project using these skills."
            )
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.3
            )
            pitch_text = response.choices[0].message.content.strip()
            if pitch_text:
                return pitch_text
        except Exception:
            # Fall back cleanly without exposing API errors or secrets
            pass

    # Deterministic high-quality recruiter pitch
    skills_phrase = ", ".join(matched_skills[:4]) if matched_skills else "Python, FastAPI, and REST APIs"
    return (
        f"In my recent project, I engineered an automated backend using {skills_phrase} "
        "that processes real-time text inputs, extracts key structured entities, and computes deterministic match scores. "
        "I focused on modular architecture, clean Pydantic validations, and deployable REST endpoints designed to scale."
    )
