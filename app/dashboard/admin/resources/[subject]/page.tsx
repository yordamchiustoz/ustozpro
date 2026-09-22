import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { getSubjectBySlug } from "@/lib/resource-subjects";

export default function SubjectGradesPage({
  params,
}: {
  params: { subject: string };
}) {
  const subject = getSubjectBySlug(params.subject);
  if (!subject) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/admin/resources"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Resurslar bazasi
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-800">{subject.name}</h1>
        <p className="text-slate-500 text-sm mt-1">Sinfni tanlang</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {subject.grades.map((grade) => (
          <Link
            key={grade}
            href={`/dashboard/admin/resources/${subject.slug}/${grade}`}
            className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200 py-6 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800">{grade}-sinf</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
