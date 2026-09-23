import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// DIQQAT: Bu klient faqat server tomonda (API route'larda) ishlatiladi.
// SUPABASE_SERVICE_ROLE_KEY hech qachon brauzerga yuborilmasligi kerak —
// shuning uchun u NEXT_PUBLIC_ prefiksisiz saqlanadi.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
