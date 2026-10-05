"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Trophy, BarChart3, ArrowRight, ShieldCheck } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">Campus AI Sprint</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded">Free</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Build Your First AI Project in 60 Min</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link
            href="/"
            className={`hover:text-white transition-colors ${pathname === "/" ? "text-sky-400 font-semibold" : ""}`}
          >
            Overview
          </Link>
          <Link
            href="/#roadmap"
            className="hover:text-white transition-colors"
          >
            60-Min Roadmap
          </Link>
          <Link
            href="/#takeaways"
            className="hover:text-white transition-colors"
          >
            What You'll Build
          </Link>
          <Link
            href="/leaderboard"
            className={`flex items-center gap-1.5 hover:text-white transition-colors ${pathname === "/leaderboard" ? "text-amber-400 font-semibold" : ""}`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Campus Leaderboard
          </Link>
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 hover:text-white transition-colors ${pathname === "/admin" ? "text-indigo-400 font-semibold" : ""}`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Admin Growth
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-slate-400 hover:text-slate-200 md:hidden p-2 rounded-lg border border-slate-800"
            title="Admin Dashboard"
          >
            <BarChart3 className="w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sky-500 hover:from-sky-400 to-indigo-600 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-md shadow-sky-500/25 transition-all hover:shadow-sky-500/40 active:scale-95"
          >
            <span>Reserve Seat</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
