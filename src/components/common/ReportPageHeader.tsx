import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, PanelLeft } from "lucide-react";
import Link from "next/link";

export type BreadcrumbItem = string | { label: string; href?: string };

interface ReportPageHeaderProps {
  title: string;
  reportCount?: number;
  onDownload?: () => void;
  breadcrumbItems?: BreadcrumbItem[];
}

export default function ReportPageHeader({
  title,
  reportCount,
  onDownload,
  breadcrumbItems = [
    { label: "Reports & Analysis", href: "/" },
    { label: "All Reports", href: "/" },
  ],
}: ReportPageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-300 px-4 py-3 flex items-center justify-between mb-7">
      <div className="flex items-center gap-4 text-sm text-[#0A0A0A]">
        <button
          className="text-[#0A0A0A] hover:text-gray-700 focus:outline-none"
          onClick={() => console.log("Sidebar toggle clicked")}
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="h-4 w-[1px] bg-gray-200"></div>
        <div className="flex items-center gap-2">
          {breadcrumbItems.map((item, index) => {
            const label = typeof item === "string" ? item : item.label;
            const href = typeof item === "object" ? item.href : undefined;

            return (
              <React.Fragment key={index}>
                {href ? (
                  <Link
                    href={href}
                    className="hover:text-gray-900 text-[#0A0A0A] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                ) : (
                  <span className="hover:text-gray-900 text-[#0A0A0A] cursor-default transition-colors duration-200">
                    {label}
                  </span>
                )}
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                  <path d="M0.75 8.75L4.75 4.75L0.75 0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

              </React.Fragment>
            );
          })}
          <span className="font-semibold text-[#0A0A0A]">{title}</span>
        </div>
      </div>
      {onDownload && (
        <Button
          className="bg-[#0A0A0A] text-white hover:bg-gray-800 gap-2 h-9 px-4 text-xs font-medium"
          onClick={onDownload}
        >
          Download & Print Report
          <Printer className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}
