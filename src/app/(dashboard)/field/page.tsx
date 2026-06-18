import { FieldApp } from "@/components/field/FieldApp";
import { Smartphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default function FieldPage() {
  return (
    <>
      {/* Mobile field app */}
      <div className="md:hidden">
        <FieldApp />
      </div>

      {/* Desktop notice — these tools are built for the phone */}
      <div className="hidden md:flex flex-col items-center justify-center text-center" style={{ minHeight: "60vh" }}>
        <Smartphone className="w-8 h-8 mb-3" style={{ color: "var(--b-text-muted)" }} />
        <h1 className="text-[18px] font-semibold" style={{ color: "var(--b-text)" }}>Field Tools are designed for mobile</h1>
        <p className="text-[13px] mt-1 max-w-[360px]" style={{ color: "var(--b-text-muted)" }}>
          The worker wallet, site sign-on, field inspections and emergency tools are built for the phone in your pocket. Open Briesa on a mobile device to use them.
        </p>
      </div>
    </>
  );
}
