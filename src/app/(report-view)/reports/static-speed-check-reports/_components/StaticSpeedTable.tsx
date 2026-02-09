// "use client";

// import React, { useMemo } from "react";
// import {
//   MoreVertical,
//   Eye,
//   Printer,
//   Edit,
//   Copy,
//   Trash,
//   Download,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { DynamicTable, Column } from "@/components/common/DynamicTable";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import OffenderDetailsCell from "@/app/(report-view)/reports/general-traffic-offence-reports/_components/OffenderDetailsCell";
// import MpDetailsCell from "@/app/(report-view)/reports/mp-occurrence-reports/_components/MpDetailsCell";
// import {
//   useUpdateStaticSpeedRecord,
//   useDeleteStaticSpeedRecord,
// } from "@/features/staticSpeed/hooks";
// import { toast } from "react-toastify";

// import ConfirmationModal from "@/components/common/ConfirmationModal";

// interface StaticSpeedTableProps {
//   data: any[];
//   onView?: (item: any) => void;
//   onPrint?: (item: any) => void;
//   onDownload?: (item: any) => void;
//   onEdit?: (item: any) => void;
// }

// export default function StaticSpeedTable({
//   data,
//   onView,
//   onPrint,
//   onDownload,
// }: StaticSpeedTableProps) {
//   const { mutateAsync: updateRecord, isPending: isUpdating } =
//     useUpdateStaticSpeedRecord();
//   const { mutateAsync: deleteRecord, isPending: isDeleting } =
//     useDeleteStaticSpeedRecord();
//   const [actionRemark, setActionRemark] = React.useState(""); // New state

//   const [modalState, setModalState] = React.useState<{
//     isOpen: boolean;
//     recordId: string | null;
//     type: "status" | "delete";
//     newStatus?: boolean;
//   }>({
//     isOpen: false,
//     recordId: null,
//     type: "status",
//     newStatus: false,
//   });

//   const [remarkError, setRemarkError] = React.useState("");

//   const handleStatusClick = (recordId: string, currentStatus: boolean) => {
//     setActionRemark(""); // Reset
//     setRemarkError("");
//     setModalState({
//       isOpen: true,
//       recordId,
//       type: "status",
//       newStatus: !currentStatus,
//     });
//   };

//   const handleDeleteClick = (recordId: string) => {
//     setModalState({
//       isOpen: true,
//       recordId,
//       type: "delete",
//     });
//   };

//   const handleConfirm = async () => {
//     if (!modalState.recordId) return;

//     try {
//       if (modalState.type === "status") {
//         if (!actionRemark.trim()) {
//           setRemarkError("Action remark is required.");
//           toast.error("Please add action remark");
//           return;
//         }

//         await updateRecord({
//           id: modalState.recordId,
//           data: {
//             actionStatus: modalState.newStatus,
//             actionStatusRemark: actionRemark, // Include remark
//           },
//         });
//         toast.success("Action status updated successfully!");
//       } else if (modalState.type === "delete") {
//         await deleteRecord(modalState.recordId);
//         toast.success("Report deleted successfully!");
//       }
//       setModalState({
//         isOpen: false,
//         recordId: null,
//         type: "status",
//         newStatus: false,
//       });
//       setActionRemark(""); // Clear
//       setRemarkError("");
//     } catch (error) {
//       toast.error(
//         modalState.type === "status"
//           ? "Failed to update action status."
//           : "Failed to delete report.",
//       );
//       console.error(error);
//     }
//   };

