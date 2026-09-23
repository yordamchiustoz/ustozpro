import { createClient } from "@/lib/supabase/server";
import { Bot, MessageSquare, CalendarClock } from "lucide-react";
import AiSettingsForm from "@/components/admin/AiSettingsForm";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

export default async function AIMonitoringPage() {
  const supabase = createClient();

  const { data: settingsRow } = await supabase
    .from("ai_settings")
    .select("id, api_key, model, enabled")
    .eq("provider", "gemini")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: logs, count: totalCount } = await supabase
    .from("ai_usage_logs")
    .select("id, user_email, prompt_preview, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(20);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabase
    .from("ai_usage_logs")
    .select("id", { count: "exact", head: true })
    .gte("created_at", todayStart.toISOString());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Sun'iy intellekt nazorati</h1>
        <p className="text-slate-500 text-sm mt-1">
          UstozAI — o'qituvchilar uchun bepul AI yordamchini ulang va nazorat qiling
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Bot} label="Holat" value={settingsRow?.enabled ? "Faol" : "O'chiq"} />
        <StatCard icon={MessageSquare} label="Jami so'rovlar" value={totalCount ?? 0} />
        <StatCard icon={CalendarClock} label="Bugungi so'rovlar" value={todayCount ?? 0} />
      </div>

      <AiSettingsForm
        initial={{
          id: settingsRow?.id ?? null,
          api_key: settingsRow?.api_key ?? "",
          model: settingsRow?.model ?? "gemini-3.5-flash",
          enabled: settingsRow?.enabled ?? true,
        }}
      />

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">So'nggi so'rovlar</h2>
          <p className="text-xs text-slate-400 mt-0.5">Oxirgi 20 ta UstozAI murojaati</p>
        </div>
        {!logs || logs.length === 0 ? (
          <p className="text-center text-slate-400 py-10 text-sm">
            Hali UstozAI'dan foydalanilmagan
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400">
                  <th className="px-5 py-3 font-medium">Foydalanuvchi</th>
                  <th className="px-5 py-3 font-medium">So'rov namunasi</th>
                  <th className="px-5 py-3 font-medium">Vaqt</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3 text-slate-700 font-medium">{log.user_email}</td>
                    <td className="px-5 py-3 text-slate-500 max-w-md truncate">
                      {log.prompt_preview}
                    </td>
                    <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("uz-UZ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
