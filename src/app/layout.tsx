import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShiftBoard — ניהול משמרות חכם",
  description: "מערכת ניהול משמרות למילואים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
