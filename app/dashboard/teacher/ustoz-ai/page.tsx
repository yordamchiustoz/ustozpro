"use client";

import { useState, useRef } from "react";
import { Sparkles, Send, Copy, Check, Loader2 } from "lucide-react";

const SUGGESTIONS = [
  "5-sinf matematika fanidan 'Kasrlar' mavzusida dars ishlanma tuzib ber",
  "7-sinf fizika uchun 'Nyuton qonunlari' mavzusida qisqa test tuzib ber",
  "Ona tili darsiga qiziqarli kirish (motivatsiya) qismini yoz",
  "9-sinf uchun 'Kimyoviy reaksiyalar' mavzusida uy vazifasi tuzib ber",
];

type Message = { role: "user" | "ai"; text: string };

export default function UstozAiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send(promptText: string) {
    const prompt = promptText.trim();
    if (!prompt || loading) return;

    setError(null);
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ustoz-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi");
      } else {
        setMessages((m) => [...m, { role: "ai", text: data.text }]);
      }
    } catch {
      setError("Tarmoqqa ulanishda xatolik yuz berdi");
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }

  function copyText(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] -m-4 sm:-m-6">
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col min-h-0">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 mb-1">UstozAI yordamchisi</h1>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Dars ishlanmalari, testlar va boshqa o'quv materiallarini tayyorlashda
              yordam beraman — savolingizni yozing yoki quyidagilardan birini tanlang.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-sm bg-white border border-slate-200 rounded-xl p-3 hover:border-emerald-300 hover:shadow-sm transition-all text-slate-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-4 pb-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-white border border-slate-200 text-slate-700"
                  }`}
                >
                  {m.text}
                  {m.role === "ai" && (
                    <button
                      onClick={() => copyText(m.text, i)}
                      className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
                    >
                      {copiedIdx === i ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Nusxalandi
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Nusxalash
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Yozilmoqda...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
            {error}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="sticky bottom-4 flex items-end gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-lg"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Savolingizni yozing..."
            rows={1}
            className="flex-1 resize-none outline-none px-3 py-2 text-sm max-h-32"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-10 h-10 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition-all"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
