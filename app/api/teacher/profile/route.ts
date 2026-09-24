import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PUT(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();
  const { subject, category, region, district, school_number } = body;

  // Faqat shu 5 maydon yangilanadi — ism, telefon, login, parolga
  // bu API orqali hech qachon tegib bo'lmaydi.
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("teachers")
    .update({
      subject: subject || null,
      category: category || null,
      region: region || null,
      district: district || null,
      school_number: school_number || null,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ teacher: data });
}
