import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShiftBoard — Smart Shift Scheduling",
  description: "Mobile-first shift scheduling for reserve duty teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
