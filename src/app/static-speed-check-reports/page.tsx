"use client";

import React, { useMemo, useState } from "react";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import StaticSpeedTable from "./_components/StaticSpeedTable";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import { useGetStaticSpeedRecords } from "@/features/staticSpeed/hooks";

export default function StaticSpeedCheckReportsPage() {
  const { data, isLoading, isError } = useGetStaticSpeedRecords();
  
  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    date: "06/12/2025",
    actionStatus: "All",
  });

  const processedData = useMemo(() => {
    if (!data) return [];
    
    return data.map((item: any) => {
      const offenceDetails = item.offenceOccurenceDetails || {};
      const primaryOffender = item.offenders?.[0]?.offenderDetails || {};
      const coDriver = item.offenders?.[1]?.offenderDetails || null;
      const mpName = item.onDutyDetailsMPReporting?.nameReportingMP || "Unknown";
      
      const dateObj = new Date(offenceDetails.timeOfOffence || item.createdAt);
      const dateStr = dateObj.toLocaleDateString("en-GB");
      const timeStr = dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false });

      return {
        _id: item._id,
        placeOfOffence: offenceDetails.incidentLocation || "Unknown",
        subLocation: "SI Line Military Station", // Hardcoded fallback or from API if available
        date: dateStr,
        time: timeStr,
        driverDetails: {
          aadharNumber: primaryOffender.aadharNumber,
          name: primaryOffender.name,
          armyNumber: primaryOffender.armyNumber,
          rank: primaryOffender.rank,
        },
        mpName: mpName,
        unit: primaryOffender.unit || "N/A",
        fmn: primaryOffender.fmn || "HQ 21 CORPs", // Fallback
        offenceBrief: offenceDetails.description || "Speeding",
        vehicleNo: item.vehicleNumber || "N/A",
        vehicleModel: item.vehicleName || "Unknown Vehicle",
        reportNo: item.reportNumber || "PRO/21 CPU/00042/102/25", // Fallback or real field
        authSpeed: offenceDetails.authSpeed || "30",
        actualSpeed: offenceDetails.actualSpeed || "0",
        overSpeed: offenceDetails.overSpeed || "0",
        coDriverDetails: coDriver ? {
             aadharNumber: coDriver.aadharNumber,
             name: coDriver.name,
             armyNumber: coDriver.armyNumber,
             rank: coDriver.rank,
        } : null,
        actionStatus: item.actionStatus
      };
    });
  }, [data]);

  const distinctReportsCount = processedData.length;
  const pageTitle = "Static Speed Check Reports";

  if (isError) {
    return <div className="p-8 text-red-500 text-center">Failed to load reports.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>Reports & Analysis</span>
        <span className="mx-2">›</span>
        <span>All Reports</span>
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-900">{pageTitle}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
        <div className="flex items-center gap-4">
           <span className="text-sm font-semibold">{distinctReportsCount} Reports</span>
             <Button variant="outline" className="bg-black text-white hover:bg-gray-800 hover:text-white cursor-pointer border-none gap-2">
            Download & Print Report
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters Placeholder */}
      <ReportFilterBar
        filters={filters}
        onFilterChange={(key, value) => {
          setFilters((prev) => ({ ...prev, [key]: value }));
        }}
        showOffenceType={false}
        placeholder="Search by report no, unit, or vehicle..."
        onAddNew={() => console.log("Add New Clicked")}
      />

      {/* Main Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <StaticSpeedTable data={processedData} />
      )}
    </div>
  );
}
