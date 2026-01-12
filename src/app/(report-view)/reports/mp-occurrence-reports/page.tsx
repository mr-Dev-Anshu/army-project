"use client";

import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import MpOccurrenceTable from "./_components/MpOccurrenceTable";
import { useGetAllMPReports } from "@/features/mpReports/hooks";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import MpOccurrenceReport, { MpOccurrenceReportProps } from "@/components/reports/MpOccurrenceReport";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { generateMPOccurrenceWordReport } from "@/utils/generateMPOccurrenceWordReport";

export default function MpOccurrenceReportsPage() {
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
    offenceType: "All",
    date: "",
    fromDate: "",
    toDate: "",
    unit: "",
    fmn: "",
    placeOfOffence: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

  /* ================= API FILTERS ================= */
  const apiParams = useMemo(() => {
    const params: any = {};
    if (filters.unit) params.unit = filters.unit;
    if (filters.fmn) params.fmn = filters.fmn;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    if (filters.toDate) params.toDate = filters.toDate;
    if (filters.placeOfOffence) params.placeOfOffence = filters.placeOfOffence;
    if (filters.date) params.date = filters.date;
    return params;
  }, [filters]);

  const { data, isLoading, isError } = useGetAllMPReports(apiParams);

  /* ================= DYNAMIC OPTIONS FROM DATA ================= */
  const { offenceTypeOptions, unitOptions, fmnOptions, placeOptions } = useMemo(() => {
    if (!data) return { offenceTypeOptions: [], unitOptions: [], fmnOptions: [], placeOptions: [] };

    const types = new Set<string>();
    const units = new Set<string>();
    const fmns = new Set<string>();
    const places = new Set<string>();

    data.forEach((item: any) => {
      // Offence Types
      const type = item.occurrenceDetails?.offenceType;
      if (type) types.add(type);
      const typeList = item.occurrenceDetails?.offenceTypes;
      if (Array.isArray(typeList)) {
        typeList.forEach((t: string) => types.add(t));
      }

      // Unit
      const invHead = item.investigationHead || {};
      const primaryIndividual = item.individuals?.[0] || item.individual?.[0] || {};
      const unit = invHead.unit || primaryIndividual.unit || item.customFields?.unit;
      if (unit) units.add(unit);

      // FMN
      const fmn = invHead.fmn || primaryIndividual.fmn || item.customFields?.fmn;
      if (fmn) fmns.add(fmn);

      // Place
      const place = item.occurrenceDetails?.placeOfOccurrence || item.placeOfOccurrence;
      if (place) places.add(place);
    });

    return {
      offenceTypeOptions: Array.from(types).sort(),
      unitOptions: Array.from(units).sort(),
      fmnOptions: Array.from(fmns).sort(),
      placeOptions: Array.from(places).sort()
    };
  }, [data]);

  const processedData = useMemo(() => {
    if (!data) return [];

    // Filter raw data
    const filteredData = data.filter((item: any) => {
      const occurrence = item.occurrenceDetails || {};
      const invHead = item.investigationHead || {};
      const primaryIndividual = item.individuals?.[0] || item.individual?.[0] || {};

      // Date Check
      const rawDate = occurrence.dateOfOccurrence || item.createdAt;

      /* ---------- DATE RANGE ---------- */
      if (filters.fromDate || filters.toDate) {
        const d = new Date(rawDate).getTime();
        if (filters.fromDate && d < new Date(filters.fromDate).getTime()) return false;
        if (filters.toDate && d > new Date(filters.toDate + "T23:59:59.999").getTime()) return false;
      }

      /* ---------- SINGLE DATE ---------- */
      if (filters.date) {
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

      // Offence Type Check
      if (filters.offenceType !== "All") {
        const type = occurrence.offenceType;
        const typeList = occurrence.offenceTypes || [];

        const matchSingle = type === filters.offenceType;
        const matchArray = Array.isArray(typeList) && typeList.includes(filters.offenceType);

        if (!matchSingle && !matchArray) return false;
      }

      /* ---------- UNIT ---------- */
      if (filters.unit) {
        const unit = invHead.unit || primaryIndividual.unit || item.customFields?.unit;
        if (!unit || unit !== filters.unit) return false;
      }

      /* ---------- FMN ---------- */
      if (filters.fmn) {
        const fmn = invHead.fmn || primaryIndividual.fmn || item.customFields?.fmn;
        if (!fmn || fmn !== filters.fmn) return false;
      }

      /* ---------- PLACE OF OFFENCE ---------- */
      if (filters.placeOfOffence) {
        const place =
          item.occurrenceDetails?.placeOfOccurrence ||
          item.placeOfOccurrence;
        if (
          !place ||
          place.toLowerCase() !== filters.placeOfOffence.toLowerCase()
        )
          return false;
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
        originalData: item // Store original data for report view
      };
    });
  }, [data, filters]);

  const mapToReportProps = (item: any): MpOccurrenceReportProps => {
    const raw = item.originalData || item || {};
    const reportDetails = raw.reportDetails || {};
    const invHead = raw.investigationHead || raw.mpParticulars || {}; // Check form state key variants
    const occurrence = raw.occurrenceDetails || {};

    // Dynamic Fields: People (Victims/Offenders/Individuals)
    // Check all possible locations where the array might be stored
    const rawPeople =
      raw.individuals ||
      raw.offenders ||
      raw.individual ||
      raw.offenderList ||
      raw.customFields?.individuals ||
      raw.customFields?.offenderList ||
      [];

    const people = Array.isArray(rawPeople) ? rawPeople.map((p: any, index: number) => {
      const src = p.details || p;
      const custom = src.customFields || {};
      const merged = { ...custom, ...src }; // flatten for search

      return {
        sno: index + 1,
        armyNo: merged.armyNo || merged.armyNumber || merged.serviceNumber || merged.aadharNumber || "",
        rank: merged.rank || "",
        name: merged.name || merged.personName || merged.fullName || "",
        identityCard: merged.iCardNumber || merged.icard || merged.idCardNumber || merged.identityCard || merged.passNo || "",
        unitName: merged.unit || merged.unitName || "",
        fmn: merged.fmn || merged.fmnName || "",
        address: merged.address || "",
        remark: merged.remark || "",
        role: mappedRole(merged.role || merged.type || "Offender"),
        customFields: merged
      };
    }) : [];

    // Helper for role mapping if needed, otherwise string
    function mappedRole(r: string) {
      if (!r) return "";
      return r;
    }

    // Dynamic Fields: Witnesses
    const rawWitnesses =
      raw.witnesses ||
      raw.witness ||
      raw.witnessList ||
      raw.customFields?.witnesses ||
      [];

    const witnesses = Array.isArray(rawWitnesses) ? rawWitnesses.map((w: any, index: number) => {
      const src = w.details || w;
      const custom = src.customFields || {};
      const merged = { ...custom, ...src };

      return {
        sno: index + 1,
        armyNo: merged.armyNo || merged.armyNumber || merged.serviceNumber || "",
        rank: merged.rank || "",
        name: merged.name || merged.witnessName || merged.fullName || "",
        identityCard: merged.iCardNumber || merged.icard || merged.idCardNumber || merged.passNo || "",
        unitName: merged.unit || merged.unitName || "",
        fmn: merged.fmn || merged.fmnName || "",
        address: merged.address || "",
        remark: merged.remark || "",
        customFields: merged
      };
    }) : [];

    // Dynamic Fields: Documents
    const rawDocs = raw.documents || [];
    const docs = Array.isArray(rawDocs)
      ? rawDocs.map((d: any) => typeof d === 'string' ? d : (d.statement || d.name || "Attached Document"))
      : [];

    // Dynamic Fields: Brief
    const brief =
      occurrence.description ||
      occurrence.brief ||
      occurrence.statement ||
      raw.detailedOccurrenceReport ||
      "";

    // Dynamic Fields: Evidences
    const evidences = raw.evidences || [];
    // Helper to find specific evidence types if they exist in the array
    const findEvidence = (type: string) => {
      const found = evidences.find((e: any) => e.type?.toLowerCase().includes(type));
      return found ? (found.description || found.url || "Attached") : null;
    };

    // Dynamic Fields: Detailed Report & Remarks
    const detailedStatement =
      raw.detailedOccurrenceReport ||
      raw.detailedStatement ||
      raw.detailedReport?.statement ||
      raw.customFields?.detailedStatement ||
      "";

    // Handle findings whether stored as string (schema) or array
    let findingsList: string[] = [];
    const rawFindings = raw.pointsFindOutDuringInvestigation || raw.investigationFindings || raw.detailedReport?.findings;

    if (typeof rawFindings === 'string') {
      findingsList = rawFindings.split('\n').filter((line: string) => line.trim() !== '');
    } else if (Array.isArray(rawFindings)) {
      findingsList = rawFindings;
    }

    const reportDate = raw.createdAt
      ? new Date(raw.createdAt).toLocaleDateString("en-GB")
      : new Date().toLocaleDateString("en-GB");

    // "Station" typically typically comes from unit address or similar
    const station = invHead.address || raw.customFields?.station || invHead.unit || "";

    return {
      reportNo: reportDetails.reportNumber || "",
      command: reportDetails.command || invHead.command || "",
      firNo: reportDetails.firNumber || "",
      mpDetails: {
        armyNumber: invHead.armyNumber || invHead.armyNo || "",
        rank: invHead.rank || "",
        name: invHead.name || "",
        unit: invHead.unit || "",
        fmn: invHead.fmn || "",
        command: invHead.command || ""
      },
      occurrence: {
        types: occurrence.offenceTypes && occurrence.offenceTypes.length > 0
          ? occurrence.offenceTypes
          : (occurrence.offenceType ? [occurrence.offenceType] : []),
        refs: occurrence.offenceTypeReference || [],
        place: occurrence.placeOfOccurrence || "",
        date: occurrence.dateOfOccurrence ? new Date(occurrence.dateOfOccurrence).toLocaleDateString("en-GB") : (raw.createdAt ? new Date(raw.createdAt).toLocaleDateString("en-GB") : ""),
        time: occurrence.timeOfOccurrence ? new Date(occurrence.timeOfOccurrence).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }) : ""
      },
      people: people,
      briefOfOccurrence: brief,
      witnesses: witnesses,
      evidence: {
        eyeSketch: findEvidence("sketch") || "",
        photos: findEvidence("photo") || "",
        videos: findEvidence("video") || ""
      },
      documents: docs,
      detailedReport: {
        statement: detailedStatement,
        findings: findingsList,
        opinion: raw.opinion || raw.detailedReport?.opinion || raw.customFields?.opinion || ""
      },
      remarks: {
        analysis: raw.remarks?.analysis || raw.analysis || raw.coRemarks?.analysis || raw.customFields?.analysis || "",
        recommendation: raw.remarks?.recommendation || raw.recommendation || raw.coRemarks?.recommendation || raw.customFields?.recommendation || ""
      },
      station: station,
      reportDate: reportDate
    };
  };


  const handleDownloadReport = (item: any) => {
    const props = mapToReportProps(item);
    generateMPOccurrenceWordReport(props);
  };

  const handlePrintReport = (item: any) => {
    setViewingReport(item);
    setShouldAutoPrint(true);
  };

  const distinctReportsCount = processedData.length;
  const pageTitle = "MP Occurrence & Investigation Report";

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">Create New MP Occurrence & Investigation Report</h1>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="w-full max-w-5xl p-6 border rounded-xl mx-auto bg-white">
            <h2 className="font-semibold text-lg">
              MP Occurrence & Investigation Form
            </h2>
            <p className="text-gray-500 mt-2">Form implementation pending...</p>
          </div>
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
          <h1 className="text-lg font-semibold text-gray-800">MP Occurrence & Investigation Report</h1>
          <div className="ml-auto">
            <Button onClick={() => handleDownloadReport(viewingReport)} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download Word Report
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-500/10">
          <MpOccurrenceReport {...mapToReportProps(viewingReport)} />
        </div>
      </div>
    );
  }

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
        onDownload={() => window.print()}
      />

      {/* Filters */}
      <ReportFilterBar
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        showOffenceType={true}
        offenceTypeOptions={offenceTypeOptions}
        unitOptions={unitOptions}
        fmnOptions={fmnOptions}
        placeOptions={placeOptions}
        showDateRange
        showFilter
        // showSort={true}

        onAddNew={() => setIsCreating(true)}
        onReset={() =>
          setFilters({
            search: "",
            offenceType: "All",
            date: "",
            fromDate: "",
            toDate: "",
            unit: "",
            fmn: "",
            placeOfOffence: "",
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
        <MpOccurrenceTable
          data={processedData}
          onView={(item) => setViewingReport(item)}
          onPrint={handlePrintReport}
          onDownload={handleDownloadReport}
        />
      )}
    </div>
  );
}
