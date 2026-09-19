import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function TeacherDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?role=teacher");

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
          Xush kelibsiz, o&apos;qituvchi!
        </h1>
        <p className="text-slate-500">{user.email}</p>
        <p className="text-sm text-slate-400 mt-4">
          Bu yerda darslar, test va resurslar bo&apos;limlari joylashadi.
        </p>
      </div>
    </main>
  );
}
