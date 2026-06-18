"use client";

import { useState } from "react";
import {
  IdCard, LogIn, ClipboardCheck, FileSignature, Megaphone, FileText, HeartPulse,
  ChevronRight, AlertTriangle,
} from "lucide-react";
import { useField, statusFor } from "./store";
import { WalletView } from "./views/WalletView";
import { SignOnView } from "./views/SignOnView";
import { InspectionsView } from "./views/InspectionsView";
import { PermitsView } from "./views/PermitsView";
import { ToolboxView } from "./views/ToolboxView";
import { DocumentsView } from "./views/DocumentsView";
import { MedicalView } from "./views/MedicalView";

type View = "hub" | "wallet" | "signon" | "inspections" | "permits" | "toolbox" | "documents" | "medical";

const TOOLS: { id: View; icon: typeof IdCard; name: string; desc: string }[] = [
  { id: "wallet", icon: IdCard, name: "My Wallet", desc: "Licences, tickets & site pass QR" },
  { id: "signon", icon: LogIn, name: "Sign-On / Off", desc: "Gate QR · time, date & GPS" },
  { id: "inspections", icon: ClipboardCheck, name: "Inspections & Defects", desc: "Photos, voice notes, checklists" },
  { id: "permits", icon: FileSignature, name: "Permits, SWMS & JSA", desc: "Read & sign · raise a permit" },
  { id: "toolbox", icon: Megaphone, name: "Toolbox & Meetings", desc: "Run talks · capture attendance" },
  { id: "documents", icon: FileText, name: "Documents & Drawings", desc: "SDS, SWMS, latest revisions" },
  { id: "medical", icon: HeartPulse, name: "Medical & Emergency", desc: "Contacts, info & broadcast" },
];

export function FieldApp() {
  const f = useField();
  const [view, setView] = useState<View>("hub");
  const back = () => setView("hub");

  if (view === "wallet") return <WalletView f={f} back={back} />;
  if (view === "signon") return <SignOnView f={f} back={back} />;
  if (view === "inspections") return <InspectionsView f={f} back={back} />;
  if (view === "permits") return <PermitsView back={back} />;
  if (view === "toolbox") return <ToolboxView back={back} />;
  if (view === "documents") return <DocumentsView back={back} />;
  if (view === "medical") return <MedicalView f={f} back={back} />;

  const p = f.state.profile;
  const expiringCount = f.state.licences.filter((l) => statusFor(l.expiry) !== "current").length;

  return (
    <div className="p-4 pb-24">
      {/* Worker header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: "var(--b-bg-active)" }}>
          {p.photo ? <img src={p.photo} alt="" className="w-full h-full object-cover" /> : <IdCard className="w-6 h-6" style={{ color: "var(--b-text-muted)" }} />}
        </div>
        <div className="min-w-0">
          <div className="text-[16px] font-bold" style={{ color: "var(--b-text)" }}>{p.name}</div>
          <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>{p.role} · {p.site}</div>
        </div>
      </div>

      {expiringCount > 0 && (
        <button onClick={() => setView("wallet")} className="w-full flex items-center gap-2 px-3 py-2.5 mb-4 border text-left" style={{ borderColor: "#f0606055", background: "rgba(240,96,96,0.06)" }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#f06060" }} />
          <span className="text-[12.5px] flex-1" style={{ color: "var(--b-text-secondary)" }}>{expiringCount} licence{expiringCount > 1 ? "s" : ""} expiring or expired — check your wallet</span>
          <ChevronRight className="w-4 h-4" style={{ color: "#f06060" }} />
        </button>
      )}

      <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>Field tools</div>
      <div className="grid grid-cols-2 gap-2.5">
        {TOOLS.map(({ id, icon: Icon, name, desc }) => (
          <button key={id} onClick={() => setView(id)} className="border p-3.5 text-left" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <Icon className="w-5 h-5 mb-2.5" style={{ color: "var(--b-accent-text)" }} />
            <div className="text-[13.5px] font-semibold leading-tight" style={{ color: "var(--b-text)" }}>{name}</div>
            <div className="text-[11px] mt-1 leading-snug" style={{ color: "var(--b-text-muted)" }}>{desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
