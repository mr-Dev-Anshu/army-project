"use client";

import { useState } from "react";

import ReportFilterBar from "@/components/common/ReportFilterBar";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";
import GroupedList from "@/app/general-traffic-offence-reports/_components/GroupedList";

import {
  MilitaryPoliceReport,
  MilitaryPoliceReportProps,
} from "@/components/reports/MilitaryPoliceReport";

const mapToReportProps = (offence: any): MilitaryPoliceReportProps => {
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

      secondary: secondary
        ? {
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
          }
        : undefined,

      vehicle: offence.vehicleNumber
        ? {
            baNo: offence.vehicleNumber,
            makeAndTake: offence.vehicleName || "Unknown",
          }
        : undefined,
    },

    occurrence: {
  dateOfDuty: mpDetails.dateOfDuty
    ? new Date(mpDetails.dateOfDuty).toLocaleDateString("en-GB")
    : date.toLocaleDateString("en-GB"),

  dutyTime: mpDetails.dutyTime || "N/A",
  dutyLocation: mpDetails.placeOfDuty || "N/A",

  nameOfWitnessingOfficial1: witness.name || "N/A",
  nameOfWitnessingOfficial2: offence.witnessDetails?.[1]?.name || "N/A",
  nameOfWitnessingOfficial3: offence.witnessDetails?.[2]?.name || undefined,

  timeOfOffence: date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),

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
      text:
        offence.remarks ||
        "The indl committed offence as enumerated under Para 3 above. Suitable disciplinary action be initiated by the unit and inform this office within 15 days.",
      station: offence.station || "C/O 56 APO",
      dated: new Date(offence.createdAt).toLocaleDateString("en-GB"),
    },
  };
};


export default function UnifiedAllReports() {
  const [filters, setFilters] = useState({
    search: "",
    offenceType: "All",
    date: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

  const [viewingReport, setViewingReport] = useState<any | null>(null);

  const { data: traffic } = useGetAllTrafficOffences({
    groupBy: "offenceType",
  });

  if (viewingReport) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white border-b px-6 py-3 flex items-center gap-4 print:hidden">
          <button
            onClick={() => setViewingReport(null)}
            className="text-sm border px-3 py-1 rounded"
          >
            Back to Reports
          </button>

          <h1 className="text-lg font-semibold text-gray-800">
            View General Traffic Offence Report
          </h1>

          <div className="ml-auto">
            <button
              onClick={() => window.print()}
              className="border px-3 py-1 rounded"
            >
              Print Report
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-500/10">
          <MilitaryPoliceReport {...mapToReportProps(viewingReport)} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm">
      <h2 className="text-sm font-semibold mb-3 text-gray-600">
        All Registered Reports
      </h2>

      <ReportFilterBar
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        offenceTypeOptions={["All"]}
        showOffenceType={true}
        onAddNew={() => {}}
        onReset={() =>
          setFilters({
            search: "",
            offenceType: "All",
            date: "",
            actionStatus: "All",
            sortOrder: "desc",
          })
        }
      />

      <div className="mt-4">
        <GroupedList
          data={traffic ?? []}
          isVehicleInvolved
          onView={setViewingReport}
          onPrint={(item) => {
            setViewingReport(item);
            setTimeout(() => window.print(), 300);
          }}
        />
      </div>
    </div>
  );
}
