import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  // 1) Foydalanuvchi tizimga kirganligini tekshirish
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Tizimga kirilmagan" }, { status: 401 });
  }

  const { prompt } = await request.json();
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "So'rov bo'sh bo'lishi mumkin emas" }, { status: 400 });
  }

  // 2) AI sozlamalarini service_role orqali o'qish (API kalit brauzerga chiqmaydi)
  const admin = createAdminClient();
  const { data: settings } = await admin
    .from("ai_settings")
    .select("api_key, model, enabled")
    .eq("provider", "gemini")
    .eq("enabled", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!settings) {
    return NextResponse.json(
      { error: "UstozAI hozircha faol emas. Administratorga murojaat qiling." },
      { status: 503 }
    );
  }

  // 3) Gemini API'ga so'rov yuborish
  const SYSTEM_INSTRUCTION =
    "Siz UstozPro platformasidagi UstozAI yordamchisisiz. O'zbekiston maktab " +
    "o'qituvchilariga dars ishlanmalari, testlar, mavzu rejalari va boshqa " +
    "o'quv materiallarini tayyorlashda yordam berasiz. Javoblaringiz o'zbek " +
    "tilida, aniq va amaliy bo'lsin.";

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.api_key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini xatosi:", errText);
      return NextResponse.json(
        { error: "AI javob berishda xatolik yuz berdi. Keyinroq urinib ko'ring." },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ??
      "";

    // 4) Foydalanishni qayd qilish (monitoring uchun)
    await admin.from("ai_usage_logs").insert({
      user_id: user.id,
      user_email: user.email,
      prompt_preview: prompt.slice(0, 200),
    });

    return NextResponse.json({ text });
  } catch (err) {
    console.error("UstozAI xatosi:", err);
    return NextResponse.json({ error: "Kutilmagan xatolik yuz berdi" }, { status: 500 });
  }
}
