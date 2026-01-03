"use client";

import React, { useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Printer,
  Edit,
  Copy,
  Trash,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicTable, Column } from "@/components/common/DynamicTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OffenderDetailsCell from "@/app/general-traffic-offence-reports/_components/OffenderDetailsCell";
import { useUpdateStaticSpeedRecord, useDeleteStaticSpeedRecord } from "@/features/staticSpeed/hooks";
import { toast } from "react-toastify";

import ConfirmationModal from "@/components/common/ConfirmationModal";


interface StaticSpeedTableProps {
  data: any[];
  onView?: (item: any) => void;
  onPrint?: (item: any) => void;
  onDownload?: (item: any) => void;
}

export default function StaticSpeedTable({ data, onView, onPrint, onDownload }: StaticSpeedTableProps) {
  const { mutateAsync: updateRecord, isPending: isUpdating } = useUpdateStaticSpeedRecord();
  const { mutateAsync: deleteRecord, isPending: isDeleting } = useDeleteStaticSpeedRecord();
  const [modalState, setModalState] = React.useState<{ isOpen: boolean; recordId: string | null; type: "status" | "delete"; newStatus?: boolean }>({
    isOpen: false,
    recordId: null,
    type: "status",
    newStatus: false,
  });

  const handleStatusClick = (recordId: string, currentStatus: boolean) => {
    setModalState({
      isOpen: true,
      recordId,
      type: "status",
      newStatus: !currentStatus,
    });
  };

  const handleDeleteClick = (recordId: string) => {
    setModalState({
      isOpen: true,
      recordId,
      type: "delete",
    });
  };

  const handleConfirm = async () => {
    if (!modalState.recordId) return;

    try {
      if (modalState.type === "status") {
        await updateRecord({
          id: modalState.recordId,
          data: { actionStatus: modalState.newStatus },
        });
        toast.success("Action status updated successfully!");
      } else if (modalState.type === "delete") {
        await deleteRecord(modalState.recordId);
        toast.success("Report deleted successfully!");
      }
      setModalState({ isOpen: false, recordId: null, type: "status", newStatus: false });
    } catch (error) {
      toast.error(modalState.type === "status" ? "Failed to update action status." : "Failed to delete report.");
      console.error(error);
    }
  };

  const columns = useMemo<Column<any>[]>(() => {
    return [
      {
        header: "Sr no.",
        cell: (item) => <span className="text-gray-900">{item.displayIndex}</span>,
        className: "w-12 text-center sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-r border-gray-200",
        headerClassName: "sticky left-0 z-20 bg-gray-50 border-r border-gray-200 w-12"
      },
      {
        header: "Place of Offence",
        className: "min-w-[150px]",
        cell: (item) => (
          <div>
            <div className="font-medium text-gray-900">{item.placeOfOffence || "Unknown"}</div>
            <div className="text-gray-500 font-normal mt-1">{item.subLocation || "SI Line Military Station"}</div>
          </div>
        )
      },
      {
        header: "Date & Time",
        className: "min-w-[120px]",
        cell: (item) => (
          <div>
            <div className="font-semibold text-gray-900">{item.date}</div>
            <div className="text-gray-500 text-xs">{item.time}</div>
          </div>
        )
      },
      {
        header: "Particulars of Driver/Rider",
        className: "min-w-[200px]",
        cell: (item) => (
          <OffenderDetailsCell details={item.driverDetails} mpName={item.mpName} />
        )
      },
      {
        header: "Unit",
        className: "min-w-[100px]",
        cell: (item) => item.unit
      },
      {
        header: "FMN",
        className: "min-w-[100px]",
        cell: (item) => item.fmn
      },
      {
        header: "Offence Brief",
        className: "min-w-[180px]",
        cell: (item) => (
          <div className="text-gray-700 text-xs max-w-xs">{item.offenceBrief}</div>
        )
      },
      {
        header: "Veh. BA No. / Make & Take",
        className: "min-w-[150px]",
        cell: (item) => (
          <div>
            <div className="font-semibold text-gray-900">{item.vehicleNo}</div>
            <div className="text-gray-500 text-xs">{item.vehicleModel}</div>
          </div>
        )
      },
      {
        header: "Report no.",
        className: "min-w-[140px]",
        cell: (item) => <span className="text-gray-600 text-xs">{item.reportNo}</span>
      },
      {
        header: "Auth. Speed",
        className: "min-w-[100px]",
        cell: (item) => <span className="font-semibold text-gray-900">{item.authSpeed} KMPH</span>
      },
      {
        header: "Actual Speed",
        className: "min-w-[100px]",
        cell: (item) => <span className="font-semibold text-gray-900">{item.actualSpeed} KMPH</span>
      },
      {
        header: "Over Speed",
        className: "min-w-[100px]",
        cell: (item) => <span className="font-bold text-gray-900">{item.overSpeed} KMPH</span>
      },
      {
        header: "Particulars of Co-Driver/Rider",
        className: "min-w-[200px]",
        cell: (item) => {
          if (!item.coDriverDetails) return <span className="text-gray-400">-</span>;
          return <OffenderDetailsCell details={item.coDriverDetails} mpName={item.mpName} />;
        }
      },
      {
        header: "Action Status",
        className: "text-center w-28 text-xs sticky right-12 z-10 bg-white group-hover:bg-gray-50 border-l border-gray-200",
        headerClassName: "text-center w-28 sticky right-12 z-20 bg-gray-50 border-l border-gray-200",
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
              <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${isTaken ? 'bg-green-500' : 'bg-red-500'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isTaken ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-[10px] text-gray-500 font-medium uppercase">{isTaken ? "Taken" : "Pending"}</span>
            </div>
          );
        }
      },
      {
        header: "",
        className: "text-right w-12 sticky right-0 z-10 bg-white group-hover:bg-gray-50",
        headerClassName: "w-12 sticky right-0 z-20 bg-gray-50",
        cell: (item) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
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
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Edit className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="gap-2 cursor-pointer">
                <Copy className="w-4 h-4" />
                Duplicate Report
              </DropdownMenuItem> */}
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
        )
      }
    ];
  }, [updateRecord, onView]);

  const processedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      displayIndex: index + 1
    }));
  }, [data]);

  return (
    <>
      <DynamicTable data={processedData} columns={columns} className="no-scrollbar" />
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirm}
        title={modalState.type === "status" ? "Change Action Status" : "Delete Report"}
        message={
          modalState.type === "status"
            ? `Are you sure you want to change the status to ${modalState.newStatus ? "Taken" : "Pending"}?`
            : "Are you sure you want to delete this report? This action cannot be undone."
        }
        confirmLabel={modalState.type === "status" ? "Yes, Change" : "Yes, Delete"}
        isProcessing={isUpdating || isDeleting}
      />
    </>
  );
}