//   const columns = useMemo<Column<any>[]>(() => {
//     return [
//       {
//         header: "Sr no.",
//         cell: (item) => (
//           <span className="text-gray-900">{item.displayIndex}</span>
//         ),
//         className:
//           "w-12 text-center sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-r border-gray-300",
//         headerClassName:
//           "sticky left-0 z-20 bg-gray-50 border-r border-gray-300 w-12",
//       },
//       {
//         header: "Place of Offence",
//         className: "min-w-[150px] border-r border-gray-300",
//         cell: (item) => (
//           <div>
//             <div className="font-medium text-gray-900">
//               {item.placeOfOffence}
//             </div>
//             <div className="text-gray-500 font-normal mt-1">
//               {item.subLocation}
//             </div>
//           </div>
//         ),
//       },
//       {
//         header: "Date & Time",
//         className: "min-w-[120px] border-r border-gray-300",
//         cell: (item) => (
//           <div>
//             <div className="font-semibold text-gray-900">{item.date}</div>
//             <div className="text-gray-500 text-xs">{item.time}</div>
//           </div>
//         ),
//       },
//       {
//         header: "Particulars of Driver/Rider",
//         className: "min-w-[200px] border-r border-gray-300",
//         cell: (item) => (
//           <div className="flex flex-col gap-2">
//             {item.driverDetails ? (
//               <OffenderDetailsCell details={item.driverDetails} mpName="" />
//             ) : (
//               ""
//             )}
//             {item.mpDetails &&
//               Object.values(item.mpDetails).some((val) => val) && (
//                 <div className="pt-2 border-t border-dashed border-gray-300">
//                   <div className="font-semibold text-xs text-gray-900 mb-1">
//                     MP Details:
//                   </div>
//                   <MpDetailsCell details={item.mpDetails} />
//                 </div>
//               )}
//           </div>
//         ),
//       },
//       {
//         header: "Unit",
//         className: "min-w-[100px] border-r border-gray-300",
//         cell: (item) => item.unit,
//       },
//       {
//         header: "FMN",
//         className: "min-w-[100px] border-r border-gray-300",
//         cell: (item) => item.fmn,
//       },
//       {
//         header: "Offence Brief",
//         className: "min-w-[180px] border-r border-gray-300",
//         cell: (item) => (
//           <div className="text-gray-700 text-xs max-w-xs">
//             {item.offenceBrief}
//           </div>
//         ),
//       },
//       {
//         header: "Veh. BA No. / Make & Take",
//         className: "min-w-[150px] border-r border-gray-300",
//         cell: (item) => (
//           <div>
//             <div className="font-semibold text-gray-900">{item.vehicleNo}</div>
//             <div className="text-gray-500 text-xs">{item.vehicleModel}</div>
//           </div>
//         ),
//       },
//       {
//         header: "Report no.",
//         className: "min-w-[140px] border-r border-gray-300",
//         cell: (item) => (
//           <span className="text-gray-600 text-xs">{item.reportNo}</span>
//         ),
//       },
//       {
//         header: "Auth. Speed",
//         className: "min-w-[100px] border-r border-gray-300",
//         cell: (item) => (
//           <span className=" text-gray-900">{item.authSpeed} KMPH</span>
//         ),
//       },
//       {
//         header: "Actual Speed",
//         className: "min-w-[100px] border-r border-gray-300",
//         cell: (item) => (
//           <span className="text-gray-900">{item.actualSpeed} KMPH</span>
//         ),
//       },
//       {
//         header: "Over Speed",
//         className: "min-w-[100px] border-r border-gray-300",
//         cell: (item) => (
//           <span className="font-semibold text-gray-900">
//             {item.overSpeed} KMPH
//           </span>
//         ),
//       },
//       {
//         header: "Particulars of Co-Driver/Rider",
//         className: "min-w-[200px] border-r border-gray-300",
//         cell: (item) => {
//           if (!item.coDriverDetails)
//             return <span className="text-gray-400">-</span>;

//           return (
//             <div className="flex flex-col gap-2">
//               <OffenderDetailsCell details={item.coDriverDetails} mpName="" />

