import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { RESOURCE_SUBJECTS } from "@/lib/resource-subjects";

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Resurslar bazasi</h1>
        <p className="text-slate-500 text-sm mt-1">
          Mutaxassislikni tanlang, so'ng tegishli sinfni ko'ring
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {RESOURCE_SUBJECTS.map((subject) => (
          <Link
            key={subject.slug}
            href={`/dashboard/admin/resources/${subject.slug}`}
            className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-800 truncate">{subject.name}</p>
              <p className="text-xs text-slate-400">
                {subject.grades[0]}–{subject.grades[subject.grades.length - 1]} sinflar
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
