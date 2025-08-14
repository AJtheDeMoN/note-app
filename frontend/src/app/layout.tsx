// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // <-- Add this import
import Providers from './provider';
import Navbar from '@/components/ui/Navbar';
import HydrationManager from '@/components/HydrationManager';
// We no longer need GlobalStyles, so you can remove this import
// import GlobalStyles from '@/components/GlobalStyles'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notes App',
  description: 'A simple notes taking app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* The GlobalStyles component is no longer needed here */}
      <body className={inter.className}>
        <HydrationManager />
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}