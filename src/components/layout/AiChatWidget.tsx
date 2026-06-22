"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Sparkles, X, Send, RotateCcw, ChevronRight,
} from "lucide-react";
import type { Industry } from "@/config/modules";

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

// ── Brand colours ──────────────────────────────────────────────────────────

const Y = "#ffd600";
const YH = "#f0cb00";
const BK = "#0a0a0a";

// ── Page-specific suggested prompts ───────────────────────────────────────

const SUGGESTIONS: Record<string, string[]> = {
  "/dashboard":              ["Explain my compliance score", "What should I focus on today?", "How does Briesa calculate TRIFR?"],
  "/safety/incidents":       ["Walk me through an ICAM investigation", "What makes an incident notifiable?", "How does TapRooT work with ICAM?"],
  "/safety/actions":         ["Difference between Immediate, Systemic and Preventive?", "How do I prioritise corrective actions?", "What ICAM factor should this action address?"],
  "/safety/swms":            ["When is a SWMS legally required?", "What must a SWMS include?", "How often should SWMS be reviewed?"],
  "/safety/permits-to-work": ["What work types require a Permit to Work?", "What are PCBU duties for high-risk work?", "How long should PTW records be kept?"],
  "/safety/loto":            ["LOTO requirements under the WHS Regulations?", "Who can remove a LOTO lock?", "What plant requires isolation procedures?"],
  "/compliance":             ["How is the compliance score calculated?", "What records must I keep under the WHS Act?", "What triggers a notifiable incident investigation?"],
  "/training":               ["What competency records am I required to keep?", "What training is mandatory for high-risk work?", "How do I verify contractor competencies?"],
  "/risk":                   ["What is the hierarchy of controls?", "How do I assess a risk under Australian standards?", "When should a risk be escalated?"],
  "/people/inductions":      ["What must a site induction cover?", "Are induction records legally required?", "How often should inductions be refreshed?"],
};

const DEFAULT_SUGGESTIONS = [
  "What are my PCBU duties under the WHS Act?",
  "How do I navigate to incidents?",
  "Explain the ICAM methodology",
];

