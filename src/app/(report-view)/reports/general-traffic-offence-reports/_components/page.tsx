"use client";

import React, { use, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useGetTrafficOffenceById } from "@/features/generalTraficOffence/hooks";
import MilitaryPoliceReport from "@/components/reports/MilitaryPoliceReport";
import { mapToReportProps } from "@/app/(report-view)/reports/general-traffic-offence-reports/_components/ReportsPage";

export default function PrintGeneralTrafficOffencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useGetTrafficOffenceById(id);

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-red-500">
        Report not found
      </div>
    );
  }

  const reportProps = mapToReportProps(data);

  return (
    <div id="print-container" className="min-h-screen bg-white p-0">
      <div id="report-content">
        <MilitaryPoliceReport {...reportProps} />
      </div>
    </div>
  );
}
