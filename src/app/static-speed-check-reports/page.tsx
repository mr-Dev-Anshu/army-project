"use client";

import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import StaticSpeedTable from "./_components/StaticSpeedTable";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import { useGetStaticSpeedRecords } from "@/features/staticSpeed/hooks";
import StaticSpeedReport, { StaticSpeedReportProps } from "@/components/reports/StaticSpeedReport";

import StaticSpeedForm from "@/common/component/staticSpeedForm/MainForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { generateStaticSpeedWordReport } from "@/utils/generateStaticSpeedWordReport";

export default function StaticSpeedCheckReportsPage() {
  const { data, isLoading, isError } = useGetStaticSpeedRecords();
  const [isCreating, setIsCreating] = useState(false);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);

  // Auto Print Effect
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
        unit: item.onDutyDetailsMPReporting?.unit || "MP Unit",
        fmn: item.fmn || primaryOffender.fmn || "HQ 21 Corps",
        offenceBrief: offenceDetails.description || "Speeding",
        vehicleNo: item.vehicleNumber || "N/A",
        vehicleModel: item.vehicleName || "Unknown Vehicle",
        reportNo: item.reportNumber || `SSC/21 CPU/${(item._id?.slice(-4) || "0000").toUpperCase()}/${new Date().getFullYear()}`,
        authSpeed: offenceDetails.authSpeed || "30",
        actualSpeed: offenceDetails.actualSpeedNoted || offenceDetails.actualSpeed || "0",
        overSpeed: offenceDetails.overSpeedCalculated || offenceDetails.overSpeed || "0",
        coDriverDetails: coDriver ? {
          aadharNumber: coDriver.aadharNumber,
          name: coDriver.name,
          armyNumber: coDriver.armyNumber,
          rank: coDriver.rank,
        } : null,
        actionStatus: item.actionStatus,
        originalData: item // Store full item for detailed view
      };
    });
  }, [data, filters]);

  const mapToReportProps = (item: any): StaticSpeedReportProps => {
    const raw = item.originalData || {};
    const offence = raw.offenceOccurenceDetails || {};
    const offender = raw.offenders?.[0]?.offenderDetails || {};
    const mpDetails = raw.onDutyDetailsMPReporting || {};
    const witness = raw.witness || {};

    const dateOfDuty = offence.timeOfOffence ? new Date(offence.timeOfOffence).toLocaleDateString("en-GB") : "Unknown Date";
    const startTime = "06:00";
    const endTime = "18:00";
    const location = offence.placeOfOffence || "Unknown Location";
    const statement = `On ${dateOfDuty}, from ${startTime} hours to ${endTime} hours, I was detailed for static speed check duty at ${location} along with ${mpDetails.rank || "Hav(MP)"} ${mpDetails.nameReportingMP || "Unknown"} and other MP personnel. At approximately ${offence.timeOfOffence ? new Date(offence.timeOfOffence).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }) : "Unknown Time"} hours, near the ${offence.incidentLocation || "Check Post"}, the speed of a vehicle was measured using a Static Speed Check Gun and was found to be ${offence.actualSpeed || 0} KMPH. As per the orders of the Station Commander and in accordance with Letter No. 599/2025 dated 26 August 2025, the prescribed speed limit for this type of vehicle within Bhopal Military Station is ${offence.authSpeed || 30} KMPH. The vehicle was therefore exceeding the laid-down speed limit by ${offence.overSpeed || 0} KMPH.`;

    const generatedReportNo = raw.reportNumber || `SSC/21 CPU/${(raw._id?.slice(-4) || "0000").toUpperCase()}/${new Date().getFullYear()}`;

    return {
      reportNo: generatedReportNo,
      reportDate: new Date(raw.createdAt).toLocaleDateString("en-GB"),
      unitName: "21 Corps Provost Unit (CMP Control Room)",
      particulars: {
        rider: {
          armyNo: offender.armyNumber || "N/A",
          name: offender.name || "Unknown",
          fmn: raw.fmn || offender.fmn || "HQ 21 Corps",
          address: offender.address || "C/O 56 APO",
          rank: offender.rank || "N/A",
          unit: mpDetails.unit || offender.unit || "MP Unit",
          command: offender.command || "Southern Comd",
          iCardNo: offender.iCardNumber || "N/A",
        },
        vehicle: {
          baNo: raw.vehicleNumber || "N/A",
          makeAndTake: raw.vehicleName || "N/A",
        }
      },
      occurrence: {
        statement: statement
      },
      offence: {
        actualSpeed: `${offence.actualSpeedNoted || offence.actualSpeed || 0} KMPH`,
        authSpeed: `${offence.authSpeed || 0} KMPH`,
        overSpeed: `${offence.overSpeedCalculated || offence.overSpeed || 0} KMPH`
      },
      witnessSig: {
        armyNo: witness.armyNumber || "1122334A",
        rank: witness.rank || "Nk (MP)",
        name: witness.name || "Bhupender Singh",
        unit: witness.unit || "21 Corps Pro Unit"
      },
      mpSig: {
        armyNo: mpDetails.armyNumber || mpDetails.armyNo || "7788991B",
        rank: mpDetails.rank || "Hav (MP)",
        name: mpDetails.nameReportingMP || "Robert Robert",
        unit: mpDetails.unit || "21 Corps Pro Unit"
      },
      remarks: {
        text: `The case of over speeding by ${offence.overSpeedCalculated || offence.overSpeed || 0} KMPH, which is contrary to the order of the FMN. Suitable discp action be initiated against the indl by the unit, and inform to this office within 15 days from issue of this report.`,
        station: "C/O 56 APO",
        dated: new Date().toLocaleDateString("en-GB")
      }
    };
  };


  const handleDownloadReport = (item: any) => {
    const props = mapToReportProps(item);
    generateStaticSpeedWordReport(props);
  };

  const handlePrintReport = (item: any) => {
    setViewingReport(item);
    setShouldAutoPrint(true);
  };

  const distinctReportsCount = processedData.length;
  const pageTitle = "Static Speed Check Reports";

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">Create New Static Speed Check Report</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <StaticSpeedForm />
        </div>
      </div>
    )
  }

  if (viewingReport) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 print:hidden">
          <Button variant="ghost" size="sm" onClick={() => { setViewingReport(null); setShouldAutoPrint(false); }} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">View Static Speed Check Report</h1>
          <div className="ml-auto">
            <Button onClick={() => handleDownloadReport(viewingReport)} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download Word Report
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-500/10">
          <StaticSpeedReport {...mapToReportProps(viewingReport)} />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-red-500 text-center">Failed to load reports.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <ReportPageHeader
        title={pageTitle}
        reportCount={distinctReportsCount}
        onDownload={() => window.print()}
      />

      {/* Filters Placeholder */}
      <ReportFilterBar
        filters={filters}
        onFilterChange={(key, value) => {
          setFilters((prev) => ({ ...prev, [key]: value }));
        }}
        showOffenceType={false}
        // showSort={true}
        showFilter={true}
        placeholder="Search by report no, unit, or vehicle..."
        onAddNew={() => setIsCreating(true)}
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
        <StaticSpeedTable
          data={processedData}
          onView={(item) => setViewingReport(item)}
          onPrint={handlePrintReport}
          onDownload={handleDownloadReport}
        />
      )}
    </div>
  );
}
