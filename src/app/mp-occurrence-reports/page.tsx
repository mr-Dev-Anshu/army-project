"use client";

import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import MpOccurrenceTable from "./_components/MpOccurrenceTable";
import { useGetAllMPReports } from "@/features/mpReports/hooks";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";

export default function MpOccurrenceReportsPage() {
  const { data, isLoading, isError } = useGetAllMPReports();

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    offenceType: "All",
    date: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

  const processedData = useMemo(() => {
    if (!data) return [];

    // Filter raw data
    const filteredData = data.filter((item: any) => {
         // ... existing filter logic ...
         const occurrence = item.occurrenceDetails || {};
         
         // Date Check
         if (filters.date) {
            const rawDate = occurrence.dateOfOccurrence || item.createdAt;
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
         
         // Search
         if (filters.search) {
             const searchLower = filters.search.toLowerCase();
             const reportNo = item.reportDetails?.reportNumber?.toLowerCase() || "";
             const offenceType = occurrence.offenceType?.toLowerCase() || "";
             if (!reportNo.includes(searchLower) && !offenceType.includes(searchLower)) return false;
         }

        return true;
    });

    // Sorting
    if (filters.sortOrder) {
        filteredData.sort((a: any, b: any) => {
            const dateA = new Date(a.occurrenceDetails?.dateOfOccurrence || a.createdAt).getTime();
            const dateB = new Date(b.occurrenceDetails?.dateOfOccurrence || b.createdAt).getTime();
            return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
    }

    return filteredData.map((item: any) => {
      const occurrence = item.occurrenceDetails || {};
      const invHead = item.investigationHead || {};

      const dateObj = new Date(occurrence.dateOfOccurrence || item.createdAt);
      const primaryIndividual =
        item.individual?.[0] ||
        item.individuals?.[0] ||
        item.offenders?.[0] ||
        item.customFields?.victim ||
        {};

      return {
        _id: item._id,
        date: dateObj.toLocaleDateString("en-GB"),
        time: occurrence.timeOfOccurrence
          ? new Date(occurrence.timeOfOccurrence).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "00:00",
        placeOfOccurrence: occurrence.placeOfOccurrence || "Unknown",

        assignedMP: {
          armyNumber: invHead.armyNumber,
          rank: invHead.rank,
          name: invHead.name,
          unit: invHead.unit,
          fmn: invHead.fmn || "HQ 21 CORPs",
          address: invHead.address || "C/O 56 APO",
          iCardNumber: invHead.iCardNumber || "F-123456",
        },

        victimDetails: {
          armyNumber:
            primaryIndividual.armyNumber ||
            primaryIndividual.aadharNumber ||
            "N/A",
          rank: primaryIndividual.rank || "Civ",
          name: primaryIndividual.name || "Unknown",
          unit: primaryIndividual.unit || "N/A",
          ...primaryIndividual,
        },
        reportingMPName: invHead.name || "Unknown MP",

        offenceType:
          occurrence.offenceType || "Overtaking in NO Overtaking Zone",
        brief: occurrence.description || "Brief of occurrence...",
        documents: item.documents || [],
        reportNumber: item.reportDetails?.reportNumber,
        actionStatus: item.actionStatus,
      };
    });
  }, [data, filters]);

  const distinctReportsCount = processedData.length;
  const pageTitle = "MP Occurrence & Investigation Report";

  if (isError) {
    return (
      <div className="p-8 text-red-500 text-center">
        Failed to load reports.
      </div>
    );
  }

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
        showOffenceType={false}
        onAddNew={() => console.log("Add New Clicked")}
        onReset={() =>
          setFilters({
            search: "",
            offenceType: "All",
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
        <MpOccurrenceTable data={processedData} />
      )}
    </div>
  );
}
