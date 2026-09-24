import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubjectByName } from "@/lib/resource-subjects";
import { BookOpen } from "lucide-react";

export default async function ResourcesEntryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?role=teacher");

  const { data: teacher } = await supabase
    .from("teachers")
    .select("subject")
    .eq("id", user.id)
    .maybeSingle();

  const resourceSubject = teacher?.subject ? getSubjectByName(teacher.subject) : null;

  if (!resourceSubject) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <p className="font-bold text-slate-700">Avval profilingizni to'ldiring</p>
        <p className="text-sm text-slate-400 mt-1">
          Mutaxassisligingizni tanlasangiz, shu fan resurslari shu yerda ko'rinadi.
        </p>
      </div>
    );
  }

  redirect(`/dashboard/teacher/resources/${resourceSubject.slug}`);
}
