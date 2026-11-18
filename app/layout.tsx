import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Operations Dashboard",
  description: "GitHub + Supabase + Vercel Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
