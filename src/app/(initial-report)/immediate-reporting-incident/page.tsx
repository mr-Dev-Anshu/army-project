// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import ImmediateReportingIncidentTable from "@/features/immediateReportingIncident/components/immediateReportingIncidentTable";
// import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";
// import ImmediateReportingIncidentReport from "@/components/reports/ImmediateReportingIncident";
// import { generateImmediateIncidentWordReport } from "@/utils/generateImmediateIncidentWordReport";
// import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";

// export default function ImmediateReportingIncidentReportsPage() {
//     const router = useRouter();
//     const [viewingReport, setViewingReport] = useState<ImmediateReportingIncident | null>(null);
//     const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
//     const [isDownloading, setIsDownloading] = useState(false);
//     const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

//     const handleAddNew = () => {
//         router.push("/create-record/immediate-reporting-incident");
//     };

//     const handleEdit = (item: ImmediateReportingIncident) => {
//         router.push(`/create-record/immediate-reporting-incident?id=${item._id}`);
//     };

//     /* ================= AUTO PRINT ================= */
//     useEffect(() => {
//         if (viewingReport && shouldAutoPrint) {
//             const t = setTimeout(() => {
//                 window.print();
//                 setShouldAutoPrint(false);
//             }, 500);
//             return () => clearTimeout(t);
//         }
//     }, [viewingReport, shouldAutoPrint]);

//     const handlePrint = () => {
//         window.print();
//     };

//     const handleDownloadWord = async () => {
//         if (!viewingReport) return;
//         setIsDownloading(true);
//         setDownloadType("Word");
//         try {
//             await generateImmediateIncidentWordReport(viewingReport);
//         } catch (error) {
//             console.error("Failed to generate Word report:", error);
//             alert("Failed to generate Word report");
//         } finally {
//             setIsDownloading(false);
//             setDownloadType(null);
//         }
//     };

//     const handleDownloadPdf = async () => {
//         if (!viewingReport?._id) return;
//         setIsDownloading(true);
//         setDownloadType("PDF");
//         try {
//             const response = await fetch(`/api/immediate-reporting-incident/pdf/${viewingReport._id}`);
//             if (!response.ok) throw new Error("Failed to generate PDF");

//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = `Incident_Report_${viewingReport._id}.pdf`;
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error("Failed to generate PDF:", error);
//             alert("Failed to generate PDF report");
//         } finally {
//             setIsDownloading(false);
//             setDownloadType(null);
//         }
//     };

//     if (viewingReport) {
//         return (
//             <ReportViewerWrapper
//                 title="IMMEDIATE REPORTING OF INCIDENT"
//                 onBack={() => {
//                     setViewingReport(null);
//                     setShouldAutoPrint(false);
//                 }}
//                 onEdit={() => handleEdit(viewingReport)}
//                 isDownloading={isDownloading}
//                 downloadType={downloadType}
//                 onDownloadWord={handleDownloadWord}
//                 onDownloadPdf={handleDownloadPdf}
//                 onPrint={handlePrint}
//             >
//                 <div style={{ padding: "48px" }}>
//                     <ImmediateReportingIncidentReport data={viewingReport} />
//                 </div>
//             </ReportViewerWrapper>
//         );
//     }

//     return (
//         <div className="h-full bg-gray-50 p-6 overflow-hidden flex flex-col">
//             <ImmediateReportingIncidentTable
//                 onAddNew={handleAddNew}
//                 onEdit={handleEdit}
//                 onView={setViewingReport}
//             />
//         </div>
//     );
// }


"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ImmediateReportingIncidentTable from "@/features/immediateReportingIncident/components/immediateReportingIncidentTable";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";
import ImmediateReportingIncidentReport from "@/components/reports/ImmediateReportingIncident";

import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";
import FormAttachmentModal from "@/components/ui/FormAttachmentModal";

import { useUpdateImmediateReportingIncident } from "@/features/immediateReportingIncident/hooks";
import { toast } from "react-toastify";

export default function ImmediateReportingIncidentReportsPage() {
  const router = useRouter();

  const [viewingReport, setViewingReport] =
    useState<ImmediateReportingIncident | null>(null);

  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] =
    useState<"PDF" | "Word" | null>(null);

  /* ================= ATTACHMENT MODAL STATE ================= */
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [recordForAttachment, setRecordForAttachment] = useState<any | null>(null);

  const handleAttach = (item: any) => {
    // If we are viewing a report, we might be attaching to it.
    // If called from table row, item is passed.
    setRecordForAttachment(item);
    setIsAttachModalOpen(true);
  };

  const { mutateAsync: updateReport } = useUpdateImmediateReportingIncident();

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

  const handleAttachSave = async (newAttachments: any[]) => {
    // If viewingReport is open, use reportData. Else use recordForAttachment.
    const target = reportData || recordForAttachment;
    // Normalize if needed (though recordForAttachment from table is likely the raw item)
    // reportData is already normalized from viewingReport

    // If target has .data structure (from API response), use .data
    // reportData logic above: (viewingReport as any)?.data || viewingReport
    const targetData = (target as any)?.data || target;

    if (!targetData?._id) return;

    try {
      const currentAttachments = targetData.customFields?.attachments || [];
      const updatedAttachments = [...currentAttachments, ...newAttachments];

      await updateReport({
        id: targetData._id,
        data: {
          // @ts-ignore
          customFields: {
            ...targetData.customFields,
            attachments: updatedAttachments,
          },
        },
      });

      toast.success("Attachments Added Successfully");

      toast.success("Attachments Added Successfully");

      // If we are viewing THIS report, update local state
      if (viewingReport) {
        const viewingId = (viewingReport as any)?.data?._id || viewingReport._id;
        if (viewingId === targetData._id) {
          setViewingReport((prev: any) => {
            const prevData = (prev as any)?.data || prev;
            return {
              ...prevData,
              customFields: {
                ...prevData.customFields,
                attachments: updatedAttachments
              }
            }
          });
        }
      }

      setIsAttachModalOpen(false);
      setRecordForAttachment(null);

    } catch (error) {
      console.error(error);
      toast.error("Failed to add attachments");
    }
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
        onAttach={handleAttach}
      />

      {isAttachModalOpen && (
        <FormAttachmentModal
          isOpen={isAttachModalOpen}
          onClose={() => {
            setIsAttachModalOpen(false);
            setRecordForAttachment(null);
          }}
          onSave={handleAttachSave}
        />
      )}
    </div>
  );
}


