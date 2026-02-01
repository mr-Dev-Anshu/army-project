"use client";

import React, { useMemo, useState, useRef } from "react";
import { Loader2, ArrowLeft, Download, FileSpreadsheet, FileJson, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

import MpOccurrenceTable from "./_components/MpOccurrenceTable";
import { useGetAllMPReports, useCreateMPReport } from "@/features/mpReports/hooks";

// Import Offender Hook and Type
import { useCreateOffender } from "@/features/offender/Hooks";
import { CreateOffenderData } from "@/apis/offender/types";

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

// Recursively removes system fields
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

/* ================= KEY MAPPING UTILS (CSV/Flat JSON) ================= */
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

// 2. UPDATED NORMALIZER FOR MP OCCURRENCE JSON
const normalizeJSON = (json: any): any[] => {
  // Handle the specific structure: { exportDate: "...", reports: [ { report: { ... } } ] }
  if (json.reports && Array.isArray(json.reports)) {
    return json.reports.map((item: any) => {
      const r = item.report || {};
      
      // 1. Map Offenders to 'individuals' structure with role='Offender'
      const offenderIndividuals = Array.isArray(r.offenders) ? r.offenders.map((o: any) => {
        let type = "Military Person"; 
        if (o.offenderType === "servantMaid") type = "Maid"; 
        else if (o.offenderType === "civilian") type = "Civilian";
        else if (o.offenderType) type = o.offenderType;

        return {
          role: "Offender",
          name: o.name || o.personName || "Unknown",
          rank: o.rank || o.selectRank,
          armyNo: o.armyNumber || o.serviceNumber,
          iCardNumber: o["I Card Number"] || o.iCardNumber || o["Pass ID"] || o.passNo,
          unit: o.unit || o.unitName,
          fmn: o.fmn || o.fmnName,
          command: o.command || r.command, // Inherit command from report if missing on person
          address: o.address || o["Place of QTR."],
          trade: o.Trade,
          fatherName: o.fatherName,
          caste: o.caste,
          age: o.age,
          customFields: {
             offenderType: type
          }
        };
      }) : [];

      // 2. Map Victim/Individual (Using root fields based on your JSON)
      const victim = {
          role: "Victim",
          name: "Unknown", // Default since name isn't clearly at root level in your JSON example
          age: r.age,
          totalServiceDuration: r.totalServiceDuration,
          unit: r.unit, 
          fmn: r.fmn,
          command: r.command,
          address: r.address
      };

      // Combine Offenders and Victim into one 'individuals' array
      // This is crucial: The Report View looks at 'individuals' to list people.
      const allIndividuals = [...offenderIndividuals];
      
      // Only add victim if there is relevant data (avoid empty victim entries if possible)
      if (r.age || r.totalServiceDuration || r.unit) {
        allIndividuals.push(victim);
      }

      return {
        // Map Report Details
        reportDetails: {
            reportNumber: r.id || "Auto-Generated",
            firNumber: r.firNo,
            command: r.command
        },
        // 3. Map Assigned MP (Investigation Head)
        investigationHead: {
            name: r.incidentCoveredBy || r.coordWith || "System Import", 
            rank: "",
            armyNumber: "", 
            unit: "",
            fmn: ""
        },
        occurrenceDetails: {
            dateOfOccurrence: r.dateOfOccurrence,
            // Format time properly if it exists
            timeOfOccurrence: r.timeOfOccurrence ? `${r.dateOfOccurrence}T${r.timeOfOccurrence}` : r.dateOfOccurrence,
            placeOfOccurrence: r.placeOfOccurrence,
            // Map reportHeading to offenceType
            offenceType: r.reportHeading || "General Offence", 
            description: r.description
        },
        customFields: {
            vehicleNumber: r.vehicleNumber,
            vehicleType: r.vehicleType,
            vehicleName: r.vehicleName,
            leaveOrDuty: r["leave / duty"]
        },
        // 4. Save individuals here so they appear in the report
        individuals: allIndividuals,
        
        // Keep raw offenders for the separate collection creation loop
        rawOffenders: r.offenders 
      };
    });
  }
  
  if (Array.isArray(json)) return mapData(json);
  if (json.data && Array.isArray(json.data)) return mapData(json.data);
  return mapData([json]);
};

export default function MpOccurrenceReportsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
  
  const [showAddOptions, setShowAddOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutateAsync: createMPReport } = useCreateMPReport();
  const { mutateAsync: createOffender } = useCreateOffender();

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

        if (json && !Array.isArray(json) && json.data) {
            json = json.data;
        }

        let dataArray = Array.isArray(json) ? json : [json];
        dataArray = cleanSystemFields(dataArray);

        // Normalize JSON
        const mappedData = normalizeJSON(json || dataArray);

        // Import Logic
        const handleImportRecord = async (item: any) => {
            // A. Create the MP Report
            // Note: We MUST keep 'individuals' in reportPayload because that's where we normalized the offenders to.
            const reportPayload = { ...item };
            
            // Clean up the temporary rawOffenders field before saving to DB
            const rawOffendersForLoop = reportPayload.rawOffenders;
            delete reportPayload.rawOffenders; 

            // Safety Defaults
            if (!reportPayload.investigationHead.name) reportPayload.investigationHead.name = "Imported Report";
            if (!reportPayload.occurrenceDetails.offenceType) reportPayload.occurrenceDetails.offenceType = "General";

            const createdReport = await createMPReport(reportPayload);

            // B. Create Offenders Linked to Report (Separate Collection)
            // Even though they are in the report now, we also create them as entities if your system uses a separate offenders table.
            if (createdReport && createdReport._id && rawOffendersForLoop && Array.isArray(rawOffendersForLoop)) {
                await Promise.all(rawOffendersForLoop.map(async (offender: any) => {
                    const offenderPayload: CreateOffenderData = {
                        offenceId: createdReport._id, 
                        offenderType: offender.offenderType || "Military Person", 
                        offenderDetails: {
                            name: offender.name || offender.personName,
                            rank: offender.rank || offender.selectRank,
                            armyNumber: offender.armyNumber || offender.serviceNumber,
                            iCardNumber: offender["I Card Number"] || offender.iCardNumber,
                            unit: offender.unit,
                            fmn: offender.fmn,
                            address: offender.address
                        }
                    };
                    try {
                        await createOffender(offenderPayload);
                    } catch (err) {
                        console.error("Failed to create offender entity:", err);
                    }
                }));
            }
            return createdReport;
        };

        await processImport(mappedData, handleImportRecord);
        
        toast.success("Reports and Offenders imported successfully!");
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
      // Safely access first individual if it exists
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
      // Try to find the "Main" person involved (usually first individual/offender)
      const primaryIndividual =
        item.individuals?.[0] ||
        item.individual?.[0] ||
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
          : "",
        placeOfOccurrence: occurrence.placeOfOccurrence,

        assignedMP: {
          armyNumber: invHead.armyNumber,
          rank: invHead.rank,
          name: invHead.name,
          unit: invHead.unit,
          fmn: invHead.fmn,
          address: invHead.address,
          iCardNumber: invHead.iCardNumber,
        },

        victimDetails: {
          armyNumber:
            primaryIndividual.armyNo ||
            primaryIndividual.armyNumber ||
            primaryIndividual.aadharNumber,
          rank: primaryIndividual.rank,
          name: primaryIndividual.name,
          unit: primaryIndividual.unit || primaryIndividual.unitName,
          ...primaryIndividual,
        },
        reportingMPName: invHead.name,

        offenceType:
          (Array.isArray(occurrence.offenceTypes) && occurrence.offenceTypes.length > 0)
            ? occurrence.offenceTypes.join(", ")
            : (occurrence.offenceType === "NA" ? "" : occurrence.offenceType),
        brief: occurrence?.description,
        documents: item?.documents,
        reportNumber: item?.reportDetails?.reportNumber,
        actionStatus: item?.actionStatus, // status action
        originalData: item // Store original data for report view 
      };
    });
  }, [data, filters]);

  const mapToReportProps = (item: any): MpOccurrenceReportProps => {
    const raw = item.originalData || item || {};
    const reportDetails = raw.reportDetails || {};
    const invHead = raw.investigationHead || raw.mpParticulars || {}; 
    const occurrence = raw.occurrenceDetails || {};

    // Prioritize 'individuals' which we standardized in the import
    const rawPeople = raw.individuals || raw.offenders || raw.individual || [];

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