//               {item.mpDetails &&
//                 Object.values(item.mpDetails).some((val) => val) && (
//                   <div className="pt-2 border-t border-dashed border-gray-300">
//                     <div className="font-semibold text-xs text-gray-900 mb-1">
//                       MP Details:
//                     </div>
//                     <MpDetailsCell details={item.mpDetails} />
//                   </div>
//                 )}
//             </div>
//           );
//         },
//       },
//       {
//         header: "Action Status",
//         className:
//           "text-center w-28 text-xs sticky right-12 z-10 bg-white group-hover:bg-gray-50 border-l border-gray-300",
//         headerClassName:
//           "text-center w-28 sticky right-12 z-20 bg-gray-50 border-l border-gray-300",
//         cell: (item) => {
//           const isTaken = item.actionStatus === true;
//           return (
//             <div
//               className="flex flex-col items-center gap-1 cursor-pointer"
//               onClick={() => {
//                 if (item._id) {
//                   handleStatusClick(item._id, isTaken);
//                 }
//               }}
//             >
//               <div
//                 className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${
//                   isTaken ? "bg-green-500" : "bg-red-500"
//                 }`}
//               >
//                 <div
//                   className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
//                     isTaken ? "translate-x-5" : "translate-x-0"
//                   }`}
//                 ></div>
//               </div>
//               <span className="text-[10px] text-gray-500 font-medium uppercase">
//                 {isTaken ? "Taken" : "Pending"}
//               </span>
//             </div>
//           );
//         },
//       },
//       {
//         header: "",
//         className:
//           "text-right w-12 sticky right-0 z-10 bg-white group-hover:bg-gray-50",
//         headerClassName: "w-12 sticky right-0 z-20 bg-gray-50",
//         cell: (item) => (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 hover:bg-gray-100"
//               >
//                 <MoreVertical className="w-4 h-4 text-gray-400" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-[200px]">
//               <DropdownMenuItem
//                 className="gap-2 cursor-pointer"
//                 onSelect={() => {
//                   if (onView) {
//                     onView(item);
//                   }
//                 }}
//               >
//                 <Eye className="w-4 h-4" />
//                 View
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 className="gap-2 cursor-pointer"
//                 onSelect={() => onPrint && onPrint(item)}
//               >
//                 <Printer className="w-4 h-4" />
//                 Print
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 className="gap-2 cursor-pointer"
//                 onSelect={() => {
//                   if (onEdit) {
//                     onEdit(item.originalData || item);
//                   }
//                 }}
//               >
//                 <Edit className="w-4 h-4" />
//                 Edit
//               </DropdownMenuItem>

//               {/* <DropdownMenuItem className="gap-2 cursor-pointer">
//                 <Copy className="w-4 h-4" />
//                 Duplicate Report
//               </DropdownMenuItem> */}
//               <DropdownMenuItem
//                 className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
//                 onSelect={() => {
//                   if (item._id) {
//                     handleDeleteClick(item._id);
//                   }
//                 }}
//               >
//                 <Trash className="w-4 h-4" />
//                 Delete
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ),
//       },
//     ];
//   }, [updateRecord, onView]);

//   const processedData = useMemo(() => {
//     return data.map((item, index) => ({
//       ...item,
//       displayIndex: index + 1,
//     }));
//   }, [data]);

//   return (
//     <>
//       <DynamicTable
//         data={processedData}
//         columns={columns}
//         className="no-scrollbar"
//       />
//       <ConfirmationModal
//         isOpen={modalState.isOpen}
//         onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
//         onConfirm={handleConfirm}
//         title={
//           modalState.type === "status"
//             ? "Change Action Status"
//             : "Delete Report"
//         }
//         message={
//           modalState.type === "status"
//             ? `Are you sure you want to change the status to ${
//                 modalState.newStatus ? "Taken" : "Pending"
//               }?`
//             : "Are you sure you want to delete this report? This action cannot be undone."
//         }
//         confirmLabel={
//           modalState.type === "status" ? "Yes, Change" : "Yes, Delete"
//         }
//         isProcessing={isUpdating || isDeleting}
//         variant={modalState.type === "status" ? "info" : "danger"}
//       >
//         {modalState.type === "status" && (
//           <div className="flex flex-col gap-2 mt-2">
//             <Label htmlFor="remark">
//               Action Remark <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="remark"
//               placeholder="Enter reason for status change..."
//               value={actionRemark}
//               onChange={(e) => {
//                 setActionRemark(e.target.value);
//                 if (e.target.value.trim()) setRemarkError("");
//               }}
//               className={
//                 remarkError ? "border-red-500 focus-visible:ring-red-500" : ""
//               }
//             />
//             {remarkError && (
//               <span className="text-xs text-red-500 mt-1">{remarkError}</span>
//             )}
//           </div>
//         )}
//       </ConfirmationModal>
//     </>
//   );
// }

