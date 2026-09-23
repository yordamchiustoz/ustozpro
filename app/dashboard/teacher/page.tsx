import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Sparkles, Library, MessageSquare, ArrowRight } from "lucide-react";
import { RESOURCE_SUBJECTS } from "@/lib/resource-subjects";

export default async function TeacherDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id)
    .single();

  const { count: aiRequestCount } = await supabase
    .from("ai_usage_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user?.id);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-3xl p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold">
          Xush kelibsiz, {profile?.full_name || "o'qituvchi"}!
        </h1>
        <p className="text-white/80 text-sm mt-1">
          UstozPro platformasida ish faoliyatingiz shu yerda kuzatiladi
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Library className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{RESOURCE_SUBJECTS.length}</p>
          <p className="text-sm text-slate-500 mt-0.5">Mavjud fanlar</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{aiRequestCount ?? 0}</p>
          <p className="text-sm text-slate-500 mt-0.5">UstozAI so'rovlaringiz</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-700">Ko'proq funksiyalar</p>
          <p className="text-xs text-slate-400 mt-0.5">Tez orada qo'shiladi</p>
        </div>
      </div>

      <Link
        href="/dashboard/teacher/ustoz-ai"
        className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-slate-800">UstozPro AI</p>
          <p className="text-sm text-slate-500">
            Dars ishlanmalari va materiallar uchun AI yordamchi
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
      </Link>
    </div>
  );
}
