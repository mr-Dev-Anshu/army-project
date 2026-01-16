"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/common/features/dashboard/components/dashboard-components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isPrint = pathname.startsWith("/print");

    if (isPrint) {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen overflow-hidden bg-[#f5f5f7]">
                <Sidebar />

                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 sm:p-6 md:p-8">{children}</div>
                    </div>
                </main>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </SidebarProvider>
    );
}
