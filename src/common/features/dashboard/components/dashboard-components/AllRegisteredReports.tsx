"use client";

import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import ReportsCard from "@/common/component/cards/ReportsCard";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";
import { useGetStaticSpeedRecords } from "@/features/staticSpeed/hooks";
import { useGetAllMPReports } from "@/features/mpReports/hooks";
import { useRouter } from "next/navigation";
import ReportPageHeader from "@/components/common/ReportPageHeader";

export default function AllRegisteredReports({
  onNoVehicleReports,
  onVehicleReports,
  onStaticSpeed,
  onMPReports,
}: {
  onNoVehicleReports: () => void;
  onVehicleReports: () => void;
  onStaticSpeed: () => void;
  onMPReports: () => void;
}) {
  const { data: trafficData, isLoading: trafficLoading } =
    useGetAllTrafficOffences({ groupBy: "offenceType" });

  const { data: speedData, isLoading: speedLoading } =
    useGetStaticSpeedRecords();

  const { data: mpData, isLoading: mpLoading } = useGetAllMPReports();

  const counts = useMemo(() => {
    let trafficVehicle = 0;
    let trafficNoVehicle = 0;

    if (trafficData) {
      trafficData.forEach((group: any) => {
        const offences = group.offences || [];
        trafficVehicle += offences.filter((o: any) => o.isVehicleInvolved).length;
        trafficNoVehicle += offences.filter((o: any) => !o.isVehicleInvolved).length;
      });
    }

    return {
      trafficVehicle,
      trafficNoVehicle,
      staticSpeed: speedData?.length || 0,
      mpOccurrence: mpData?.length || 0,
    };
  }, [trafficData, speedData, mpData]);

  const isLoading = trafficLoading || speedLoading || mpLoading;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          All Registered Reports
        </h2>
        <p className="text-sm text-gray-500">
          Reports & Analysis › All Registered Reports
        </p>
      </div>
      {/* Header / Breadcrumb substitute */}
      <ReportPageHeader
        title="All Registered Reports"
        breadcrumbItems={[{ label: "Reports & Analysis", href: "/" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ReportsCard
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none">  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.59 16.59L11 11L7.41 14.59L6 13.17L11 8.17L18 15.17L16.59 16.59Z" fill="#4F46E5"/></svg>}
          title="General & Traffic Offence Reports - No Vehicle Involved"
          count={counts.trafficNoVehicle}
          onClick={onNoVehicleReports}
        />

        <ReportsCard
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none">  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.59 16.59L11 11L7.41 14.59L6 13.17L11 8.17L18 15.17L16.59 16.59Z" fill="#4F46E5"/></svg>}
          title="General & Traffic Offence Reports - Vehicle Involved"
          count={counts.trafficVehicle}
          onClick={onVehicleReports}
        />

        <ReportsCard
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none">  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.59 16.59L11 11L7.41 14.59L6 13.17L11 8.17L18 15.17L16.59 16.59Z" fill="#4F46E5"/></svg>}   
          title="Static Speed Check Reports"
          count={counts.staticSpeed}
          onClick={onStaticSpeed}
        />

        <ReportsCard
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none">  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.59 16.59L11 11L7.41 14.59L6 13.17L11 8.17L18 15.17L16.59 16.59Z" fill="#4F46E5"/></svg>}
          title="MP Occurrence & Investigation Reports"
          count={counts.mpOccurrence}
          onClick={onMPReports}
        />
      </div>
    </div>
  );
}
