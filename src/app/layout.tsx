import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FormProvider } from "@/context/FormContext";
import { AuthProvider } from "@/context/AuthContext";
import Wrapper from "@/common/hoc/Wrapper";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Awesome app with breadcrumbs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#f5f5f7] overflow-hidden`} suppressHydrationWarning>
        <AuthProvider>
          <FormProvider>
            <Wrapper>
              <ClientLayout>
                {children}
              </ClientLayout>
            </Wrapper>
          </FormProvider>
        </AuthProvider>
      </body>
    </html>
  );
}