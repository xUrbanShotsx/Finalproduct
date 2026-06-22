"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Sparkles, X, Send, RotateCcw, ChevronDown,
} from "lucide-react";
import type { Industry } from "@/config/modules";

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

// ── Page-specific suggested prompts ───────────────────────────────────────

const SUGGESTIONS: Record<string, string[]> = {
  "/dashboard":                 [
    "Explain my compliance score",
    "What should I focus on today?",
    "How does Briesa calculate TRIFR?",
  ],
  "/safety/incidents":          [
    "Walk me through an ICAM investigation",
    "What makes an incident notifiable under the WHS Act?",
    "How does TapRooT work with ICAM?",
  ],
  "/safety/actions":            [
    "What's the difference between Immediate, Systemic and Preventive actions?",
    "How do I prioritise corrective actions?",
    "What ICAM factor should this action address?",
  ],
  "/safety/swms":               [
    "When is a SWMS legally required?",
    "What must a SWMS include under the WHS Regulations?",
    "How often should SWMS be reviewed?",
  ],
  "/safety/permits-to-work":    [
    "What work types require a Permit to Work?",
    "What are my PCBU duties for high-risk work?",
    "How long should PTW records be kept?",
  ],
  "/safety/loto":               [
    "What are the LOTO requirements under the WHS Regulations?",
    "Who can remove a LOTO lock?",
    "What plant requires isolation procedures?",
  ],
  "/compliance":                [
    "How is the compliance score calculated?",
    "What triggers a notifiable incident investigation?",
    "What records must I keep under the WHS Act?",
  ],
  "/training":                  [
    "What competency records am I required to keep?",
    "What training is mandatory for high-risk work?",
    "How do I verify contractor competencies?",
  ],
  "/risk":                      [
    "What is the hierarchy of controls?",
    "How do I assess a risk under Australian standards?",
    "When should a risk be escalated?",
  ],
  "/people/inductions":         [
    "What must a site induction cover?",
    "Are induction records legally required?",
    "How often should inductions be refreshed?",
  ],
};

const DEFAULT_SUGGESTIONS = [
  "What are my PCBU duties under the WHS Act?",
  "How do I navigate to incidents?",
  "Explain the ICAM methodology",
];

// ── Bubble component ───────────────────────────────────────────────────────

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div
          className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2"
          style={{ background: "var(--b-accent-bg)", border: "1px solid var(--b-accent-border)" }}
        >
          <Sparkles className="w-3 h-3" style={{ color: "var(--b-accent-text)" }} />
        </div>
      )}
      <div
        className="max-w-[84%] px-3 py-2.5 text-[12.5px] leading-relaxed whitespace-pre-wrap"
        style={
          isUser
            ? {
                background: "var(--b-accent-bg)",
                color: "var(--b-accent-text)",
                border: "1px solid var(--b-accent-border)",
              }
            : {
                background: "var(--b-bg-secondary)",
                color: "var(--b-text)",
                border: "1px solid var(--b-border)",
              }
        }
      >
        {msg.content}
        {msg.streaming && (
          <span
            className="inline-block ml-0.5 w-1.5 h-3.5 align-middle animate-pulse"
            style={{ background: "var(--b-accent-text)" }}
          />
        )}
      </div>
    </div>
  );
}

// ── Main widget ────────────────────────────────────────────────────────────

export function AiChatWidget({ industry }: { industry: Industry }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = SUGGESTIONS[pathname] ?? DEFAULT_SUGGESTIONS;

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

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

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId ? { ...m, content: accumulated, streaming: true } : m
          )
        );
      }

      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, content: accumulated, streaming: false } : m
        )
      );
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: "Sorry — something went wrong. Please try again.", streaming: false }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }, [messages, pathname, industry, loading]);

  function clearChat() {
    setMessages([]);
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* ── Floating chat panel ── */}
      <div
        className="fixed right-4 sm:right-6 z-[48] flex flex-col"
        style={{
          bottom: "112px",
          width: "min(380px, calc(100vw - 32px))",
          maxHeight: "min(520px, calc(100dvh - 160px))",
          background: "var(--b-bg)",
          border: "1px solid var(--b-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 180ms ease, transform 180ms ease",
          transformOrigin: "bottom right",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 border-b flex-shrink-0"
          style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
        >
          <div
            className="w-6 h-6 flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--b-accent-bg)", border: "1px solid var(--b-accent-border)" }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Briesa AI</div>
            <div className="text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>
              WHS expert · platform guide
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="b-icon-btn w-7 h-7 flex items-center justify-center"
                title="Clear chat"
              >
                <RotateCcw className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="b-icon-btn w-7 h-7 flex items-center justify-center"
              title="Close"
            >
              <ChevronDown className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 min-h-0">
          {messages.length === 0 ? (
            <div>
              {/* Welcome message */}
              <div className="mb-4 pb-4 border-b" style={{ borderColor: "var(--b-border)" }}>
                <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--b-text-muted)" }}>
                  Ask me anything about WHS legislation, platform navigation, ICAM investigations, or what you can see on this page.
                </p>
              </div>
              {/* Suggested prompts */}
              <div className="space-y-2">
                <div
                  className="text-[10.5px] font-semibold uppercase tracking-widest mb-2.5"
                  style={{ color: "var(--b-text-muted)" }}
                >
                  Suggested
                </div>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="w-full text-left px-3 py-2.5 text-[12.5px] border transition-colors"
                    style={{
                      background: "var(--b-bg-secondary)",
                      borderColor: "var(--b-border)",
                      color: "var(--b-text)",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)"}
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
          )}
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-2 px-3 py-3 border-t flex-shrink-0"
          style={{ borderColor: "var(--b-border)" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about WHS, navigation, or this page…"
            disabled={loading}
            className="flex-1 h-[36px] px-3 text-[12.5px] border outline-none transition-colors disabled:opacity-60"
            style={{
              background: "var(--b-bg)",
              borderColor: "var(--b-border-strong)",
              color: "var(--b-text)",
            }}
            onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--b-accent-text)"}
            onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--b-border-strong)"}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-[36px] h-[36px] flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40"
            style={{
              background: "var(--b-accent-bg)",
              border: "1px solid var(--b-accent-border)",
              color: "var(--b-accent-text)",
            }}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Disclaimer */}
        <div
          className="px-4 pb-2.5 text-[10.5px] text-center"
          style={{ color: "var(--b-text-muted)" }}
        >
          AI responses are guidance only — always verify with current legislation.
        </div>
      </div>

      {/* ── Floating toggle button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed right-4 sm:right-6 z-[48] flex items-center gap-2 px-4 h-[42px] transition-all"
        style={{
          bottom: "72px",
          background: open ? "var(--b-bg)" : "var(--b-accent-bg)",
          border: `1px solid ${open ? "var(--b-border)" : "var(--b-accent-border)"}`,
          color: open ? "var(--b-text-muted)" : "var(--b-accent-text)",
          boxShadow: open ? "none" : "0 4px 16px rgba(0,0,0,0.14)",
        }}
        onMouseEnter={e => {
          if (!open) (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)";
        }}
        onMouseLeave={e => {
          if (!open) (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)";
        }}
      >
        {open ? (
          <X className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span className="text-[12.5px] font-semibold">
          {open ? "Close" : "Ask AI"}
        </span>
        {messages.length > 0 && !open && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: "var(--b-accent-text)" }}
          />
        )}
      </button>
    </>
  );
}
