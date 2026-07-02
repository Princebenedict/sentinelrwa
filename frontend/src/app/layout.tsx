import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";

export const metadata: Metadata = {
  title: "SentinelRWA - AI-Powered Asset Intelligence",
  description: "Real-World Asset monitoring and insurance powered by GenLayer Intelligent Contracts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a12] text-slate-200 antialiased">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
