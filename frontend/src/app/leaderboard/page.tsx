"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Medal,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles,
  School,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import {
  getCampusLeaderboard,
  getAmbassadorLeaderboard,
  CampusLeaderboardItem,
  AmbassadorLeaderboardItem
} from "@/lib/api";

export default function LeaderboardPage() {
  const [campuses, setCampuses] = useState<CampusLeaderboardItem[]>([]);
  const [ambassadors, setAmbassadors] = useState<AmbassadorLeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"campuses" | "ambassadors">("campuses");

  const loadData = () => {
    setLoading(true);
    setErrorMsg(null);
    Promise.all([getCampusLeaderboard(), getAmbassadorLeaderboard()])
      .then(([campRes, ambRes]) => {
        setCampuses(campRes || []);
        setAmbassadors(ambRes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Leaderboard fetch error:", err);
        setErrorMsg(err instanceof Error ? err.message : "Failed to load leaderboard data from server.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            Live Sprint Standings
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Campus AI Sprint Leaderboard
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Deterministic campus rankings computed dynamically from verified registration records.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center justify-center">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("campuses")}
              className={`px-5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "campuses"
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <School className="w-4 h-4" />
              <span>Campus Rankings</span>
            </button>
            <button
              onClick={() => setActiveTab("ambassadors")}
              className={`px-5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "ambassadors"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Top Ambassadors</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {errorMsg && (
          <div className="p-5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <span className="font-bold block text-white">Leaderboard Data Error</span>
                <span className="text-xs text-red-300">{errorMsg}</span>
              </div>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
            <p className="text-xs font-mono">Fetching live campus rankings from backend API...</p>
          </div>
        )}

        {/* Content Loaded */}
        {!loading && !errorMsg && (
          <>
            {/* CAMPUSES TAB */}
            {activeTab === "campuses" && (
              <div className="space-y-6">
                {/* Top 3 Podium (rendered when at least 3 campuses exist) */}
                {campuses.length >= 3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {/* Rank 2 (Silver) */}
                    <div className="order-2 sm:order-1 p-5 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-slate-700/80 text-center relative overflow-hidden">
                      <div className="h-10 w-10 mx-auto rounded-full bg-slate-700/60 border border-slate-500 flex items-center justify-center text-slate-200 font-bold text-sm mb-3">
                        #2
                      </div>
                      <h3 className="font-bold text-white text-base truncate">{campuses[1]?.college}</h3>
                      <div className="mt-2 text-2xl font-black text-white font-mono">
                        {campuses[1]?.registrations} <span className="text-xs font-normal text-slate-400">regs</span>
                      </div>
                      <span className="text-[11px] text-sky-400 font-mono mt-1 block">
                        {campuses[1]?.referrals} via referrals ({campuses[1]?.viral_share || `${campuses[1]?.growth_rate}%`})
                      </span>
                    </div>

                    {/* Rank 1 (Gold) */}
                    <div className="order-1 sm:order-2 p-6 rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/50 text-center relative overflow-hidden shadow-xl shadow-amber-950/30 transform sm:-translate-y-2">
                      <div className="h-12 w-12 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-black text-base mb-3 shadow-lg shadow-amber-500/20">
                        <Trophy className="w-6 h-6 text-amber-400" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 inline-block mb-1">
                        Campus Leader
                      </span>
                      <h3 className="font-extrabold text-white text-lg truncate">{campuses[0]?.college}</h3>
                      <div className="mt-2 text-3xl font-black text-white font-mono">
                        {campuses[0]?.registrations} <span className="text-xs font-normal text-slate-400">regs</span>
                      </div>
                      <span className="text-xs text-amber-300 font-mono mt-1 block">
                        {campuses[0]?.referrals} via referrals ({campuses[0]?.viral_share || `${campuses[0]?.growth_rate}%`})
                      </span>
                    </div>

                    {/* Rank 3 (Bronze) */}
                    <div className="order-3 p-5 rounded-2xl bg-gradient-to-b from-amber-950/20 to-slate-900/80 border border-amber-900/60 text-center relative overflow-hidden">
                      <div className="h-10 w-10 mx-auto rounded-full bg-amber-900/40 border border-amber-700/60 flex items-center justify-center text-amber-400 font-bold text-sm mb-3">
                        #3
                      </div>
                      <h3 className="font-bold text-white text-base truncate">{campuses[2]?.college}</h3>
                      <div className="mt-2 text-2xl font-black text-white font-mono">
                        {campuses[2]?.registrations} <span className="text-xs font-normal text-slate-400">regs</span>
                      </div>
                      <span className="text-[11px] text-sky-400 font-mono mt-1 block">
                        {campuses[2]?.referrals} via referrals ({campuses[2]?.viral_share || `${campuses[2]?.growth_rate}%`})
                      </span>
                    </div>
                  </div>
                )}

                {/* Table of all Campuses */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                          <th className="py-3.5 px-4">College / University</th>
                          <th className="py-3.5 px-4 text-right">Registrations</th>
                          <th className="py-3.5 px-4 text-right">Referrals</th>
                          <th className="py-3.5 px-4 text-right">Viral Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {campuses.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-400 font-sans">
                              <School className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                              <span className="font-bold text-slate-300 block text-sm">No registrations yet</span>
                              <span className="text-xs text-slate-500 mt-1 block">
                                Be the first student from your campus to register and lead the standings!
                              </span>
                            </td>
                          </tr>
                        ) : (
                          campuses.map((col) => (
                            <tr
                              key={col.rank}
                              className={`hover:bg-slate-800/40 transition-colors ${
                                col.rank <= 3 ? "bg-slate-900/40" : ""
                              }`}
                            >
                              <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                                {col.rank === 1 && "🥇"}
                                {col.rank === 2 && "🥈"}
                                {col.rank === 3 && "🥉"}
                                {col.rank > 3 && `#${col.rank}`}
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-white">
                                {col.college}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                                {col.registrations}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono text-emerald-400">
                                {col.referrals}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono text-xs text-sky-400">
                                {col.viral_share || `${col.growth_rate}%`}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* AMBASSADORS TAB */}
            {activeTab === "ambassadors" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Privacy Notice: Full student names are privacy-masked for public display.</span>
                  <span className="text-amber-400 font-semibold">Tier Rewards Active</span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                          <th className="py-3.5 px-4">Ambassador</th>
                          <th className="py-3.5 px-4">College</th>
                          <th className="py-3.5 px-4 text-right">Referrals</th>
                          <th className="py-3.5 px-4 text-right">Status Tier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {ambassadors.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-400 font-sans">
                              <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                              <span className="font-bold text-slate-300 block text-sm">No ambassadors yet</span>
                              <span className="text-xs text-slate-500 mt-1 block">
                                Register and share your link to join the ambassador rankings!
                              </span>
                            </td>
                          </tr>
                        ) : (
                          ambassadors.map((amb) => (
                            <tr
                              key={amb.rank}
                              className="hover:bg-slate-800/40 transition-colors"
                            >
                              <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                                #{amb.rank}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-white">
                                {amb.name}
                              </td>
                              <td className="py-3.5 px-4 text-slate-400 text-xs">
                                {amb.college}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                                {amb.referrals}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                                  {amb.tier}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* BOTTOM PROMPT */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-500/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-white text-base">
              Want your college at the top of the leaderboard?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Register now to get your personal referral link and share with your department classmates.
            </p>
          </div>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors flex-shrink-0 cursor-pointer"
          >
            <span>Register & Get Referral Link</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
