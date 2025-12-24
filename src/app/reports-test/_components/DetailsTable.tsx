"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

import OffenderDetailsCell from "./OffenderDetailsCell";

// ... existing imports

interface DetailsTableProps {
  offences: any[];
  isVehicleInvolved: boolean;
}

export default function DetailsTable({ offences, isVehicleInvolved }: DetailsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-700 bg-white">
        <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 uppercase">
          <tr>
            <th className="px-4 py-3 w-12">Sr no.</th>
            <th className="px-4 py-3">Place of Offence</th>
            
            {/* Dynamic Headers */}
            {isVehicleInvolved ? (
              <>
                <th className="px-4 py-3 min-w-[200px]">Particulars of Driver/Rider</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">FMN</th>
                <th className="px-4 py-3 max-w-[150px]">Offence Type/ Brief</th>
                <th className="px-4 py-3">Veh. BA No. / Make & Take</th>
                <th className="px-4 py-3">Report no.</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Particulars of Co-Driver/Rider</th>
              </>
            ) : (
              <>
                <th className="px-4 py-3 min-w-[200px]">Particulars of Indls.</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">FMN</th>
                <th className="px-4 py-3">Report no.</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3 max-w-xs">Offence Description</th>
              </>
            )}

            <th className="px-4 py-3">Action status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {offences.map((offence, index) => {
            const date = new Date(offence.offenceOccurenceDetails?.timeOfOffence || offence.createdAt);
            const dateStr = date.toLocaleDateString("en-GB");
            const timeStr = date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false });
            
            // Derive Status
            const isTaken = offence.actionStatus === true; 
            const statusLabel = isTaken ? "Taken" : "Pending";
            
            // Offenders info
            const offenders = offence.offenders || [];
            const primaryOffender = offenders[0] || {};
            const primaryDetails = primaryOffender.offenderDetails || {};
            
            // Co-Driver / Secondary Offender
            const coDriver = offenders[1] || {};
            const coDriverDetails = coDriver.offenderDetails || {};

            // Reporting MP
            const reportingMP = offence.onDutyDetailsMPReporting?.nameReportingMP || "Unknown";
            
            // Locations
            const place = offence.offenceOccurenceDetails?.incidentLocation || "Unknown Location";
            
            // Report No 
            const reportNo = "PRO/21 CPU/00042/102/25";

            return (
              <tr key={offence._id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 align-top">{index + 1}</td>
                <td className="px-4 py-4 align-top font-medium text-gray-900">
                  {place}
                  <div className="text-gray-500 font-normal mt-1">SI Line Military Station</div>
                </td>
                
                {/* VEHICLE INVOLVED COLUMNS */}
                {isVehicleInvolved ? (
                  <>
                    <td className="px-4 py-4 align-top">
                      <OffenderDetailsCell details={primaryDetails} mpName={reportingMP} />
                    </td>
                    <td className="px-4 py-4 align-top">{primaryDetails.unit || "N/A"}</td>
                    <td className="px-4 py-4 align-top">{primaryDetails.fmn || "HQ 21 CORPs"}</td>
                    <td className="px-4 py-4 align-top text-gray-700">
                      <div className="font-medium text-gray-900">{offence.currentOffenceType || "Traffic Offence"}</div>
                      <div>{offence.offenceOccurenceDetails?.description ? offence.offenceOccurenceDetails.description.substring(0, 30) + "..." : ""}</div>
                    </td>
                     <td className="px-4 py-4 align-top">
                        <div className="font-semibold text-gray-900">{offence.vehicleNumber || "N/A"}</div>
                        <div className="text-gray-500">{offence.vehicleName || "Unknown Vehicle"}</div>
                      </td>
                    <td className="px-4 py-4 align-top text-gray-600">{offence.reportNumber || reportNo}</td>
                    <td className="px-4 py-4 align-top">
                       <div className="font-semibold" suppressHydrationWarning>{dateStr}</div>
                       <div className="text-gray-500" suppressHydrationWarning>{timeStr}</div>
                    </td>
                     <td className="px-4 py-4 align-top">
                      {offenders.length > 1 ? (
                        <OffenderDetailsCell details={coDriverDetails} mpName={reportingMP} />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </>
                ) : (
                  /* NO VEHICLE COLUMNS */
                  <>
                    <td className="px-4 py-4 align-top">
                       <OffenderDetailsCell details={primaryDetails} mpName={reportingMP} />
                    </td>
                    <td className="px-4 py-4 align-top">{primaryDetails.unit || "N/A"}</td>
                    <td className="px-4 py-4 align-top">{primaryDetails.fmn || "HQ 21 CORPs"}</td>
                    <td className="px-4 py-4 align-top text-gray-600">{offence.reportNumber || reportNo}</td>
                    <td className="px-4 py-4 align-top">
                       <div className="font-semibold" suppressHydrationWarning>{dateStr}</div>
                       <div className="text-gray-500" suppressHydrationWarning>{timeStr}</div>
                    </td>
                    <td className="px-4 py-4 align-top text-gray-700 max-w-md">
                      {offence.offenceOccurenceDetails?.description || "No description provided."}
                    </td>
                  </>
                )}

                <td className="px-4 py-4 align-top">
                  <div className="flex flex-col items-center gap-1">
                    {/* Design shows Toggle Switch looks specific */}
                    <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${isTaken ? 'bg-green-500' : 'bg-red-500'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isTaken ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{statusLabel}</span>
                  </div>
                </td>

                <td className="px-4 py-4 align-top text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
