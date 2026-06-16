"use client";

import { useState } from "react";
import { Plus, User, Mail, Shield, Clock, CheckCircle2, XCircle, ChevronDown, Trash2, MoreHorizontal } from "lucide-react";

type Role = "Owner" | "Admin" | "Safety Manager" | "Worker" | "Viewer";
type MemberStatus = "Active" | "Invited" | "Suspended";

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  lastActive: string;
  joinedDate: string;
  sites: string[];
}

const MEMBERS: Member[] = [
  { id: "m1", name: "Jordan Smith",    email: "j.smith@demoorg.com.au",    role: "Owner",          status: "Active",    lastActive: "Just now",    joinedDate: "Jan 2023",  sites: ["All sites"]             },
  { id: "m2", name: "Morgan Jones",    email: "m.jones@demoorg.com.au",    role: "Safety Manager", status: "Active",    lastActive: "2 hrs ago",   joinedDate: "Mar 2023",  sites: ["Site 01", "Site 02"]    },
  { id: "m3", name: "Kim Davis",       email: "k.davis@demoorg.com.au",    role: "Admin",          status: "Active",    lastActive: "Yesterday",   joinedDate: "Jun 2023",  sites: ["All sites"]             },
  { id: "m4", name: "Lee Brown",       email: "l.brown@demoorg.com.au",    role: "Worker",         status: "Active",    lastActive: "3 days ago",  joinedDate: "Aug 2023",  sites: ["Site 01"]               },
  { id: "m5", name: "Taylor Walsh",    email: "t.walsh@demoorg.com.au",    role: "Worker",         status: "Active",    lastActive: "1 week ago",  joinedDate: "Sep 2023",  sites: ["Site 02", "Site 03"]    },
  { id: "m6", name: "Alex Chen",       email: "a.chen@demoorg.com.au",     role: "Worker",         status: "Active",    lastActive: "1 week ago",  joinedDate: "Oct 2023",  sites: ["Site 01"]               },
  { id: "m7", name: "Riley Patel",     email: "r.patel@demoorg.com.au",    role: "Viewer",         status: "Suspended", lastActive: "1 month ago", joinedDate: "Nov 2023",  sites: ["Site 03"]               },
  { id: "m8", name: "Sam Nguyen",      email: "s.nguyen@demoorg.com.au",   role: "Safety Manager", status: "Invited",   lastActive: "—",           joinedDate: "—",         sites: ["Site 01", "Site 04"]    },
  { id: "m9", name: "Casey Williams",  email: "c.williams@contractor.com", role: "Worker",         status: "Invited",   lastActive: "—",           joinedDate: "—",         sites: ["Site 02"]               },
];

