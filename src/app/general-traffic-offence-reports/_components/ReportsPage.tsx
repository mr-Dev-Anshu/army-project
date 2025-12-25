"use client";

import React, { useState, useMemo } from "react";
import { Loader2, Printer } from "lucide-react";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import GroupedList from "./GroupedList";
import { Button } from "@/components/ui/button";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";

const TableSection = ({ title, groups, isVehicleInvolved }: { title: string, groups: any[], isVehicleInvolved: boolean }) => {
  const uniqueOffenceTypesCount = groups.length;
  
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 mt-6 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
         <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      {/* Main List Header */}
      <div className="flex items-center bg-white px-6 py-3 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="flex-1">Type of Offence ({uniqueOffenceTypesCount} OFFENCES)</div>
        <div className="w-64 text-center">Action Status</div>
        <div className="w-32 text-right">No. of Records</div>
      </div>

      {/* Content */}
      <GroupedList data={groups} isVehicleInvolved={isVehicleInvolved} />
    </div>
  );
};

export default function ReportsPage({ viewType = "vehicle" }: { viewType?: "vehicle" | "no-vehicle" }) {
  const { data, isLoading, isError } = useGetAllTrafficOffences();

  // State for filters (mocked for now as backend handles some)
  const [filters, setFilters] = useState({
    search: "",
    offenceType: "All",
    date: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc", // Default
  });

  // Process data into two sets: Vehicle Involved vs No Vehicle Involved
  const { vehicleGroups, noVehicleGroups } = useMemo(() => {
    if (!data) return { vehicleGroups: [], noVehicleGroups: [] };

    const vGroups: any[] = [];
    const nvGroups: any[] = [];

    data.forEach((group: any) => {
      // Common filtering function
      const matchesFilter = (o: any) => {
        // Date Check
        if (filters.date) {
            const rawDate = o.offenceOccurenceDetails?.timeOfOffence || o.createdAt;
            if (rawDate) {
                const recordDate = new Date(rawDate).toISOString().split('T')[0];
                if (recordDate !== filters.date) return false;
            }
        }

        // Action Status Check
        if (filters.actionStatus !== "All") {
            const isTaken = o.actionStatus === true;
            const filterTaken = filters.actionStatus === "Taken";
            // e.g. if filter is Taken (true), record must be true.
            // if filter is Pending (false), record must be false.
            // Simplified: (isTaken && filterTaken) || (!isTaken && !filterTaken) which is isTaken === filterTaken
            if (isTaken !== filterTaken) return false;
        }

        // Search Check (already existing or new?)
        // The original code passed 'search' to filter but didn't implement it in the snippet I saw.
        // Assuming search is desired:
        if (filters.search) {
             const searchLower = filters.search.toLowerCase();
             const reportNo = o.reportNumber?.toLowerCase() || "";
             const offenceType = o.currentOffenceType?.toLowerCase() || "";
             // Add more fields if needed
             if (!reportNo.includes(searchLower) && !offenceType.includes(searchLower)) return false;
        }

        return true;
      };

      let vOffences = group.offences?.filter((o: any) => o.isVehicleInvolved && matchesFilter(o)) || [];
      let nvOffences = group.offences?.filter((o: any) => !o.isVehicleInvolved && matchesFilter(o)) || [];

      // Sort
      if (filters.sortOrder) {
        const sorter = (a: any, b: any) => {
             const dateA = new Date(a.offenceOccurenceDetails?.timeOfOffence || a.createdAt).getTime();
             const dateB = new Date(b.offenceOccurenceDetails?.timeOfOffence || b.createdAt).getTime();
             return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        };
        vOffences.sort(sorter);
        nvOffences.sort(sorter);
      }

      if (vOffences.length > 0) {
        vGroups.push({ ...group, offences: vOffences });
      }

      if (nvOffences.length > 0) {
        nvGroups.push({ ...group, offences: nvOffences });
      }
    });

    return { vehicleGroups: vGroups, noVehicleGroups: nvGroups };
  }, [data, filters]);

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

  const isVehicleView = viewType === "vehicle";
  const pageTitle = isVehicleView 
    ? "General & Traffic Offence Reports- Vehicle Involved" 
    : "General & Traffic Offence Reports- NO Vehicle Involved";

  // Calculate total count (summing up the original groups or the processed ones)
  // We should probably filter the count based on view type
  const activeGroups = isVehicleView ? vehicleGroups : noVehicleGroups;
  const distinctReportsCount = activeGroups.reduce((acc: number, group: any) => acc + (group.offences?.length || 0), 0);

  // Calculate options
  const fetchedOptions = activeGroups?.map((g: any) => g.offenceType).filter(Boolean) || [];
  const offenceTypeOptions = fetchedOptions.length > 0 
    ? fetchedOptions 
    : ["Intoxication", "Over Speeding", "Wrong Parking", "No Helmet"];



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
      <ReportFilterBar
        filters={filters}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        offenceTypeOptions={offenceTypeOptions}
        showOffenceType={true}
        onAddNew={() => console.log("Add New Clicked")}
      />

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
