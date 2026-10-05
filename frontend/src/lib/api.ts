import { getApiBaseUrl } from "./config";

export interface RegistrationInput {
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  graduation_year: number;
  source?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  referral_code?: string | null;
}

export interface RegistrationRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  graduation_year: number;
  referral_code: string;
  referral_url: string;
  successful_referrals: number;
  campus_rank?: number;
  referral_tier: string;
  created_at: string;
}

export interface ReferralDetails {
  referral_code: string;
  referrer_name: string;
  referrer_college: string;
  total_referrals: number;
  campus_name: string;
  campus_rank: number;
  referral_tier: string;
  next_tier_target: number;
  referrals_needed: number;
  referral_url: string;
}

export interface CampusLeaderboardItem {
  rank: number;
  college: string;
  registrations: number;
  referrals: number;
  growth_rate: number;
  viral_share?: string;
  is_top_performer: boolean;
}

export interface AmbassadorLeaderboardItem {
  rank: number;
  name: string;
  college: string;
  referrals: number;
  tier: string;
}

export interface AnalyticsOverview {
  campaign_target: number;
  current_registrations: number;
  remaining_registrations: number;
  progress_percentage: number;
  direct_registrations: number;
  referral_registrations: number;
  referral_share_percentage: number;
  total_campuses: number;
  average_referrals_per_participant: number;
  best_performing_source: string;
  best_performing_college: string;
  registration_velocity: number;
  is_synthetic_data: boolean;
}

export interface FunnelStage {
  stage: string;
  count: number;
  conversion_from_prev: number;
  dropoff_rate: number;
}

export interface SourceBreakdown {
  source: string;
  count: number;
  percentage: number;
}

export interface DailyTrend {
  date: string;
  total: number;
  direct: number;
  referral: number;
}

export interface CollegeBreakdown {
  college: string;
  registrations: number;
  referrals: number;
  percentage: number;
}

export interface ATSResult {
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  candidate_skills: string[];
  job_skills: string[];
  interview_pitch: string;
  scoring_breakdown: {
    skill_overlap_score: number;
    semantic_similarity_score: number;
    experience_delivery_score: number;
    weights: string;
  };
}

/**
 * Helper to produce clean, actionable error messages
 */
async function handleResponseError(res: Response): Promise<never> {
  let detailMessage = `Request failed with status ${res.status}`;
  try {
    const errData = await res.json();
    if (errData && typeof errData === "object") {
      if (typeof errData.detail === "string") {
        detailMessage = errData.detail;
      } else if (Array.isArray(errData.detail) && errData.detail.length > 0) {
        // Pydantic validation error array
        detailMessage = errData.detail.map((d: any) => d.msg || "Invalid field").join(", ");
      }
    }
  } catch {
    // Non-JSON response
  }

  if (res.status === 409) {
    throw new Error(detailMessage || "This email or phone number is already registered.");
  }
  if (res.status === 400 || res.status === 422) {
    throw new Error(detailMessage || "Registration validation failed. Please check your inputs.");
  }
  if (res.status === 404) {
    throw new Error(detailMessage || "Requested resource not found.");
  }
  if (res.status >= 500) {
    throw new Error("Server error. Please try again shortly.");
  }
  throw new Error(detailMessage);
}

function catchNetworkError(err: unknown): never {
  if (err instanceof Error) {
    if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
      throw new Error("Backend service unavailable. Please check that the server is running.");
    }
    throw err;
  }
  throw new Error("An unexpected network error occurred.");
}

export async function checkBackendHealth(): Promise<{ status: string }> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/health`, { cache: "no-store" });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function registerStudent(data: RegistrationInput): Promise<RegistrationRecord> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function getReferralInfo(code: string): Promise<ReferralDetails> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/referral/${encodeURIComponent(code)}`);
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function getCampusLeaderboard(): Promise<CampusLeaderboardItem[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/leaderboard?limit=25`, { cache: "no-store" });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function getAmbassadorLeaderboard(): Promise<AmbassadorLeaderboardItem[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/leaderboard/ambassadors?limit=15`, { cache: "no-store" });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/analytics/overview`, { cache: "no-store" });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function getAnalyticsFunnel(): Promise<FunnelStage[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/analytics/funnel`, { cache: "no-store" });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function getAnalyticsSources(): Promise<SourceBreakdown[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/analytics/sources`, { cache: "no-store" });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function getAnalyticsDaily(): Promise<DailyTrend[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/analytics/registrations`, { cache: "no-store" });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function getAnalyticsColleges(): Promise<CollegeBreakdown[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/analytics/colleges`, { cache: "no-store" });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function loginAdmin(password: string): Promise<boolean> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/analytics/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.authenticated;
  } catch {
    return false;
  }
}

export async function logEvent(eventType: string, metadata?: Record<string, unknown>, userId?: number): Promise<void> {
  try {
    const apiBase = getApiBaseUrl();
    await fetch(`${apiBase}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        user_id: userId || null,
        metadata: metadata || null,
      }),
    });
  } catch {
    // Non-blocking telemetry
  }
}

export async function analyzeResumeText(resumeText: string, jobDescription: string): Promise<ATSResult> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/ats/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDescription,
      }),
    });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}

export async function analyzeResumeFile(file: File, jobDescription: string): Promise<ATSResult> {
  try {
    const apiBase = getApiBaseUrl();
    const formData = new FormData();
    formData.append("resume_file", file);
    formData.append("job_description", jobDescription);

    const res = await fetch(`${apiBase}/api/ats/analyze-file`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) await handleResponseError(res);
    return res.json();
  } catch (err) {
    return catchNetworkError(err);
  }
}
