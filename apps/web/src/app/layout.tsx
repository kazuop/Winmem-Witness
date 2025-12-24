import "../styles/globals.css";
import React from "react";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const brand = process.env.NEXT_PUBLIC_WINMEM_BRAND ?? "Winmem";
  return (
    <html lang="en">
      <body><div className="win-desktop" aria-label={`${brand} desktop`}>{children}</div></body>
    </html>
  );
}
