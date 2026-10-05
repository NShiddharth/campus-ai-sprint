from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from backend.services.ats_service import (
    calculate_transparent_ats_score,
    extract_text_from_pdf
)

router = APIRouter(prefix="/api/ats", tags=["ATS Resume Screener"])

class ATSAnalyzeRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Plain text or parsed resume content")
    job_description: str = Field(..., min_length=10, description="Job description or target role requirements")

class ScoringBreakdown(BaseModel):
    skill_overlap_score: float
    semantic_similarity_score: float
    experience_delivery_score: float
    weights: str

class ATSAnalyzeResponse(BaseModel):
    match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    candidate_skills: List[str]
    job_skills: List[str]
    interview_pitch: str
    scoring_breakdown: ScoringBreakdown

@router.post("/analyze", response_model=ATSAnalyzeResponse)
def analyze_resume_text(payload: ATSAnalyzeRequest):
    """
    Analyze resume plain text against job description using deterministic skill extraction,
    semantic token similarity, and weighted scoring.
    """
    if len(payload.resume_text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text is too short. Please provide at least 10 characters of content."
        )
    if len(payload.job_description.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description is too short. Please provide at least 10 characters of requirements."
        )

    result = calculate_transparent_ats_score(payload.resume_text, payload.job_description)
    return result

@router.post("/analyze-file", response_model=ATSAnalyzeResponse)
async def analyze_resume_file(
    resume_file: UploadFile = File(..., description="Resume file (PDF or plain text)"),
    job_description: str = Form(..., description="Target job description")
):
    """
    Upload and parse resume file (PDF or TXT), validate size/type, extract text,
    and compute transparent match scores.
    """
    # 1. Validate file extension
    filename = (resume_file.filename or "").lower()
    if not (filename.endswith(".pdf") or filename.endswith(".txt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF (.pdf) or text (.txt) file."
        )

    # 2. Read bytes with size limit (max 5 MB)
    MAX_FILE_SIZE = 5 * 1024 * 1024
    content = await resume_file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 5MB limit. Please upload a smaller file."
        )
    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty. Please provide a valid resume file."
        )

    # 3. Extract text
    if filename.endswith(".pdf"):
        try:
            resume_text = extract_text_from_pdf(content)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    else:
        try:
            resume_text = content.decode("utf-8")
        except UnicodeDecodeError:
            try:
                resume_text = content.decode("latin-1")
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unable to decode text file. Ensure it is encoded in UTF-8."
                )

    if len(resume_text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded resume contains less than 10 characters of readable text."
        )

    result = calculate_transparent_ats_score(resume_text, job_description)
    return result
