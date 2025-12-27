"use client";

import React, { useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Printer,
  Edit,
  Copy,
  Trash
} from "lucide-react";
import { useUpdateTrafficOffence, useDeleteTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { Button } from "@/components/ui/button";

import { DynamicTable, Column } from "@/components/common/DynamicTable";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ReportPreviewModal from "@/components/common/ReportPreviewModal";
import { MilitaryPoliceReportProps } from "@/components/reports/MilitaryPoliceReport";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OffenderDetailsCell from "./OffenderDetailsCell";

interface DetailsTableProps {
  offences: any[];
  isVehicleInvolved: boolean;
}

export default function DetailsTable({ offences, isVehicleInvolved }: DetailsTableProps) {
  const { mutateAsync: updateOffence, isPending: isUpdating } = useUpdateTrafficOffence();
  const { mutateAsync: deleteOffence, isPending: isDeleting } = useDeleteTrafficOffence();
  const [modalState, setModalState] = React.useState<{ isOpen: boolean; offenceId: string | null; type: "status" | "delete"; newStatus?: boolean }>({
    isOpen: false,
    offenceId: null,
    type: "status",
    newStatus: false,
  });

  const [previewState, setPreviewState] = React.useState<{ isOpen: boolean; data: MilitaryPoliceReportProps | null }>({
    isOpen: false,
    data: null
  });

  const mapOffenceToReportProps = (offence: any): MilitaryPoliceReportProps => {
    const primary = offence.offenders?.[0]?.offenderDetails || {};
    const secondary = offence.offenders?.[1]?.offenderDetails;
    const mpDetails = offence.onDutyDetailsMPReporting || {};
    const occDetails = offence.offenceOccurenceDetails || {};
    const witness = offence.witnessDetails?.[0] || {};
    const date = new Date(occDetails.timeOfOffence || offence.createdAt);

    return {
      reportNo: offence.reportNumber || "N/A",
      reportDate: new Date(offence.createdAt).toLocaleDateString("en-GB"),
      particulars: {
        primary: {
          aadharCardNo: primary.aadharCardNo || "N/A",
          name: primary.name || "N/A",
          so: primary.so || "N/A",
          relation: primary.relation || "N/A",
          armyNo: primary.armyNo || "N/A",
          rank: primary.rank || "N/A",
          unit: primary.unit || "N/A",
          fmn: primary.fmn || "N/A",
          command: primary.command || "N/A",
          address: primary.address || "N/A",
          iCardNo: primary.iCardNo || "N/A",
        },
        secondary: secondary ? {
          aadharCardNo: secondary.aadharCardNo || "N/A",
          name: secondary.name || "N/A",
          so: secondary.so || "N/A",
          relation: secondary.relation || "N/A",
          armyNo: secondary.armyNo || "N/A",
          rank: secondary.rank || "N/A",
          unit: secondary.unit || "N/A",
          fmn: secondary.fmn || "N/A",
          command: secondary.command || "N/A",
          address: secondary.address || "N/A",
          iCardNo: secondary.iCardNo || "N/A",
        } : undefined,
        vehicle: offence.vehicleNumber ? {
          baNo: offence.vehicleNumber,
          makeAndTake: offence.vehicleName || "Unknown"
        } : undefined,
      },
      occurrence: {
        dateOfDuty: mpDetails.dateOfDuty ? new Date(mpDetails.dateOfDuty).toLocaleDateString("en-GB") : date.toLocaleDateString("en-GB"),
        dutyTime: mpDetails.dutyTime || "N/A",
        dutyLocation: mpDetails.placeOfDuty || "N/A",
        nameOfWitnessingOfficial1: witness.name || "N/A",
        nameOfWitnessingOfficial2: offence.witnessDetails?.[1]?.name || "",
        nameOfWitnessingOfficial3: offence.witnessDetails?.[2]?.name || "",
        timeOfOffence: date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }),
        locationOfOffence: occDetails.incidentLocation || "N/A",
        statement: occDetails.statement || "No statement provided.",
      },
      offence: {
        type: offence.currentOffenceType || "Traffic Offence",
        ref1: "Mil Tfc offence (Auth - Para 48 of SAO 6/S/2001/PM).",
        ref2: "Para 463(a) of CMP manual, SAO 9/S/78 and Stn order.",
        description: occDetails.description || "No description provided.",
      },
      witnessSig: {
        armyNo: witness.armyNo || "N/A",
        rank: witness.rank || "N/A",
        name: witness.name || "N/A",
        unit: witness.unit || "N/A",
      },
      mpSig: {
        armyNo: mpDetails.armyNoReportingMP || "N/A",
        rank: mpDetails.rank || "N/A",
        name: mpDetails.nameReportingMP || "N/A",
        unit: mpDetails.unit || "N/A",
      },
      remarks: {
        text: "The indl committed offence as enumerated under Para 3 above. Suitable discp action be initiated against the indl by the unit, and inform to this office within 15 days from issue of this report.",
        station: "C/O 56 APO",
        dated: new Date().toLocaleDateString("en-GB"),
      },
    };
  };

  const handleViewClick = (offence: any) => {
    const data = mapOffenceToReportProps(offence);
    setPreviewState({ isOpen: true, data });
  };

  const handleStatusClick = (offenceId: string, currentStatus: boolean) => {
    setModalState({
      isOpen: true,
      offenceId,
      type: "status",
      newStatus: !currentStatus,
    });
  };

  const handleDeleteClick = (offenceId: string) => {
    setModalState({
      isOpen: true,
      offenceId,
      type: "delete",
    });
  };

  const handleConfirm = async () => {
    if (!modalState.offenceId) return;

    try {
      if (modalState.type === "status") {
        await updateOffence({
          id: modalState.offenceId,
          data: { actionStatus: modalState.newStatus },
        });
        toast.success("Action status updated successfully!");
      } else if (modalState.type === "delete") {
        await deleteOffence(modalState.offenceId);
        toast.success("Report deleted successfully!");
      }
      setModalState({ isOpen: false, offenceId: null, type: "status", newStatus: false });
    } catch (error) {
      toast.error(modalState.type === "status" ? "Failed to update action status." : "Failed to delete report.");
      console.error(error);
    }
  };

  const columns = useMemo<Column<any>[]>(() => {
    const commonColumns: Column<any>[] = [
      {
        header: "Sr no.",
        cell: (offence) => {
          return <span className="text-gray-900">{offence.displayIndex}</span>
        },
        className: "w-12 text-center sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-r border-gray-200",
        headerClassName: "sticky left-0 z-20 bg-gray-50 border-r border-gray-200 w-12"
      },
      {
        header: "Place of Offence",
        cell: (offence) => (
          <div>
            <div className="font-medium text-gray-900">
              {offence.offenceOccurenceDetails?.incidentLocation || "Unknown Location"}
            </div>
            <div className="text-gray-500 font-normal mt-1"> {offence.offenceOccurenceDetails?.incidentLocation || "Unknown Location"}</div>
          </div>
        ),
        className: "min-w-[180px]"
      }
    ];

    const vehicleColumns: Column<any>[] = [
      {
        header: "Particulars of Driver/Rider",
        className: "min-w-[200px]",
        cell: (offence) => {
          const primaryDetails = offence.offenders?.[0]?.offenderDetails || {};
          const reportingMP = offence.onDutyDetailsMPReporting?.nameReportingMP || "Unknown";
          return <OffenderDetailsCell details={primaryDetails} mpName={reportingMP} />;
        }
      },
      {
        header: "Unit",
        cell: (offence) => offence.offenders?.[0]?.offenderDetails?.unit || "N/A",
        className: "min-w-[100px]"
      },
      {
        header: "FMN",
        cell: (offence) => offence.offenders?.[0]?.offenderDetails?.fmn || "N/A",
        className: "min-w-[100px]"
      },
      {
        header: "Offence Type/ Brief",
        className: "min-w-[180px] max-w-[200px]",
        cell: (offence) => (
          <div>
            <div className="font-medium text-gray-900">{offence.currentOffenceType || "Traffic Offence"}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
              {offence.offenceOccurenceDetails?.description || ""}
            </div>
          </div>
        )
      },
      {
        header: "Veh. BA No. / Make & Take",
        className: "min-w-[150px]",
        cell: (offence) => (
          <div>
            <div className="font-semibold text-gray-900">{offence.vehicleNumber || "N/A"}</div>
            <div className="text-gray-500 text-xs">{offence.vehicleName || "Unknown Vehicle"}</div>
          </div>
        )
      },
      {
        header: "Report no.",
        className: "min-w-[140px]",
        cell: (offence) => (
          <span className="text-gray-600 text-xs">{offence.reportNumber || "N/A"}</span>
        )
      },
      {
        header: "Date & Time",
        className: "min-w-[120px]",
        cell: (offence) => {
          const date = new Date(offence.offenceOccurenceDetails?.timeOfOffence || offence.createdAt);
          return (
            <div>
              <div className="font-semibold text-gray-900">{date.toLocaleDateString("en-GB")}</div>
              <div className="text-gray-500 text-xs">{date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
            </div>
          );
        }
      },
      {
        header: "Particulars of Co-Driver/Rider",
        className: "min-w-[200px]",
        cell: (offence) => {
          const coDriver = offence.offenders?.[1];
          if (!coDriver) return <span className="text-gray-400">-</span>;
          const details = coDriver.offenderDetails || {};
          const reportingMP = offence.onDutyDetailsMPReporting?.nameReportingMP || "Unknown";
          return <OffenderDetailsCell details={details} mpName={reportingMP} />;
        }
      }
    ];

    const noVehicleColumns: Column<any>[] = [
      {
        header: "Particulars of Indls.",
        className: "min-w-[200px]",
        cell: (offence) => {
          const primaryDetails = offence.offenders?.[0]?.offenderDetails || {};
          const reportingMP = offence.onDutyDetailsMPReporting?.nameReportingMP || "Unknown";
          return <OffenderDetailsCell details={primaryDetails} mpName={reportingMP} />;
        }
      },
      {
        header: "Unit",
        className: "min-w-[100px]",
        cell: (offence) => offence.offenders?.[0]?.offenderDetails?.unit || "N/A"
      },
      {
        header: "FMN",
        className: "min-w-[100px]",
        cell: (offence) => offence.offenders?.[0]?.offenderDetails?.fmn || "N/A"
      },
      {
        header: "Report no.",
        className: "min-w-[140px]",
        cell: (offence) => (
          <span className="text-gray-600 text-xs">{offence.reportNumber || "N/A"}</span>
        )
      },
      {
        header: "Date & Time",
        className: "min-w-[120px]",
        cell: (offence) => {
          const date = new Date(offence.offenceOccurenceDetails?.timeOfOffence || offence.createdAt);
          return (
            <div>
              <div className="font-semibold text-gray-900">{date.toLocaleDateString("en-GB")}</div>
              <div className="text-gray-500 text-xs">{date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
            </div>
          );
        }
      },
      {
        header: "Offence Description",
        className: "min-w-[300px] max-w-md",
        cell: (offence) => (
          <div className="text-gray-700 text-xs">
            {offence.offenceOccurenceDetails?.description || "No description provided."}
          </div>
        )
      }
    ];

    const actionColumns: Column<any>[] = [
      {
        header: "Action Status",
        cell: (offence) => {
          const isTaken = offence.actionStatus === true;
          return (
            <div
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => {
                if (offence._id) {
                  handleStatusClick(offence._id, isTaken);
                }
              }}
            >
              <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${isTaken ? 'bg-green-500' : 'bg-red-500'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isTaken ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-[10px] text-gray-500 font-medium uppercase">{isTaken ? "Taken" : "Pending"}</span>
            </div>
          );
        },
        className: "text-center w-28 text-xs sticky right-12 z-10 bg-white group-hover:bg-gray-50 border-l border-gray-200",
        headerClassName: "text-center w-28 sticky right-12 z-20 bg-gray-50 border-l border-gray-200"
      },
      {
        header: "",
        cell: (offence) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleViewClick(offence)}>
                <Eye className="w-4 h-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Printer className="w-4 h-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Edit className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Copy className="w-4 h-4" />
                Duplicate Report
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={() => {
                  if (offence._id) {
                    handleDeleteClick(offence._id);
                  }
                }}
              >
                <Trash className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        className: "text-right w-12 sticky right-0 z-10 bg-white group-hover:bg-gray-50",
        headerClassName: "w-12 sticky right-0 z-20 bg-gray-50"
      }
    ];

    return [
      ...commonColumns,
      ...(isVehicleInvolved ? vehicleColumns : noVehicleColumns),
      ...actionColumns
    ];
  }, [isVehicleInvolved, updateOffence]);

  const processedData = useMemo(() => {
    return offences.map((item, index) => ({
      ...item,
      displayIndex: index + 1
    }));
  }, [offences]);

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
      <ReportPreviewModal
        isOpen={previewState.isOpen}
        onClose={() => setPreviewState({ ...previewState, isOpen: false })}
        data={previewState.data}
      />
    </>
  );
}
