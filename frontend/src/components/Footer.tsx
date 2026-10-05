import Link from "next/link";
import { Sparkles, Shield, Trophy, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-sky-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">Campus AI Sprint Growth Engine</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A high-velocity viral workshop growth system designed for final-year engineering students. Built with Next.js, FastAPI, and viral referral loops.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Challenge Submission: NxtWave Growth Intern Round 1
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Sprint Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">Workshop Overview</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-sky-400 transition-colors">Register (Free Seat)</Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-sky-400 transition-colors">Campus Leaderboard</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-sky-400 transition-colors">Admin Growth Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Governance & Privacy */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Simulation Governance</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              All student names and metrics displayed in public leaderboards are privacy-masked. Analytics data is backed by simulated synthetic campaigns.
            </p>
            <div className="mt-3 p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              Target: 500 Engineers • 7-Day Sprint • ₹2,000 Budget Model
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Campus AI Sprint. Developed for NxtWave Growth Challenge.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Participation</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Student Data Ethics</span>
            <span>•</span>
            <Link href="/admin" className="text-sky-400 hover:underline">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
