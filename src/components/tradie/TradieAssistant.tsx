"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, Send, Bot, User, ChevronRight } from "lucide-react";

const YELLOW = "#ffd600";
const GREEN  = "#1a8a4a";

interface Msg { role: "user" | "assistant"; text: string; }

const SUGGESTIONS = [
  "Draft a SWMS for replacing a hot water system",
  "Write a toolbox talk on working in confined spaces",
  "What are my obligations under NSW WHS Act as a sole trader?",
  "Create a checklist for a bathroom rough-in",
  "What PPE do I need when cutting concrete?",
  "Draft a pre-start safety check for plumbing work",
];

const MOCK_RESPONSES: Record<string, string> = {
  default: `Here's what I've drafted for you based on Australian WHS legislation and best practice for your trade:\n\n**Key hazards identified:**\n- Working near live services\n- Manual handling of heavy materials\n- Exposure to biological hazards (drainage work)\n- Slips, trips and falls on uneven surfaces\n\n**Required controls:**\n1. Isolate water supply before commencing\n2. Use appropriate PPE (gloves, safety boots, eye protection)\n3. Ensure adequate ventilation in confined work areas\n4. Have a first aid kit accessible on site\n5. Notify the homeowner before commencing and after completion\n\n**Emergency contacts to post on site:**\n- SafeWork NSW: 13 10 50\n- Emergency: 000\n\nWant me to expand any section or generate the full SWMS document?`,
  swms: `**SWMS — Hot Water System Replacement**\n*Prepared for: Jake Sullivan, Licensed Plumber (PL-089423)*\n\n**Task:** Supply and install replacement Rinnai Infinity 26 continuous flow hot water system.\n\n**Step 1 — Isolation**\nHazard: Live gas and water services | Control: Isolate gas at meter, water at main stop valve. Confirm isolation with pressure test.\n\n**Step 2 — Remove existing unit**\nHazard: Heavy item (≈18kg), awkward position | Control: Team lift or mechanical aid. Back brace if required.\n\n**Step 3 — Installation**\nHazard: Gas connection, flue positioning | Control: Check flue clearances to AS/NZS 5601. Use thread sealant approved for gas. Pressure-test all connections before commission.\n\n**Step 4 — Commissioning**\nHazard: Hot surfaces, gas ignition | Control: Confirm hot water temp ≤50°C at outlets. Leak-check all joints with soap solution.\n\n**Sign-off:** ___________  Date: ___________`,
  whs: `As a sole trader in NSW, your key WHS obligations under the **Work Health and Safety Act 2011 (NSW)** are:\n\n1. **Duty of care to yourself** — You must ensure your own health and safety at work, just as an employer would for workers.\n\n2. **Duty of care to others** — Anyone affected by your work (homeowners, bystanders) must not be put at risk.\n\n3. **Safe work procedures** — You must use SWMS for high-risk construction work (e.g. working at heights >2m, confined spaces, demolition).\n\n4. **Licences** — You must hold and maintain a current plumbing licence issued by NSW Fair Trading.\n\n5. **Insurance** — Public liability insurance is strongly recommended (minimum $5M for residential work).\n\n6. **Incident reporting** — Notifiable incidents (serious injury, dangerous incidents) must be reported to SafeWork NSW immediately.\n\nWant a checklist of your annual compliance tasks?`,
};

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("swms") || lower.includes("hot water") || lower.includes("checklist")) return MOCK_RESPONSES.swms;
  if (lower.includes("whs") || lower.includes("obligation") || lower.includes("act") || lower.includes("sole trader")) return MOCK_RESPONSES.whs;
  return MOCK_RESPONSES.default;
}

const TOKEN_USED  = 34;
const TOKEN_LIMIT = 100;

