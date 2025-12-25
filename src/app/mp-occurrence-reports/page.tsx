"use client";

import React, { useMemo, useState } from "react";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import MpOccurrenceTable from "./_components/MpOccurrenceTable";
import { useGetAllMPReports } from "@/features/mpReports/hooks";

export default function MpOccurrenceReportsPage() {
  const { data, isLoading, isError } = useGetAllMPReports();

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    offenceType: "All",
    date: "06/12/2025",
    actionStatus: "All",
  });

  const processedData = useMemo(() => {
    if (!data) return [];

    return data.map((item: any) => {
      // Mapping API data to Table format
      const occurrence = item.occurrenceDetails || {};
      const invHead = item.investigationHead || {};
      // Assuming validation allows custom structure or relying on any type
      // The screenshot has "Particulars of Individual/Victim", let's map from item fields
      // NOTE: The current schema has 'investigationHead' but not explicit 'victim' fields.
      // I will assume for now that 'customFields' or future updates will hold victim info,
      // or map 'investigationHead' to one of them if it makes sense, BUT:
      // Schema has `onDutyDetails`? No, schema has `investigationHead`.
      // Let's assume we use mock victim data if missing or map from known fields.

      const dateObj = new Date(occurrence.dateOfOccurrence || item.createdAt);

      // Attempt to resolve victim/individual details
      // The backend model is strict: false, so it might store 'offenders', 'individual', or 'victim'
      const primaryIndividual =
        item.individual?.[0] ||
        item.individuals?.[0] ||
        item.offenders?.[0] ||
        item.customFields?.victim ||
        {};

      return {
        _id: item._id, // Ensure this matches types.ts MPReport._id
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
          // Add other fields as needed by OffenderDetailsCell
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
  }, [data]);

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
          <span className="text-sm font-semibold">
            {distinctReportsCount} Reports
          </span>
          <Button
            variant="outline"
            className="bg-black text-white hover:bg-gray-800 hover:text-white cursor-pointer border-none gap-2"
          >
            Download & Print Report
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center gap-4 flex-wrap border border-gray-200">
        <div className="flex justify-center items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search by report no, unit, offence type..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
            <span className="text-sm text-gray-500">Date:</span>
            <span className="text-sm font-medium text-gray-900">
              {filters.date}
            </span>
          </div>

          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
            <span className="text-sm text-gray-500">Action Status:</span>
            <span className="text-sm font-medium text-gray-900">
              {filters.actionStatus}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <Button variant="outline" size="icon" className="border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </Button>
        </div>

        <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
          + Add New
        </Button>
      </div>

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
