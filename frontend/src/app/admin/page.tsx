"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Share2,
  PieChart,
  ShieldCheck,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
  FlaskConical,
  DollarSign,
  Award,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Loader2,
  RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import {
  getAnalyticsOverview,
  getAnalyticsFunnel,
  getAnalyticsSources,
  getAnalyticsDaily,
  getAnalyticsColleges,
  getAmbassadorLeaderboard,
  loginAdmin,
  AnalyticsOverview,
  FunnelStage,
  SourceBreakdown,
  DailyTrend,
  CollegeBreakdown,
  AmbassadorLeaderboardItem
} from "@/lib/api";

const PIE_COLORS = ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#f43f5e", "#a855f7"];

export default function AdminDashboardPage() {
  const [authKey, setAuthKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Analytics data from backend database
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [sources, setSources] = useState<SourceBreakdown[]>([]);
  const [daily, setDaily] = useState<DailyTrend[]>([]);
  const [colleges, setColleges] = useState<CollegeBreakdown[]>([]);
  const [ambassadors, setAmbassadors] = useState<AmbassadorLeaderboardItem[]>([]);

  // Check existing session
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_auth");
    if (saved === "true") {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(false);
    const ok = await loginAdmin(authKey);
    setLoading(false);
    if (ok) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setAuthKey(""); // Clear input from memory
      fetchDashboardData();
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  const fetchDashboardData = async () => {
    setFetchingData(true);
    setFetchError(null);
    try {
      const [ov, fn, src, dy, col, amb] = await Promise.all([
        getAnalyticsOverview(),
        getAnalyticsFunnel(),
        getAnalyticsSources(),
        getAnalyticsDaily(),
        getAnalyticsColleges(),
        getAmbassadorLeaderboard(),
      ]);
      setOverview(ov);
      setFunnel(fn);
      setSources(src);
      setDaily(dy);
      setColleges(col);
      setAmbassadors(amb);
      setFetchingData(false);
    } catch (err: unknown) {
      setFetchingData(false);
      setFetchError(err instanceof Error ? err.message : "Failed to load analytics data from server.");
    }
  };

  // If not authenticated, render server-validated password screen (NO credentials in HTML)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">Admin Growth Portal</h2>
            <p className="text-xs text-slate-400">
              Enter the campaign administrator key configured in the backend environment.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300 block">Prototype Security Notice:</span>
            <span>Authentication is validated server-side via the FastAPI backend. No credentials or secret keys are stored in client code.</span>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Authentication failed: Invalid admin secret key.</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Admin Secret Key
              </label>
              <input
                type="password"
                required
                placeholder="Enter secret key..."
                value={authKey}
                onChange={(e) => setAuthKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
              <span>Verify & Access Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const directVsReferralData = overview
    ? [
        { name: "Direct Registrations", value: overview.direct_registrations },
        { name: "Attributed Referrals", value: overview.referral_registrations },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* SYNTHETIC NOTICE BANNER */}
      <div className="max-w-7xl mx-auto p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-amber-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <strong className="font-bold">Prototype Growth Dashboard — Synthetic Campaign Data</strong>
            <p className="text-amber-200/80 text-[11px]">
              All student names and campaign metrics are generated by the backend seeder for growth simulation and model testing.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={fetchingData}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${fetchingData ? "animate-spin" : ""}`} />
            <span>Refresh Database Data</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 hover:bg-red-900/50 text-xs font-semibold cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="max-w-7xl mx-auto p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>Error loading dashboard metrics: {fetchError}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* TOP TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Campaign Growth Analytics</h1>
              <span className="text-xs font-mono bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded">
                Live REST API
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              "Build Your First AI Project in 60 Minutes" • 7-Day Sprint Control Center
            </p>
          </div>
        </div>

        {/* 1. CAMPAIGN TARGET WIDGET (Target 500, Current, Remaining, Progress %) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900 border border-sky-500/30 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
                Primary Goal Progress (Single Source of Truth)
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  {overview?.current_registrations ?? 0}
                </span>
                <span className="text-slate-400 text-sm">
                  / {overview?.campaign_target ?? 500} Total Target
                </span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  ({overview?.progress_percentage ?? 0}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px] uppercase">Remaining Seats</span>
                <span className="text-xl font-bold text-amber-400">
                  {overview?.remaining_registrations ?? 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px] uppercase">Active Velocity</span>
                <span className="text-xl font-bold text-sky-400">
                  {overview?.registration_velocity ?? 0} /day
                </span>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${overview?.progress_percentage ?? 0}%` }}
            />
          </div>
        </div>

        {/* 2. CAMPAIGN HEALTH INDICATORS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Viral Referral Rate</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              {overview?.referral_share_percentage ?? 0}%
            </span>
            <span className="text-[11px] text-slate-500 block">Total regs via referrals</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Avg Referrals / Student</span>
            <span className="text-2xl font-black text-sky-400 font-mono mt-1 block">
              {overview?.average_referrals_per_participant ?? 0}
            </span>
            <span className="text-[11px] text-slate-500 block">Active ambassador power</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Best Acquisition Source</span>
            <span className="text-base font-bold text-white truncate mt-1 block font-mono">
              {overview?.best_performing_source ?? "N/A"}
            </span>
            <span className="text-[11px] text-indigo-400 block">Highest volume</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Top Performing College</span>
            <span className="text-base font-bold text-amber-400 truncate mt-1 block">
              {overview?.best_performing_college ?? "N/A"}
            </span>
            <span className="text-[11px] text-slate-500 block">Leaderboard Rank #1</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 lg:col-span-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Campuses Reached</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              {overview?.total_campuses ?? 0}
            </span>
            <span className="text-[11px] text-emerald-400 block">Engineering institutes</span>
          </div>
        </div>

        {/* 3. GROWTH CONVERSION FUNNEL */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-bold text-white">Full Growth Conversion Funnel</h2>
            </div>
            <span className="text-xs text-slate-400">Tracking telemetry events from database</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {funnel.map((stage, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Step {idx + 1}</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{stage.stage}</h4>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-white font-mono block">{stage.count}</span>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span className="text-emerald-400 font-semibold">{stage.conversion_from_prev}% conv</span>
                    {idx > 0 && <span className="text-red-400">-{stage.dropoff_rate}% drop</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. CHARTS GRID (Registrations by Day + Direct vs Referral Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Trend Line Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Registrations by Day (7-Day Sprint)</h3>
              <span className="text-xs text-slate-400">Direct vs Referral Contribution</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="direct" name="Direct Regs" fill="#38bdf8" stackId="a" />
                  <Bar dataKey="referral" name="Referral Regs" fill="#818cf8" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Direct vs Referral Donut */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Acquisition Split</h3>
              <span className="text-xs text-slate-400">Direct vs Referral Attributions</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={directVsReferralData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    <Cell fill="#38bdf8" />
                    <Cell fill="#818cf8" />
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-around text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-sky-400 inline-block"></span>
                <span>Direct ({overview?.direct_registrations ?? 0})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-indigo-400 inline-block"></span>
                <span>Referral ({overview?.referral_registrations ?? 0})</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. TOP COLLEGES & SOURCES BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Colleges */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Registrations by College (Top 10)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={colleges} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="college" stroke="#64748b" fontSize={10} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Bar dataKey="registrations" name="Registrations" fill="#34d399" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Acquisition Sources */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Registrations by Channel Source</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sources}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="source" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" name="Count" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 6. TOP REFERRAL STUDENTS TABLE */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Top Referral Ambassadors
            </h3>
            <span className="text-xs text-slate-400">Database Attribution Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Ambassador Name</th>
                  <th className="py-2.5 px-3">College</th>
                  <th className="py-2.5 px-3 text-right">Attributed Referrals</th>
                  <th className="py-2.5 px-3 text-right">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {ambassadors.slice(0, 6).map((amb) => (
                  <tr key={amb.rank} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-300">#{amb.rank}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{amb.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{amb.college}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {amb.referrals}
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-300 font-mono">{amb.tier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. GROWTH EXPERIMENTS SECTION */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-900/60 space-y-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">Proposed Growth Experiments</h3>
              <p className="text-xs text-slate-400">
                A/B hypotheses formulated to optimize viral loop conversion and campus penetration.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Experiment A */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950 px-2 py-0.5 rounded">
                  Experiment A
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Proposed</span>
              </div>
              <h4 className="text-sm font-bold text-white">"Referral Incentive CTA vs Generic Share CTA"</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Hypothesis:</strong> Giving students immediate visibility into tangible interview rewards (AI Project Interview Prep Toolkit) will increase referral share-click rates compared to a generic "Share with friends" button.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800 font-mono">
                <div>
                  <span className="text-slate-400 block">Variant A (Control):</span>
                  <span className="text-slate-200">"Share workshop with classmates"</span>
                </div>
                <div>
                  <span className="text-sky-300 block">Variant B (Challenger):</span>
                  <span className="text-sky-200">"Refer 1 student to unlock AI Interview Toolkit"</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-400 font-mono">
                <strong>Decision Rule:</strong> Deploy Variant B permanently if WhatsApp/Copy share click-through improves by &gt;15%.
              </p>
            </div>

            {/* Experiment B */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">
                  Experiment B
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Proposed</span>
              </div>
              <h4 className="text-sm font-bold text-white">"Campus Leaderboard Prominence vs No Leaderboard"</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Hypothesis:</strong> Showing students their college's real-time rank and how many registrations are needed to surpass rival campuses stimulates inter-college competitive pride.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800 font-mono">
                <div>
                  <span className="text-slate-400 block">Variant A:</span>
                  <span className="text-slate-200">Standard confirmation without rank</span>
                </div>
                <div>
                  <span className="text-indigo-300 block">Variant B:</span>
                  <span className="text-indigo-200">Live Campus Rank (#2) + Gap to #1</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-400 font-mono">
                <strong>Decision Rule:</strong> If Variant B yields a viral coefficient (K-factor) &gt; 0.35, expand campus leaderboards across all future sprints.
              </p>
            </div>
          </div>
        </div>

        {/* 8. BUDGET / CAMPAIGN PLANNING SECTION */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">₹2,000 Campaign Budget Allocation Model</h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">Planned Capital Efficiency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Community Amplification</span>
              <span className="text-xl font-black text-white font-mono mt-1 block">₹700</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Targeted distribution across verified college WhatsApp & Telegram tech communities.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Ambassador Incentives</span>
              <span className="text-xl font-black text-white font-mono mt-1 block">₹500</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Micro-incentives and recognition certificates for top student referral drivers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Creative Experiments</span>
              <span className="text-xl font-black text-white font-mono mt-1 block">₹400</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Micro-testing student hook messaging and LinkedIn student network creatives.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Contingency / Double-Down</span>
              <span className="text-xl font-black text-white font-mono mt-1 block">₹400</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Reserved to re-allocate into the single best-performing channel discovered by Day 4.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-800/80 pt-3">
            Note: This allocation is experimental and dynamic. By analyzing Day 4 conversion rates from the source breakdown API, capital will be shifted toward whichever channel delivers the lowest Customer Acquisition Cost (CAC).
          </p>
        </div>
      </div>
    </div>
  );
}
