import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DynamicBreadcrumbs from '@/common/component/DynamicBreadCrumb';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Awesome app with breadcrumbs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Breadcrumb Bar */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <DynamicBreadcrumbs />
          </div>
        </div>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}