"use client";

import { X, Plus, ArrowLeft } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  step: number;
  totalSteps: number;
  stepLabels: string[];
  onStepChange: (n: number) => void;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}

/**
 * Full-page record form. Renders as a full-screen overlay with a centred
 * content column so there's room to capture detailed information — replaces the
 * old narrow side panel. API is unchanged so every existing form works as-is.
 */
export function Drawer({
  open, onClose, title, step, totalSteps, stepLabels,
  onStepChange, children, onBack, onNext, onSubmit,
  submitLabel = "Submit",
}: DrawerProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: "var(--b-bg-canvas)",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(10px)",
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 200ms ease, transform 200ms ease",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14 border-b flex-shrink-0" style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}>
        <button onClick={onClose} aria-label="Close" className="b-icon-btn w-9 h-9 flex items-center justify-center -ml-2">
          <X className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold truncate" style={{ color: "var(--b-text)" }}>{title}</div>
          {totalSteps > 1 && (
            <div className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>Step {step} of {totalSteps} · {stepLabels[step - 1]}</div>
          )}
        </div>
      </div>

      {/* Step tabs */}
      {totalSteps > 1 && (
        <div className="border-b flex-shrink-0 overflow-x-auto" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
          <div className="mx-auto max-w-[760px] flex">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <button
                  key={n}
                  className="flex-1 min-w-[120px] py-3 text-center text-[12px] font-semibold cursor-pointer transition-colors"
                  style={{
                    color: active ? "var(--b-accent-text)" : done ? "var(--b-text-secondary)" : "var(--b-text-muted)",
                    borderBottom: active ? "2px solid var(--b-accent-text)" : "2px solid transparent",
                    background: active ? "var(--b-accent-bg)" : "transparent",
                  }}
                  onClick={() => onStepChange(n)}
                >
                  {n}. {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-5 sm:px-8 py-7 pb-28">{children}</div>
      </div>

      {/* Footer */}
      <div className="border-t flex-shrink-0" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
        <div className="mx-auto max-w-[760px] px-5 sm:px-8 py-3.5 flex items-center justify-between gap-3">
          <button onClick={onBack} className="b-btn-ghost flex items-center gap-1.5 px-4 h-[40px] text-[13px] font-medium">
            {step === 1 ? "Cancel" : <><ArrowLeft className="w-3.5 h-3.5" /> Back</>}
          </button>
          {step < totalSteps ? (
            <button onClick={onNext} className="b-btn-accent flex items-center gap-1.5 px-6 h-[40px] text-[13px] font-semibold">
              Next →
            </button>
          ) : (
            <button onClick={onSubmit} className="b-btn-accent flex items-center gap-1.5 px-6 h-[40px] text-[13px] font-semibold">
              <Plus className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
