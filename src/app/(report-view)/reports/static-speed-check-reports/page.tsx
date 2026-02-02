"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Loader2,
  ArrowLeft,
  Plus,
  X,
} from "lucide-react";

import StaticSpeedTable from "./_components/StaticSpeedTable";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";

import {
  useGetStaticSpeedRecords,
  useGetStaticSpeedRecordById,
  useUpdateStaticSpeedRecord,
  useCreateStaticSpeedRecord,
} from "@/features/staticSpeed/hooks";

import StaticSpeedReport, {
  StaticSpeedReportProps,
} from "@/components/reports/StaticSpeedReport";

import StaticSpeedForm from "@/common/component/staticSpeedForm/MainForm";
import SignedAttachmentsViewer from "@/components/common/SignedAttachmentsViewer";
import { Button } from "@/components/ui/button";
import { generateStaticSpeedWordReport } from "@/utils/generateStaticSpeedWordReport";
import FormAttachmentModal, {
  AttachedItem,
} from "@/components/ui/FormAttachmentModal";

/* ================= HELPERS ================= */

const cleanSystemFields = (data: any): any => {
  if (Array.isArray(data)) return data.map(cleanSystemFields);
  if (data && typeof data === "object") {
    const cleaned: any = {};
    Object.keys(data).forEach((k) => {
      if (["_id", "__v", "createdAt", "updatedAt", "id"].includes(k)) return;
      cleaned[k] = cleanSystemFields(data[k]);
    });
    return cleaned;
  }
  return data;
};

