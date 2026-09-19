"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GraduationCap, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as "teacher" | "admin") || "teacher";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTeacher = role === "teacher";
  const accent = isTeacher
    ? { text: "text-emerald-600", bg: "bg-emerald-600 hover:bg-emerald-700", ring: "focus:ring-emerald-500" }
    : { text: "text-blue-600", bg: "bg-blue-600 hover:bg-blue-700", ring: "focus:ring-blue-500" };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role } },
        });
        if (signUpError) throw signUpError;

        // profiles jadvaliga yozuv — RLS policy bunga ruxsat berishi kerak
        // (qarang: README.md dagi SQL sxema)
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName,
            role,
          });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      router.push(`/dashboard/${role}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white/90 backdrop-blur-xl border border-white/60 max-w-md w-full rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isTeacher ? "bg-emerald-100" : "bg-blue-100"} ${accent.text}`}>
            {isTeacher ? <GraduationCap className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            ustoz<span className="text-teal-600">Pro</span>
          </h1>
        </div>
        <p className="text-center text-slate-500 text-sm mb-6">
          {isTeacher ? "O'qituvchi" : "Admin"} sifatida {mode === "signin" ? "kirish" : "ro'yxatdan o'tish"}
        </p>

        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "signin" ? "bg-white shadow text-slate-800" : "text-slate-500"}`}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "signup" ? "bg-white shadow text-slate-800" : "text-slate-500"}`}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">To'liq ism</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 ${accent.ring}`}
                placeholder="Ism Familiya"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 ${accent.ring}`}
              placeholder="siz@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Parol</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 ${accent.ring}`}
              placeholder="Kamida 6 ta belgi"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all ${accent.bg} disabled:opacity-60`}
          >
            {loading ? "Iltimos kuting..." : mode === "signin" ? "Kirish" : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-600"
        >
          ← Profil tanlashga qaytish
        </button>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
