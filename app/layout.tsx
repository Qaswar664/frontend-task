// src/app/layout.tsx
import type { Metadata } from "next";
import Providers from "../lib/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "MERN Challenge Frontend",
  description: "Frontend for MERN stack challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
