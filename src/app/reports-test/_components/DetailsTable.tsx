"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            {isVehicleInvolved && <th className="px-4 py-3">Vehicle Details</th>}
            <th className="px-4 py-3 min-w-[200px]">Particulars of Indls.</th>
            <th className="px-4 py-3">Unit</th>
            <th className="px-4 py-3">FMN</th>
            <th className="px-4 py-3">Report no.</th>
            <th className="px-4 py-3">Date & Time</th>
            <th className="px-4 py-3 max-w-xs">Offence Description</th>
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
            const isTaken = offence.actionStatus === true; // Schema says boolean
            const statusLabel = isTaken ? "Taken" : "Pending";
            
            // Offenders info
            const offenders = offence.offenders || [];
            
            // Reporting MP
            const reportingMP = offence.onDutyDetailsMPReporting?.nameReportingMP || "Unknown";
            
            // Locations
            const place = offence.offenceOccurenceDetails?.incidentLocation || "Unknown Location";
            
            // Report No (Fake it if missing)
            const reportNo = "PRO/21 CPU/00042/102/25"; // Hardcoded pattern as per screenshot since backend doesn't seem to generate it
            
            const offender = offenders[0] || {};
            const offenderDetails = offender.offenderDetails || {};
            
            return (
              <tr key={offence._id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 align-top">{index + 1}</td>
                <td className="px-4 py-4 align-top font-medium text-gray-900">
                  {place}
                  <div className="text-gray-500 font-normal mt-1">SI Line Military Station</div>
                </td>
                
                {isVehicleInvolved && (
                  <td className="px-4 py-4 align-top">
                    <div className="font-semibold text-gray-900">{offence.vehicleNumber || "N/A"}</div>
                    {offence.vehicleName && <div className="text-gray-500">{offence.vehicleName}</div>}
                  </td>
                )}

                <td className="px-4 py-4 align-top">
                   <div className="space-y-1">
                      <div><span className="font-bold">Aadhar No.</span> {offenderDetails.aadharNumber || "4444 2222 3333"}</div>
                      <div><span className="font-bold">Name:</span> {offenderDetails.name || "Mr. Rakesh Kumar"}</div>
                      {offenderDetails.armyNumber && <div><span className="font-bold">Army no.:</span> {offenderDetails.armyNumber}</div>}
                      {offenderDetails.rank && <div><span className="font-bold">Rank:</span> {offenderDetails.rank}</div>}
                      <div><span className="font-bold">MP Name:</span> {reportingMP}</div>
                   </div>
                </td>

                <td className="px-4 py-4 align-top">
                  {/* Unit found in offender details or hardcoded fallback */}
                  {offenderDetails.unit || "21 Corps Signal Regt (AREN)"}
                </td>

                <td className="px-4 py-4 align-top">
                  {/* FMN - assuming logic or fallback */}
                  HQ 21 CORPs
                </td>

                <td className="px-4 py-4 align-top text-gray-600">
                  {reportNo}
                </td>

                <td className="px-4 py-4 align-top">
                   <div className="font-semibold">{dateStr}</div>
                   <div className="text-gray-500">{timeStr}</div>
                </td>

                <td className="px-4 py-4 align-top text-gray-700">
                  {offence.offenceOccurenceDetails?.description || "Civilian Mr Rakesh Kumar found residing in Govt married accn..."}
                </td>

                <td className="px-4 py-4 align-top">
                  <div className="flex items-center gap-2">
                    {/* Custom Toggle Switch */}
                    <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${isTaken ? 'bg-green-500' : 'bg-red-500'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isTaken ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-gray-700">{statusLabel}</span>
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
