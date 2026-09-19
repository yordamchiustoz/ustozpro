"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap, ShieldCheck, BookOpen, Lightbulb, Clock } from "lucide-react";

type Role = "teacher" | "admin";

export default function ProfileSelectPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);

  function handleContinue() {
    if (!role) return;
    router.push(`/login?role=${role}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_900px_600px_at_8%_8%,rgba(16,185,129,.10),transparent_55%),radial-gradient(ellipse_900px_600px_at_92%_92%,rgba(59,130,246,.10),transparent_55%)]">
      {/* Fon bezaklari */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <BookOpen className="absolute opacity-50 text-emerald-500" style={{ top: "6%", left: "6%", width: 76, height: 76, transform: "rotate(-8deg)" }} />
        <GraduationCap className="absolute opacity-50 text-blue-500" style={{ top: "12%", right: "9%", width: 58, height: 58, transform: "rotate(10deg)" }} />
        <Clock className="absolute opacity-50 text-amber-500" style={{ bottom: "10%", left: "8%", width: 64, height: 64, transform: "rotate(-6deg)" }} />
        <GraduationCap className="absolute opacity-50 text-emerald-500" style={{ bottom: "8%", right: "7%", width: 70, height: 70, transform: "rotate(9deg)" }} />
        <Lightbulb className="absolute opacity-50 text-blue-500" style={{ top: "45%", left: "3%", width: 40, height: 40, transform: "rotate(-12deg)" }} />
        <BookOpen className="absolute opacity-50 text-amber-500" style={{ top: "40%", right: "3%", width: 46, height: 46, transform: "rotate(14deg)" }} />
      </div>

      <div className="relative z-10 bg-white/85 backdrop-blur-2xl border border-white/60 max-w-xl w-full rounded-3xl p-8 shadow-2xl text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className="w-[46px] h-[46px] rounded-2xl flex items-center justify-center shrink-0 shadow-[0_8px_18px_-6px_rgba(16,185,129,0.55)]"
            style={{ background: "linear-gradient(135deg, #10b981, #0d9488)", transform: "rotate(-6deg)" }}
          >
            <GraduationCap className="w-[26px] h-[26px] text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800">
            ustoz<span className="text-teal-600">Pro</span>
          </h1>
        </div>
        <p className="text-slate-500 font-medium mb-8">Profil tanlang</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`border-2 p-6 rounded-2xl cursor-pointer transition-all duration-250 hover:scale-[1.02] ${
              role === "teacher"
                ? "border-emerald-500 bg-emerald-50/90 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.2)]"
                : "border-emerald-100 bg-emerald-50/50"
            }`}
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">O'qituvchi</h3>
          </button>

          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`border-2 p-6 rounded-2xl cursor-pointer transition-all duration-250 hover:scale-[1.02] ${
              role === "admin"
                ? "border-blue-500 bg-blue-50/90 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.2)]"
                : "border-blue-100 bg-blue-50/50"
            }`}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Admin</h3>
          </button>
        </div>

        <button
          type="button"
          disabled={!role}
          onClick={handleContinue}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            !role
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : role === "teacher"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg cursor-pointer"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer"
          }`}
        >
          Davom etish
        </button>

        <p className="mt-6 text-xs text-slate-400">
          © 2026 UstozPro platformasi. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </main>
  );
}
