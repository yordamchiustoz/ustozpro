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
