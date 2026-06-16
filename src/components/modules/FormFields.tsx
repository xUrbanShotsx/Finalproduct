"use client";

import { ChevronDown } from "lucide-react";

const fieldBase: React.CSSProperties = {
  background: "var(--b-bg)",
  borderColor: "var(--b-border-strong)",
  color: "var(--b-text)",
};

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[11px] font-semibold uppercase tracking-widest mb-1.5"
      style={{ color: "var(--b-text-muted)" }}
    >
      {children}
    </label>
  );
}

export function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b pb-5 mb-5" style={{ borderColor: "var(--b-border)" }}>
      {children}
    </div>
  );
}

export function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[36px] pl-3 pr-8 text-[12.5px] border outline-none appearance-none cursor-pointer transition-colors focus:border-[var(--b-accent-text)]"
        style={{ ...fieldBase, color: value ? "var(--b-text)" : "var(--b-text-placeholder)" }}
      >
        <option value="" disabled style={{ color: "var(--b-text-muted)", background: "var(--b-bg-secondary)" }}>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} style={{ color: "var(--b-text)", background: "var(--b-bg-secondary)" }}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--b-text-muted)" }}
      />
    </div>
  );
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[36px] px-3 text-[12.5px] border outline-none appearance-none transition-colors focus:border-[var(--b-accent-text)]"
      style={fieldBase}
    />
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 text-[12.5px] border outline-none appearance-none resize-none transition-colors focus:border-[var(--b-accent-text)]"
      style={fieldBase}
    />
  );
}

export function OptionGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex">
      {options.map((opt, i) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="flex-1 h-[36px] text-[12.5px] transition-colors"
            style={{
              background: active ? "var(--b-accent-bg)" : "var(--b-bg)",
              color: active ? "var(--b-accent-text)" : "var(--b-text-muted)",
              border: "1px solid",
              borderColor: active ? "var(--b-accent-border)" : "var(--b-border-strong)",
              marginLeft: i === 0 ? 0 : -1,
              fontWeight: active ? 600 : 400,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* Convenience row for two fields side-by-side */
export function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-3">{children}</div>;
}

export function Col({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 min-w-0">{children}</div>;
}
