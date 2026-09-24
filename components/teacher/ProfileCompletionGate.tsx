"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProfileCompletionModal, { type ProfileData } from "./ProfileCompletionModal";

export default function ProfileCompletionGate() {
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState<ProfileData>({
    subject: "",
    category: "",
    region: "",
    district: "",
    school_number: "",
  });
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teacher } = await supabase
        .from("teachers")
        .select("subject, category, region, district, school_number")
        .eq("id", user.id)
        .maybeSingle();

      // teacher qatori topilmasa (masalan admin bo'lsa) — hech narsa qilinmaydi
      if (teacher && !teacher.subject) {
        setInitial({
          subject: teacher.subject || "",
          category: teacher.category || "",
          region: teacher.region || "",
          district: teacher.district || "",
          school_number: teacher.school_number || "",
        });
        setOpen(true);
      }
    })();
  }, []);

  if (!open) return null;

  return (
    <ProfileCompletionModal
      initial={initial}
      onClose={() => setOpen(false)}
      onSaved={() => {
        setOpen(false);
        router.refresh();
      }}
    />
  );
}
