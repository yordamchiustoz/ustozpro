import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Sparkles, ArrowRight } from "lucide-react";

export default async function TeacherDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?role=teacher");

  return (
    <main className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
            Xush kelibsiz, o&apos;qituvchi!
          </h1>
          <p className="text-slate-500">{user.email}</p>
          <p className="text-sm text-slate-400 mt-4">
            Bu yerda darslar, test va resurslar bo&apos;limlari joylashadi.
          </p>
        </div>

        <Link
          href="/dashboard/teacher/ustoz-ai"
          className="flex items-center gap-4 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-3xl p-6 shadow-xl shadow-emerald-600/20 hover:scale-[1.01] transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-lg">UstozAI</p>
            <p className="text-sm text-white/80">
              Dars ishlanmalari va materiallar uchun AI yordamchi
            </p>
          </div>
          <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </main>
  );
}
