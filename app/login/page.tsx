"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GraduationCap, ShieldCheck } from "lucide-react";

const EMAIL_DOMAIN = "ustozpro.internal";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as "teacher" | "admin") || "teacher";
  const isTeacher = role === "teacher";

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accent = isTeacher
    ? { text: "text-emerald-600", bg: "bg-emerald-600 hover:bg-emerald-700", ring: "focus:ring-emerald-500" }
    : { text: "text-blue-600", bg: "bg-blue-600 hover:bg-blue-700", ring: "focus:ring-blue-500" };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    try {
      const email = `${login.trim().toLowerCase()}@${EMAIL_DOMAIN}`;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw new Error("Login yoki parol noto'g'ri");

      router.push(isTeacher ? "/dashboard/teacher" : "/dashboard/admin");
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
        <p className="text-center text-slate-500 text-sm mb-8">
          {isTeacher ? "O'qituvchi" : "Admin"} sifatida kirish
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Login</label>
            <input
              type="text"
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 ${accent.ring}`}
              placeholder="login"
              autoCapitalize="none"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Parol</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 ${accent.ring}`}
              placeholder="Parol"
              autoComplete="current-password"
            />
          </div>

          {!isTeacher && (
            <p className="text-xs text-slate-400">
              Login va parolni admin sizga bergan bo'ladi.
            </p>
          )}
          {isTeacher && (
            <p className="text-xs text-slate-400">
              Login va parolni maktab administratori sizga bergan bo'ladi.
            </p>
          )}

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
            {loading ? "Iltimos kuting..." : "Kirish"}
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
