"use client";

import { X, Plus } from "lucide-react";

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

export function Drawer({
  open, onClose, title, step, totalSteps, stepLabels,
  onStepChange, children, onBack, onNext, onSubmit,
  submitLabel = "Submit",
}: DrawerProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.55)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 z-50 h-full flex flex-col transition-transform duration-300"
        style={{
          width: "33.333%",
          background: "var(--b-bg-secondary)",
          borderLeft: "1px solid var(--b-border)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b"
          style={{ borderColor: "var(--b-border)" }}
        >
          <div>
            <div className="text-[15px] font-semibold" style={{ color: "var(--b-text)" }}>{title}</div>
            <div className="text-[11.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
              Step {step} of {totalSteps}
            </div>
          </div>
          <button onClick={onClose} className="b-icon-btn w-8 h-8 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step tabs */}
        {totalSteps > 1 && (
          <div className="flex flex-shrink-0" style={{ borderBottom: "1px solid var(--b-border)" }}>
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              return (
                <div
                  key={n}
                  className="flex-1 py-2.5 text-center text-[11px] font-semibold cursor-pointer transition-colors"
                  style={{
                    color: active ? "var(--b-accent-text)" : "var(--b-text-muted)",
                    borderBottom: active ? "2px solid var(--b-accent-text)" : "2px solid transparent",
                    background: active ? "var(--b-accent-bg)" : "transparent",
                  }}
                  onClick={() => onStepChange(n)}
                >
                  {n}. {label}
                </div>
              );
            })}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-t"
          style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}
        >
          <button onClick={onBack} className="b-btn-ghost px-4 h-[34px] text-[12.5px] font-medium">
            {step === 1 ? "Cancel" : "← Back"}
          </button>
          {step < totalSteps ? (
            <button
              onClick={onNext}
              className="b-btn-accent flex items-center gap-1.5 px-5 h-[34px] text-[12.5px] font-medium"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="b-btn-accent flex items-center gap-1.5 px-5 h-[34px] text-[12.5px] font-medium"
            >
              <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
