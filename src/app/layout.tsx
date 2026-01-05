import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FormProvider } from "@/context/FormContext";
import Wrapper from "@/common/hoc/Wrapper";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/common/features/dashboard/components/dashboard-components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Awesome app with breadcrumbs",
};

// app/layout.tsx
import { SidebarProvider } from "@/context/SidebarContext";
// ... other imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#f5f5f7]`} suppressHydrationWarning>
        <FormProvider>
          <Wrapper>
            <SidebarProvider>          
              <div className="flex h-screen overflow-hidden">
                <Sidebar />

                <main className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 md:p-8">
                      {children}
                    </div>
                  </div>
                </main>
              </div>

              <ToastContainer /* ... */ />
            </SidebarProvider>
          </Wrapper>
        </FormProvider>
      </body>
    </html>
  );
}