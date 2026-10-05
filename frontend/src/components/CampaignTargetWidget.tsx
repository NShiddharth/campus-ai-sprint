"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, TrendingUp, Sparkles, Trophy, Loader2 } from "lucide-react";
import { getAnalyticsOverview, AnalyticsOverview } from "@/lib/api";

export function CampaignTargetWidget() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAnalyticsOverview()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Live metrics fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
        <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
        <span>Syncing live campaign capacity from database...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center text-xs text-slate-400">
        <span>Campaign Goal: 500 Engineering Students • Connect backend server to view live database count</span>
      </div>
    );
  }

  // Exact calculations from the single backend source of truth
  const target = data.campaign_target;
  const current = data.current_registrations;
  const remaining = Math.max(0, target - current);
  const progress = data.progress_percentage;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-500/25 bg-gradient-to-r from-slate-900/90 via-sky-950/40 to-slate-900/90 p-4 sm:p-5 backdrop-blur-md shadow-xl shadow-sky-950/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Metric Overview */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Users className="w-5 h-5" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Live Campaign Sprint</span>
              <span className="text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800/80 px-1.5 py-0.5 rounded">
                Target: {target}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                {current}
              </span>
              <span className="text-xs text-slate-400">
                / {target} seats filled ({progress}%)
              </span>
            </div>
          </div>
        </div>

        {/* Urgency Badge & Leaderboard Link */}
        <div className="flex items-center gap-3 sm:text-right">
          <div className="bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-lg">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {remaining > 0 ? `Only ${remaining} Seats Left` : "Target Achieved!"}
            </span>
            <span className="text-[10px] text-amber-200/80 block">Registration closes upon capacity</span>
          </div>

          <Link
            href="/leaderboard"
            className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Colleges</span>
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3.5 w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-sky-400/50"
          style={{ width: `${Math.min(100, Math.max(2, progress))}%` }}
        />
      </div>
    </div>
  );
}
