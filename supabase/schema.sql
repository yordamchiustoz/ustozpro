-- ============================================================
-- UstozPro — TO'LIQ SQL SXEMA
-- Supabase Dashboard -> SQL Editor ga joylashtirib ishga tushiring.
-- Bu skript qayta ishga tushirilsa ham (asosan) xatosiz ishlaydi.
-- ============================================================

-- 1) Rol turi
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('teacher', 'admin');
  end if;
end $$;

-- 2) PROFILES — har bir Supabase Auth foydalanuvchisi (admin + o'qituvchi)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'teacher',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own_limited" on public.profiles;
create policy "profiles_update_own_limited" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role then
    if auth.role() <> 'service_role' then
      raise exception 'Rolni faqat administrator o''zgartira oladi';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_role_self_escalation on public.profiles;
create trigger trg_prevent_role_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- 3) TEACHERS — o'qituvchi profili. id = shu o'qituvchining Supabase Auth ID'si
--    (admin qo'shganda /api/admin/teachers orqali avtomatik yaratiladi).
--    ESLATMA: agar avval boshqa tuzilishdagi 'teachers' jadvali yaratilgan
--    bo'lsa, bu skript uni butunlay qayta yaratadi (mavjud qatorlar o'chadi).
drop table if exists public.teachers cascade;

create table public.teachers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  login text not null unique,
  password text not null, -- ESLATMA: MVP uchun oddiy matn. Haqiqiy kirish
                           -- Supabase Auth orqali amalga oshadi; bu maydon
                           -- faqat admin panelida ko'rsatish/tahrirlash uchun.
  subject text,
  category text,
  region text,
  district text,
  school_number text,
  created_at timestamptz not null default now()
);

alter table public.teachers enable row level security;

create policy "teachers_admin_full_access" on public.teachers
  for all
  using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

create policy "teachers_select_own" on public.teachers
  for select using (auth.uid() = id);

-- 4) AI_SETTINGS — admin tomonidan ulanadigan AI (Gemini) sozlamalari
create table if not exists public.ai_settings (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'gemini',
  api_key text not null,
  model text not null default 'gemini-2.5-flash',
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.ai_settings enable row level security;

drop policy if exists "ai_settings_admin_only" on public.ai_settings;
create policy "ai_settings_admin_only" on public.ai_settings
  for all
  using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

-- 5) AI_USAGE_LOGS — UstozAI foydalanish tarixi
create table if not exists public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  user_email text,
  prompt_preview text,
  created_at timestamptz not null default now()
);

alter table public.ai_usage_logs enable row level security;

drop policy if exists "ai_usage_admin_read" on public.ai_usage_logs;
create policy "ai_usage_admin_read" on public.ai_usage_logs
  for select
  using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

drop policy if exists "ai_usage_select_own" on public.ai_usage_logs;
create policy "ai_usage_select_own" on public.ai_usage_logs
  for select using (auth.uid() = user_id);
