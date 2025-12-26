"use client";

import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import StaticSpeedTable from "./_components/StaticSpeedTable";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import { useGetStaticSpeedRecords } from "@/features/staticSpeed/hooks";

export default function StaticSpeedCheckReportsPage() {
  const { data, isLoading, isError } = useGetStaticSpeedRecords();
  
  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc", // Default sort
  });

  const processedData = useMemo(() => {
    if (!data) return [];
    
    // Filter raw data first
    const filteredData = data.filter((item: any) => {
        // Date Check
        if (filters.date) {
            const rawDate = item.offenceOccurenceDetails?.timeOfOffence || item.createdAt;
            if (rawDate) {
                const recordDate = new Date(rawDate).toISOString().split('T')[0];
                if (recordDate !== filters.date) return false;
            }
        }

        // Action Status Check
        if (filters.actionStatus !== "All") {
            const isTaken = item.actionStatus === true;
            const filterTaken = filters.actionStatus === "Taken";
            if (isTaken !== filterTaken) return false;
        }

        // Search Check
        if (filters.search) {
             const searchLower = filters.search.toLowerCase();
             const reportNo = item.reportNumber?.toLowerCase() || "";
             const vehicleNo = item.vehicleNumber?.toLowerCase() || "";
             if (!reportNo.includes(searchLower) && !vehicleNo.includes(searchLower)) return false;
        }
        return true;
    });

    // Sorting
    if (filters.sortOrder) {
        filteredData.sort((a: any, b: any) => {
            const dateA = new Date(a.offenceOccurenceDetails?.timeOfOffence || a.createdAt).getTime();
            const dateB = new Date(b.offenceOccurenceDetails?.timeOfOffence || b.createdAt).getTime();
            return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
    }

    return filteredData.map((item: any) => {
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
  }, [data, filters]);

  const distinctReportsCount = processedData.length;
  const pageTitle = "Static Speed Check Reports";

  if (isError) {
    return <div className="p-8 text-red-500 text-center">Failed to load reports.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <ReportPageHeader 
        title={pageTitle}
        reportCount={distinctReportsCount}
        onDownload={() => console.log("Download Clicked")}
      />

      {/* Filters Placeholder */}
      <ReportFilterBar
        filters={filters}
        onFilterChange={(key, value) => {
          setFilters((prev) => ({ ...prev, [key]: value }));
        }}
        showOffenceType={false}
        placeholder="Search by report no, unit, or vehicle..."
        onAddNew={() => console.log("Add New Clicked")}
        onReset={() =>
          setFilters({
            search: "",
            date: "",
            actionStatus: "All",
            sortOrder: "desc",
          })
        }
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