export function TradieAssistant() {
  const [msgs, setMsgs]       = useState<Msg[]>([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [used, setUsed]       = useState(TOKEN_USED);
  const bottomRef             = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  function send(text: string) {
    if (!text.trim() || loading || used >= TOKEN_LIMIT) return;
    const userMsg: Msg = { role: "user", text: text.trim() };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const reply: Msg = { role: "assistant", text: getResponse(text) };
      setMsgs(prev => [...prev, reply]);
      setLoading(false);
      setUsed(u => Math.min(u + 1, TOKEN_LIMIT));
    }, 1400 + Math.random() * 600);
  }

  const pct = (used / TOKEN_LIMIT) * 100;

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-48px)]">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b" style={{ borderColor: "var(--b-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background: "rgba(255,214,0,0.12)" }}>
            <Zap className="w-4 h-4" style={{ color: YELLOW }} />
          </div>
          <div>
            <h1 className="text-[14px] font-[800]" style={{ color: "var(--b-text)" }}>Briesa AI</h1>
            <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>Ask anything about WHS, SWMS, licences or your trade.</p>
          </div>
          {/* Token bar */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-[700]" style={{ color: pct > 80 ? "#f06060" : "var(--b-text-muted)" }}>{used}/{TOKEN_LIMIT} AI calls</p>
              <p className="text-[9.5px]" style={{ color: "var(--b-text-muted)" }}>this month</p>
            </div>
            <div className="w-16 h-1.5 overflow-hidden" style={{ background: "var(--b-bg-active)" }}>
              <div className="h-full transition-all" style={{ width: `${pct}%`, background: pct > 80 ? "#f06060" : YELLOW }} />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {msgs.length === 0 && (
          <div>
            <p className="text-[12px] font-[700] mb-3" style={{ color: "var(--b-text-muted)" }}>Suggested questions</p>
            <div className="space-y-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 border text-left text-[12px] transition-colors"
                  style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)", color: "var(--b-text-secondary)" }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = YELLOW; (e.currentTarget as HTMLElement).style.background = "rgba(255,214,0,0.04)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"; (e.currentTarget as HTMLElement).style.background = "var(--b-bg-secondary)"; }}
                >
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: YELLOW }} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: m.role === "user" ? "rgba(255,214,0,0.15)" : "var(--b-bg-active)" }}>
              {m.role === "user"
                ? <User className="w-3.5 h-3.5" style={{ color: YELLOW }} />
                : <Bot  className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />}
            </div>
            <div
              className="max-w-[80%] px-4 py-3 text-[12.5px] leading-relaxed"
              style={{
                background: m.role === "user" ? "rgba(255,214,0,0.08)" : "var(--b-bg-secondary)",
                border: `1px solid ${m.role === "user" ? "rgba(255,214,0,0.2)" : "var(--b-border)"}`,
                color: "var(--b-text-secondary)",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: "var(--b-bg-active)" }}>
              <Bot className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
            </div>
            <div className="px-4 py-3 border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: YELLOW, animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t px-5 py-3" style={{ borderColor: "var(--b-border)" }}>
        {used >= TOKEN_LIMIT ? (
          <div className="text-center py-2 text-[12px]" style={{ color: "#f06060" }}>
            Monthly AI limit reached. Resets 1 July 2024.{" "}
            <span style={{ color: YELLOW, textDecoration: "underline", cursor: "pointer" }}>Upgrade plan</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 h-[40px] border text-[12.5px] outline-none"
              style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
              placeholder="Ask about SWMS, WHS, your licences…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
              onFocus={e => (e.currentTarget.style.borderColor = YELLOW)}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="flex items-center gap-1.5 px-4 h-[40px] text-[12.5px] font-[700] transition-colors disabled:opacity-40"
              style={{ background: YELLOW, color: "#0a0a0a" }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <p className="text-[10px] mt-1.5 text-center" style={{ color: "var(--b-text-muted)" }}>
          AI responses are for guidance only — always verify against current legislation.
        </p>
      </div>
    </div>
  );
}
