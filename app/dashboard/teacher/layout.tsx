import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TeacherShell from "@/components/TeacherShell";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?role=teacher");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/dashboard/admin");

  return <TeacherShell>{children}</TeacherShell>;
}
