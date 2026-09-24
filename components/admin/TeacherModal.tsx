"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SUBJECTS, CATEGORIES, REGIONS } from "@/lib/constants";

export type Teacher = {
  id?: string;
  full_name: string;
  phone: string;
  login: string;
  password: string;
  subject: string;
  category: string;
  region: string;
  district: string;
  school_number: string;
};

const EMPTY: Teacher = {
  full_name: "",
  phone: "",
  login: "",
  password: "",
  subject: "",
  category: "",
  region: "",
  district: "",
  school_number: "",
};

export default function TeacherModal({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: Teacher | null;
  onClose: () => void;
  onSave: (teacher: Teacher) => Promise<void>;
}) {
  const [form, setForm] = useState<Teacher>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initial ?? EMPTY);
    setError(null);
  }, [initial, open]);

  if (!open) return null;

  function set<K extends keyof Teacher>(key: K, value: Teacher[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.full_name || !form.phone || !form.login || !form.password) {
      setError("Ism, telefon, login va parol majburiy");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-3xl">
          <h2 className="font-extrabold text-slate-800 text-lg">
            {initial ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Ism familiya *</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Aziz Aliyev"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Telefon raqami *</label>
            <input
              required
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+998 90 123 45 67"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Login *</label>
              <input
                required
                value={form.login}
                onChange={(e) => set("login", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="aziz.aliyev"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Parol *</label>
              <input
                required
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Parol"
              />
            </div>
          </div>

          {initial ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Mutaxassisligi <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Tanlanmagan</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Toifasi <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Tanlanmagan</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">
                  Maktab ma'lumotlari (ixtiyoriy)
                </p>
                <div className="space-y-3">
                  <select
                    value={form.region}
                    onChange={(e) => set("region", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Viloyat tanlanmagan</option>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <input
                    value={form.district}
                    onChange={(e) => set("district", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tuman"
                  />
                  <input
                    value={form.school_number}
                    onChange={(e) => set("school_number", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Maktab raqami"
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-3">
              Mutaxassislik, toifa va maktab ma'lumotlarini o'qituvchining o'zi
              birinchi marta tizimga kirganda to'ldiradi.
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all"
            >
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
