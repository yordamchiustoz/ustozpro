import { notFound, redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSubjectBySlug, getSubjectByName } from "@/lib/resource-subjects";

export default async function SubjectGradesPage({
  params,
}: {
  params: { subject: string };
}) {
  const subject = getSubjectBySlug(params.subject);
  if (!subject) notFound();

  // Faqat o'zining mutaxassisligiga tegishli fanni ko'rishi mumkin
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

  const own = teacher?.subject ? getSubjectByName(teacher.subject) : null;
  if (!own || own.slug !== subject.slug) {
    redirect("/dashboard/teacher/resources");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">{subject.name}</h1>
        <p className="text-slate-500 text-sm mt-1">Sinfni tanlang</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {subject.grades.map((grade) => (
          <a
            key={grade}
            href={`/dashboard/teacher/resources/${subject.slug}/${grade}`}
            className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200 py-6 hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800">{grade}-sinf</span>
          </a>
        ))}
      </div>
    </div>
  );
}
