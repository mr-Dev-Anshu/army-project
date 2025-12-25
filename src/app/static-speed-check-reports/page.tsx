"use client";

import React, { useMemo, useState } from "react";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import StaticSpeedTable from "./_components/StaticSpeedTable";
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
        id: item._id,
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
        actionStatus: item.actionStatus === true ? "Taken" : "Pending"
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
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4 flex-wrap border border-gray-200">
         <div className="relative flex-1 min-w-[300px]">
            <input 
              type="text" 
              placeholder="Search by report no, unit, offence type..." 
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
         </div>
         
         <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
           <span className="text-sm text-gray-500">Date:</span>
           <span className="text-sm font-medium text-gray-900">{filters.date}</span>
         </div>

         <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
            <span className="text-sm text-gray-500">Action Status:</span>
            <span className="text-sm font-medium text-gray-900">{filters.actionStatus}</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
         </div>

         <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
             </Button>
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                + Add New
            </Button>
         </div>
      </div>

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
