"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Printer, MoreVertical, Trash } from "lucide-react";
import { DynamicTable, Column } from "@/components/common/DynamicTable";
import {
  useDeleteMTAccidentReport,
  useUpdateMTAccidentReport,
} from "../hooks/useMTAccidentReport";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "react-toastify";

interface MTAccidentTableProps {
  data: any[];
  onEdit: (id: string) => void;
  onView?: (item: any) => void;
  onPrint?: (item: any) => void;
}

export default function MTAccidentTable({
  data,
  onEdit,
  onView,
  onPrint,
}: MTAccidentTableProps) {
  console.log("MTAccidentTable - data received:", data);
  console.log("MTAccidentTable - data length:", data?.length || 0);
  
  const { mutateAsync: deleteReport, isPending: isDeleting } =
    useDeleteMTAccidentReport();
  const { mutateAsync: updateReport, isPending: isUpdating } =
    useUpdateMTAccidentReport();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    recordId: string | null;
    type: "status" | "delete";
    newStatus?: boolean;
  }>({
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
        await updateReport({
          id: modalState.recordId,
          data: { actionStatus: modalState.newStatus },
        });
        toast.success("Action status updated successfully!");
      } else if (modalState.type === "delete") {
        await deleteReport(modalState.recordId);
        toast.success("Report deleted successfully!");
      }
      setModalState({
        isOpen: false,
        recordId: null,
        type: "status",
        newStatus: false,
      });
    } catch (error) {
      toast.error(
        modalState.type === "status"
          ? "Failed to update action status."
          : "Failed to delete report."
      );
      console.error(error);
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Sr no.",
      cell: (_, index) => (
        <span className="font-medium text-gray-900">{index + 1}</span>
      ),
      className: "w-16 text-center bg-gray-50/50",
    },
    {
      header: "Particulars of Individual/Victim",
      cell: (item) => {
        const hasIndividualDetails = item.individualDetails && Object.keys(item.individualDetails).length > 0;
        const d = hasIndividualDetails
          ? item.individualDetails
          : {
              armyNumber: item.armyNumber,
              aadharNumber: item.aadharNumber,
              rank: item.rank,
              name: item.name,
              mpName: item.mpName,
            };
        return (
          <div className="space-y-1 text-xs min-w-[180px]">
            {d.armyNumber && (
              <div className="flex gap-1">
                <span className="font-semibold text-gray-700 w-16 shrink-0">
                  Army no.:
                </span>
                <span>{d.armyNumber}</span>
              </div>
            )}
            {d.aadharNumber && (
              <div className="flex gap-1">
                <span className="font-semibold text-gray-700 w-16 shrink-0">
                  Aadhar No.:
                </span>
                <span>{d.aadharNumber}</span>
              </div>
            )}
            {d.rank && (
              <div className="flex gap-1">
                <span className="font-semibold text-gray-700 w-16 shrink-0">
                  Rank:
                </span>
                <span>{d.rank}</span>
              </div>
            )}
            {d.name && (
              <div className="flex gap-1">
                <span className="font-semibold text-gray-700 w-16 shrink-0">
                  Name:
                </span>
                <span className="font-medium">{d.name}</span>
              </div>
            )}
            {d.mpName && (
              <div className="flex gap-1">
                <span className="font-semibold text-gray-700 w-16 shrink-0">
                  MP Name:
                </span>
                <span>{d.mpName}</span>
              </div>
            )}
            {!d.name && item.individualType && (
              <div className="flex gap-1">
                <span className="font-semibold text-gray-700 w-16 shrink-0">Type:</span>
                <span className="font-medium">{item.individualType}</span>
              </div>
            )}
          </div>
        );
      },
      className: "align-top",
    },
    // {
    //   header: "Driver / Co-Driver Details",
    //   cell: (item) => {
    //     let offenders = item.offenders || [];

    //     // If no offenders array, try to build from driver/co-driver top-level fields
    //     if (!offenders || offenders.length === 0) {
    //       const built: any[] = [];
    //       if (item.driverDetails && Object.keys(item.driverDetails).length > 0) {
    //         built.push({ offenderDetails: item.driverDetails, offenderType: item.driverType || "Driver", category: "Driver" });
    //       }
    //       if (item.coDriverDetails && Object.keys(item.coDriverDetails).length > 0) {
    //         built.push({ offenderDetails: item.coDriverDetails, offenderType: item.coDriverDetails.type || "Co-Driver", category: "Co-Driver" });
    //       }
    //       // top-level driver name fallback
    //       if (item.driverName || item.driver) {
    //         built.push({ offenderDetails: { name: item.driverName || item.driver }, offenderType: item.driverType || "Driver", category: "Driver" });
    //       }

    //       if (built.length > 0) offenders = built;
    //     }

    //     if (!offenders || offenders.length === 0) {
    //       return <span className="text-xs text-gray-400">--</span>;
    //     }
    //     return (
    //       <div className="space-y-2 text-xs min-w-[200px]">
    //         {offenders.map((offender: any, idx: number) => {
    //           // Support legacy shapes where offender may be stored directly as details
    //           const details = offender?.offenderDetails || offender || {};
    //           const type = offender?.offenderType || offender?.category || offender?.type || "Unknown";
    //           return (
    //             <div key={idx} className="border-l-2 border-blue-300 pl-2">
    //               <div className="font-semibold text-blue-700 mb-1">{type}</div>
    //               {details.name && (
    //                 <div className="flex gap-1">
    //                   <span className="font-semibold text-gray-700 w-12 shrink-0">Name:</span>
    //                   <span className="font-medium">{details.name}</span>
    //                 </div>
    //               )}
    //               {details.rank && (
    //                 <div className="flex gap-1">
    //                   <span className="font-semibold text-gray-700 w-12 shrink-0">Rank:</span>
    //                   <span>{details.rank}</span>
    //                 </div>
    //               )}
    //               {details.armyNumber && (
    //                 <div className="flex gap-1">
    //                   <span className="font-semibold text-gray-700 w-12 shrink-0">Army:</span>
    //                   <span>{details.armyNumber}</span>
    //                 </div>
    //               )}
    //               {details.unit && (
    //                 <div className="flex gap-1">
    //                   <span className="font-semibold text-gray-700 w-12 shrink-0">Unit:</span>
    //                   <span>{details.unit}</span>
    //                 </div>
    //               )}
    //             </div>
    //           );
    //         })}
    //       </div>
    //     );
    //   },
    //   className: "align-top",
    // },
    {
      header: "Unit",
      cell: (item) => {
        const unit = item.unit || item.individualDetails?.unit || item.offenders?.[0]?.offenderDetails?.unit || item.driverDetails?.unit || "";
        return <span className="text-xs font-medium">{unit || "--"}</span>;
      },
      className: "min-w-[120px] text-xs",
    },
    {
      header: "FMN",
      cell: (item) => {
        const fmn = item.fmn || item.individualDetails?.fmn || item.offenders?.[0]?.offenderDetails?.fmn || item.driverDetails?.fmn || "";
        return <span className="text-xs font-medium">{fmn || "--"}</span>;
      },
      className: "min-w-[100px] text-xs",
    },
    {
      header: "Date & Time of Accident",
      cell: (item) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium">
            {item.dateOfAccident
              ? new Date(item.dateOfAccident).toLocaleDateString("en-GB")
              : "-"}
          </span>
          <span className="text-gray-500">
            {item.timeOfAccident || "--:--"}
          </span>
        </div>
      ),
      className: "min-w-[130px]",
    },
    {
      header: "Place of Accident",
      accessorKey: "placeOfAccident",
      className: "text-xs min-w-[150px]",
    },
    {
      header: "Veh. BA No. / Make & Take",
      cell: (item) => (
        <div className="flex flex-col text-xs space-y-0.5">
          <span className="font-medium">{item.vehicleNumber || "N/A"}</span>
          <span className="text-gray-500">{item.makeAndModel || "-"}</span>
        </div>
      ),
      className: "text-xs min-w-[140px]",
    },
    {
      header: "Type of Accident",
      cell: (item) => (
        <span
          className={`px-2 py-1 rounded text-[10px] uppercase font-semibold tracking-wide ${item.typeOfAccident === "Fatal" ||
              item.typeOfAccident === "Very Serious"
              ? "bg-red-50 text-red-700 border border-red-100"
              : item.typeOfAccident === "Serious"
                ? "bg-orange-50 text-orange-700 border border-orange-100"
                : "bg-green-50 text-green-700 border border-green-100"
            }`}
        >
          {item.typeOfAccident || "-"}
        </span>
      ),
      className: "min-w-[110px]",
    },
    // Casualties - Flattened for DynamicTable
    {
      header: (
        <div className="flex flex-col items-center leading-tight">
          <span>Injured</span>
          <span className="text-[10px]">(Civ)</span>
        </div>
      ),
      accessorKey: "injuredCivil",
      className: "text-center text-xs min-w-[80px]",
      headerGroup: "No. of Casualty",
    },
    {
      header: (
        <div className="flex flex-col items-center leading-tight">
          <span>Injured</span>
          <span className="text-[10px]">(Mil)</span>
        </div>
      ),
      accessorKey: "injuredMilitary",
      className: "text-center text-xs min-w-[80px]",
      headerGroup: "No. of Casualty",
    },
    {
      header: (
        <div className="flex flex-col items-center leading-tight">
          <span>Died</span>
          <span className="text-[10px]">(Civ)</span>
        </div>
      ),
      accessorKey: "diedCivil",
      className: "text-center text-xs min-w-[80px]",
      headerGroup: "No. of Casualty",
    },
    {
      header: (
        <div className="flex flex-col items-center leading-tight">
          <span>Died</span>
          <span className="text-[10px]">(Mil)</span>
        </div>
      ),
      accessorKey: "diedMilitary",
      className: "text-center text-xs min-w-[80px]",
      headerGroup: "No. of Casualty",
    },
    {
      header: "Probable Cause of Accident",
      accessorKey: "probableCause",
      className: "text-xs min-w-[180px]",
      cell: (item) => (
        <div className="line-clamp-2" title={item.probableCause}>
          {item.probableCause || "-"}
        </div>
      ),
    },
    {
      header: "FIR/MACT Status",
      cell: (item) => (
        <span className="text-xs">{item.firCaseNumber || "--"}</span>
      ),
      className: "min-w-[100px]",
    },
    {
      header: "Report no.",
      cell: (item) => (
        <span className="text-xs font-mono text-gray-600">
          {item.reportNumber || "PRO/21 CPU/..."}
        </span>
      ),
      className: "min-w-[140px]",
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
              className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${isTaken ? "bg-green-500" : "bg-red-500"
                }`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isTaken ? "translate-x-5" : "translate-x-0"
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
              onClick={() => onEdit(item._id)}
            >
              <Edit className="w-4 h-4" />
              Edit
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

  return (
    <div className="w-full">
      <DynamicTable
        data={data}
        columns={columns}
        emptyMessage="No MT Accident reports found"
        className="min-h-[500px]"
        bordered={true}
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
            ? `Are you sure you want to change the status to ${modalState.newStatus ? "Taken" : "Pending"
            }?`
            : "Are you sure you want to delete this report? This action cannot be undone."
        }
        confirmLabel={
          modalState.type === "status" ? "Yes, Change" : "Yes, Delete"
        }
        isProcessing={isUpdating || isDeleting}
      />
    </div>
  );
}
