import type { Metadata } from 'next';
import './globals.css';
import { FormProvider } from '@/context/FormContext';
import Wrapper from '@/common/hoc/Wrapper';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Army Project',
  description: 'Army Project - Desktop Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-sans">
        <Wrapper>
          <FormProvider>
            <main className="min-h-screen bg-gray-50">
              {children}
              <ToastContainer position="top-right" autoClose={3000} />
            </main>
          </FormProvider>
        </Wrapper>
      </body>
    </html>
  );
}
