# UstozPro

O'qituvchilar uchun yordamchi platforma. Next.js (App Router) + Tailwind + Supabase.

## 1. Loyihani mahalliy ishga tushirish

```bash
npm install
cp .env.example .env.local
# .env.local ichiga Supabase URL va anon key ni qo'ying (2-bosqichga qarang)
npm run dev
```

Brauzerda: http://localhost:3000

## 2. Supabase sozlash

1. https://supabase.com da yangi loyiha yarating.
2. **Project Settings → API** bo'limidan `Project URL` va `anon public` kalitni oling — ularni `.env.local` ga qo'ying.
3. **SQL Editor** ga o'ting va `supabase/schema.sql` faylidagi kodni to'liq nusxalab ishga tushiring (bu `profiles` jadvalini, RLS qoidalarini va rolni o'zboshimchalik bilan o'zgartirishdan himoyalovchi triggerni yaratadi).
4. **Authentication → Providers** bo'limida Email/Password yoqilganligiga ishonch hosil qiling (odatda standart yoqilgan).
5. (Ixtiyoriy) **Authentication → URL Configuration** da `Site URL` ni keyinchalik Vercel domeningizga o'zgartiring.

## 3. GitHub'ga yuklash

```bash
git init
git add .
git commit -m "UstozPro: boshlang'ich auth va dashboard"
git branch -M main
git remote add origin https://github.com/<username>/ustozpro.git
git push -u origin main
```

## 4. Vercel'ga deploy qilish

1. https://vercel.com → **Add New → Project** → GitHub repo'ingizni tanlang (`ustozpro`).
2. Framework avtomatik **Next.js** deb aniqlanadi — hech narsa o'zgartirish shart emas.
3. **Environment Variables** bo'limiga quyidagilarni qo'shing (Supabase'dan olgan qiymatlar bilan):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** tugmasini bosing. Bir necha daqiqada `https://ustozpro.vercel.app` (yoki tanlagan domeningiz) tayyor bo'ladi.
5. Custom domen (masalan `ustozpro.uz`) qo'shmoqchi bo'lsangiz: **Project → Settings → Domains**.

## 5. Loyiha tuzilmasi

```
app/
  page.tsx              -> Profil tanlash (bosh sahifa)
  login/page.tsx         -> Kirish / Ro'yxatdan o'tish
  dashboard/teacher/     -> O'qituvchi kabineti
  dashboard/admin/       -> Admin kabineti
lib/supabase/
  client.ts               -> Brauzer tomon Supabase klienti
  server.ts               -> Server komponentlar uchun Supabase klienti
middleware.ts              -> Sessiyani har so'rovda yangilab turadi
supabase/schema.sql         -> Supabase uchun SQL sxema (profiles + RLS)
```

## 6. Muhim xavfsizlik eslatmasi

`profiles.role` — foydalanuvchining "O'qituvchi" yoki "Admin" ekanligini belgilaydi.
`supabase/schema.sql` ichidagi trigger buni oddiy foydalanuvchi o'zgartira olmasligini
ta'minlaydi. Yangi adminlarni faqat Supabase Dashboard orqali yoki `service_role`
kaliti bilan ishlaydigan xavfsiz server funksiyasi orqali tayinlang — hech qachon
`service_role` kalitini frontend kodiga yoki `.env` dan tashqarida hech qayerga
qo'ymang.

## 7. Keyingi qadamlar (taklif)

- [ ] Email tasdiqlash (Supabase Auth email confirm) yoqish
- [ ] "Parolni unutdingizmi" oqimi
- [ ] O'qituvchi profiliga fan/sinf ma'lumotlarini qo'shish
- [ ] Admin panelida foydalanuvchilar ro'yxati va rol boshqaruvi
- [ ] Mobil ilova uchun Capacitor bilan o'rash