// ── Bubble ─────────────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div
          className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2"
          style={{ background: Y, border: `1px solid ${Y}` }}
        >
          <Sparkles className="w-3 h-3" style={{ color: BK }} />
        </div>
      )}
      <div
        className="max-w-[88%] px-3 py-2.5 text-[12px] leading-relaxed whitespace-pre-wrap"
        style={
          isUser
            ? { background: Y, color: BK, border: `1px solid ${Y}` }
            : { background: "var(--b-bg-secondary)", color: "var(--b-text)", border: "1px solid var(--b-border)" }
        }
      >
        {msg.content}
        {msg.streaming && (
          <span
            className="inline-block ml-0.5 w-1.5 h-3.5 align-middle animate-pulse"
            style={{ background: Y }}
          />
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function AiChatWidget({ industry }: { industry: Industry }) {
  const pathname = usePathname();

  // Desktop panel state — open by default
  const [panelOpen, setPanelOpen] = useState(true);
  // Mobile overlay state
  const [mobileOpen, setMobileOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const suggestions = SUGGESTIONS[pathname] ?? DEFAULT_SUGGESTIONS;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (panelOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [panelOpen]);

  useEffect(() => {
    if (mobileOpen) setTimeout(() => mobileInputRef.current?.focus(), 80);
  }, [mobileOpen]);

  const sendMessage = useCallback(async (text: string) => {
    const userText = text.trim();
    if (!userText || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: userText };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", streaming: true };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, pathname, industry }),
      });
      if (!res.ok || !res.body) throw new Error("failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: acc, streaming: true } : m));
      }
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: acc, streaming: false } : m));
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, content: "Sorry — something went wrong. Please try again.", streaming: false } : m
      ));
    } finally {
      setLoading(false);
    }
  }, [messages, pathname, industry, loading]);

  function clearChat() { setMessages([]); }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  // ── Shared chat body content ─────────────────────────────────────────────

  function ChatBody() {
    return messages.length === 0 ? (
      <div>
        <div className="mb-4 pb-4 border-b" style={{ borderColor: "var(--b-border)" }}>
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--b-text-muted)" }}>
            Ask me anything about WHS legislation, platform navigation, ICAM investigations, or what you can see on this page.
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>Suggested</div>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="w-full text-left px-3 py-2 text-[12px] border transition-colors"
              style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)", color: "var(--b-text)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = Y}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    ) : (
      <div>
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>
    );
  }

  // ── Shared input row ─────────────────────────────────────────────────────

  function InputRow({ ref: ref_ }: { ref: React.RefObject<HTMLInputElement | null> }) {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 border-t flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
        <input
          ref={ref_}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about WHS, navigation, or this page…"
          disabled={loading}
          className="flex-1 h-[34px] px-3 text-[12px] border outline-none transition-colors disabled:opacity-60"
          style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
          onFocus={e => (e.target as HTMLElement).style.borderColor = Y}
          onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--b-border-strong)"}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="w-[34px] h-[34px] flex items-center justify-center flex-shrink-0 transition-opacity disabled:opacity-40"
          style={{ background: Y, border: `1px solid ${Y}`, color: BK }}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ══ DESKTOP: inline panel ══════════════════════════════════════════ */}

      {panelOpen ? (
        /* Open panel — participates in flex layout, shrinks main */
        <div
          className="hidden md:flex flex-col flex-shrink-0 border-l"
          style={{
            width: "25vw",
            minWidth: "260px",
            maxWidth: "420px",
            borderColor: "var(--b-border)",
            background: "var(--b-bg)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 border-b flex-shrink-0"
            style={{ borderColor: "var(--b-border)", background: Y }}
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: BK }} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold leading-tight" style={{ color: BK }}>Briesa AI</div>
              <div className="text-[10px] font-medium opacity-70 leading-tight" style={{ color: BK }}>WHS expert · platform guide</div>
            </div>
            <div className="flex items-center gap-0.5">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="w-7 h-7 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                  title="Clear chat"
                >
                  <RotateCcw className="w-3.5 h-3.5" style={{ color: BK }} />
                </button>
              )}
              <button
                onClick={() => setPanelOpen(false)}
                className="w-7 h-7 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                title="Collapse panel"
              >
                <ChevronRight className="w-4 h-4" style={{ color: BK }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 min-h-0">
            <ChatBody />
          </div>

          {/* Input */}
          <InputRow ref={inputRef} />

          {/* Disclaimer */}
          <div className="px-3 pb-2 text-[10px] text-center" style={{ color: "var(--b-text-muted)" }}>
            Guidance only — verify with current legislation.
          </div>
        </div>
      ) : (
        /* Collapsed strip — click to re-open */
        <div
          className="hidden md:flex flex-col items-center justify-start pt-4 border-l flex-shrink-0 cursor-pointer group"
          style={{ width: "36px", borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}
          onClick={() => setPanelOpen(true)}
          title="Open Briesa AI"
        >
          <div
            className="flex items-center justify-center w-8 h-8 mb-3 transition-colors group-hover:opacity-90"
            style={{ background: Y }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: BK }} />
          </div>
          <div
            className="text-[10px] font-bold select-none"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              color: "var(--b-text-muted)",
              letterSpacing: "0.08em",
            }}
          >
            ASK AI
          </div>
          {messages.length > 0 && (
            <div
              className="mt-2 w-1.5 h-1.5"
              style={{ background: Y }}
              title={`${messages.length} messages`}
            />
          )}
        </div>
      )}

      {/* ══ MOBILE: floating button + overlay ════════════════════════════ */}

      {/* Toggle button */}
      <button
        onClick={() => setMobileOpen(o => !o)}
        className="md:hidden fixed right-4 z-[48] flex items-center gap-2 px-4 h-[42px] transition-all"
        style={{
          bottom: "72px",
          background: mobileOpen ? "var(--b-bg)" : Y,
          border: `1px solid ${mobileOpen ? "var(--b-border)" : Y}`,
          color: mobileOpen ? "var(--b-text-muted)" : BK,
          boxShadow: mobileOpen ? "none" : "0 4px 16px rgba(0,0,0,0.18)",
        }}
        onMouseEnter={e => { if (!mobileOpen) (e.currentTarget as HTMLElement).style.background = YH; }}
        onMouseLeave={e => { if (!mobileOpen) (e.currentTarget as HTMLElement).style.background = Y; }}
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        <span className="text-[12.5px] font-semibold">{mobileOpen ? "Close" : "Ask AI"}</span>
      </button>

      {/* Mobile chat panel */}
      <div
        className="md:hidden fixed right-4 z-[48] flex flex-col"
        style={{
          bottom: "120px",
          width: "min(380px, calc(100vw - 32px))",
          maxHeight: "min(520px, calc(100dvh - 180px))",
          background: "var(--b-bg)",
          border: "1px solid var(--b-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          opacity: mobileOpen ? 1 : 0,
          transform: mobileOpen ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 180ms ease, transform 180ms ease",
          transformOrigin: "bottom right",
        }}
      >
        {/* Mobile header */}
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 border-b flex-shrink-0"
          style={{ background: Y, borderColor: "var(--b-border)" }}
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: BK }} />
          <div className="flex-1">
            <div className="text-[13px] font-bold" style={{ color: BK }}>Briesa AI</div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} className="w-7 h-7 flex items-center justify-center opacity-70">
              <RotateCcw className="w-3.5 h-3.5" style={{ color: BK }} />
            </button>
          )}
        </div>

        {/* Mobile messages */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 min-h-0">
          <ChatBody />
        </div>

        {/* Mobile input */}
        <InputRow ref={mobileInputRef} />

        <div className="px-3 pb-2 text-[10px] text-center" style={{ color: "var(--b-text-muted)" }}>
          Guidance only — verify with current legislation.
        </div>
      </div>
    </>
  );
}
