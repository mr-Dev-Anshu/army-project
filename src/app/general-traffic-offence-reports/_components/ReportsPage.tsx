"use client";

import React, { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import GroupedList from "./GroupedList";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";

const TableSection = ({
  groups,
  isVehicleInvolved,
}: {
  groups: any[];
  isVehicleInvolved: boolean;
}) => {
  const uniqueOffenceTypesCount = groups.length;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 mt-6 overflow-hidden">
      {/* Main List Header */}
      <div className="flex items-center bg-white px-6 py-3 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="flex-1">
          Type of Offence ({uniqueOffenceTypesCount} OFFENCES)
        </div>
        <div className="w-64 text-center">Action Status</div>
        <div className="w-32 text-right">No. of Records</div>
      </div>

      {/* Content */}
      <GroupedList data={groups} isVehicleInvolved={isVehicleInvolved} />
    </div>
  );
};

export default function ReportsPage({
  viewType = "vehicle",
}: {
  viewType?: "vehicle" | "no-vehicle";
}) {
  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    offenceType: "All",
    date: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc", // Default
  });

  // Prepare params for backend
  const apiParams = useMemo(() => {
    const params: any = { groupBy: "offenceType" };
    
    if (filters.offenceType && filters.offenceType !== "All") {
      params.offenceType = filters.offenceType;
    }
    
    if (filters.actionStatus && filters.actionStatus !== "All") {
      params.status = filters.actionStatus; // Backend accepts "Taken" / "Pending"
    }

    return params;
  }, [filters.offenceType, filters.actionStatus]);

  const { data, isLoading, isError } = useGetAllTrafficOffences(apiParams);

  // Fetch all options for the dropdown (unfiltered by specific offence type or status)
  // This ensures the dropdown list doesn't shrink when a selection is made
  const optionsParams = useMemo(() => ({
    groupBy: "offenceType",
    isVehicleInvolved: viewType === "vehicle"
  }), [viewType]);
  
  const { data: optionsData } = useGetAllTrafficOffences(optionsParams);

  // Process data into two sets: Vehicle Involved vs No Vehicle Involved
  const { vehicleGroups, noVehicleGroups } = useMemo(() => {
    if (!data) return { vehicleGroups: [], noVehicleGroups: [] };

    const vGroups: any[] = [];
    const nvGroups: any[] = [];

    data.forEach((group: any) => {
      // Common filtering function (still useful for search/date which are client-side)
      const matchesFilter = (o: any) => {
        // Date Check
        if (filters.date) {
            const rawDate = o.offenceOccurenceDetails?.timeOfOffence || o.createdAt;
            if (rawDate) {
                const recordDate = new Date(rawDate).toISOString().split('T')[0];
                if (recordDate !== filters.date) return false;
            }
        }

        if (filters.search) {
             const searchLower = filters.search.toLowerCase();
             const reportNo = o.reportNumber?.toLowerCase() || "";
             const offenceType = o.currentOffenceType?.toLowerCase() || "";
             if (!reportNo.includes(searchLower) && !offenceType.includes(searchLower)) return false;
        }

        return true;
      };

      // Note: Backend handles isVehicleInvolved via apiParams for the main query if we wanted,
      // but current logic splits a single response into two. 
      // Actually, since we now pass filters to backend, 'data' might already be filtered by offenceType.
      // But we still need to split for the "viewType" logic if the backend query wasn't strictly viewType bounded.
      // Wait, apiParams *didn't* include isVehicleInvolved in the previous step I wrote?
      // Let's check apiParams construction below/above.
      
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



  const isVehicleView = viewType === "vehicle";
  const pageTitle = isVehicleView 
    ? "General & Traffic Offence Reports- Vehicle Involved" 
    : "General & Traffic Offence Reports- NO Vehicle Involved";

  // Calculate total count
  const activeGroups = isVehicleView ? vehicleGroups : noVehicleGroups;
  const distinctReportsCount = activeGroups.reduce((acc: number, group: any) => acc + (group.offences?.length || 0), 0);

  // Calculate options from the SEPARATE optionsData query
  const fetchedOptions = optionsData?.map((g: any) => g.offenceType).filter(Boolean) || [];
  const offenceTypeOptions = fetchedOptions.length > 0 
    ? fetchedOptions 
    : ["Intoxication", "Over Speeding", "Wrong Parking", "No Helmet"];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <ReportPageHeader
        title={pageTitle}
        reportCount={distinctReportsCount}
        onDownload={() => console.log("Download Clicked")}
      />

      {/* Filters */}
      <ReportFilterBar
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        offenceTypeOptions={offenceTypeOptions}
        showOffenceType={true}
        onAddNew={() => console.log("Add New Clicked")}
      />

      {/* Content Area: Loader, Error, or Data */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow border border-gray-200 mt-6 min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : isError ? (
        <div className="p-8 text-red-500 bg-white rounded-lg shadow border border-gray-200 mt-6 text-center">
          Failed to load reports.
        </div>
      ) : (
        /* Conditional Table Rendering */
        isVehicleView ? (
          vehicleGroups.length > 0 ? (
            <TableSection groups={vehicleGroups} isVehicleInvolved={true} />
          ) : (
            <div className="mt-12 text-center text-gray-500">
              No "Vehicle Involved" offences found.
            </div>
          )
        ) : noVehicleGroups.length > 0 ? (
          <TableSection
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
