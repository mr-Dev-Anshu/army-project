import type { Metadata } from "next";
import "./globals.css";
import { FormProvider } from "@/context/FormContext";
import { AuthProvider } from "@/context/AuthContext";
import Wrapper from "@/common/hoc/Wrapper";
import ClientLayout from "@/components/layout/ClientLayout";
import { ValidationProvider } from "@/context/ValidationContext";

export const metadata: Metadata = {
  title: "Provost | 21 Corps",
  description: "Provost | 21 Corps Central Command",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
     
        
      <body className={" font-inter h-full bg-[#f5f5f7] overflow-hidden"} suppressHydrationWarning>
        <AuthProvider>
        <ValidationProvider>
          <FormProvider>
            <Wrapper>
              <ClientLayout>
                {children}
              </ClientLayout>
            </Wrapper>
          </FormProvider>
        </ValidationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}