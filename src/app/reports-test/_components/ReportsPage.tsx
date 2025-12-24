"use client";

import React, { useState, useMemo } from "react";
import { Loader2, Printer } from "lucide-react";
import FilterBar from "./FilterBar";
import GroupedList from "./GroupedList";
import { Button } from "@/components/ui/button";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";

export default function ReportsPage() {
  const { data, isLoading, isError } = useGetAllTrafficOffences();

  // State for filters (mocked for now as backend handles some)
  const [filters, setFilters] = useState({
    search: "",
    offenceType: "All",
    date: "06/12/2025",
    actionStatus: "All",
  });

  const [isVehicleView, setIsVehicleView] = useState(true);

  // Process data into two sets: Vehicle Involved vs No Vehicle Involved
  const { vehicleGroups, noVehicleGroups } = useMemo(() => {
    if (!data) return { vehicleGroups: [], noVehicleGroups: [] };

    const vGroups: any[] = [];
    const nvGroups: any[] = [];

    data.forEach((group: any) => {
      const vOffences = group.offences?.filter((o: any) => o.isVehicleInvolved) || [];
      const nvOffences = group.offences?.filter((o: any) => !o.isVehicleInvolved) || [];

      if (vOffences.length > 0) {
        vGroups.push({ ...group, offences: vOffences });
      }

      if (nvOffences.length > 0) {
        nvGroups.push({ ...group, offences: nvOffences });
      }
    });

    return { vehicleGroups: vGroups, noVehicleGroups: nvGroups };
  }, [data]);

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

  const pageTitle = "General & Traffic Offence Reports";

  // Calculate total count (summing up the original groups or the processed ones)
  const distinctReportsCount = data?.reduce((acc: number, group: any) => acc + (group.offences?.length || 0), 0) || 0;

  // Calculate options
  const fetchedOptions = data?.map((g: any) => g.offenceType).filter(Boolean) || [];
  const offenceTypeOptions = fetchedOptions.length > 0 
    ? fetchedOptions 
    : ["Intoxication", "Over Speeding", "Wrong Parking", "No Helmet"];

  const TableSection = ({ title, groups, isVehicleInvolved }: { title: string, groups: any[], isVehicleInvolved: boolean }) => (
    <div className="bg-white rounded-lg shadow border border-gray-200 mt-6 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
         <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      {/* Main List Header */}
      <div className="flex items-center bg-white px-6 py-3 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="flex-1">Type of Offence</div>
        <div className="w-64 text-center">Action Status</div>
        <div className="w-32 text-right">No. of Records</div>
      </div>

      {/* Content */}
      <GroupedList data={groups} isVehicleInvolved={isVehicleInvolved} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
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
             <Button variant="outline" className="bg-black text-white hover:bg-gray-800 hover:text-white cursor-pointer border-none gap-2">
            Download & Print Report
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        offenceTypeOptions={offenceTypeOptions}
      />

      {/* View Toggle */}
      <div className="flex justify-center mt-6">
        <div className="bg-gray-200 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setIsVehicleView(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isVehicleView
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Vehicle Involved
          </button>
          <button
            onClick={() => setIsVehicleView(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              !isVehicleView
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            No Vehicle Involved
          </button>
        </div>
      </div>

      {/* Conditional Table Rendering */}
      {isVehicleView ? (
        vehicleGroups.length > 0 ? (
          <TableSection 
            title="Vehicle Involved Reports" 
            groups={vehicleGroups} 
            isVehicleInvolved={true} 
          />
        ) : (
          <div className="mt-12 text-center text-gray-500">
            No "Vehicle Involved" offences found.
          </div>
        )
      ) : (
        noVehicleGroups.length > 0 ? (
          <TableSection 
            title="No Vehicle Involved Reports" 
            groups={noVehicleGroups} 
            isVehicleInvolved={false} 
          />
        ) : (
           <div className="mt-12 text-center text-gray-500">
            No "No Vehicle Involved" offences found.
          </div>
        )
      )}
    </div>
  );
}
