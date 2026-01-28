import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FormProvider } from "@/context/FormContext";
import Wrapper from "@/common/hoc/Wrapper";
import ClientLayout from "@/components/layout/ClientLayout";
import { ValidationProvider } from "@/context/ValidationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Provost | 21 Corps",
  description: "Provost | 21 Corps Central Command",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#f5f5f7] overflow-hidden`} suppressHydrationWarning>
        <ValidationProvider>
          <FormProvider>
            <Wrapper>
              <ClientLayout>
                {children}
              </ClientLayout>
            </Wrapper>
          </FormProvider>
        </ValidationProvider>
      </body>
    </html>
  );
}