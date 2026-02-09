import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from './components/Navbar';
import ToastProvider from './components/ToastProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Product Manager',
  description: 'Full-stack CRUD application with Next.js and Express',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-(family-name:--font-geist-sans) antialiased text-gray-900 dark:text-gray-100 min-h-screen`}>
        <AuthProvider>
          <ToastProvider />
          <Navbar />
          <main className="pb-12">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
