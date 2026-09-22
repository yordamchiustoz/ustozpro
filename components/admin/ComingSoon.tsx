import type { LucideIcon } from "lucide-react";

export default function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">{title}</h1>
        <p className="text-slate-500 text-sm mt-1">{description}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7" />
        </div>
        <p className="font-bold text-slate-700">Bu bo'lim tez orada tayyor bo'ladi</p>
        <p className="text-sm text-slate-400 mt-1 max-w-sm">
          Hozircha ishlab chiqilmoqda — tafsilotlar aniqlangach shu yerga qo'shiladi.
        </p>
      </div>
    </div>
  );
}
