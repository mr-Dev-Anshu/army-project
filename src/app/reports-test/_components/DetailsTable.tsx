"use client";

import React, { useMemo } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicTable, Column } from "@/components/common/DynamicTable";
import OffenderDetailsCell from "./OffenderDetailsCell";

interface DetailsTableProps {
  offences: any[];
  isVehicleInvolved: boolean;
}

export default function DetailsTable({ offences, isVehicleInvolved }: DetailsTableProps) {
  
  const columns = useMemo<Column<any>[]>(() => {
    const commonColumns: Column<any>[] = [
      {
        header: "Sr no.",
        cell: (offence) => {
             // We don't have the index here directly if we just pass the item. 
             // But DynamicTable maps over data. 
             // Use a wrapper or just render based on index if we can get it.
             // EDIT: DynamicTable doesn't pass index to cell. 
             // I should probably map the data to include index or handling it in DynamicTable. 
             // For now, I'll specificially handle it by mapping data before passing it to DynamicTable?
             // Or better, I'll update DynamicTable to pass index to cell function.
             // Wait, I can't easily change DynamicTable repeatedly.
             // I'll map the data to add 'displayIndex' property.
             return <span className="text-gray-900">{offence.displayIndex}</span>
        },
        className: "w-12 text-center" 
      },
      {
        header: "Place of Offence",
        cell: (offence) => (
          <div>
            <div className="font-medium text-gray-900">
              {offence.offenceOccurenceDetails?.incidentLocation || "Unknown Location"}
            </div>
            <div className="text-gray-500 font-normal mt-1">SI Line Military Station</div>
          </div>
        )
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
        cell: (offence) => offence.offenders?.[0]?.offenderDetails?.unit || "N/A"
      },
      {
        header: "FMN",
        cell: (offence) => offence.offenders?.[0]?.offenderDetails?.fmn || "HQ 21 CORPs"
      },
      {
        header: "Offence Type/ Brief",
        className: "max-w-[150px]",
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
        cell: (offence) => (
          <div>
            <div className="font-semibold text-gray-900">{offence.vehicleNumber || "N/A"}</div>
            <div className="text-gray-500 text-xs">{offence.vehicleName || "Unknown Vehicle"}</div>
          </div>
        )
      },
      {
        header: "Report no.",
        cell: (offence) => (
          <span className="text-gray-600 text-xs">{offence.reportNumber || "PRO/21 CPU/00042/102/25"}</span>
        )
      },
      {
        header: "Date & Time",
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
          // Check if we have specific mock data fields or standardized ones
          // For No Vehicle Involved, sometimes it's a Civilian or Maid
          const primaryDetails = offence.offenders?.[0]?.offenderDetails || {};
          // Mocking some data for visual parity with screenshot if missing
          // The screenshot had "Civilian Mr Rakesh Kumar" etc.
          // We'll trust the details object has what we need or OffenderDetailsCell handles it
          const reportingMP = offence.onDutyDetailsMPReporting?.nameReportingMP || "Unknown";
          return <OffenderDetailsCell details={primaryDetails} mpName={reportingMP} />;
        }
      },
      {
        header: "Unit",
        cell: (offence) => offence.offenders?.[0]?.offenderDetails?.unit || "N/A"
      },
      {
        header: "FMN",
        cell: (offence) => offence.offenders?.[0]?.offenderDetails?.fmn || "HQ 21 CORPs"
      },
      {
        header: "Report no.",
        cell: (offence) => (
          <span className="text-gray-600 text-xs">{offence.reportNumber || "PRO/21 CPU/00042/102/25"}</span>
        )
      },
      {
        header: "Date & Time",
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
        className: "max-w-md",
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
             <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${isTaken ? 'bg-green-500' : 'bg-red-500'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isTaken ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium uppercase">{isTaken ? "Taken" : "Pending"}</span>
              </div>
          );
        },
        className: "text-center w-24"
      },
      {
        header: "",
        cell: () => (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </Button>
        ),
        className: "text-right w-10"
      }
    ];

    return [
      ...commonColumns,
      ...(isVehicleInvolved ? vehicleColumns : noVehicleColumns),
      ...actionColumns
    ];
  }, [isVehicleInvolved]);

  // Pre-process data to add index
  const processedData = useMemo(() => {
    return offences.map((item, index) => ({
      ...item,
      displayIndex: index + 1
    }));
  }, [offences]);

  return <DynamicTable data={processedData} columns={columns} />;
}
