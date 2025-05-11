import React from 'react';
import './styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Grid Command Center',
  description: 'Dashboard for grid operators to monitor and mitigate feeder overloads',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
} 