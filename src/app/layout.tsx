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
        {/* Breadcrumb Bar */}
        {/* <div className="border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <DynamicBreadcrumbs />
            </div>
          </div> */}

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
