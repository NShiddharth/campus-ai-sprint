"use client";

import { useState } from "react";
import {
  Terminal,
  Play,
  CheckCircle2,
  Code2,
  Sparkles,
  Copy,
  Check,
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { analyzeResumeText, analyzeResumeFile, ATSResult } from "@/lib/api";

const PRESET_ROLES = [
  {
    role: "Junior AI / Backend Engineer",
    jd: "Looking for an engineer with strong Python, FastAPI, REST APIs, SQL, Docker, and Prompt Engineering skills to build LLM pipelines.",
    sampleResume: "B.Tech Computer Science graduate. Built full-stack applications with Python, FastAPI, and SQLAlchemy. Developed RESTful endpoints with Docker deployment and Git version control. Practiced prompt engineering with OpenAI APIs."
  },
  {
    role: "Full-Stack Web & AI Developer",
    jd: "Seeking a developer skilled in React, Next.js, TypeScript, Tailwind CSS, Python, and REST APIs for scalable web apps.",
    sampleResume: "Engineered responsive web apps using React, Next.js, and TypeScript with Tailwind CSS. Integrated Python backend services and REST APIs with automated GitHub CI/CD workflows."
  }
];

export function LiveDemoCard() {
  const [activeTab, setActiveTab] = useState<"analyzer" | "code" | "pitch">("analyzer");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [jobDescription, setJobDescription] = useState(PRESET_ROLES[0].jd);
  const [resumeText, setResumeText] = useState(PRESET_ROLES[0].sampleResume);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePresetChange = (idx: number) => {
    setSelectedPreset(idx);
    setJobDescription(PRESET_ROLES[idx].jd);
    setResumeText(PRESET_ROLES[idx].sampleResume);
    setSelectedFile(null);
    setResult(null);
    setErrorMsg(null);
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let data: ATSResult;
      if (selectedFile) {
        data = await analyzeResumeFile(selectedFile, jobDescription);
      } else {
        data = await analyzeResumeText(resumeText, jobDescription);
      }
      setResult(data);
      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      setErrorMsg(err instanceof Error ? err.message : "Failed to analyze resume.");
    }
  };

  const copyPitch = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.interview_pitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Window Title Bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block"></span>
          <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            ats_analyzer.py • Live FastAPI Endpoint (/api/ats/analyze)
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "analyzer" ? "bg-sky-500/20 text-sky-400 font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            Live Screener
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "code" ? "bg-sky-500/20 text-sky-400 font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            Backend Architecture
          </button>
          <button
            onClick={() => setActiveTab("pitch")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "pitch" ? "bg-sky-500/20 text-sky-400 font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            Interview Articulation
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 text-sm font-sans space-y-4">
        {activeTab === "analyzer" && (
          <div className="space-y-4">
            {/* Presets and Upload Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Test Role:</span>
                <div className="flex gap-1.5">
                  {PRESET_ROLES.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handlePresetChange(i)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        selectedPreset === i
                          ? "bg-sky-950 text-sky-300 border-sky-700 font-semibold"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {p.role}
                    </button>
                  ))}
                </div>
              </div>

              {/* PDF / File Upload Option */}
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span>{selectedFile ? selectedFile.name : "Upload Resume (PDF/TXT)"}</span>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setSelectedFile(f);
                      setResult(null);
                    }
                  }}
                />
              </label>
            </div>

            {/* Input preview or File badge */}
            {selectedFile ? (
              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs text-sky-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  File Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Use text mode instead
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Candidate Resume Snippet
                  </label>
                  <textarea
                    rows={3}
                    value={resumeText}
                    onChange={(e) => {
                      setResumeText(e.target.value);
                      setResult(null);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px] focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Target Job Description
                  </label>
                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      setResult(null);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px] focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Error notice */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Real ATS Score via Backend API...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Real-Time ATS Screening</span>
                </>
              )}
            </button>

            {/* Real Backend Result Display */}
            {result && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5 mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Computed Match Score (Transparent Formula)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {result.scoring_breakdown.weights}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                      {result.match_score}%
                    </span>
                  </div>
                </div>

                {/* Detected Matched Skills */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Verified Competencies Matched ({result.matched_skills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched_skills.length > 0 ? (
                      result.matched_skills.map((s, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] font-mono bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded-md"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No direct taxonomy skills matched</span>
                    )}
                  </div>
                </div>

                {/* Identified Gaps */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Identified Placement Gaps ({result.missing_skills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_skills.length > 0 ? (
                      result.missing_skills.map((s, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] font-mono bg-amber-950/40 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded-md"
                        >
                          • {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-400 font-mono">100% skill requirements matched!</span>
                    )}
                  </div>
                </div>

                {/* Generated Pitch */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                      Recruiter Technical Pitch:
                    </span>
                    <button
                      onClick={copyPitch}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{result.interview_pitch}"
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "code" && (
          <div className="rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed border border-slate-800 space-y-3">
            <p className="text-[11px] text-slate-400">
              The workshop deliverable is powered by clean FastAPI routes, SQLAlchemy 2.0 ORM, and deterministic scoring:
            </p>
            <pre>
              <code className="text-slate-300">{`# backend/routers/ats.py
from fastapi import APIRouter, UploadFile, File, Form
from backend.services.ats_service import calculate_transparent_ats_score

router = APIRouter(prefix="/api/ats")

@router.post("/analyze")
def analyze_resume(payload: ATSAnalyzeRequest):
    # Transparent formula: 50% Skill Match + 30% Semantic + 20% Action
    return calculate_transparent_ats_score(
        payload.resume_text, 
        payload.job_description
    )

@router.post("/analyze-file")
async def analyze_file(resume_file: UploadFile = File(...), job_description: str = Form(...)):
    # Validates file size, extracts text with pypdf, computes match
    content = await resume_file.read()
    text = extract_text_from_pdf(content)
    return calculate_transparent_ats_score(text, job_description)`}</code>
            </pre>
            <p className="text-[11px] text-slate-500">
              Note on Vector Embeddings: In Minute 40 of the sprint, we demonstrate swapping Jaccard similarity for dense vector embeddings (FAISS / OpenAI Embeddings) for high-scale enterprise matching.
            </p>
          </div>
        )}

        {activeTab === "pitch" && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-2">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                How to Explain This Project in Placement Interviews:
              </span>
              <p className="italic text-slate-300">
                "Rather than building a trivial ChatGPT wrapper, I architected an end-to-end ATS Resume Screener using FastAPI and Python. The engine parses PDF resumes, isolates key technical entities against a structured taxonomy, and applies a transparent multi-factor weighted scoring algorithm combining explicit skill overlap and semantic token density. It handles multipart uploads, includes automated Swagger documentation, and persists data with SQLAlchemy ORM."
              </p>
            </div>
            <p className="text-[11px] text-slate-400">
              Recruiter Insight: Placement interviewers look for candidates who can explain data structures, API validation, and architectural tradeoffs rather than just pasting prompt templates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
