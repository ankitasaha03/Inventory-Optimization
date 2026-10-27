import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { InventoryProvider } from '@/context/InventoryContext';
import { ToastContainer } from '@/components/ui/toast';
import { AssistantDrawer } from '@/components/chat/AssistantDrawer';
import { ExecuteActionModal } from '@/components/dashboard/ExecuteActionModal';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StockIQ AI — Retail Inventory Intelligence & Stockout Prevention',
  description:
    'AI-powered inventory intelligence system for retailers facing stockouts on high-demand items and excess inventory on slow-moving products.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}
      >
        <InventoryProvider>
          <div className="flex h-screen w-full overflow-hidden">
            {/* Enterprise Sidebar */}
            <Sidebar />

            {/* Main Application Area */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>

          {/* Global Slide-over Drawer, Action Modal & Toasts */}
          <AssistantDrawer />
          <ExecuteActionModal />
          <ToastContainer />
        </InventoryProvider>
      </body>
    </html>
  );
}
