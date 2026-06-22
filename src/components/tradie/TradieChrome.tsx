"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, ClipboardList, Shield, BadgeCheck, Bot,
  SlidersHorizontal, CreditCard, LogOut,
  Plus, Search, Bell, HelpCircle, Sun, Moon, Menu,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Nav definition ──────────────────────────────────────────────── */
const MAIN_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/tradie",           label: "Dashboard",    icon: LayoutDashboard },
  { href: "/tradie/jobs",      label: "Job Log",      icon: ClipboardList   },
  { href: "/tradie/safety",    label: "Safety",       icon: Shield          },
  { href: "/tradie/licences",  label: "My Licences",  icon: BadgeCheck      },
  { href: "/tradie/assistant", label: "AI Assistant", icon: Bot             },
];

const ACCOUNT_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/tradie/settings", label: "Settings", icon: SlidersHorizontal },
  { href: "/tradie/settings", label: "Billing",  icon: CreditCard        },
];

/* ── Briesa logo SVG ─────────────────────────────────────────────── */
function BLogo() {
  return (
    <svg viewBox="0 0 400 425" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "var(--b-text)", flexShrink: 0 }}>
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill="currentColor"/>
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill="currentColor"/>
    </svg>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────── */
function TradieSidebar({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname();

  const navItem = (href: string, exact = false) => {
    const isActive = exact ? pathname === href : (href === "/tradie" ? pathname === "/tradie" : pathname.startsWith(href));
    return cn(
      "flex items-center gap-2.5 px-2.5 py-[7px] text-[12.5px] font-[450] transition-colors select-none",
      isActive
        ? "bg-[var(--b-bg-active)] text-[var(--b-text)]"
        : "text-[var(--b-text-tertiary)] hover:bg-[var(--b-bg-hover)] hover:text-[var(--b-text-secondary)]"
    );
  };

  return (
    <aside
      className="flex flex-col w-[214px] min-h-full border-r flex-shrink-0"
      style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}
    >
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-px">
        {/* Main nav */}
        {MAIN_NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={navItem(href)}>
            <Icon className="w-[15px] h-[15px] flex-shrink-0" />
            {label}
          </Link>
        ))}

        {/* Account section */}
        <div className="pt-4 pb-1 px-2.5">
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", color: "var(--b-text-muted)", textTransform: "uppercase" }}>
            Account
          </span>
        </div>

        {ACCOUNT_NAV.map(({ href, label, icon: Icon }) => (
          <Link key={label} href={href} className={navItem(href, label === "Settings")}>
            <Icon className="w-[15px] h-[15px] flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-3 py-2.5 border-t"
        style={{ borderColor: "var(--b-border)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-6 h-6 flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
            style={{ background: "var(--b-bg-active)", color: "var(--b-text-secondary)" }}
          >
            J
          </div>
          <span className="text-[12px] truncate" style={{ color: "var(--b-text-tertiary)" }}>Jye</span>
        </div>
        <button
          onClick={onSignOut}
          title="Sign out"
          className="p-1.5 transition-colors"
          style={{ color: "var(--b-text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--b-text-tertiary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--b-text-muted)")}
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}

/* ── TopBar ──────────────────────────────────────────────────────── */
function TradieTopBar({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const subSegment = segments[1];
  const subLabel = subSegment
    ? subSegment.charAt(0).toUpperCase() + subSegment.slice(1).replace(/-/g, " ")
    : null;

  return (
    <header
      className="flex items-center h-12 px-4 border-b flex-shrink-0 gap-2 overflow-hidden"
      style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center text-[11.4px] font-[500] min-w-0">
        <div className="flex items-center gap-2.5">
          <BLogo />
          <div className="w-px h-4 flex-shrink-0" style={{ background: "var(--b-border-strong)" }} />
          <span className="text-[11.4px] font-[500]" style={{ color: "var(--b-text)" }}>Jye</span>
          <span
            className="text-[9px] font-[600] tracking-[0.05em] px-1.5 py-0.5"
            style={{ background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" }}
          >
            TRADIE
          </span>
        </div>

        {subLabel && (
          <span className="hidden md:flex items-center">
            <div className="w-px h-4 flex-shrink-0 mx-1.5" style={{ background: "var(--b-border-strong)" }} />
            <span className="text-[11.4px] font-[500]" style={{ color: "var(--b-text)" }}>{subLabel}</span>
          </span>
        )}
      </div>

      {/* + New */}
      <button
        className="hidden md:flex items-center gap-1.5 ml-2 px-3 h-[30px] border text-[11.4px] font-[500] transition-colors flex-shrink-0"
        style={{ background: "var(--b-accent-bg)", borderColor: "var(--b-accent-border)", color: "var(--b-text)" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)"; }}
      >
        <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
        New
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 px-3 h-[30px] border text-[11.4px] cursor-pointer w-44 transition-colors"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text-placeholder)" }}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1">Search…</span>
          <kbd className="text-[10px] px-1.5 h-[18px] border flex items-center font-[500]" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>⌘K</kbd>
        </div>

        {[HelpCircle, Bell].map((Icon, i) => (
          <button
            key={i}
            className="hidden md:flex w-8 h-8 items-center justify-center transition-colors"
            style={{ color: "var(--b-text-muted)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-tertiary)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-muted)")}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex w-8 h-8 items-center justify-center border transition-colors"
          style={{
            background: isDark ? "var(--b-badge-yellow-bg)" : "var(--b-bg-secondary)",
            borderColor: isDark ? "var(--b-badge-yellow-text)" : "var(--b-border-strong)",
            color: isDark ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)",
          }}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* User */}
        <button
          className="flex items-center gap-2 px-2 h-[30px] border ml-1 text-[11.4px] font-[500] transition-colors"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text-secondary)" }}
        >
          <div className="w-5 h-5 flex items-center justify-center text-[10px] font-semibold flex-shrink-0" style={{ background: "var(--b-bg-active)", color: "var(--b-text-secondary)" }}>
            J
          </div>
          <span className="hidden sm:block">Jye</span>
        </button>
      </div>
    </header>
  );
}

/* ── Chrome wrapper ──────────────────────────────────────────────── */
interface Props { children: React.ReactNode; }

export function TradieChrome({ children }: Props) {
  const router  = useRouter();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const saved = localStorage.getItem("b-theme");
    if (saved === "light") { document.documentElement.classList.remove("dark"); setIsDark(false); }
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("b-theme", next ? "dark" : "light");
  }

  function signOut() {
    document.cookie = "b-demo-plan=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--b-bg-canvas)" }}>
      {/* Topbar */}
      <div className="flex-shrink-0">
        <TradieTopBar isDark={isDark} onToggleTheme={toggleTheme} />
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <TradieSidebar onSignOut={signOut} />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="flex-shrink-0 h-full shadow-2xl">
              <TradieSidebar onSignOut={signOut} />
            </div>
            <div className="flex-1" onClick={() => setMobileOpen(false)} style={{ background: "rgba(0,0,0,0.5)" }} />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-auto" style={{ background: "var(--b-bg-canvas)" }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t"
        style={{ background: "var(--b-bg)", borderColor: "var(--b-border)", height: "60px", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {MAIN_NAV.slice(0, 4).map(({ href, label, icon: Icon }) => {
          const isActive = href === "/tradie" ? pathname === "/tradie" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1"
              style={{ color: isActive ? "var(--b-accent-text)" : "var(--b-text-muted)" }}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1"
          style={{ color: "var(--b-text-muted)" }}
        >
          <Menu className="w-[18px] h-[18px]" />
          <span className="text-[10px] font-medium leading-none">More</span>
        </button>
      </nav>
    </div>
  );
}
