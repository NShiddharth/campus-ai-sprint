"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Trophy,
  Users,
  Award,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { getReferralInfo, logEvent, ReferralDetails } from "@/lib/api";

export default function ReferralDashboardPage() {
  const params = useParams();
  const code = (params?.code as string)?.toUpperCase() || "";

  const [data, setData] = useState<ReferralDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#818cf8", "#34d399", "#fbbf24"],
      });
    } catch {
      // Safe fallback if canvas not available
    }

    // Log telemetry
    logEvent("REFERRAL_PAGE_VIEW", { referral_code: code });

    getReferralInfo(code)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load referral details");
        setLoading(false);
      });
  }, [code]);

  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const shareableUrl = `${origin}/register?ref=${code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    logEvent("REFERRAL_LINK_COPIED", { referral_code: code });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    logEvent("WHATSAPP_SHARE_CLICKED", { referral_code: code });
    const msg = encodeURIComponent(
      `Hey! I'm joining NxtWave's free 'Build Your First AI Project in 60 Minutes' workshop. You can register here: ${shareableUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  const handleLinkedInShare = () => {
    logEvent("LINKEDIN_SHARE_CLICKED", { referral_code: code });
    const shareText = encodeURIComponent(
      `Excited to participate in the 'Campus AI Sprint: Build Your First AI Project in 60 Minutes'! Final-year engineering peers can reserve their free seat here: ${shareableUrl}`
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        <p className="text-sm font-mono">Loading your Campus Referral Dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Referral Code Not Found</h2>
          <p className="text-xs text-slate-400">
            The referral code <code className="text-sky-400">{code}</code> does not match an active registration.
          </p>
          <Link
            href="/register"
            className="inline-block px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-colors"
          >
            Register Here
          </Link>
        </div>
      </div>
    );
  }

  const referralCount = data.total_referrals;
  const needed = data.referrals_needed;
  const nextTarget = data.next_tier_target;
  const tierProgress = Math.min(100, Math.round((referralCount / nextTarget) * 100));

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* SUCCESS CONFIRMATION HERO */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Seat Reserved Successfully
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            You're in! Your workshop seat is reserved.
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Welcome, <strong className="text-white">{data.referrer_name}</strong>. Workshop connection link and GitHub starter repo have been dispatched.
          </p>
        </div>

        {/* CAMPUS & AMBASSADOR CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center sm:text-left">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Campus Standing</span>
            <span className="text-xl font-extrabold text-white mt-1 block">#{data.campus_rank}</span>
            <span className="text-xs text-sky-400 truncate block">{data.campus_name}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center sm:text-left">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Confirmed Referrals</span>
            <span className="text-xl font-extrabold text-white mt-1 block font-mono">
              {referralCount}
            </span>
            <span className="text-xs text-emerald-400 block">Classmates Joined</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center sm:text-left">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Ambassador Tier</span>
            <span className="text-base font-bold text-amber-400 mt-1 block flex items-center justify-center sm:justify-start gap-1">
              <Award className="w-4 h-4" />
              {data.referral_tier}
            </span>
            <span className="text-[11px] text-slate-400 block">Campus AI Advocate</span>
          </div>
        </div>

        {/* REFERRAL PROGRESS & GAMIFICATION */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950/20 to-slate-900 border border-sky-500/25 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
                Campus Referral Sprint Loop
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                You have {referralCount} {referralCount === 1 ? "referral" : "referrals"}
              </h3>
            </div>
            {needed > 0 ? (
              <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg">
                Refer {needed} more student{needed > 1 ? "s" : ""} to unlock next tier!
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Campus AI Champion Achieved!
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Current Progress</span>
              <span className="font-mono text-white font-semibold">
                {referralCount} / {nextTarget} ({tierProgress}%)
              </span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
          </div>

          {/* SHARE LINK BOX */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Your Unique Referral Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 font-mono select-all truncate">
                {shareableUrl}
              </div>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors active:scale-95 flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* VIRAL SHARING ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleWhatsAppShare}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleLinkedInShare}
              className="py-3 px-4 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.55a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
              </svg>
              <span>Share on LinkedIn</span>
            </button>
          </div>
        </div>

        {/* MILESTONE UNLOCKS */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Ambassador Tier Unlocks
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className={`p-3 rounded-lg border ${referralCount >= 1 ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300" : "bg-slate-950/60 border-slate-800 text-slate-500"}`}>
              <span className="font-bold block">1 Referral</span>
              <span>AI Project Architecture Cheatsheet PDF</span>
            </div>
            <div className={`p-3 rounded-lg border ${referralCount >= 3 ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300" : "bg-slate-950/60 border-slate-800 text-slate-500"}`}>
              <span className="font-bold block">3 Referrals (Silver)</span>
              <span>20+ Technical Interview AI Prompt Templates</span>
            </div>
            <div className={`p-3 rounded-lg border ${referralCount >= 5 ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300" : "bg-slate-950/60 border-slate-800 text-slate-500"}`}>
              <span className="font-bold block">5+ Referrals (Gold)</span>
              <span>1-on-1 Portfolio Code Review & Placement Spotlight</span>
            </div>
          </div>
        </div>

        {/* LEADERBOARD CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-center sm:text-left text-xs">
            <span className="font-bold text-white block">See how your college is performing</span>
            <span className="text-slate-400">Track total registrations across all participating campuses.</span>
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            <span>View Campus Leaderboard</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
