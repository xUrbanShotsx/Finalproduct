"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, ClipboardList, Shield, BadgeCheck,
  Bot, Settings, LogOut, Menu, X, Sun, Moon, Zap,
} from "lucide-react";

const YELLOW = "#ffd600";

const NAV = [
  { href: "/tradie",           label: "Home",         icon: LayoutDashboard },
  { href: "/tradie/jobs",      label: "Job Log",      icon: ClipboardList   },
  { href: "/tradie/safety",    label: "Safety",       icon: Shield          },
  { href: "/tradie/licences",  label: "Licences",     icon: BadgeCheck      },
  { href: "/tradie/assistant", label: "AI Assistant", icon: Bot             },
];

function BLogo({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill="currentColor"/>
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill="currentColor"/>
    </svg>
  );
}

interface Props { children: React.ReactNode; }

export function TradieChrome({ children }: Props) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [isDark, setIsDark]     = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  function logout() {
    document.cookie = "b-demo-plan=; path=/; max-age=0";
    router.push("/login");
  }

  const isActive = (href: string) =>
    href === "/tradie" ? pathname === "/tradie" : pathname.startsWith(href);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={mobile ? "flex flex-col h-full" : "hidden md:flex flex-col h-full w-56 flex-shrink-0 border-r"}
      style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-12 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
        <BLogo size={20} />
        <div>
          <span className="text-[13px] font-[700] tracking-tight" style={{ color: "var(--b-text)" }}>Briesa</span>
          <span className="ml-1.5 text-[9px] font-[700] tracking-[0.08em] px-1 py-px uppercase" style={{ background: `rgba(255,214,0,0.15)`, color: YELLOW }}>Tradie</span>
        </div>
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto p-1" style={{ color: "var(--b-text-muted)" }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User pill */}
      <div className="mx-3 mt-3 mb-1 px-3 py-2.5 border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center text-[11px] font-[700] flex-shrink-0" style={{ background: `rgba(255,214,0,0.15)`, color: YELLOW }}>
            J
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-[600] truncate" style={{ color: "var(--b-text)" }}>Jake Sullivan</p>
            <p className="text-[10.5px] truncate" style={{ color: "var(--b-text-muted)" }}>Licensed Plumber</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <Zap className="w-3 h-3" style={{ color: YELLOW }} />
          <div className="flex-1 h-1.5 overflow-hidden" style={{ background: "var(--b-bg-active)" }}>
            <div className="h-full" style={{ width: "34%", background: YELLOW }} />
          </div>
          <span className="text-[9.5px] font-[600]" style={{ color: "var(--b-text-muted)" }}>34/100 AI</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-[500] transition-colors"
              style={{
                background:  active ? "var(--b-bg-active)" : "transparent",
                color:       active ? "var(--b-text)" : "var(--b-text-tertiary)",
                borderLeft:  active ? `2px solid ${YELLOW}` : "2px solid transparent",
              }}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: active ? YELLOW : undefined }} />
              {label}
              {label === "AI Assistant" && (
                <span className="ml-auto text-[9.5px] font-[700] px-1.5 py-px" style={{ background: "rgba(255,214,0,0.12)", color: YELLOW }}>AI</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 py-2 border-t space-y-0.5" style={{ borderColor: "var(--b-border)" }}>
        <Link
          href="/tradie/settings"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-[500] transition-colors"
          style={{ color: "var(--b-text-tertiary)" }}
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
        </Link>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-[500] transition-colors"
          style={{ color: "var(--b-text-tertiary)" }}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-[500] transition-colors"
          style={{ color: "var(--b-text-tertiary)" }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--b-bg)" }}>
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-64 h-full shadow-2xl" style={{ background: "var(--b-bg)" }}>
            <Sidebar mobile />
          </div>
          <div className="flex-1" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center h-12 px-4 border-b flex-shrink-0 gap-3" style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}>
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-1" style={{ color: "var(--b-text-muted)" }}>
            <Menu className="w-4 h-4" />
          </button>

          {/* Page title from path */}
          <span className="text-[12px] font-[600]" style={{ color: "var(--b-text-muted)" }}>
            {NAV.find(n => isActive(n.href))?.label ?? "Settings"}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-[600] px-2.5 h-[28px] border" style={{ borderColor: `rgba(255,214,0,0.25)`, color: YELLOW, background: "rgba(255,214,0,0.06)" }}>
              <Zap className="w-3 h-3" />
              Tradie Plan · $69/mo
            </span>
            <div className="w-7 h-7 flex items-center justify-center text-[11px] font-[700]" style={{ background: `rgba(255,214,0,0.15)`, color: YELLOW }}>
              J
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
