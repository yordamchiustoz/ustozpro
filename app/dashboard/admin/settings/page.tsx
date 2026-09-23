import ComingSoon from "@/components/admin/ComingSoon";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Admin sozlamalari"
      description="Platformaning umumiy va admin darajasidagi sozlamalari shu yerda bo'ladi"
    />
  );
}
