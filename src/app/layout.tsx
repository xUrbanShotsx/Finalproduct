import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Briesa — WHS Management Platform",
  description: "AI-powered Work Health & Safety software for Australian industries",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