const ROLE_STYLE: Record<Role, { bg: string; color: string }> = {
  "Owner":          { bg: "rgba(180,80,200,0.1)",    color: "#b450c8" },
  "Admin":          { bg: "var(--b-badge-blue-bg)",  color: "var(--b-badge-blue-text)" },
  "Safety Manager": { bg: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" },
  "Worker":         { bg: "var(--b-bg-active)",      color: "var(--b-text-secondary)" },
  "Viewer":         { bg: "var(--b-bg-secondary)",   color: "var(--b-text-muted)" },
};

const ROLE_PERMISSIONS: Record<Role, string> = {
  "Owner":          "Full access — billing, members, all data",
  "Admin":          "Manage members, all modules, no billing",
  "Safety Manager": "Create & edit safety records, assign actions",
  "Worker":         "Report incidents, run pre-ops, sign SWMS",
  "Viewer":         "Read-only access to assigned modules",
};

const STATUS_STYLE: Record<MemberStatus, { bg: string; color: string; label: string }> = {
  "Active":    { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)", label: "Active" },
  "Invited":   { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)", label: "Invited" },
  "Suspended": { bg: "rgba(240,96,96,0.1)",      color: "#f06060", label: "Suspended" },
};

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole,  setInviteRole]  = useState<Role>("Worker");
  const [openMenu,    setOpenMenu]    = useState<string | null>(null);

  const activeMembers  = MEMBERS.filter(m => m.status === "Active").length;
  const invited        = MEMBERS.filter(m => m.status === "Invited").length;
  const suspended      = MEMBERS.filter(m => m.status === "Suspended").length;

  return (
    <div className="p-8 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Team</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Manage team members, roles and site access.</p>
        </div>
        <button
          onClick={() => setShowInvite(v => !v)}
          className="flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium border transition-colors"
          style={{ background: "var(--b-accent-bg)", borderColor: "var(--b-accent-border)", color: "var(--b-accent-text)" }}
        >
          <Plus className="w-3.5 h-3.5" /> Invite Member
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="border mb-6 p-5" style={{ borderColor: "var(--b-accent-border)", background: "var(--b-accent-bg)" }}>
          <div className="text-[13px] font-semibold mb-4" style={{ color: "var(--b-text)" }}>Invite a new team member</div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="text-[10.5px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--b-text-muted)" }}>Email address</div>
              <input
                value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                placeholder="worker@company.com.au"
                className="w-full h-[36px] px-3 text-[13px] border outline-none focus:border-[var(--b-accent-text)]"
                style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
              />
            </div>
            <div className="w-44">
              <div className="text-[10.5px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--b-text-muted)" }}>Role</div>
              <div className="relative">
                <select
                  value={inviteRole} onChange={e => setInviteRole(e.target.value as Role)}
                  className="w-full h-[36px] pl-3 pr-8 text-[13px] border outline-none appearance-none"
                  style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                >
                  {(["Worker","Viewer","Safety Manager","Admin"] as Role[]).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--b-text-muted)" }} />
              </div>
            </div>
            <button
              onClick={() => { setShowInvite(false); setInviteEmail(""); }}
              className="h-[36px] px-5 text-[12.5px] font-medium border"
              style={{ background: "var(--b-accent-bg)", borderColor: "var(--b-accent-border)", color: "var(--b-accent-text)" }}
            >
              Send invite
            </button>
            <button onClick={() => setShowInvite(false)} className="h-[36px] px-4 text-[12.5px] border" style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>
              Cancel
            </button>
          </div>
          {inviteRole && (
            <p className="text-[11.5px] mt-2" style={{ color: "var(--b-text-muted)" }}>
              {ROLE_PERMISSIONS[inviteRole]}
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        {[
          { label: "Active Members",    value: `${activeMembers}`, highlight: "green"  },
          { label: "Pending Invites",   value: `${invited}`,       highlight: "yellow" },
          { label: "Suspended",         value: `${suspended}`,     highlight: suspended > 0 ? "red" : "" },
          { label: "Plan Seats Used",   value: "9 / 25",           highlight: "" },
        ].map(s => (
          <div key={s.label} className="flex-1 border p-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
            <div className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--b-text-muted)" }}>{s.label}</div>
            <div className="text-[26px] font-bold leading-none" style={{ color: s.highlight === "green" ? "var(--b-badge-green-text)" : s.highlight === "yellow" ? "var(--b-badge-yellow-text)" : s.highlight === "red" ? "#f06060" : "var(--b-text)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Roles legend */}
      <div className="border mb-6" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
        <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--b-border)" }}>
          <Shield className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
          <span className="text-[12px] font-semibold" style={{ color: "var(--b-text)" }}>Role permissions</span>
        </div>
        <div className="flex divide-x" style={{ borderColor: "var(--b-border)" }}>
          {(Object.entries(ROLE_PERMISSIONS) as [Role, string][]).map(([role, perm]) => {
            const s = ROLE_STYLE[role];
            return (
              <div key={role} className="flex-1 px-4 py-3">
                <span className="text-[10px] font-bold px-1.5 py-0.5" style={{ background: s.bg, color: s.color }}>{role.toUpperCase()}</span>
                <p className="text-[11.5px] mt-1.5 leading-snug" style={{ color: "var(--b-text-muted)" }}>{perm}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Members table */}
      <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
        {/* Column headers */}
        <div className="flex items-center px-5 py-2.5 border-b" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
          {["Member", "Role", "Status", "Last Active", "Sites", ""].map((h, i) => (
            <div key={i} className={`text-[10px] font-semibold uppercase tracking-widest ${i === 0 ? "flex-1" : i === 5 ? "w-10" : "w-32"}`} style={{ color: "var(--b-text-muted)" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {MEMBERS.map(m => {
          const rs = ROLE_STYLE[m.role];
          const ss = STATUS_STYLE[m.status];
          return (
            <div
              key={m.id}
              className="flex items-center px-5 py-3 border-b group transition-colors"
              style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--b-bg-hover)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--b-bg)"}
            >
              {/* Member */}
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 flex items-center justify-center text-[13px] font-semibold flex-shrink-0 border" style={{ background: "var(--b-bg-active)", borderColor: "var(--b-border)", color: "var(--b-text-secondary)" }}>
                  {m.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>{m.name}</div>
                  <div className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{m.email}</div>
                </div>
              </div>

              {/* Role */}
              <div className="w-32">
                <span className="text-[10.5px] font-bold px-1.5 py-0.5" style={{ background: rs.bg, color: rs.color }}>{m.role.toUpperCase()}</span>
              </div>

              {/* Status */}
              <div className="w-32">
                <span className="flex items-center gap-1.5 text-[11.5px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: ss.color }} />
                  <span style={{ color: ss.color }}>{ss.label}</span>
                </span>
              </div>

              {/* Last active */}
              <div className="w-32 flex items-center gap-1.5" style={{ color: "var(--b-text-muted)" }}>
                <Clock className="w-3 h-3" />
                <span className="text-[11.5px]">{m.lastActive}</span>
              </div>

              {/* Sites */}
              <div className="w-32 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                {m.sites.join(", ")}
              </div>

              {/* Actions */}
              <div className="w-10 flex items-center justify-end">
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                    className="w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--b-text-muted)" }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {openMenu === m.id && (
                    <div className="absolute right-0 top-8 z-10 border w-36 py-1" style={{ background: "var(--b-bg)", borderColor: "var(--b-border)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
                      {["Change role", "Change sites", m.status === "Suspended" ? "Reactivate" : "Suspend", "Remove"].map((action, i) => (
                        <button
                          key={action}
                          onClick={() => setOpenMenu(null)}
                          className="w-full text-left px-3 py-2 text-[12.5px] transition-colors"
                          style={{ color: i === 3 ? "#f06060" : "var(--b-text-secondary)" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--b-bg-hover)"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
