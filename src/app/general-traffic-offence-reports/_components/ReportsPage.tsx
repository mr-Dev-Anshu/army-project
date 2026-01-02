"use client";

import React, { useState, useMemo } from "react";
import { Loader2, ArrowLeft, Download } from "lucide-react";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import GroupedList from "./GroupedList";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";
import MultiStepForm from "@/common/component/multi-step-form/MulitstepForm";
import { Button } from "@/components/ui/button";
import MilitaryPoliceReport, { MilitaryPoliceReportProps } from "@/components/reports/MilitaryPoliceReport";
import { generateWordReport } from "@/utils/generateWordReport";

const TableSection = ({
  groups,
  isVehicleInvolved,
  onView,
  onPrint,
}: {
  groups: any[];
  isVehicleInvolved: boolean;
  onView: (offence: any) => void;
  onPrint?: (offence: any) => void;
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
      <GroupedList data={groups} isVehicleInvolved={isVehicleInvolved} onView={onView} onPrint={onPrint} />
    </div>
  );
};

export default function ReportsPage({
  viewType = "vehicle",
}: {
  viewType?: "vehicle" | "no-vehicle";
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);

  // Auto-print effect
  React.useEffect(() => {
    if (viewingReport && shouldAutoPrint) {
      // Small timeout to allow render
      const timer = setTimeout(() => {
        window.print();
        setShouldAutoPrint(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [viewingReport, shouldAutoPrint]);

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

    if (filters.date) {
      params.date = filters.date.split('T')[0];
    }

    return params;
  }, [filters.offenceType, filters.actionStatus, filters.date]);

  const { data, isLoading, isError } = useGetAllTrafficOffences(apiParams);

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

  const mapToReportProps = (offence: any): MilitaryPoliceReportProps => {
    const primary = offence.offenders?.[0]?.offenderDetails || {};
    const secondary = offence.offenders?.[1]?.offenderDetails;
    const mpDetails = offence.onDutyDetailsMPReporting || {};
    const occDetails = offence.offenceOccurenceDetails || {};
    const witness = offence.witnessDetails?.[0] || {};
    const date = new Date(occDetails.timeOfOffence || offence.createdAt);

    // Generate report number if not provided
    const generatedReportNo = offence.reportNumber || `GTO/21 CPU/${(offence._id?.slice(-4) || "0000").toUpperCase()}/${new Date().getFullYear()}`;

    return {
      reportNo: generatedReportNo,
      reportDate: new Date(offence.createdAt).toLocaleDateString("en-GB"),
      particulars: {
        primary: {
          aadharCardNo: primary.aadharCardNo || "N/A",
          name: primary.name || "N/A",
          so: primary.so || "N/A",
          relation: primary.relation || "N/A",
          armyNo: primary.armyNo || "N/A",
          rank: primary.rank || "N/A",
          unit: mpDetails.unit || primary.unit || "MP Unit",
          fmn: offence.fmn || primary.fmn || "HQ 21 Corps",
          command: primary.command || "N/A",
          address: primary.address || "N/A",
          iCardNo: primary.iCardNo || "N/A",
        },
        secondary: secondary ? {
          aadharCardNo: secondary.aadharCardNo || "N/A",
          name: secondary.name || "N/A",
          so: secondary.so || "N/A",
          relation: secondary.relation || "N/A",
          armyNo: secondary.armyNo || "N/A",
          rank: secondary.rank || "N/A",
          unit: mpDetails.unit || secondary.unit || "MP Unit",
          fmn: offence.fmn || secondary.fmn || "HQ 21 Corps",
          command: secondary.command || "N/A",
          address: secondary.address || "N/A",
          iCardNo: secondary.iCardNo || "N/A",
        } : undefined,
        vehicle: offence.vehicleNumber ? {
          baNo: offence.vehicleNumber,
          makeAndTake: offence.vehicleName || "Unknown"
        } : undefined,
      },
      occurrence: {
        dateOfDuty: mpDetails.dateOfDuty ? new Date(mpDetails.dateOfDuty).toLocaleDateString("en-GB") : date.toLocaleDateString("en-GB"),
        dutyTime: mpDetails.dutyTime || "N/A",
        dutyLocation: mpDetails.dutyLocation || mpDetails.placeOfDuty || "N/A",
        nameOfWitnessingOfficial1: witness.name || "N/A",
        nameOfWitnessingOfficial2: offence.witnessDetails?.[1]?.name || "",
        nameOfWitnessingOfficial3: offence.witnessDetails?.[2]?.name || "",
        timeOfOffence: date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }),
        locationOfOffence: occDetails.incidentLocation || "N/A",
        statement: occDetails.statement || occDetails.description || "No statement provided.",
      },
      offence: {
        type: offence.currentOffenceType || offence.offenceTypes?.[0] || "Traffic Offence",
        ref1: offence.offenceTypeReference?.[0] || "Mil Tfc offence (Auth - Para 48 of SAO 6/S/2001/PM).",
        ref2: offence.offenceTypeReference?.[1] || "Para 463(a) of CMP manual, SAO 9/S/78 and Stn order.",
        description: occDetails.description || "No description provided.",
      },
      witnessSig: {
        armyNo: witness.armyNo || "N/A",
        rank: witness.rank || "N/A",
        name: witness.name || "N/A",
        unit: witness.unit || "N/A",
      },
      mpSig: {
        armyNo: mpDetails.armyNumber || mpDetails.armyNoReportingMP || "N/A",
        rank: mpDetails.rank || "N/A",
        name: mpDetails.nameReportingMP || "N/A",
        unit: mpDetails.unit || "N/A",
      },
      remarks: {
        text: offence.remarks || "The indl committed offence as enumerated under Para 3 above. Suitable discp action be initiated against the indl by the unit, and inform to this office within 15 days from issue of this report.",
        station: offence.station || "C/O 56 APO",
        dated: new Date(offence.createdAt).toLocaleDateString("en-GB"),
      },
    };
  };

  const handleDownloadReport = (offence: any) => {
    const props = mapToReportProps(offence);
    generateWordReport(props);
  };

  const handlePrintReport = (offence: any) => {
    setViewingReport(offence);
    setShouldAutoPrint(true);
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">Create New General & Traffic Offence Report</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <MultiStepForm />
        </div>
      </div>
    )
  }

  if (viewingReport) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 print:hidden">
          <Button variant="ghost" size="sm" onClick={() => setViewingReport(null)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">View General Traffic Offence Report</h1>
          <div className="ml-auto">
            <Button onClick={() => handleDownloadReport(viewingReport)} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download Word Report
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-500/10">
          <MilitaryPoliceReport {...mapToReportProps(viewingReport)} />
        </div>
      </div>
    );
  }

  const isVehicleView = viewType === "vehicle";
  const pageTitle = isVehicleView
    ? "General & Traffic Offence Reports- Vehicle Involved"
    : "General & Traffic Offence Reports- No Vehicle Involved";

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
        onAddNew={() => setIsCreating(true)}
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
            <TableSection
              groups={vehicleGroups}
              isVehicleInvolved={true}
              onView={setViewingReport}
              onPrint={handlePrintReport}
            />
          ) : (
            <div className="mt-12 text-center text-gray-500">
              No "Vehicle Involved" offences found.
            </div>
          )
        ) : noVehicleGroups.length > 0 ? (
          <TableSection
            groups={noVehicleGroups}
            isVehicleInvolved={false}
            onView={setViewingReport}
            onPrint={handlePrintReport}
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
