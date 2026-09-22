import ComingSoon from "@/components/admin/ComingSoon";
import { Send } from "lucide-react";

export default function TelegramPage() {
  return (
    <ComingSoon
      icon={Send}
      title="Telegram Connection"
      description="Telegram bot va kanal integratsiyasi shu yerda sozlanadi"
    />
  );
}
