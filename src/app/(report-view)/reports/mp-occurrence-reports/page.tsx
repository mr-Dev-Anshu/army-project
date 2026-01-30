"use client";

import React, { useMemo, useState, useRef } from "react";
import { Loader2, ArrowLeft, Download, FileSpreadsheet, FileJson, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

import MpOccurrenceTable from "./_components/MpOccurrenceTable";
import { useGetAllMPReports, useCreateMPReport } from "@/features/mpReports/hooks";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";
import MpOccurrenceReport, { MpOccurrenceReportProps } from "@/components/reports/MpOccurrenceReport";

import { Button } from "@/components/ui/button";
import { generateMPOccurrenceWordReport } from "@/utils/generateMPOccurrenceWordReport";

import { csvToJsonWithHiddenKeys } from "@/lib/csvToJson";
import { excelToJson } from "@/lib/excelToJson";
import { processImport } from "@/lib/processImport";

/* ================= HELPERS ================= */

// Recursively removes system fields (_id, __v, createdAt, updatedAt)
const cleanSystemFields = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(cleanSystemFields);
  } else if (data !== null && typeof data === 'object') {
    const cleaned: any = {};
    Object.keys(data).forEach(key => {
      if (["_id", "__v", "createdAt", "updatedAt", "id"].includes(key)) return;
      cleaned[key] = cleanSystemFields(data[key]);
    });
    return cleaned;
  }
  return data;
};

/* ================= KEY MAPPING UTILS ================= */
const KEY_MAPPING: Record<string, string> = {
  "Report No": "reportDetails.reportNumber",
  "Report Number": "reportDetails.reportNumber",
  "Command": "reportDetails.command",
  "FIR No": "reportDetails.firNumber",
  "Investigation MP Name": "investigationHead.name",
  "Investigation MP Rank": "investigationHead.rank",
  "Investigation MP Army No": "investigationHead.armyNumber",
  "Investigation MP Unit": "investigationHead.unit",
  "Investigation MP FMN": "investigationHead.fmn",
  "Date of Occurrence": "occurrenceDetails.dateOfOccurrence",
  "Time of Occurrence": "occurrenceDetails.timeOfOccurrence",
  "Place of Occurrence": "occurrenceDetails.placeOfOccurrence",
  "Offence Type": "occurrenceDetails.offenceType",
  "Brief Description": "occurrenceDetails.description",
  "Detailed Report": "detailedOccurrenceReport",
  "Opinion": "opinion",
  "Analysis": "remarks.analysis",
  "Recommendation": "remarks.recommendation",
  
  "Offender Name": "individuals[0].name",
  "Offender Rank": "individuals[0].rank",
  "Offender Army No": "individuals[0].armyNo",
  "Offender Unit": "individuals[0].unit",
  "Offender Role": "individuals[0].role",

  "Victim Name": "individuals[1].name"
};

