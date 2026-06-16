"use client";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface AiButtonProps {
  prompt: string;
  onStream: (chunk: string) => void;
  onDone?: () => void;
  disabled?: boolean;
  label?: string;
}

export function AiButton({ prompt, onStream, onDone, disabled, label = "Generate with AI" }: AiButtonProps) {
  const [loading, setLoading] = useState(false);

  async function run() {
    if (loading || disabled) return;
    setLoading(true);
    onStream("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok || !res.body) throw new Error("Request failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onStream(decoder.decode(value, { stream: true }));
      }
    } catch {
      onStream("Error generating content. Please try again.");
    } finally {
      setLoading(false);
      onDone?.();
    }
  }

  return (
    <button
      type="button"
      onClick={run}
      disabled={loading || disabled}
      className="flex items-center gap-1.5 px-2.5 h-[28px] text-[11.5px] font-[500] border transition-colors flex-shrink-0 disabled:opacity-40"
      style={{
        background: loading ? "var(--b-accent-bg)" : "var(--b-accent-bg)",
        borderColor: "var(--b-accent-border)",
        color: "var(--b-accent-text)",
      }}
      onMouseEnter={(e) => {
        if (!loading && !disabled) (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)";
      }}
    >
      {loading
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : <Sparkles className="w-3 h-3" />}
      {loading ? "Generating…" : label}
    </button>
  );
}