"use client";

import React, { useMemo } from "react";
import { MoreVertical, Eye, Printer, Edit, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DynamicTable, Column } from "@/components/common/DynamicTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OffenderDetailsCell from "@/app/(report-view)/reports/general-traffic-offence-reports/_components/OffenderDetailsCell";
import MpDetailsCell from "@/app/(report-view)/reports/mp-occurrence-reports/_components/MpDetailsCell";
import {
  useUpdateStaticSpeedRecord,
  useDeleteStaticSpeedRecord,
} from "@/features/staticSpeed/hooks";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/common/ConfirmationModal";

interface StaticSpeedTableProps {
  data: any[];
  onView?: (item: any) => void;
  onPrint?: (item: any) => void;
  onDownload?: (item: any) => void;
  onEdit?: (item: any) => void;
}

export default function StaticSpeedTable({
  data,
  onView,
  onPrint,
  onDownload,
  onEdit,
}: StaticSpeedTableProps) {
  const { mutateAsync: updateRecord, isPending: isUpdating } =
    useUpdateStaticSpeedRecord();
  const { mutateAsync: deleteRecord, isPending: isDeleting } =
    useDeleteStaticSpeedRecord();

  const [actionRemark, setActionRemark] = React.useState("");
  const [remarkError, setRemarkError] = React.useState("");

  const [modalState, setModalState] = React.useState<{
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

  /* ================= ACTION HANDLERS ================= */

  const handleStatusClick = (recordId: string, currentStatus: boolean) => {
    setActionRemark("");
    setRemarkError("");
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
        if (!actionRemark.trim()) {
          setRemarkError("Action remark is required.");
          toast.error("Please add action remark");
          return;
        }

        await updateRecord({
          id: modalState.recordId,
          data: {
            actionStatus: modalState.newStatus,
            actionStatusRemark: actionRemark,
          },
        });

        toast.success("Action status updated successfully!");
      } else {
        await deleteRecord(modalState.recordId);
        toast.success("Report deleted successfully!");
      }

      setModalState({
        isOpen: false,
        recordId: null,
        type: "status",
        newStatus: false,
      });
      setActionRemark("");
      setRemarkError("");
    } catch (err) {
      toast.error("Operation failed");
      console.error(err);
    }
  };

  /* ================= COLUMNS (OLD UI) ================= */

  const columns = useMemo<Column<any>[]>(
    () => [
      {
        header: "Sr no.",
        cell: (item) => (
          <span className="text-gray-900">{item.displayIndex}</span>
        ),
        className:
          "w-12 text-center sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-r border-gray-300",
        headerClassName:
          "sticky left-0 z-20 bg-gray-50 border-r border-gray-300 w-12",
      },
      {
        header: "Place of Offence",
        className: "min-w-[150px] border-r border-gray-300",
        cell: (item) => (
          <div>
            <div className="font-medium text-gray-900">
              {item.placeOfOffence}
            </div>
            <div className="text-gray-500 text-xs mt-1">{item.subLocation}</div>
          </div>
        ),
      },
      {
        header: "Date & Time",
        className: "min-w-[120px] border-r border-gray-300",
        cell: (item) => (
          <div>
            <div className="font-semibold text-gray-900">{item.date}</div>
            <div className="text-gray-500 text-xs">{item.time}</div>
          </div>
        ),
      },
      {
        header: "Particulars of Driver/Rider",
        className: "min-w-[200px] border-r border-gray-300",
        cell: (item) => {
          // ✅ source of truth = originalData.offenders
          const offenders = item.originalData?.offenders || [];

          // ✅ latest offender (last added)
          const latestOffender =
            offenders.length > 0
              ? offenders[offenders.length - 1].offenderDetails
              : null;

          return (
            <div className="flex flex-col gap-2">
              {latestOffender ? (
                <OffenderDetailsCell details={latestOffender} mpName="" />
              ) : (
                <span className="text-gray-400 text-xs italic">
                  No driver details
                </span>
              )}

              {item.mpDetails &&
                Object.values(item.mpDetails).some(Boolean) && (
                  <div className="pt-2 border-t border-dashed border-gray-300">
                    <div className="font-semibold text-xs text-gray-900 mb-1">
                      MP Details:
                    </div>
                    <MpDetailsCell details={item.mpDetails} />
                  </div>
                )}
            </div>
          );
        },
      },

      {
        header: "Unit",
        className: "min-w-[100px] border-r border-gray-300",
        cell: (item) => item.unit,
      },
      {
        header: "FMN",
        className: "min-w-[100px] border-r border-gray-300",
        cell: (item) => item.fmn,
      },
      {
        header: "Offence Brief",
        className: "min-w-[180px] border-r border-gray-300",
        cell: (item) => (
          <div className="text-gray-700 text-xs max-w-xs">
            {item.offenceBrief}
          </div>
        ),
      },
      {
        header: "Veh. BA No. / Make & Take",
        className: "min-w-[150px] border-r border-gray-300",
        cell: (item) => (
          <div>
            <div className="font-semibold text-gray-900">{item.vehicleNo}</div>
            <div className="text-gray-500 text-xs">{item.vehicleModel}</div>
          </div>
        ),
      },
      {
        header: "Report no.",
        className: "min-w-[140px] border-r border-gray-300",
        cell: (item) => (
          <span className="text-gray-600 text-xs">{item.reportNo}</span>
        ),
      },
      {
        header: "Action Status",
        className:
          "text-center w-28 text-xs sticky right-12 z-10 bg-white border-l border-gray-300",
        headerClassName:
          "text-center w-28 sticky right-12 z-20 bg-gray-50 border-l border-gray-300",
        cell: (item) => {
          const isTaken = item.actionStatus === true;
          return (
            <div
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => item._id && handleStatusClick(item._id, isTaken)}
            >
              <div
                className={`w-10 h-5 rounded-full p-1 transition-colors ${
                  isTaken ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full transition-transform ${
                    isTaken ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
              <span className="text-[10px] uppercase text-gray-500">
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
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onSelect={() => onView?.(item)}>
                <Eye className="w-4 h-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onPrint?.(item)}>
                <Printer className="w-4 h-4 mr-2" /> Print
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onEdit?.(item.originalData || item)}
              >
                <Edit className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => item._id && handleDeleteClick(item._id)}
              >
                <Trash className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onView, onPrint, onEdit],
  );
  console.log("data:", data);

  const processedData = useMemo(() => {
    return data.map((item, i) => {
      const offenders = Array.isArray(item.offenders)
        ? [...item.offenders].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
        : [];

      return {
        ...item,
        displayIndex: i + 1,
        offenders, // 🔥 EXACTLY like traffic
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
        onClose={() => setModalState((p) => ({ ...p, isOpen: false }))}
        onConfirm={handleConfirm}
        isProcessing={isUpdating || isDeleting}
        title={
          modalState.type === "status"
            ? "Change Action Status"
            : "Delete Report"
        }
      >
        {modalState.type === "status" && (
          <div className="flex flex-col gap-2">
            <Label>
              Action Remark <span className="text-red-500">*</span>
            </Label>
            <Input
              value={actionRemark}
              onChange={(e) => setActionRemark(e.target.value)}
              className={remarkError ? "border-red-500" : ""}
            />
            {remarkError && (
              <span className="text-xs text-red-500">{remarkError}</span>
            )}
          </div>
        )}
      </ConfirmationModal>
    </>
  );
}
