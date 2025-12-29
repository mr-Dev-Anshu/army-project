import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface ReportPageHeaderProps {
  title: string;
  reportCount: number;
  onDownload?: () => void;
  breadcrumbItems?: string[];
}

export default function ReportPageHeader({
  title,
  reportCount,
  onDownload,
  breadcrumbItems = ["Reports & Analysis", "All Reports"],
}: ReportPageHeaderProps) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <span>{item}</span>
            <span className="mx-2">›</span>
          </React.Fragment>
        ))}
        <span className="font-semibold text-gray-900">{title}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold">{reportCount} Reports</span>
          {/* <Button
            variant="outline"
            className="bg-black text-white hover:bg-gray-800 hover:text-white cursor-pointer border-none gap-2"
            onClick={onDownload}
          >
            Download & Print Report
            <Printer className="w-4 h-4" />
          </Button> */}
        </div>
      </div>
    </>
  );
}