export default function StaticSpeedCheckReportsPage() {
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    fromDate: "",
    toDate: "",
    unit: "",
    fmn: "",
    placeOfOffence: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);

  /* ✅ MOVED UP */
  const [viewMode, setViewMode] = useState<"report" | "attachments">("report");

  const [showAddOptions, setShowAddOptions] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks remain same
  // const { mutateAsync: createStaticSpeedRecord } = useCreateStaticSpeedRecord();
  // const { mutateAsync: updateRecord } = useUpdateStaticSpeedRecord();

  /* ================= AUTO PRINT ================= */

  useEffect(() => {
    if (viewingReport && shouldAutoPrint) {
      setTimeout(() => {
        window.print();
        setShouldAutoPrint(false);
      }, 400);
    }
  }, [viewingReport, shouldAutoPrint]);

  /* ================= API ================= */

  const apiParams = useMemo(() => {
    const p: any = {};
    if (filters.unit) p.unit = filters.unit;
    if (filters.fmn) p.fmn = filters.fmn;
    if (filters.fromDate) p.fromDate = filters.fromDate;
    if (filters.toDate) p.toDate = filters.toDate;
    if (filters.placeOfOffence) p.placeOfOffence = filters.placeOfOffence;
    if (filters.date) p.date = filters.date;
    if (filters.actionStatus !== "All") p.status = filters.actionStatus;
    return p;
  }, [filters]);

  const { data, isLoading, isError } =
    useGetStaticSpeedRecords(apiParams);

  /* ================= EDIT VIEW DATA ================= */

  const viewingId =
    viewingReport?._id || viewingReport?.originalData?._id || "";

  const { data: viewingFullRecordData } =
    useGetStaticSpeedRecordById(viewingId);

  const finalViewingRecord =
    viewingFullRecordData?.data ||
    viewingFullRecordData ||
    viewingReport?.originalData ||
    viewingReport;

  /* ================= DOWNLOAD ================= */

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

  // RESTORED: Map data to report props ensuring correct structure
  const mapToReportProps = (item: any): StaticSpeedReportProps => {
    const raw = item.originalData || item || {};
    const offence = raw.offenceOccurenceDetails || {};
    const offender = raw.offenders?.[0]?.offenderDetails || {};
    const mp = raw.onDutyDetailsMPReporting || {};
    const witness1 = raw.onDutyWitnessingMps?.[0] || {};
    const witness2 = raw.onDutyWitnessingMps?.[1] || {};
    const val = (v: any) => v || "";

    return {
      reportNo: raw.reportId || raw.reportNo,
      reportDate: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString("en-GB") : "",
      unitName: mp.unit || offender.unit,
      particulars: {
        rider: {
          offenderType: val(offender.offenderType || offender.individualType || raw.offenderType),
          armyNo: val(offender.armyNumber),
          name: val(offender.name),
          rank: val(offender.rank),
          unit: val(mp.unit || offender.unit),
          fmn: val(raw.fmn || offender.fmn),
          address: val(raw.address || offender.address),
          command: val(raw.command || offender.command),
          iCardNo: val(offender.iCardNumber),
          // Pass full details for conditional rendering
          offenderDetails: offender,
        },
        vehicle: {
          baNo: val(raw.vehicleNumber),
          makeAndTake: val(raw.vehicleName),
        },
      },
      occurrence: {
        dateOfDuty: val(raw.date || raw.offenceOccurenceDetails?.time),
        dutyLocation: val(raw.placeOfOffence || raw.offenceOccurenceDetails?.incidentLocation),
        dutyTime: raw.time ? `${raw.time} Hrs` : "",
        nameOfWitnessingOfficial1: val(witness1.name),
        rankOfWitnessingOfficial1: val(witness1.rank),
        nameOfWitnessingOfficial2: val(witness2.name),
        rankOfWitnessingOfficial2: val(witness2.rank),
        statement: val(offence.description),
      },
      offence: {
        actualSpeed: val(offence.actualSpeedNoted),
        authSpeed: val(offence.authSpeed),
        overSpeed: val(offence.overSpeedCalculated),
      },
      witnessSig: {
        armyNo: val(witness1.armyNumber || witness1.ArmyNo),
        rank: val(witness1.rank),
        name: val(witness1.name),
        unit: val(witness1.unit),
      },
      mpSig: {
        armyNo: val(mp.armyNumber),
        name: val(mp.nameReportingMP),
        rank: val(mp.rank),
        unit: val(mp.unit),
      },
      remarks: {
        text: val(raw.remark || raw.remarks),
        station: val(raw.station || raw.placeOfOffence || raw.offenceOccurenceDetails?.incidentLocation),
        dated: new Date().toLocaleDateString("en-GB"),
      },
    };
  };

  const handleDownloadReport = async (item: any) => {
    setIsDownloading(true);
    setDownloadType("Word");
    try {
      generateStaticSpeedWordReport(mapToReportProps(item));
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  // RESTORED AND IMPROVED: PDF Download with error handling
  const handleDownloadPdf = async (item: any) => {
    const id = item._id || item.reportId;
    if (!id) {
      alert("Report ID not found");
      return;
    }
    setIsDownloading(true);
    setDownloadType("PDF");
    try {
      const response = await fetch(`/api/static-speed-report/pdf/${id}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Unknown server error" }));
        throw new Error(errData.error || "Failed to generate PDF");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `StaticSpeedReport-${item.reportNo || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download Error", error);
      alert(`Failed to download PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const handlePrintReport = (item: any) => {
    setViewingReport(item);
    setShouldAutoPrint(true);
  };

  /* ================= CREATE / EDIT SCREEN ================= */

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Button
          onClick={() => {
            setIsCreating(false);
            setEditingReport(null);
          }}
          className="m-4"
        >
          <ArrowLeft /> Back
        </Button>

        <StaticSpeedForm
          existingReport={editingReport}
          onCancel={() => {
            setIsCreating(false);
            setEditingReport(null);
          }}
        />
      </div>
    );
  }

  /* ================= VIEW REPORT ================= */

  if (viewingReport) {
    return (
      <>
        <ReportViewerWrapper
          title="STATIC SPEED CHECK REPORT"
          activeView={viewMode}
          onBack={() => {
            setViewingReport(null);
            setViewMode("report");
            setShouldAutoPrint(false);
          }}
          onViewReport={() => setViewMode("report")}
          onViewAttachments={() => setViewMode("attachments")}
          onDownloadWord={() => handleDownloadReport(finalViewingRecord)}
          onDownloadPdf={() => handleDownloadPdf(finalViewingRecord)}
          onPrint={() => window.print()}
          onEdit={() => {
            setEditingReport(finalViewingRecord);
            setViewingReport(null);
            setIsCreating(true);
          }}
          isDownloading={isDownloading}
          downloadType={downloadType}
        >
          {viewMode === "report" && (
            <StaticSpeedReport {...mapToReportProps(finalViewingRecord)} />
          )}

          {viewMode === "attachments" && (
            <SignedAttachmentsViewer
              record={finalViewingRecord}
              onAttachMore={() => setIsAttachModalOpen(true)}
            />
          )}
        </ReportViewerWrapper>

        <FormAttachmentModal
          isOpen={isAttachModalOpen}
          onClose={() => setIsAttachModalOpen(false)}
          onSave={() => { }}
        />
      </>
    );
  }

  /* ================= MAIN LIST ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportPageHeader
        title="Static Speed Check Reports"
        reportCount={data?.length || 0}
      />

      <ReportFilterBar
        filters={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onAddNew={() => setShowAddOptions(true)}
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">Failed to load</div>
      ) : (
        <StaticSpeedTable
          data={data || []}
          onView={setViewingReport}
          onPrint={handlePrintReport}
          onDownload={handleDownloadReport}
          onEdit={(r) => {
            setEditingReport(r.originalData || r); // Handle wrapped or raw
            setIsCreating(true);
          }}
        />
      )}

      {/* FILE INPUT */}
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept=".csv,.xlsx,.xls,.json"
      />

      {/* ADD MODAL */}
      {showAddOptions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <button
              onClick={() => setShowAddOptions(false)}
              className="float-right"
            >
              <X />
            </button>

            <button
              className="w-full p-4 border mt-4"
              onClick={() => setIsCreating(true)}
            >
              <Plus /> Create Manually
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
