import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; 
import Providers from './provider';
import Navbar from '@/components/ui/Navbar';
import HydrationManager from '@/components/HydrationManager';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | NotesApp',
    default: 'NotesApp - Your Personal Notebook', 
  },
  description: 'A modern, full-stack notes taking application built with Next.js and FastAPI.',
  keywords: ['Notes', 'Next.js', 'FastAPI', 'React', 'Productivity'],
  openGraph: {
    title: 'NotesApp',
    description: 'Your personal notebook in the cloud.',
    type: 'website',
    siteName: 'NotesApp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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