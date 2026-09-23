import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_DOMAIN = "ustozpro.internal";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;
  return user;
}

type TeacherBody = {
  id?: string;
  full_name: string;
  phone: string;
  login: string;
  password: string;
  subject?: string;
  category?: string;
  region?: string;
  district?: string;
  school_number?: string;
};

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const body: TeacherBody = await request.json();
  const { full_name, phone, login, password, subject, category, region, district, school_number } = body;

  if (!full_name || !phone || !login || !password) {
    return NextResponse.json({ error: "Ism, telefon, login va parol majburiy" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const email = `${login.trim().toLowerCase()}@${EMAIL_DOMAIN}`;

  // 1) Supabase Auth hisobini yaratish
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role: "teacher" },
  });

  if (authError || !authData.user) {
    const msg = authError?.message?.includes("already been registered")
      ? "Bu login band — boshqasini tanlang"
      : authError?.message || "Hisob yaratilmadi";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const userId = authData.user.id;

  // 2) profiles yozuvi
  const { error: profileError } = await adminClient.from("profiles").insert({
    id: userId,
    full_name,
    role: "teacher",
  });
  if (profileError) {
    await adminClient.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  // 3) teachers yozuvi
  const { data: teacherRow, error: teacherError } = await adminClient
    .from("teachers")
    .insert({
      id: userId,
      full_name,
      phone,
      login,
      password,
      subject: subject || null,
      category: category || null,
      region: region || null,
      district: district || null,
      school_number: school_number || null,
    })
    .select()
    .single();

  if (teacherError) {
    await adminClient.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: teacherError.message }, { status: 400 });
  }

  return NextResponse.json({ teacher: teacherRow });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const body: TeacherBody = await request.json();
  const { id, full_name, phone, login, password, subject, category, region, district, school_number } = body;

  if (!id) {
    return NextResponse.json({ error: "ID topilmadi" }, { status: 400 });
  }
  if (!full_name || !phone || !login || !password) {
    return NextResponse.json({ error: "Ism, telefon, login va parol majburiy" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const email = `${login.trim().toLowerCase()}@${EMAIL_DOMAIN}`;

  // 1) Auth hisobini yangilash (login/parol o'zgargan bo'lsa ham)
  const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(id, {
    email,
    password,
    user_metadata: { full_name, role: "teacher" },
  });
  if (authUpdateError) {
    const msg = authUpdateError.message?.includes("already been registered")
      ? "Bu login band — boshqasini tanlang"
      : authUpdateError.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // 2) profiles yangilash
  await adminClient.from("profiles").update({ full_name }).eq("id", id);

  // 3) teachers yangilash
  const { data: teacherRow, error: teacherError } = await adminClient
    .from("teachers")
    .update({
      full_name,
      phone,
      login,
      password,
      subject: subject || null,
      category: category || null,
      region: region || null,
      district: district || null,
      school_number: school_number || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (teacherError) {
    return NextResponse.json({ error: teacherError.message }, { status: 400 });
  }

  return NextResponse.json({ teacher: teacherRow });
}
