"use client";

import React, { useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Printer,
  Edit,
  Copy,
  Trash,
  Download,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicTable, Column } from "@/components/common/DynamicTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useUpdateMPReport,
  useDeleteMPReport,
} from "@/features/mpReports/hooks";
import MpDetailsCell from "./MpDetailsCell";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ConfirmationModal from "@/components/common/ConfirmationModal";

import OffenderDetailsCell from "@/app/(report-view)/reports/general-traffic-offence-reports/_components/OffenderDetailsCell";
import AttachCertificateModal from "@/components/ui/CertificateAttachModal";

interface MpOccurrenceTableProps {
  data: any[];
  onView?: (item: any) => void;
  onPrint?: (item: any) => void;
  onDownload?: (item: any) => void;
  onEdit?: (item: any) => void;
}

export default function MpOccurrenceTable({
  data,
  onView,
  onPrint,
  onDownload,
  onEdit,
}: MpOccurrenceTableProps) {
  const { mutateAsync: updateReport, isPending: isUpdating } =
    useUpdateMPReport();
  const { mutateAsync: deleteReport, isPending: isDeleting } =
    useDeleteMPReport();

  const [actionRemark, setActionRemark] = React.useState("");
  const [attachModalOpen, setAttachModalOpen] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState<any>(null);

  const [modalState, setModalState] = React.useState<{
    isOpen: boolean;
    reportId: string | null;
    type: "status" | "delete";
    newStatus?: boolean;
  }>({
    isOpen: false,
    reportId: null,
    type: "status",
    newStatus: false,
  });

  const [remarkError, setRemarkError] = React.useState("");

  const handleStatusClick = (reportId: string, currentStatus: boolean) => {
    setActionRemark("");
    setRemarkError("");
    setModalState({
      isOpen: true,
      reportId,
      type: "status",
      newStatus: !currentStatus,
    });
  };

  const handleAttachCertificate = (item: any) => {
    setSelectedReport(item);
    setAttachModalOpen(true);
  };

  const handleDeleteClick = (reportId: string) => {
    setModalState({
      isOpen: true,
      reportId,
      type: "delete",
    });
  };

  const handleConfirm = async () => {
    if (!modalState.reportId) return;

    try {
      if (modalState.type === "status") {
        if (!actionRemark.trim()) {
          setRemarkError("Action remark is required.");
          toast.error("Please add action remark");
          return;
        }

        await updateReport({
          id: modalState.reportId,
          data: {
            actionStatus: modalState.newStatus,
            actionStatusRemark: actionRemark,
          },
        });
        toast.success("Action status updated successfully!");
      } else if (modalState.type === "delete") {
        await deleteReport(modalState.reportId);
        toast.success("Report deleted successfully!");
      }
      setModalState({
        isOpen: false,
        reportId: null,
        type: "status",
        newStatus: false,
      });
      setActionRemark("");
      setRemarkError("");
    } catch (error) {
      toast.error(
        modalState.type === "status"
          ? "Failed to update action status."
          : "Failed to delete report.",
      );
      console.error(error);
    }
  };

  const columns = useMemo<Column<any>[]>(() => {
    return [
      {
        header: "Sr no.",
        cell: (item) => (
          <span className="text-gray-900">{item.displayIndex}</span>
        ),
        className:
          "w-12 text-center sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-r border-gray-200",
        headerClassName:
          "sticky left-0 z-20 bg-gray-50 border-r border-gray-200 w-12",
      },
      {
        header: "Date & Time of Occu.",
        className: "min-w-[120px]",
        cell: (item) => (
          <div>
            <div className="font-semibold text-gray-900">{item.date}</div>
            <div className="text-gray-500 text-xs">{item.time}</div>
          </div>
        ),
      },
      {
        header: "Place of Occu.",
        className: "min-w-[150px]",
        cell: (item) => (
          <div className="font-medium text-gray-900">
            {item.placeOfOccurrence}
          </div>
        ),
      },
      {
        header: "Assigned MP Particulars",
        className: "min-w-[200px]",
        cell: (item) => <MpDetailsCell details={item.assignedMP} />,
      },
      {
        header: "Particulars of Individual/Victim",
        className: "min-w-[200px]",
        cell: (item) => (
          // Using OffenderDetailsCell as a generic Person info cell
          <OffenderDetailsCell
            details={item.victimDetails}
            mpName={item.reportingMPName}
          />
        ),
      },
      {
        header: "Offence Type",
        className: "min-w-[150px]",
        cell: (item) => (
          <div className="font-medium text-gray-900">{item.offenceType}</div>
        ),
      },
      {
        header: "Brief of Occurrence",
        className: "min-w-[250px]",
        cell: (item) => (
          <div className="text-gray-700 text-xs">{item.brief}</div>
        ),
      },
      {
        header: "List of Attached Documents & Statements",
        className: "min-w-[250px]",
        cell: (item) => (
          <ul className="list-decimal pl-4 text-xs text-gray-600 space-y-1">
            {item.documents?.map((doc: any, i: number) => (
              <li key={i}>{doc.statement || "Document"}</li>
            ))}
            {(!item.documents || item.documents.length === 0) && <li>-</li>}
          </ul>
        ),
      },
      {
        header: "Report no.",
        className: "min-w-[140px]",
        cell: (item) => (
          <span className="text-gray-600 text-xs">{item.reportNumber}</span>
        ),
      },
      {
        header: "Initials of MPCR NCO",
        className: "text-center w-24",
        cell: (item) => (
          <div className="w-4 h-4 border border-gray-300 rounded mx-auto"></div>
        ),
      },
      {
        header: "Initials of CO",
        className: "text-center w-24",
        cell: (item) => (
          <div className="w-4 h-4 border border-gray-300 rounded mx-auto"></div>
        ),
      },
      {
        header: "Remark",
        className: "min-w-[100px]",
        cell: (item) => (
          <span className="text-gray-400 text-xs italic">Add Remark</span>
        ),
      },
      {
        header: "Action Status",
        className:
          "text-center w-28 text-xs sticky right-12 z-10 bg-white group-hover:bg-gray-50 border-l border-gray-200",
        headerClassName:
          "text-center w-28 sticky right-12 z-20 bg-gray-50 border-l border-gray-200",
        cell: (item) => {
          const isTaken = item.actionStatus === true;
          return (
            <div
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => {
                if (item._id) {
                  handleStatusClick(item._id, isTaken);
                }
              }}
            >
              <div
                className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                  isTaken ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    isTaken ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </div>
              <span className="text-[10px] text-gray-500 font-medium uppercase">
                {isTaken ? "Taken" : "Pending"}
              </span>
            </div>
          );
        },
      },
      {
        header: "",
        className:
          "text-right w-12 sticky right-0 z-10 bg-white group-hover:bg-gray-50",
        headerClassName: "w-12 sticky right-0 z-20 bg-gray-50",
        cell: (item) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-100"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => onView && onView(item)}
              >
                <Eye className="w-4 h-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => onPrint && onPrint(item)}
              >
                <Printer className="w-4 h-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => onEdit && onEdit(item)}
              >
                <Edit className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="gap-2 cursor-pointer">
                <Copy className="w-4 h-4" />
                Duplicate Report
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => handleAttachCertificate(item)}
              >
                <Paperclip className="w-4 h-4" />
                Attach Signed Certificates / Letters
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={() => {
                  if (item._id) {
                    handleDeleteClick(item._id);
                  }
                }}
              >
                <Trash className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];
  }, [updateReport, onView]);

  const processedData = useMemo(() => {
    console.log("📦 RAW MP TABLE DATA =>", data);

    return data.map((item, index) => {
      console.log("🧾 SINGLE REPORT =>", item);

      return {
        ...item,
        displayIndex: index + 1,

        // ✅ STEP 6 - Evidence
        evidence: item.evidences || item.evidence || [],

        // ✅ STEP 7 - Documents
        documents: item.documents || [],

        // ✅ STEP 8 - Detailed Occurrence
        brief:
          item.detailedOccurrenceReport?.statement ||
          item.detailedOccurrenceReport ||
          item.occurrenceDetails?.description ||
          "",

        // helpful for other columns
        placeOfOccurrence:
          item.occurrenceDetails?.placeOfOccurrence ||
          item.placeOfOccurrence ||
          "",

        offenceType:
          item.occurrenceDetails?.offenceType || item.offenceType || "",
      };
    });
  }, [data]);

  return (
    <>
      <DynamicTable
        data={processedData}
        columns={columns}
        className="no-scrollbar"
      />
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirm}
        title={
          modalState.type === "status"
            ? "Change Action Status"
            : "Delete Report"
        }
        message={
          modalState.type === "status"
            ? `Are you sure you want to change the status to ${
                modalState.newStatus ? "Taken" : "Pending"
              }?`
            : "Are you sure you want to delete this report? This action cannot be undone."
        }
        confirmLabel={
          modalState.type === "status" ? "Yes, Change" : "Yes, Delete"
        }
        isProcessing={isUpdating || isDeleting}
        variant={modalState.type === "status" ? "info" : "danger"}
      >
        {modalState.type === "status" && (
          <div className="flex flex-col gap-2 mt-2">
            <Label htmlFor="remark">
              Action Remark <span className="text-red-500">*</span>
            </Label>
            <Input
              id="remark"
              placeholder="Enter reason for status change..."
              value={actionRemark}
              onChange={(e) => {
                setActionRemark(e.target.value);
                if (e.target.value.trim()) setRemarkError("");
              }}
              className={
                remarkError ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {remarkError && (
              <span className="text-xs text-red-500 mt-1">{remarkError}</span>
            )}
          </div>
        )}
      </ConfirmationModal>
      <AttachCertificateModal
        isOpen={attachModalOpen}
        reportId={selectedReport?._id}
        reportType="mp"
        onClose={() => {
          setAttachModalOpen(false);
          setSelectedReport(null);
        }}
        onSave={() => {
          toast.success("Certificate attached successfully");
          setAttachModalOpen(false);
          setSelectedReport(null);
        }}
      />
    </>
  );
}
