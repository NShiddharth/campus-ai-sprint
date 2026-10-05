"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  ChevronDown,
  Trophy,
  Share2,
  Users,
  Terminal,
  FileCheck
} from "lucide-react";
import { CampaignTargetWidget } from "@/components/CampaignTargetWidget";
import { LiveDemoCard } from "@/components/LiveDemoCard";
import { logEvent } from "@/lib/api";

const ROADMAP_STEPS = [
  {
    time: "Minute 00 – 15",
    title: "AI API Architecture & System Prompt Design",
    desc: "Understand LLM API request-response pipelines, temperature, JSON-mode schemas, and token optimization for production backends.",
    badge: "Foundation"
  },
  {
    time: "Minute 15 – 35",
    title: "Building the FastAPI Core & Document Parser",
    desc: "Write clean Python endpoints to parse resumes, compare skill embeddings, and compute real-time recruiter match scores.",
    badge: "Backend Core"
  },
  {
    time: "Minute 35 – 50",
    title: "Interactive UI & Real-Time Scoring Engine",
    desc: "Connect frontend inputs with instant visual skill radar breakdown and personalized candidate interview pitch generation.",
    badge: "Full-Stack"
  },
  {
    time: "Minute 50 – 60",
    title: "Deployment & Recruiter Interview Articulation",
    desc: "Push code to GitHub with complete documentation and practice explaining architecture tradeoffs in placement interviews.",
    badge: "Career Ready"
  }
];

const TAKEAWAYS = [
  {
    title: "Deployable GitHub Repository",
    desc: "A clean, production-structured project with clear commit history, automated tests, and Docker-ready setup.",
    icon: Code2
  },
  {
    title: "3 Resume Bullet Points",
    desc: "Placement-vetted action bullets demonstrating API engineering, LLM prompting, and backend validation.",
    icon: FileCheck
  },
  {
    title: "Deployable Application Link",
    desc: "A shareable interactive web app link (running in Local Development on localhost, production cloud-deployable).",
    icon: Terminal
  },
  {
    title: "Technical Interview Talking Points",
    desc: "Know exactly how to answer: 'Why this model?', 'How did you handle hallucinations?', and 'How does it scale?'",
    icon: Briefcase
  }
];

const FAQS = [
  {
    q: "Is this workshop truly 100% free?",
    a: "Yes. The workshop is completely free of charge. No payment details or hidden subscriptions required."
  },
  {
    q: "Do I need prior experience with Machine Learning or PyTorch?",
    a: "No! Basic knowledge of Python and programming fundamentals is all you need. We build directly on modern LLM APIs and web frameworks."
  },
  {
    q: "Who is eligible to participate?",
    a: "The workshop is specially tailored for final-year and pre-final year engineering students (B.Tech / B.E / MCA / M.Tech) across all branches seeking tech careers."
  },
  {
    q: "How does the Campus Leaderboard and Referral Sprint work?",
    a: "Once you register, you receive a unique referral link. When your college batchmates register using your link, both your personal ambassador ranking and your college's campus standing rise on the live leaderboard!"
  },
  {
    q: "Will I receive a certificate and source code?",
    a: "Yes, every active participant receives full GitHub source code access, project boilerplate, and a verified Certificate of Completion."
  }
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    logEvent("LANDING_PAGE_VIEW", { referrer: typeof document !== "undefined" ? document.referrer : "" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="relative overflow-hidden">
        <div className="glow-blob bg-sky-500 w-[500px] h-[400px] -top-24 -left-24"></div>
        <div className="glow-blob bg-indigo-600 w-[450px] h-[400px] top-64 -right-24"></div>

        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Live Campaign Tracker Widget */}
            <div className="mb-6">
              <CampaignTargetWidget />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sky-400 text-xs font-semibold shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse"></span>
              Live 60-Minute Masterclass • For Engineering Students
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Build Your First AI Project in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
                60 Minutes
              </span>
            </h1>

            {/* Supporting Subhead */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Go from <span className="text-white font-medium">"I want an AI project"</span> to a working project you can explain in your next interview.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-sky-500/25 transition-all hover:shadow-sky-500/40 active:scale-95"
              >
                <span>Reserve My Free Seat</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/leaderboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-base px-6 py-3.5 rounded-xl border border-slate-800 transition-colors"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>View Campus Leaderboard</span>
              </Link>
            </div>

            {/* Trust Proof Points */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free Masterclass
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Complete Source Code Provided
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Resume & Interview Ready
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* INTERACTIVE PROJECT SHOWCASE */}
      <section id="project-demo" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> What You Will Build
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            An AI Project Recruiters Will Actually Care About
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Skip boilerplate tutorials. You will construct an end-to-end ATS Resume Screener & AI Interview Pitch Generator powered by FastAPI and OpenAI APIs.
          </p>
        </div>

        <LiveDemoCard />
      </section>

      {/* 60-MINUTE ROADMAP SECTION */}
      <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-900 bg-slate-950/40">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" /> High-Density Curriculum
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The 60-Minute Tactical Roadmap
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every minute is optimized for execution. No fluff, no extended sales pitches — just pure hands-on building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROADMAP_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/30 transition-all hover:shadow-xl hover:shadow-sky-950/20"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2.5 py-1 rounded-md">
                  {step.time}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded">
                  {step.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TANGIBLE TAKEAWAYS */}
      <section id="takeaways" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5" /> Career Proof
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What You Take Away
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Walk away with artifacts you can attach directly to your resume and speak to during technical interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TAKEAWAYS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHO SHOULD ATTEND */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-900">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-900/40">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Audience Fit</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Who Should Attend This Workshop?</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Designed specifically for <strong className="text-white">final-year and pre-final engineering students (2025/2026 batches)</strong> across CSE, IT, ECE, EEE, and core branches who need a credible, working AI project on their resume before campus placements and off-campus recruitment drives.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-full">Final Year B.Tech / B.E</span>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-full">CSE / IT / Data Science</span>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-full">ECE / Core Branches Transitioning</span>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-full">Placement Aspirants</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white hover:text-sky-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180 text-sky-400" : ""}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL REGISTRATION CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-tr from-sky-950 via-slate-900 to-indigo-950 border border-sky-500/30 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Claim Your Spot in the 60-Minute Sprint
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Seats are strictly capped at 500 engineering students across participating campuses to ensure interactive live mentoring.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-base sm:text-lg px-9 py-4 rounded-xl shadow-xl shadow-sky-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Reserve My Free Seat Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
