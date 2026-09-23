import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { getSubjectBySlug } from "@/lib/resource-subjects";

export default function GradeResourcesPage({
  params,
}: {
  params: { subject: string; grade: string };
}) {
  const subject = getSubjectBySlug(params.subject);
  if (!subject) notFound();

  const grade = Number(params.grade);
  if (!subject.grades.includes(grade)) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/teacher/resources/${subject.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          {subject.name}
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-800">
          {subject.name} — {grade}-sinf
        </h1>
        <p className="text-slate-500 text-sm mt-1">Ushbu sinf uchun resurslar</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <FolderOpen className="w-7 h-7" />
        </div>
        <p className="font-bold text-slate-700">Hali resurslar qo'shilmagan</p>
        <p className="text-sm text-slate-400 mt-1 max-w-sm">
          Bu yerga {grade}-sinf {subject.name} fani uchun material, video yoki
          test tez orada qo'shiladi.
        </p>
      </div>
    </div>
  );
}
