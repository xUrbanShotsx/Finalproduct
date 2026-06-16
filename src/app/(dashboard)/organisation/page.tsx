"use client";

import { useState } from "react";
import {
  Building2, MapPin, Phone, Mail, Globe, ChevronRight,
  CheckCircle2, AlertTriangle, Pencil, Plus, Trash2,
} from "lucide-react";

const SITES = [
  { id: "SITE-01", name: "Site 01 — Parramatta Tower",   type: "Construction",   address: "12 Church St, Parramatta NSW 2150", workers: 47, status: "Active"   },
  { id: "SITE-02", name: "Site 02 — Surry Hills Reno",   type: "Fitout",         address: "88 Crown St, Surry Hills NSW 2010",  workers: 12, status: "Active"   },
  { id: "SITE-03", name: "Site 03 — Ryde Warehouse",     type: "Industrial",     address: "4 Blaxland Rd, Ryde NSW 2112",       workers: 9,  status: "Active"   },
  { id: "SITE-04", name: "Site 04 — Chatswood Office",   type: "Facilities",     address: "799 Pacific Hwy, Chatswood NSW 2067",workers: 6,  status: "Inactive" },
];

const CERT_ITEMS = [
  { label: "ISO 45001:2018 — OHS Management",       status: "Active",   expiry: "30 Sep 2025" },
  { label: "SafeWork NSW Builder's Licence",         status: "Active",   expiry: "01 Mar 2026" },
  { label: "Construction Contractor Insurance",      status: "Expiring", expiry: "10 Jul 2024" },
  { label: "Public Liability — $20M",               status: "Active",   expiry: "14 Nov 2025" },
];

export default function OrganisationPage() {
  const [editing, setEditing] = useState(false);
  const [orgName,    setOrgName]    = useState("Demo Organisation");
  const [abn,        setAbn]        = useState("51 824 753 556");
  const [industry,   setIndustry]   = useState("Construction");
  const [phone,      setPhone]      = useState("+61 2 9000 1234");
  const [email,      setEmail]      = useState("safety@demoorg.com.au");
  const [website,    setWebsite]    = useState("www.demoorg.com.au");
  const [address,    setAddress]    = useState("Level 5, 1 Farrer Pl, Sydney NSW 2000");

  const fieldCls = "w-full px-3 h-[36px] text-[13px] border outline-none transition-colors focus:border-[var(--b-accent-text)]";
  const fieldStyle = { background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" };
  const readStyle  = { color: "var(--b-text-secondary)", fontSize: "13px" };

  return (
    <div className="p-8 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Organisation</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Manage your organisation profile, sites and certifications.</p>
        </div>
        <button
          onClick={() => setEditing(e => !e)}
          className="flex items-center gap-2 px-4 h-[34px] border text-[12.5px] font-medium transition-colors"
          style={{ background: editing ? "var(--b-accent-bg)" : "var(--b-bg-secondary)", borderColor: editing ? "var(--b-accent-border)" : "var(--b-border-strong)", color: editing ? "var(--b-accent-text)" : "var(--b-text-secondary)" }}
        >
          <Pencil className="w-3.5 h-3.5" />
          {editing ? "Save changes" : "Edit profile"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT — profile */}
        <div className="col-span-2 space-y-6">

          {/* Profile card */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--b-border)" }}>
              <Building2 className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
              <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Organisation Profile</span>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: "Organisation Name", value: orgName, setter: setOrgName },
                { label: "ABN",               value: abn,     setter: setAbn     },
                { label: "Primary Industry",  value: industry, setter: setIndustry },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <div className="text-[10.5px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--b-text-muted)" }}>{label}</div>
                  {editing
                    ? <input className={fieldCls} style={fieldStyle} value={value} onChange={e => setter(e.target.value)} />
                    : <div style={readStyle}>{value}</div>
                  }
                </div>
              ))}
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--b-text-muted)" }}>Plan</div>
                <span className="text-[11px] font-bold px-2 py-0.5" style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>PRO</span>
              </div>
            </div>
          </div>

          {/* Contact card */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--b-border)" }}>
              <Phone className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
              <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Contact Details</span>
            </div>
            <div className="px-5 py-4 space-y-4">
              {[
                { label: "Address",  value: address,  setter: setAddress,  icon: MapPin },
                { label: "Phone",    value: phone,    setter: setPhone,    icon: Phone  },
                { label: "Email",    value: email,    setter: setEmail,    icon: Mail   },
                { label: "Website",  value: website,  setter: setWebsite,  icon: Globe  },
              ].map(({ label, value, setter, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10.5px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--b-text-muted)" }}>{label}</div>
                    {editing
                      ? <input className={fieldCls} style={fieldStyle} value={value} onChange={e => setter(e.target.value)} />
                      : <div style={readStyle}>{value}</div>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sites */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--b-border)" }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
                <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Sites & Locations</span>
              </div>
              <button className="flex items-center gap-1.5 px-3 h-[28px] text-[11.5px] font-medium border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text-secondary)" }}>
                <Plus className="w-3 h-3" /> Add Site
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--b-border)" }}>
              {SITES.map(site => (
                <div key={site.id} className="px-5 py-3.5 flex items-center gap-4 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>{site.name}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5" style={{
                        background: site.status === "Active" ? "var(--b-badge-green-bg)" : "var(--b-bg-active)",
                        color: site.status === "Active" ? "var(--b-badge-green-text)" : "var(--b-text-muted)",
                      }}>{site.status}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                      <span>{site.address}</span>
                      <span>·</span>
                      <span>{site.type}</span>
                      <span>·</span>
                      <span>{site.workers} workers</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1.5 transition-opacity" style={{ color: "var(--b-text-muted)" }}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="border" style={{ borderColor: "#f06060", background: "rgba(240,96,96,0.03)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "#f0606030" }}>
              <span className="text-[13px] font-semibold" style={{ color: "#f06060" }}>Danger Zone</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium" style={{ color: "var(--b-text)" }}>Delete organisation</div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Permanently delete this organisation and all of its data. This action cannot be undone.</div>
              </div>
              <button className="flex items-center gap-1.5 px-4 h-[34px] border text-[12.5px] font-medium flex-shrink-0 ml-6" style={{ borderColor: "#f06060", color: "#f06060", background: "transparent" }}>
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — sidebar info */}
        <div className="space-y-5">

          {/* Stats */}
          {[
            { label: "Active Sites",    value: "3", sub: "1 inactive" },
            { label: "Total Workers",   value: "74", sub: "across all sites" },
            { label: "Modules Active",  value: "6", sub: "of 9 available" },
          ].map(stat => (
            <div key={stat.label} className="border p-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
              <div className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--b-text-muted)" }}>{stat.label}</div>
              <div className="text-[28px] font-bold leading-none" style={{ color: "var(--b-text)" }}>{stat.value}</div>
              <div className="text-[12px] mt-1" style={{ color: "var(--b-text-muted)" }}>{stat.sub}</div>
            </div>
          ))}

          {/* Certs */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[12px] font-semibold" style={{ color: "var(--b-text)" }}>Certifications</span>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--b-border)" }}>
              {CERT_ITEMS.map(c => (
                <div key={c.label} className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    {c.status === "Active"
                      ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--b-badge-green-text)" }} />
                      : <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--b-badge-yellow-text)" }} />}
                    <div>
                      <div className="text-[12px] font-medium leading-snug" style={{ color: "var(--b-text)" }}>{c.label}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: c.status === "Expiring" ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)" }}>
                        {c.status === "Expiring" ? "⚠ Expires" : "Expires"} {c.expiry}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
