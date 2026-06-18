import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const YELLOW = "#ffd600";

function BLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill="#fff" />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill="#fff" />
    </svg>
  );
}

const POSTS = [
  { tag: "Product", date: "June 2026", title: "Briesa launches — the all-in-one WHS platform", excerpt: "After a year of building and testing alongside Australian operators, Briesa is live: incidents, SWMS, permits, training and AI-generated ISO blueprints in one place." },
  { tag: "Feature", date: "June 2026", title: "AI Blueprints: certification-ready ISO packs", excerpt: "Generate audit-ready ISO 9001, 14001 and 45001 document packs tailored to your organisation — pre-filled from your live Briesa data." },
  { tag: "Field", date: "May 2026", title: "The mobile field app: safety in your pocket", excerpt: "Digital worker wallet, gate sign-on, photo inspections, permit sign-off and emergency tools — built for the phone on site." },
];

export default function NewsroomPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Space Grotesk', sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <BLogo size={20} />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>Briesa</span>
          </Link>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#555", textDecoration: "none" }}>
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "72px 24px 80px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333" }}>[NEWSROOM]</span>
          <span style={{ fontSize: "11px", color: "#222" }}>//</span>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: YELLOW }}>What&apos;s new at Briesa</span>
        </div>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.05, margin: "0 0 12px" }}>Newsroom</h1>
        <p style={{ fontSize: "16px", color: "#666", margin: "0 0 44px", maxWidth: "520px", lineHeight: 1.6 }}>
          Product releases, new features and announcements as we build the safety platform Australian teams deserve.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {POSTS.map((p) => (
            <div key={p.title} style={{ border: "1px solid #1a1a1a", background: "#0f0f0f", padding: "22px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", background: "rgba(255,214,0,0.1)", color: YELLOW }}>{p.tag}</span>
                <span style={{ fontSize: "12px", color: "#555" }}>{p.date}</span>
              </div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{p.title}</h2>
              <p style={{ fontSize: "14px", lineHeight: 1.65, color: "#777", margin: 0 }}>{p.excerpt}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px", textAlign: "center", padding: "32px", border: "1px dashed #222" }}>
          <p style={{ fontSize: "13.5px", color: "#666", margin: "0 0 16px" }}>More stories coming soon — want to be the first to hear?</p>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", background: YELLOW, textDecoration: "none" }}>
            Get in touch <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
