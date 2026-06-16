"use client";

import { useState } from "react";
import { SlidersHorizontal, Bell, Shield, Puzzle, Globe, Moon, ChevronDown, Copy, RefreshCw, Eye, EyeOff } from "lucide-react";

type TabKey = "general" | "notifications" | "security" | "integrations";

const TABS: { key: TabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: "general",       label: "General",       icon: SlidersHorizontal },
  { key: "notifications", label: "Notifications", icon: Bell   },
  { key: "security",      label: "Security",      icon: Shield },
  { key: "integrations",  label: "Integrations",  icon: Puzzle },
];

function Toggle({ value, onChange, label, sub }: { value: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b" style={{ borderColor: "var(--b-border)" }}>
      <div>
        <div className="text-[13px] font-medium" style={{ color: "var(--b-text)" }}>{label}</div>
        {sub && <div className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{sub}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-10 h-5.5 flex-shrink-0 transition-colors"
        style={{ background: value ? "var(--b-accent-text)" : "var(--b-bg-active)", padding: "2px", borderRadius: "9999px" }}
      >
        <span
          className="block w-4 h-4 transition-transform"
          style={{
            background: "#ffffff",
            transform: value ? "translateX(18px)" : "translateX(0px)",
            borderRadius: "9999px",
          }}
        />
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border mb-5" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--b-border)" }}>
        <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{title}</span>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

const INTEGRATIONS = [
  { name: "Xero",         logo: "X",  desc: "Sync payroll and workforce data",       connected: true,  color: "#1ab4d7" },
  { name: "SafeWork NSW", logo: "SW", desc: "Push notifiable incidents automatically",connected: false, color: "#c0392b" },
  { name: "Microsoft 365",logo: "MS", desc: "Sign in with Microsoft, sync Teams",    connected: true,  color: "#0078d4" },
  { name: "Procore",      logo: "P",  desc: "Sync project & subcontractor data",     connected: false, color: "#ff6b35" },
  { name: "Zapier",       logo: "Z",  desc: "Connect to 5,000+ apps via webhooks",   connected: false, color: "#ff4a00" },
  { name: "Slack",        logo: "S",  desc: "Get safety alerts in Slack channels",   connected: false, color: "#4a154b" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>("general");

  // General
  const [timezone,    setTimezone]    = useState("Australia/Sydney");
  const [dateFormat,  setDateFormat]  = useState("DD/MM/YYYY");
  const [theme,       setTheme]       = useState("System");
  const [language,    setLanguage]    = useState("English (AU)");

  // Notifications
  const [emailIncidents,  setEmailIncidents]  = useState(true);
  const [emailActions,    setEmailActions]    = useState(true);
  const [emailExpiry,     setEmailExpiry]     = useState(true);
  const [emailDigest,     setEmailDigest]     = useState(false);
  const [pushIncidents,   setPushIncidents]   = useState(true);
  const [pushActions,     setPushActions]     = useState(false);
  const [smsUrgent,       setSmsUrgent]       = useState(false);

  // Security
  const [twoFactor,       setTwoFactor]       = useState(true);
  const [sessionTimeout,  setSessionTimeout]  = useState("8 hours");
  const [showApiKey,      setShowApiKey]      = useState(false);
  const API_KEY = "brs_live_sk_k9m2xL3pQvR7nJhD8cY4wZ6aE1uF0tG5";

  const fieldCls = "w-full h-[36px] px-3 text-[13px] border outline-none transition-colors focus:border-[var(--b-accent-text)]";
  const fieldStyle = { background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" };

  return (
    <div className="p-8 max-w-[1100px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Settings</h1>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Manage your workspace preferences, notifications, security and integrations.</p>
      </div>

      <div className="flex gap-6">
        {/* Tab nav */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-px">
            {TABS.map(t => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium text-left transition-colors"
                  style={{
                    background: active ? "var(--b-bg-active)" : "transparent",
                    color: active ? "var(--b-text)" : "var(--b-text-muted)",
                    borderLeft: active ? "2px solid var(--b-accent-text)" : "2px solid transparent",
                  }}
                >
                  <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">

          {/* GENERAL */}
          {tab === "general" && (
            <div>
              <Section title="Display">
                <div className="py-3.5 border-b grid grid-cols-2 gap-x-6 gap-y-4" style={{ borderColor: "var(--b-border)" }}>
                  {[
                    { label: "Language",     value: language,    setter: setLanguage,    options: ["English (AU)", "English (UK)", "English (US)"] },
                    { label: "Timezone",     value: timezone,    setter: setTimezone,    options: ["Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth"] },
                    { label: "Date Format",  value: dateFormat,  setter: setDateFormat,  options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] },
                    { label: "Theme",        value: theme,       setter: setTheme,       options: ["System", "Light", "Dark"] },
                  ].map(({ label, value, setter, options }) => (
                    <div key={label}>
                      <div className="text-[10.5px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--b-text-muted)" }}>{label}</div>
                      <div className="relative">
                        <select
                          value={value} onChange={e => setter(e.target.value)}
                          className="w-full h-[36px] pl-3 pr-8 text-[13px] border outline-none appearance-none"
                          style={fieldStyle}
                        >
                          {options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--b-text-muted)" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="py-4">
                  <button className="px-4 h-[34px] text-[12.5px] font-medium border" style={{ background: "var(--b-accent-bg)", borderColor: "var(--b-accent-border)", color: "var(--b-accent-text)" }}>
                    Save preferences
                  </button>
                </div>
              </Section>

              <Section title="Danger Zone">
                <div className="py-4 space-y-4">
                  {[
                    { label: "Export all data",        sub: "Download a full export of your organisation's data as CSV.", cta: "Export data",         danger: false },
                    { label: "Reset WHS configuration", sub: "Reset all module settings to factory defaults. Records are not deleted.", cta: "Reset config",   danger: false },
                    { label: "Wipe all records",       sub: "Permanently delete all records. This cannot be undone.", cta: "Wipe records",       danger: true  },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-medium" style={{ color: item.danger ? "#f06060" : "var(--b-text)" }}>{item.label}</div>
                        <div className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{item.sub}</div>
                      </div>
                      <button className="flex-shrink-0 ml-6 px-4 h-[32px] text-[12px] font-medium border" style={{ borderColor: item.danger ? "#f06060" : "var(--b-border-strong)", color: item.danger ? "#f06060" : "var(--b-text-secondary)", background: "transparent" }}>
                        {item.cta}
                      </button>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === "notifications" && (
            <div>
              <Section title="Email Notifications">
                <Toggle value={emailIncidents} onChange={setEmailIncidents} label="Incident reported" sub="Get emailed when a new incident is submitted on your sites." />
                <Toggle value={emailActions}   onChange={setEmailActions}   label="Action assigned to you" sub="Receive an email when a corrective action is assigned to you." />
                <Toggle value={emailExpiry}    onChange={setEmailExpiry}    label="Licence & certificate expiry" sub="30-day and 7-day alerts before worker licences expire." />
                <Toggle value={emailDigest}    onChange={setEmailDigest}    label="Weekly digest" sub="A summary of site activity, overdue items and AI insights every Monday." />
              </Section>

              <Section title="Push Notifications">
                <Toggle value={pushIncidents} onChange={setPushIncidents} label="High-severity incidents" sub="Immediate push notification for High and Critical incidents." />
                <Toggle value={pushActions}   onChange={setPushActions}   label="Overdue actions" sub="Daily push when you have actions past their due date." />
                <div className="py-4">
                  <span className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>Push notifications require the Briesa mobile app.</span>
                </div>
              </Section>

              <Section title="SMS Alerts">
                <Toggle value={smsUrgent} onChange={setSmsUrgent} label="Urgent safety alerts" sub="SMS for notifiable incidents and critical risk control failures. Standard rates apply." />
                <div className="py-3.5">
                  <div className="text-[10.5px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--b-text-muted)" }}>Mobile number for SMS</div>
                  <input className={fieldCls} style={fieldStyle} placeholder="+61 4XX XXX XXX" />
                </div>
              </Section>
            </div>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <div>
              <Section title="Authentication">
                <Toggle value={twoFactor} onChange={setTwoFactor} label="Two-factor authentication" sub="Require 2FA for all members. Currently using authenticator app." />
                <div className="py-3.5 border-b" style={{ borderColor: "var(--b-border)" }}>
                  <div className="text-[10.5px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--b-text-muted)" }}>Session Timeout</div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-44">
                      <select
                        value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                        className="w-full h-[36px] pl-3 pr-8 text-[13px] border outline-none appearance-none"
                        style={fieldStyle}
                      >
                        {["1 hour", "4 hours", "8 hours", "24 hours", "7 days"].map(o => <option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--b-text-muted)" }} />
                    </div>
                    <span className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>Automatically sign out after period of inactivity</span>
                  </div>
                </div>
                <div className="py-3.5">
                  <button className="text-[12.5px] font-medium" style={{ color: "#f06060" }}>
                    Sign out all devices
                  </button>
                </div>
              </Section>

              <Section title="API Keys">
                <div className="py-4 border-b" style={{ borderColor: "var(--b-border)" }}>
                  <div className="text-[12.5px] mb-3" style={{ color: "var(--b-text-muted)" }}>
                    Use API keys to integrate Briesa with your own systems. Keep these secret — treat them like passwords.
                  </div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--b-text-muted)" }}>Production API Key</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center border h-[36px] px-3" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)" }}>
                      <span className="text-[12px] font-mono flex-1" style={{ color: "var(--b-text-secondary)" }}>
                        {showApiKey ? API_KEY : API_KEY.replace(/./g, "•").slice(0, 40)}
                      </span>
                    </div>
                    <button onClick={() => setShowApiKey(v => !v)} className="w-9 h-9 flex items-center justify-center border" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}>
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => navigator.clipboard?.writeText(API_KEY)} className="w-9 h-9 flex items-center justify-center border" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}>
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center border" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}>
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11.5px] mt-2" style={{ color: "var(--b-text-muted)" }}>Last used: 14 Jun 2024, 09:22 AM · Created: 1 Jan 2024</p>
                </div>
                <div className="py-4">
                  <button className="text-[12.5px]" style={{ color: "var(--b-accent-text)" }}>+ Generate new API key</button>
                </div>
              </Section>

              <Section title="Active Sessions">
                {[
                  { device: "MacBook Pro 16in",   browser: "Chrome 125",   location: "Sydney, NSW",   time: "Now",        current: true  },
                  { device: "iPhone 15 Pro",      browser: "Briesa App",   location: "Sydney, NSW",   time: "3 hrs ago",  current: false },
                  { device: "Windows Desktop",    browser: "Edge 124",     location: "Parramatta, NSW",time: "Yesterday",  current: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 border-b last:border-b-0" style={{ borderColor: "var(--b-border)" }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium" style={{ color: "var(--b-text)" }}>{s.device}</span>
                        {s.current && <span className="text-[9px] font-bold px-1.5 py-0.5" style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>THIS SESSION</span>}
                      </div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{s.browser} · {s.location} · {s.time}</div>
                    </div>
                    {!s.current && (
                      <button className="text-[12px]" style={{ color: "#f06060" }}>Revoke</button>
                    )}
                  </div>
                ))}
              </Section>
            </div>
          )}

          {/* INTEGRATIONS */}
          {tab === "integrations" && (
            <div>
              <div className="border mb-5 p-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Puzzle className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
                  <span className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>Integrations</span>
                </div>
                <p className="text-[12.5px]" style={{ color: "var(--b-text-muted)" }}>
                  Connect Briesa to your existing tools. Changes made in connected apps can sync back automatically.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {INTEGRATIONS.map(int => (
                  <div key={int.name} className="border p-4 flex items-start gap-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
                    <div className="w-10 h-10 flex items-center justify-center text-[14px] font-bold flex-shrink-0" style={{ background: int.color, color: "#ffffff" }}>
                      {int.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{int.name}</span>
                        {int.connected
                          ? <span className="text-[10px] font-bold px-1.5 py-0.5" style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>CONNECTED</span>
                          : <span className="text-[10px] font-bold px-1.5 py-0.5" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>NOT CONNECTED</span>
                        }
                      </div>
                      <p className="text-[12px] mb-3" style={{ color: "var(--b-text-muted)" }}>{int.desc}</p>
                      <button
                        className="px-3 h-[28px] text-[11.5px] font-medium border transition-colors"
                        style={{
                          borderColor: int.connected ? "#f06060" : "var(--b-border-strong)",
                          color: int.connected ? "#f06060" : "var(--b-text-secondary)",
                          background: "transparent",
                        }}
                      >
                        {int.connected ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border mt-4 px-5 py-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Custom webhooks</div>
                    <div className="text-[12.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Send real-time events to your own endpoints when records are created or updated.</div>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 h-[32px] text-[12px] font-medium border" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text-secondary)" }}>
                    <Globe className="w-3.5 h-3.5" /> Manage webhooks
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
