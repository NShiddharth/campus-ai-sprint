"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Gift,
  School,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  User,
  Loader2
} from "lucide-react";
import { registerStudent, logEvent } from "@/lib/api";

const PRESET_COLLEGES = [
  "IIT Madras",
  "NIT Trichy",
  "BITS Pilani",
  "VIT Vellore",
  "PES University",
  "Delhi Technological University",
  "RV College of Engineering",
  "SRM Institute of Science and Technology",
  "JNTU Hyderabad",
  "COEP Tech University",
  "Thapar Institute of Engineering",
  "Anna University CEG",
  "BMS College of Engineering",
  "Manipal Institute of Technology",
  "Other College / University"
];

const BRANCHES = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Artificial Intelligence & Data Science",
  "Mechanical Engineering",
  "Civil / Other Engineering Branch"
];

function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Parameters
  const refParam = searchParams.get("ref") || "";
  const utmSource = searchParams.get("utm_source") || "";
  const utmMedium = searchParams.get("utm_medium") || "";
  const utmCampaign = searchParams.get("utm_campaign") || "";

  // Form State: No forced defaults, clean select-one placeholders
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    customCollege: "",
    branch: "",
    graduation_year: "",
    source: refParam ? "peer_referral" : "whatsapp_groups",
    referral_code: refParam,
  });

  const [hasStarted, setHasStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (refParam) {
      setFormData((prev) => ({
        ...prev,
        referral_code: refParam,
        source: "peer_referral"
      }));
    }
  }, [refParam]);

  const handleStartTyping = () => {
    if (!hasStarted) {
      setHasStarted(true);
      logEvent("REGISTRATION_STARTED", { referral_code: refParam });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Name validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg("Please enter your full name (minimum 2 characters).");
      return;
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg("Please enter a valid student or personal email address (e.g. name@college.edu).");
      return;
    }

    // 3. Indian mobile number validation (10 digits starting with 6, 7, 8, 9, or +91 prefix)
    const cleanPhone = formData.phone.replace(/[^\d+]/g, "");
    const digitsOnly = cleanPhone.replace(/\D/g, "");

    let isValidIndianPhone = false;
    if (digitsOnly.length === 10 && /^[6-9]/.test(digitsOnly)) {
      isValidIndianPhone = true;
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith("91") && /^[6-9]/.test(digitsOnly.slice(2))) {
      isValidIndianPhone = true;
    }

    if (!isValidIndianPhone) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    // 4. College selection validation
    if (!formData.college) {
      setErrorMsg("Please select your College / University from the list.");
      return;
    }
    const finalCollege =
      formData.college === "Other College / University"
        ? formData.customCollege.trim()
        : formData.college;

    if (!finalCollege) {
      setErrorMsg("Please type your college name.");
      return;
    }

    // 5. Branch validation
    if (!formData.branch) {
      setErrorMsg("Please select your Engineering Branch.");
      return;
    }

    // 6. Graduation Year validation
    if (!formData.graduation_year) {
      setErrorMsg("Please select your Graduation Year.");
      return;
    }

    try {
      setLoading(true);
      const res = await registerStudent({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: cleanPhone,
        college: finalCollege,
        branch: formData.branch,
        graduation_year: Number(formData.graduation_year),
        source: formData.source || "direct",
        utm_source: utmSource || undefined,
        utm_medium: utmMedium || undefined,
        utm_campaign: utmCampaign || undefined,
        referral_code: formData.referral_code.trim() || undefined,
      });

      // Smoothly redirect to personal Referral & Workshop Confirmation Dashboard
      router.push(`/referral/${res.referral_code}`);
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setErrorMsg(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/80 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free Workshop • Instant Seat Confirmation
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Reserve Your Workshop Seat
          </h1>
          <p className="text-sm text-slate-400">
            Build and deploy your first AI project in 60 minutes.
          </p>
        </div>

        {/* Ambassador Banner if referred */}
        {refParam && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 to-slate-900 border border-amber-500/40 flex items-start gap-3">
            <Gift className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-amber-300 block">
                Invited via Ambassador Link ({refParam})
              </span>
              <span className="text-slate-300">
                You and your referrer will both earn bonus points on your college's Campus AI Sprint leaderboard.
              </span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-start gap-3 shadow-lg shadow-red-950/30">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm text-red-300">Registration Notice</span>
              <span className="mt-0.5 block leading-relaxed">{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Registration Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Siddharth Sharma"
                value={formData.name}
                onFocus={handleStartTyping}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="e.g. siddharth@college.edu or gmail.com"
                value={formData.email}
                onFocus={handleStartTyping}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              WhatsApp / Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onFocus={handleStartTyping}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors placeholder:text-slate-600"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Used for workshop Zoom access credentials and GitHub starter code.
            </span>
          </div>

          {/* College Dropdown (No forced default) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              College / University *
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <select
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors"
              >
                <option value="" disabled>Select your College / University *</option>
                {PRESET_COLLEGES.map((col, i) => (
                  <option key={i} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            {formData.college === "Other College / University" && (
              <input
                type="text"
                required
                placeholder="Type your college name..."
                value={formData.customCollege}
                onChange={(e) => setFormData({ ...formData, customCollege: e.target.value })}
                className="mt-2 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            )}
          </div>

          {/* Branch & Graduation Year Grid (No forced defaults) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Engineering Branch *
              </label>
              <select
                required
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-sky-500 focus:outline-none"
              >
                <option value="" disabled>Select Branch *</option>
                {BRANCHES.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Graduation Year *
              </label>
              <select
                required
                value={formData.graduation_year}
                onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-sky-500 focus:outline-none"
              >
                <option value="" disabled>Select Year *</option>
                <option value="2025">2025 (Final Year)</option>
                <option value="2026">2026 (Pre-Final Year)</option>
                <option value="2027">2027 (2nd Year)</option>
                <option value="2024">2024 (Recent Graduate)</option>
              </select>
            </div>
          </div>

          {/* Referral Source Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              How did you hear about this?
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-sky-500 focus:outline-none"
            >
              <option value="whatsapp_groups">College WhatsApp Group</option>
              <option value="peer_referral">Classmate / Friend Referral</option>
              <option value="college_clubs">Campus Tech Club / Coding Society</option>
              <option value="linkedin_posts">LinkedIn Post</option>
              <option value="direct">Direct Website / Search</option>
            </select>
          </div>

          {/* Referral Code (optional/editable) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Referral Code (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. NX-1024"
              value={formData.referral_code}
              onChange={(e) => setFormData({ ...formData, referral_code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono uppercase focus:border-sky-500 focus:outline-none placeholder:text-slate-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Reserving Your Seat...</span>
              </>
            ) : (
              <>
                <span>Complete Registration & Get Referral Link</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500">
            By registering, you agree to receive the free workshop access credentials and GitHub project code.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        </div>
      }
    >
      <RegistrationForm />
    </Suspense>
  );
}
