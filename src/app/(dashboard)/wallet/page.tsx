import { MobileWallet } from "@/components/field/MobileWallet";
import { Smartphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default function WalletPage() {
  return (
    <>
      <div className="md:hidden">
        <MobileWallet />
      </div>
      <div className="hidden md:flex flex-col items-center justify-center text-center" style={{ minHeight: "60vh" }}>
        <Smartphone className="w-8 h-8 mb-3" style={{ color: "var(--b-text-muted)" }} />
        <h1 className="text-[18px] font-semibold" style={{ color: "var(--b-text)" }}>My Wallet is designed for mobile</h1>
        <p className="text-[13px] mt-1 max-w-[360px]" style={{ color: "var(--b-text-muted)" }}>
          Your digital worker profile, licence wallet and site-pass QR are built for the phone in your pocket. Open Briesa on a mobile device to use them.
        </p>
      </div>
    </>
  );
}
