"use client";

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Menu,
  X,
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/teachers", label: "O'qituvchilar", icon: GraduationCap },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  // Sidebar boshlanishida ochiq turadi; hamburger bosilganda
  // istalgan ekran o'lchamida (mobil ham, kompyuter ham) ochilib-yopiladi.
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Yagona yuqori panel: hamburger + logotip */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-3 sticky top-0 z-30">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 shrink-0"
          aria-label="Menyu"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
          <ShieldCheck className="w-4.5 h-4.5" />
        </div>
        <span className="font-extrabold text-slate-800">
          ustoz<span className="text-blue-600">Pro</span>
        </span>
        <span className="text-slate-300 mx-1">|</span>
        <span className="font-semibold text-slate-500 text-sm">Admin panel</span>
      </header>

      <div className="flex flex-1 min-h-0 relative">
        {/* Mobilda menyu ochiq bo'lganda orqa fonni qorong'ilashtirish */}
        {open && (
          <div
            className="fixed inset-0 top-16 bg-black/30 z-20 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Yon panel — barcha o'lchamlarda bir xil holatda ochilib-yopiladi */}
        <aside
          className={`fixed lg:static inset-y-0 top-16 lg:top-0 left-0 z-30 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden transition-all duration-200 ${
            open ? "w-64 translate-x-0" : "w-0 lg:w-0 -translate-x-full lg:translate-x-0"
          }`}
        >
          <nav className="flex-1 p-3 space-y-1 w-64">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-100 w-64">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4.5 h-4.5" />
              Chiqish
            </button>
          </div>
        </aside>

        {/* Asosiy kontent */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Menu,
  X,
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/teachers", label: "O'qituvchilar", icon: GraduationCap },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobil uchun qorong'i fon (menyu ochiq bo'lganda) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Yon panel */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center gap-2 px-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <span className="font-extrabold text-slate-800">
            ustoz<span className="text-blue-600">Pro</span>
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4.5 h-4.5" />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Asosiy kontent */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-3 sticky top-0 z-20">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
            aria-label="Menyu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-semibold text-slate-700">Admin panel</span>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
