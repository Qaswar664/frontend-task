// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '../lib/Providers';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MERN Challenge Frontend',
  description: 'Frontend for MERN stack challenge',
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