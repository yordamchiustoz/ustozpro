-- UstozPro: profiles jadvali va RLS siyosatlari
-- Supabase Dashboard -> SQL Editor ga joylashtirib ishga tushiring.

create type public.user_role as enum ('teacher', 'admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'teacher',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Har bir foydalanuvchi faqat o'z profilini o'qiy oladi
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Har bir foydalanuvchi faqat o'z profilini yarata oladi (rolni o'zi belgilaydi,
-- lekin keyinchalik faqat admin uni o'zgartira olishi kerak — pastga qarang)
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Muhim: oddiy foydalanuvchi o'z rolini keyinchalik o'zgartira olmasin.
-- Faqat ism kabi maydonlarni yangilashga ruxsat beramiz; rolni faqat admin
-- (masalan, Supabase service_role kaliti orqali serverdan) o'zgartirsin.
create policy "profiles_update_own_limited"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Eslatma: yuqoridagi "with check" rolni ham o'zgartirishga imkon beradi,
-- chunki Postgres RLS ustun darajasida cheklamaydi. Productionga chiqishdan
-- oldin buni trigger bilan mustahkamlang:

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role then
    -- rolni faqat service_role (server tomon) o'zgartira oladi
    if auth.role() <> 'service_role' then
      raise exception 'Rolni faqat administrator o''zgartira oladi';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_prevent_role_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- ============================================================
-- TEACHERS: Admin tomonidan boshqariladigan o'qituvchilar jadvali
-- ============================================================

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  login text not null unique,
  password text not null, -- ESLATMA: MVP uchun oddiy matn. Productionga chiqishdan
                           -- oldin buni hash qilingan holda saqlash tavsiya etiladi.
  subject text,
  category text,
  region text,
  district text,
  school_number text,
  created_at timestamptz not null default now()
);

alter table public.teachers enable row level security;

-- Faqat 'admin' rolidagi foydalanuvchilar teachers jadvaliga to'liq
-- kirish (o'qish, qo'shish, tahrirlash, o'chirish) huquqiga ega.
create policy "teachers_admin_full_access"
  on public.teachers for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