const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.replace(/\]/g, "").split(/[.\[]/);
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isArray = !isNaN(Number(nextKey));

    if (!current[key]) {
      current[key] = isArray ? [] : {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
};

const mapData = (data: any[]) => {
  return data.map((item) => {
    const newItem: any = {};
    Object.keys(item).forEach((key) => {
      // Extra check, though cleanSystemFields runs before this
      if (["_id", "__v", "createdAt", "updatedAt", "id"].includes(key)) return;

      const mappedKey = KEY_MAPPING[key.trim()] || key.trim();
      if (item[key] !== null && item[key] !== undefined && item[key] !== "") {
        setNestedValue(newItem, mappedKey, item[key]);
      }
    });

    if (newItem.individuals && newItem.individuals.length > 0) {
        if (newItem.individuals[0] && !newItem.individuals[0].role) {
            newItem.individuals[0].role = "Offender";
        }
    }

    return newItem;
  });
};

export default function MpOccurrenceReportsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
  
  const [showAddOptions, setShowAddOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutateAsync: createMPReport } = useCreateMPReport();

  React.useEffect(() => {
    if (viewingReport && shouldAutoPrint) {
      const timer = setTimeout(() => {
        window.print();
        setShouldAutoPrint(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [viewingReport, shouldAutoPrint]);

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

  const { data, isLoading, isError, refetch } = useGetAllMPReports(apiParams);

  const handleImportCSV = () => {
    fileInputRef.current?.click();
    setShowAddOptions(false);
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
    setShowAddOptions(false);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setShowAddOptions(false);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
    const isJson = fileName.endsWith(".json");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const result = e.target?.result;
      if (!result) return;

      try {
        let json: any;
        if (isExcel && result instanceof ArrayBuffer) {
          json = excelToJson(result);
        } else if (isJson && typeof result === "string") {
          json = JSON.parse(result);
        } else if (typeof result === "string") {
          json = csvToJsonWithHiddenKeys(result);
        }

        // FIX: Unwrap API response wrappers
        if (json && !Array.isArray(json) && json.data) {
            json = json.data;
        }

        let dataArray = Array.isArray(json) ? json : [json];

        // FIX: Clean nested system fields
        dataArray = cleanSystemFields(dataArray);

        const mappedData = mapData(dataArray);

        await processImport(mappedData, createMPReport);
        
        toast.success("Reports imported successfully!");
        await refetch();
      } catch (error: any) {
        console.error("Error importing file:", error);
        toast.error(`Failed to import reports: ${error.message || "Unknown error"}`);
      }
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
    event.target.value = "";
  };

  const { offenceTypeOptions, unitOptions, fmnOptions, placeOptions } = useMemo(() => {
    if (!data) return { offenceTypeOptions: [], unitOptions: [], fmnOptions: [], placeOptions: [] };

    const types = new Set<string>();
    const units = new Set<string>();
    const fmns = new Set<string>();
    const places = new Set<string>();

    data.forEach((item: any) => {
      const type = item.occurrenceDetails?.offenceType;
      if (type) types.add(type);
      const typeList = item.occurrenceDetails?.offenceTypes;
      if (Array.isArray(typeList)) {
        typeList.forEach((t: string) => types.add(t));
      }

      const invHead = item.investigationHead || {};
      const primaryIndividual = item.individuals?.[0] || item.individual?.[0] || {};
      const unit = invHead.unit || primaryIndividual.unit || item.customFields?.unit;
      if (unit) units.add(unit);

      const fmn = invHead.fmn || primaryIndividual.fmn || item.customFields?.fmn;
      if (fmn) fmns.add(fmn);

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

    const filteredData = data.filter((item: any) => {
      const occurrence = item.occurrenceDetails || {};
      const invHead = item.investigationHead || {};
      const primaryIndividual = item.individuals?.[0] || item.individual?.[0] || {};

      const rawDate = occurrence.dateOfOccurrence || item.createdAt;

      if (filters.fromDate || filters.toDate) {
        const d = new Date(rawDate).getTime();
        if (filters.fromDate && d < new Date(filters.fromDate).getTime()) return false;
        if (filters.toDate && d > new Date(filters.toDate + "T23:59:59.999").getTime()) return false;
      }

      if (filters.date) {
        if (rawDate) {
          const recordDate = new Date(rawDate).toISOString().split('T')[0];
          if (recordDate !== filters.date) return false;
        }
      }

      if (filters.actionStatus !== "All") {
        const isTaken = item.actionStatus === true;
        const filterTaken = filters.actionStatus === "Taken";
        if (isTaken !== filterTaken) return false;
      }

      if (filters.offenceType && filters.offenceType !== "All") {
        const type = occurrence.offenceType;
        const typeList = occurrence.offenceTypes || [];
        const selectedTypes = filters.offenceType.split(",");
        const matchSingle = selectedTypes.includes(type);
        const matchArray = Array.isArray(typeList) && typeList.some(t => selectedTypes.includes(t));
        if (!matchSingle && !matchArray) return false;
      }

      if (filters.unit) {
        const unit = invHead.unit || primaryIndividual.unit || item.customFields?.unit;
        const selectedUnits = filters.unit.split(",");
        if (!unit || !selectedUnits.includes(unit)) return false;
      }

      if (filters.fmn) {
        const fmn = invHead.fmn || primaryIndividual.fmn || item.customFields?.fmn;
        const selectedFmns = filters.fmn.split(",");
        if (!fmn || !selectedFmns.includes(fmn)) return false;
      }

      if (filters.placeOfOffence) {
        const place = item.occurrenceDetails?.placeOfOccurrence || item.placeOfOccurrence;
        const selectedPlaces = filters.placeOfOffence.split(",").map(p => p.toLowerCase());
        if (!place || !selectedPlaces.includes(place.toLowerCase())) return false;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const reportNo = item.reportDetails?.reportNumber?.toLowerCase() || "";
        const offenceType = occurrence.offenceType?.toLowerCase() || "";
        if (!reportNo.includes(searchLower) && !offenceType.includes(searchLower)) return false;
      }

      return true;
    });

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
      const primaryIndividual = item.individual?.[0] || item.individuals?.[0] || item.offenders?.[0] || item.customFields?.victim || {};

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
          armyNumber: primaryIndividual.armyNumber || primaryIndividual.aadharNumber || "N/A",
          rank: primaryIndividual.rank || "Civ",
          name: primaryIndividual.name || "Unknown",
          unit: primaryIndividual.unit || "N/A",
          ...primaryIndividual,
        },
        reportingMPName: invHead.name || "Unknown MP",

        offenceType: occurrence.offenceType || "Overtaking in NO Overtaking Zone",
        brief: occurrence.description || "Brief of occurrence...",
        documents: item.documents || [],
        reportNumber: item.reportDetails?.reportNumber,
        actionStatus: item.actionStatus,
        originalData: item
      };
    });
  }, [data, filters]);

  const mapToReportProps = (item: any): MpOccurrenceReportProps => {
    const raw = item.originalData || item || {};
    const reportDetails = raw.reportDetails || {};
    const invHead = raw.investigationHead || raw.mpParticulars || {}; 
    const occurrence = raw.occurrenceDetails || {};

    const rawPeople = raw.individuals || raw.offenders || raw.individual || raw.offenderList || raw.customFields?.individuals || raw.customFields?.offenderList || [];

    const people = Array.isArray(rawPeople) ? rawPeople.map((p: any, index: number) => {
      const src = p.details || p;
      const custom = src.customFields || {};
      const merged = { ...custom, ...src }; 

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

    function mappedRole(r: string) {
      if (!r) return "";
      return r;
    }

    const rawWitnesses = raw.witnesses || raw.witness || raw.witnessList || raw.customFields?.witnesses || [];

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

    const rawDocs = raw.documents || [];
    const docs = Array.isArray(rawDocs)
      ? rawDocs.map((d: any) => typeof d === 'string' ? d : (d.statement || d.name || "Attached Document"))
      : [];

    const brief = occurrence.description || occurrence.brief || occurrence.statement || raw.detailedOccurrenceReport || "";

    const evidences = raw.evidences || [];
    const findEvidence = (type: string) => {
      const found = evidences.find((e: any) => e.type?.toLowerCase().includes(type));
      return found ? (found.description || found.url || "Attached") : null;
    };

    const detailedStatement = raw.detailedOccurrenceReport || raw.detailedStatement || raw.detailedReport?.statement || raw.customFields?.detailedStatement || "";

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

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

  const handleDownloadReport = async (item: any) => {
    setIsDownloading(true);
    setDownloadType("Word");
    try {
      const props = mapToReportProps(item);
      generateMPOccurrenceWordReport(props);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      console.error(e);
      alert("Failed to download Word report");
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const handleDownloadPdf = async (item: any) => {
    const id = item._id;
    if (!id) {
      alert("Report ID not found");
      return;
    }
    setIsDownloading(true);
    setDownloadType("PDF");
    try {
      const response = await fetch(`/api/mp-occurrence-report/pdf/${id}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Unknown server error" }));
        throw new Error(errData.error || "Failed to generate PDF");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MPOccurrenceReport-${item.reportDetails?.reportNumber || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download Error", error);
      alert(`Failed to download PDF report: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
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
      <ReportViewerWrapper
        title="MP OCCURRENCE REPORT"
        onBack={() => {
          setViewingReport(null);
          setShouldAutoPrint(false);
        }}
        isDownloading={isDownloading}
        downloadType={downloadType}
        onDownloadWord={() => handleDownloadReport(viewingReport)}
        onDownloadPdf={() => handleDownloadPdf(viewingReport)}
        onPrint={() => window.print()}
      >
        <MpOccurrenceReport {...mapToReportProps(viewingReport)} />
      </ReportViewerWrapper>
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

      <ReportFilterBar
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        showOffenceType={true}
        showDateRange
        showFilter
        onAddNew={() => setShowAddOptions(true)}
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

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv, .xlsx, .xls, .json"
        onChange={handleFileChange}
      />
      {showAddOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add New Record</h3>
                <p className="text-sm text-gray-500 mt-1">Choose how you want to add data to the system</p>
              </div>
              <button
                onClick={() => setShowAddOptions(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={handleImportCSV}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group text-center h-72"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileSpreadsheet className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700">Import CSV / Excel</h4>
                <p className="text-gray-500 leading-relaxed">Upload a CSV or Excel file containing multiple records.</p>
              </button>

              <button
                onClick={handleImportJSON}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group text-center h-72"
              >
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileJson className="w-10 h-10 text-orange-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700">Import JSON</h4>
                <p className="text-gray-500 leading-relaxed">Upload a JSON file with structured data.</p>
              </button>

              <button
                onClick={handleCreateNew}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-center h-72"
              >
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700">Create Manually</h4>
                <p className="text-gray-500 leading-relaxed">Fill out the form manually to add a single record.</p>
              </button>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
               <Button variant="ghost" onClick={() => setShowAddOptions(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}