import type { Metadata } from "next";

import "./globals.css";
import { Navbar } from "@/shared/components";

export const metadata: Metadata = {
  title: "Title",
  description: "Your Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {/* Gradient overlay */}
        <div className="fixed inset-0 -z-10 bg-linear-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23]" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
