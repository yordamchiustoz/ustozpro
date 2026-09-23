"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Phone } from "lucide-react";
import TeacherModal, { type Teacher } from "@/components/admin/TeacherModal";

type TeacherRow = Teacher & { id: string };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeacherRow | null>(null);

  async function loadTeachers() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("teachers")
      .select("*")
      .order("created_at", { ascending: false });
    setTeachers((data as TeacherRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  async function handleSave(teacher: Teacher) {
    const method = editing ? "PUT" : "POST";
    const res = await fetch("/api/admin/teachers", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { ...teacher, id: editing.id } : teacher),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Xatolik yuz berdi");
    }
    setModalOpen(false);
    setEditing(null);
    loadTeachers();
  }

  async function handleDelete(id: string) {
    if (!confirm("O'qituvchini o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/admin/teachers/${id}`, { method: "DELETE" });
    loadTeachers();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">O'qituvchilar</h1>
        <p className="text-slate-500 text-sm mt-1">
          Platformadagi barcha o'qituvchilarni boshqaring
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <p className="text-center text-slate-400 py-10 text-sm">Yuklanmoqda...</p>
        ) : teachers.length === 0 ? (
          <p className="text-center text-slate-400 py-10 text-sm">
            Hali o'qituvchilar qo'shilmagan
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400">
                  <th className="px-5 py-3 font-medium">Ism familiya</th>
                  <th className="px-5 py-3 font-medium">Telefon</th>
                  <th className="px-5 py-3 font-medium">Login</th>
                  <th className="px-5 py-3 font-medium">Fan</th>
                  <th className="px-5 py-3 font-medium">Toifa</th>
                  <th className="px-5 py-3 font-medium">Viloyat</th>
                  <th className="px-5 py-3 font-medium text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3 font-semibold text-slate-800">{t.full_name}</td>
                    <td className="px-5 py-3 text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {t.phone}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{t.login}</td>
                    <td className="px-5 py-3 text-slate-500">{t.subject || "—"}</td>
                    <td className="px-5 py-3 text-slate-500">{t.category || "—"}</td>
                    <td className="px-5 py-3 text-slate-500">{t.region || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditing(t);
                            setModalOpen(true);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
      >
        <Plus className="w-4.5 h-4.5" />
        O'qituvchi qo'shish
      </button>

      <TeacherModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
