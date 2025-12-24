"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/config/axios";
import { Loader2, Printer } from "lucide-react";
import FilterBar from "./FilterBar";
import GroupedList from "./GroupedList";
import { Button } from "@/components/ui/button";

// Determine if running within the expected response structure
const fetchOffences = async () => {
  // The default getAll endpoint already returns grouped data (repo logic)
  const res = await api.get("/api/generalTraficOffence");
  return res.data;
};

export default function ReportsPage() {
  // TEST OVERRIDE: Allow toggling for testing UI
  const [forceNoVehicle, setForceNoVehicle] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["generalTrafficOffence", "grouped"],
    queryFn: fetchOffences,
  });

  // State for filters (mocked for now as backend handles some)
  const [filters, setFilters] = useState({
    search: "",
    offenceType: "All",
    date: "06/12/2025",
    actionStatus: "All",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load reports.</div>;
  }

  // Determine mode from first available data
  // Check if any offence in any group has isVehicleInvolved === true
  let isVehicleInvolved = false;
  if (data && data.length > 0) {
    // Check key offences in the first group
    const firstGroup = data[0];
    if (firstGroup.offences && firstGroup.offences.length > 0) {
      isVehicleInvolved = firstGroup.offences[0].isVehicleInvolved;
    }
  }

  if (forceNoVehicle) {
    isVehicleInvolved = false;
  }

  const pageTitle = isVehicleInvolved
    ? "General & Traffic Offence Reports - Vehicle Involved"
    : "General & Traffic Offence Reports- NO Vehicle Involved";

  // Calculate total count
  const distinctReportsCount = data?.reduce((acc: number, group: any) => acc + (group.offenceCount || group.totalOffences || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* DEV TOOLS */}
      <div className="fixed bottom-4 right-4 bg-yellow-100 p-2 border border-yellow-300 rounded shadow-lg z-50 text-xs">
          <p className="font-bold mb-1 text-yellow-800">🧪 Testing Controls</p>
          <div className="flex items-center gap-2">
             <input 
               type="checkbox" 
               id="vehMode" 
               checked={forceNoVehicle} 
               onChange={(e) => setForceNoVehicle(e.target.checked)} 
             />
             <label htmlFor="vehMode" className="cursor-pointer">Force "No Vehicle"</label>
          </div>
      </div>
      {/* Breadcrumb - Mocked */}
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
             <Button variant="outline" className="bg-black text-white hover:bg-gray-800 border-none gap-2">
            Download & Print Report
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* List */}
      <div className="bg-white rounded-lg shadow border border-gray-200 mt-6 overflow-hidden">
        {/* Main List Header */}
        <div className="flex items-center bg-gray-50 px-6 py-3 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="flex-1">Type of Offence ({data?.length || 0} Offences)</div>
          <div className="w-64 text-center">Action Status</div>
          <div className="w-32 text-right">No. of Records</div>
        </div>

        {/* Content */}
        <GroupedList data={data} isVehicleInvolved={isVehicleInvolved} />
      </div>
    </div>
  );
}
