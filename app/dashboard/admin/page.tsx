import { createClient } from "@/lib/supabase/server";
import { Users, TrendingUp, BookOpen, Activity } from "lucide-react";
import { SubjectBarChart, CategoryPieChart } from "@/components/admin/DashboardCharts";

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      {hint && <p className="text-xs text-slate-400 mt-2">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const { data: teachers } = await supabase
    .from("teachers")
    .select("subject, category");

  const teacherCount = teachers?.length ?? 0;

  const subjectCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  (teachers ?? []).forEach((t) => {
    const subj = t.subject || "Belgilanmagan";
    const cat = t.category || "Belgilanmagan";
    subjectCounts.set(subj, (subjectCounts.get(subj) ?? 0) + 1);
    categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1);
  });

  const subjectData = Array.from(subjectCounts, ([name, count]) => ({ name, count }));
  const categoryData = Array.from(categoryCounts, ([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Platforma bo'yicha umumiy ko'rinish</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="O'qituvchilar soni" value={teacherCount} />
        <StatCard
          icon={TrendingUp}
          label="Kunlik kirishlar"
          value="—"
          hint="Analitika hali ulanmagan"
        />
        <StatCard
          icon={BookOpen}
          label="Fan resurslari"
          value="—"
          hint="Resurslar bo'limi hali qo'shilmagan"
        />
        <StatCard
          icon={Activity}
          label="Faol foydalanuvchilar"
          value="—"
          hint="Analitika hali ulanmagan"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-bold text-slate-800 mb-1">Fanlar bo'yicha o'qituvchilar</h2>
          <p className="text-xs text-slate-400 mb-2">Har bir fandagi o'qituvchilar soni</p>
          <SubjectBarChart data={subjectData} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-bold text-slate-800 mb-1">Toifalar bo'yicha taqsimot</h2>
          <p className="text-xs text-slate-400 mb-2">O'qituvchilarning malaka toifalari</p>
          <CategoryPieChart data={categoryData} />
        </div>
      </div>
    </div>
  );
}
