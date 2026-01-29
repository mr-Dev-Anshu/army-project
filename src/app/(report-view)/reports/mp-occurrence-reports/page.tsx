"use client";

import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import MpOccurrenceTable from "./_components/MpOccurrenceTable";
import { useGetAllMPReports, useGetMPReportById, useUpdateMPReport } from "@/features/mpReports/hooks";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";
import MpOccurrenceReport, { MpOccurrenceReportProps } from "@/components/reports/MpOccurrenceReport";

import SignedAttachmentsViewer from "@/components/common/SignedAttachmentsViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import EvidenceViewer from "@/components/common/EvidenceViewer";
import { generateMPOccurrenceWordReport } from "@/utils/generateMPOccurrenceWordReport";
import MultiFormReport from "@/common/component/investigation-report/MultiFormReport";
import FormAttachmentModal, { AttachedItem } from "@/components/ui/FormAttachmentModal";
import { toast } from "react-toastify";

export default function MpOccurrenceReportsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
  /* ================= VIEW MODE STATE ================= */
  const [viewMode, setViewMode] = useState<"report" | "attachments" | "evidences">("report");
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  const { mutateAsync: updateReport } = useUpdateMPReport();

  // Handle Attachment Save
  const handleAttachSave = async (newItems: AttachedItem[]) => {
    if (!viewingReport?._id) return;

    try {
      const currentAttachments = viewingReport.customFields?.attachments || viewingReport.attachments || [];
      const updatedAttachments = [...currentAttachments, ...newItems];

      await updateReport({
        id: viewingReport._id,
        data: {
          customFields: {
            ...viewingReport.customFields,
            attachments: updatedAttachments
          }
        }
      });

      toast.success("Attachments Added Successfully");

      // Update local viewing state
      setViewingReport((prev: any) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          attachments: updatedAttachments
        }
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to add attachments");
    }
  };

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

  /* ================= EDIT DATA FETCHING ================= */
  const editingId = isCreating && viewingReport ? (viewingReport._id || viewingReport.originalData?._id) : null;
  const { data: fullEditingReport, isLoading: isLoadingEdit } = useGetMPReportById(editingId);
  const finalEditingReport = fullEditingReport || viewingReport?.originalData || viewingReport;

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
      if (filters.offenceType && filters.offenceType !== "All") {
        const type = occurrence.offenceType;
        const typeList = occurrence.offenceTypes || [];
        const selectedTypes = filters.offenceType.split(",");

        // Check if ANY of the selected types match the record's type(s)
        const matchSingle = selectedTypes.includes(type);
        const matchArray = Array.isArray(typeList) && typeList.some(t => selectedTypes.includes(t));

        if (!matchSingle && !matchArray) return false;
      }

      /* ---------- UNIT ---------- */
      if (filters.unit) {
        const unit = invHead.unit || primaryIndividual.unit || item.customFields?.unit;
        const selectedUnits = filters.unit.split(",");
        if (!unit || !selectedUnits.includes(unit)) return false;
      }

      /* ---------- FMN ---------- */
      if (filters.fmn) {
        const fmn = invHead.fmn || primaryIndividual.fmn || item.customFields?.fmn;
        const selectedFmns = filters.fmn.split(",");
        if (!fmn || !selectedFmns.includes(fmn)) return false;
      }

      /* ---------- PLACE OF OFFENCE ---------- */
      if (filters.placeOfOffence) {
        const place =
          item.occurrenceDetails?.placeOfOccurrence ||
          item.placeOfOccurrence;

        const selectedPlaces = filters.placeOfOffence.split(",").map(p => p.toLowerCase());

        if (
          !place ||
          !selectedPlaces.includes(place.toLowerCase())
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


  /* ================= DOWNLOAD STATE ================= */
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

  /* ================= ACTIONS ================= */

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

      // Cleanup
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
          <h1 className="text-lg font-semibold text-gray-800">
            {viewingReport ? "Edit MP Occurrence & Investigation Report" : "Create New MP Occurrence & Investigation Report"}
          </h1>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {isLoadingEdit ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <MultiFormReport
              onCancel={() => { setIsCreating(false); setViewingReport(null); }}
              existingReport={finalEditingReport}
            />
          )}
        </div>
      </div>
    )
  }


  const viewingIdStr = viewingReport?._id ?? viewingReport?.originalData?._id ?? "";
  const finalViewingRecord = viewingReport?.originalData || viewingReport;

  if (viewingReport) {
    return (
      <>
        <ReportViewerWrapper
          title="MP OCCURRENCE REPORT"
          onBack={() => {
            setViewingReport(null);
            setShouldAutoPrint(false);
            setViewMode("report");
          }}
          isDownloading={isDownloading}
          downloadType={downloadType}
          activeView={viewMode}
          onViewReport={() => setViewMode("report")}
          onViewAttachments={() => setViewMode("attachments")}
          onViewEvidences={() => setViewMode("evidences")}
          onDownloadWord={() => handleDownloadReport(viewingReport)}
          onDownloadPdf={() => handleDownloadPdf(viewingReport)}
          onPrint={() => window.print()}
          onEdit={() => {
            setIsCreating(true);
          }}
        >
          {viewMode === "report" && (
            <MpOccurrenceReport {...mapToReportProps(viewingReport)} />
          )}

          {viewMode === "attachments" && (
            <SignedAttachmentsViewer
              record={finalViewingRecord}
              onAttachMore={() => setIsAttachModalOpen(true)}
            />
          )}

          {viewMode === "evidences" && (
            <EvidenceViewer evidences={finalViewingRecord?.evidences || []} />
          )}
        </ReportViewerWrapper>

        <FormAttachmentModal
          isOpen={isAttachModalOpen}
          onClose={() => setIsAttachModalOpen(false)}
          onSave={handleAttachSave}
        />
      </>
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
          onEdit={(item) => {
            setViewingReport(item);
            setIsCreating(true);
          }}
        />
      )}
    </div>
  );
}