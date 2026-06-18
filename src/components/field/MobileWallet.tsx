"use client";

import { useRouter } from "next/navigation";
import { useField } from "./store";
import { WalletView } from "./views/WalletView";

export function MobileWallet() {
  const router = useRouter();
  const f = useField();
  return <WalletView f={f} back={() => router.push("/dashboard")} />;
}
