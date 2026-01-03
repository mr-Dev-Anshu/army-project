import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FormProvider } from "@/context/FormContext";
import Wrapper from "@/common/hoc/Wrapper";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Awesome app with breadcrumbs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>

        {/* Main Content */}
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
