


"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ImmediateReportingIncidentTable from "@/features/immediateReportingIncident/components/immediateReportingIncidentTable";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";
import ImmediateReportingIncidentReport from "@/components/reports/ImmediateReportingIncident";
import { generateImmediateIncidentWordReport } from "@/utils/generateImmediateIncidentWordReport";
import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";

export default function ImmediateReportingIncidentReportsPage() {
  const router = useRouter();

  const [viewingReport, setViewingReport] =
    useState<ImmediateReportingIncident | null>(null);

  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] =
    useState<"PDF" | "Word" | null>(null);

  /* ================= NORMALIZE DATA ================= */
  const reportData = useMemo(() => {
    if (!viewingReport) return null;

    // handle nested API responses
    return (viewingReport as any)?.data || viewingReport;
  }, [viewingReport]);

  const handleAddNew = () => {
    router.push("/create-record/immediate-reporting-incident");
  };

  const handleEdit = (item: ImmediateReportingIncident) => {
    router.push(`/create-record/immediate-reporting-incident?id=${item._id}`);
  };

  /* ================= AUTO PRINT ================= */
  useEffect(() => {
    if (reportData && shouldAutoPrint) {
      const t = setTimeout(() => {
        window.print();
        setShouldAutoPrint(false);
      }, 500);

      return () => clearTimeout(t);
    }
  }, [reportData, shouldAutoPrint]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = async () => {
    if (!reportData) return;

    setIsDownloading(true);
    setDownloadType("Word");

    try {
      await generateImmediateIncidentWordReport(reportData);
    } catch (error) {
      console.error("Failed to generate Word report:", error);
      alert("Failed to generate Word report");
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportData?._id) return;

    setIsDownloading(true);
    setDownloadType("PDF");

    try {
      const response = await fetch(
        `/api/immediate-reporting-incident/pdf/${reportData._id}`
      );

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Incident_Report_${reportData._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF report");
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  /* ================= VIEW MODE ================= */
  if (reportData) {
    return (
      <ReportViewerWrapper
        title="IMMEDIATE REPORTING OF INCIDENT"
        onBack={() => {
          setViewingReport(null);
          setShouldAutoPrint(false);
        }}
        onEdit={() => handleEdit(reportData)}
        isDownloading={isDownloading}
        downloadType={downloadType}
        onDownloadWord={handleDownloadWord}
        onDownloadPdf={handleDownloadPdf}
        onPrint={handlePrint}
      >
        <div style={{ padding: "48px" }}>
          <ImmediateReportingIncidentReport data={reportData} />
        </div>
      </ReportViewerWrapper>
    );
  }

  /* ================= TABLE MODE ================= */
  return (
    <div className="h-full bg-gray-50 p-6 overflow-hidden flex flex-col">
      <ImmediateReportingIncidentTable
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onView={setViewingReport}
      />
    </div>
  );
}


