"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Save, CheckCircle2 } from "lucide-react";

const MODELS = [
  { value: "gemini-3.5-flash", label: "Gemini 3.5 Flash (tavsiya etiladi)" },
  { value: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash-Lite (tezroq, soddaroq)" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro (kuchliroq, sekinroq)" },
];

export type AiSettings = {
  id: string | null;
  api_key: string;
  model: string;
  enabled: boolean;
};

export default function AiSettingsForm({ initial }: { initial: AiSettings }) {
  const [form, setForm] = useState<AiSettings>(initial);
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (!form.api_key.trim()) {
      setError("API kalitni kiriting");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    try {
      if (form.id) {
        const { error: updErr } = await supabase
          .from("ai_settings")
          .update({
            api_key: form.api_key,
            model: form.model,
            enabled: form.enabled,
            updated_at: new Date().toISOString(),
          })
          .eq("id", form.id);
        if (updErr) throw updErr;
      } else {
        const { data, error: insErr } = await supabase
          .from("ai_settings")
          .insert({
            provider: "gemini",
            api_key: form.api_key,
            model: form.model,
            enabled: form.enabled,
          })
          .select()
          .single();
        if (insErr) throw insErr;
        setForm((f) => ({ ...f, id: data.id }));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-800">Gemini ulanishi</h2>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-sm text-slate-500">{form.enabled ? "Yoqilgan" : "O'chirilgan"}</span>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, enabled: !f.enabled }))}
            className={`w-11 h-6 rounded-full transition-all relative ${
              form.enabled ? "bg-blue-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                form.enabled ? "left-5.5" : "left-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Model</label>
        <select
          value={form.model}
          onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {MODELS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Gemini API kaliti
        </label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={form.api_key}
            onChange={(e) => setForm((f) => ({ ...f, api_key: e.target.value }))}
            placeholder="AIzaSy..."
            className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showKey ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          Kalitni{" "}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            aistudio.google.com/app/apikey
          </a>{" "}
          orqali bepul olishingiz mumkin. Kalit faqat serverda saqlanadi va
          o'qituvchilarga hech qachon ko'rsatilmaydi.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all"
      >
        {saved ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Save className="w-4.5 h-4.5" />}
        {saving ? "Saqlanmoqda..." : saved ? "Saqlandi" : "Saqlash"}
      </button>
    </form>
  );
}
