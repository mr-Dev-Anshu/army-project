"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Loader2, ArrowLeft, Download } from "lucide-react";

import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import GroupedList from "./GroupedList";

import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";
import MultiStepForm from "@/common/component/multi-step-form/MulitstepForm";
import { Button } from "@/components/ui/button";

import MilitaryPoliceReport, {
  MilitaryPoliceReportProps,
} from "@/components/reports/MilitaryPoliceReport";

import { generateWordReport } from "@/utils/generateWordReport";

/* ================= TABLE SECTION ================= */

const TableSection = ({
  groups,
  isVehicleInvolved,
  onView,
  onPrint,
}: {
  groups: any[];
  isVehicleInvolved: boolean;
  onView: (offence: any) => void;
  onPrint?: (offence: any) => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow border mt-6 overflow-hidden">
      <div className="flex items-center px-6 py-3 border-b text-xs font-semibold text-gray-500 uppercase">
        <div className="flex-1">Type of Offence ({groups.length})</div>
        <div className="w-64 text-center">Action Status</div>
        <div className="w-32 text-right">Records</div>
      </div>

      <GroupedList
        data={groups}
        isVehicleInvolved={isVehicleInvolved}
        onView={onView}
        onPrint={onPrint}
      />
    </div>
  );
};

/* ================= MAIN PAGE ================= */

export default function ReportsPage({
  viewType = "vehicle",
}: {
  viewType?: "vehicle" | "no-vehicle";
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);

  /* ================= FILTER STATE ================= */

  const [filters, setFilters] = useState({
    search: "",
    offenceType: "All",
    fromDate: "",
    toDate: "",
    unit: "",
    fmn: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

  /* ================= AUTO PRINT ================= */

  useEffect(() => {
    if (viewingReport && shouldAutoPrint) {
      const t = setTimeout(() => {
        window.print();
        setShouldAutoPrint(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [viewingReport, shouldAutoPrint]);

  /* ================= API PARAMS ================= */

  const apiParams = useMemo(() => {
    const params: any = {
      groupBy: "offenceType",
      isVehicleInvolved: viewType === "vehicle",
    };

    if (filters.offenceType !== "All") params.offenceType = filters.offenceType;
    if (filters.actionStatus !== "All") params.status = filters.actionStatus;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    if (filters.unit) params.unit = filters.unit;
    if (filters.fmn) params.fmn = filters.fmn;

    return params;
  }, [filters, viewType]);

  const { data, isLoading, isError } = useGetAllTrafficOffences(apiParams);

  /* ================= CLIENT SIDE FILTERING ================= */

  const { vehicleGroups, noVehicleGroups } = useMemo(() => {
    if (!data) return { vehicleGroups: [], noVehicleGroups: [] };

    const filterRecord = (o: any) => {
      // Search
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (
          !o.reportNumber?.toLowerCase().includes(s) &&
          !o.currentOffenceType?.toLowerCase().includes(s)
        ) {
          return false;
        }
      }

      // Unit
      if (filters.unit) {
        const unit =
          o.customFields?.unit ||
          o.onDutyDetailsMPReporting?.unit ||
          o.offenders?.[0]?.offenderDetails?.unit;

        if (!unit || unit !== filters.unit) return false;
      }

      // FMN
      if (filters.fmn) {
        const fmn =
          o.customFields?.fmn ||
          o.offenders?.[0]?.offenderDetails?.fmn;

        if (!fmn || fmn !== filters.fmn) return false;
      }

      return true;
    };

    const vg: any[] = [];
    const nvg: any[] = [];

    data.forEach((group: any) => {
      const v = group.offences
        ?.filter((o: any) => o.isVehicleInvolved && filterRecord(o)) || [];

      const nv = group.offences
        ?.filter((o: any) => !o.isVehicleInvolved && filterRecord(o)) || [];

      if (v.length) vg.push({ ...group, offences: v });
      if (nv.length) nvg.push({ ...group, offences: nv });
    });

    return { vehicleGroups: vg, noVehicleGroups: nvg };
  }, [data, filters]);

  /* ================= REPORT HELPERS ================= */

  const handleDownloadReport = (offence: any) => {
    const props = mapToReportProps(offence);
    generateWordReport(props);
  };

  const handlePrintReport = (offence: any) => {
    setViewingReport(offence);
    setShouldAutoPrint(true);
  };

  /* ================= RENDER STATES ================= */

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Button onClick={() => setIsCreating(false)} className="m-4">
          <ArrowLeft /> Back
        </Button>
        <MultiStepForm />
      </div>
    );
  }

  if (viewingReport) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Button onClick={() => setViewingReport(null)} className="m-4">
          <ArrowLeft /> Back
        </Button>
        <Button
          onClick={() => handleDownloadReport(viewingReport)}
          className="m-4"
        >
          <Download /> Download
        </Button>
        <MilitaryPoliceReport {...mapToReportProps(viewingReport)} />
      </div>
    );
  }

  const activeGroups =
    viewType === "vehicle" ? vehicleGroups : noVehicleGroups;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportPageHeader
        title="General & Traffic Offence Reports"
        reportCount={activeGroups.reduce(
          (a: number, g: any) => a + g.offences.length,
          0
        )}
      />

      {/* FILTER BAR */}
      <ReportFilterBar
        filters={filters}
        onFilterChange={(k, v) =>
          setFilters((p) => ({ ...p, [k]: v }))
        }
        showOffenceType
        showDateRange
        showActionStatus
        onAddNew={() => setIsCreating(true)}
        onReset={() =>
          setFilters({
            search: "",
            offenceType: "All",
            fromDate: "",
            toDate: "",
            unit: "",
            fmn: "",
            actionStatus: "All",
            sortOrder: "desc",
          })
        }
      />

      {isLoading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : isError ? (
        <div className="text-red-500 p-6">Failed to load data</div>
      ) : activeGroups.length ? (
        <TableSection
          groups={activeGroups}
          isVehicleInvolved={viewType === "vehicle"}
          onView={setViewingReport}
          onPrint={handlePrintReport}
        />
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No records found
        </div>
      )}
    </div>
  );
}

/* ================= REPORT MAPPER ================= */

function mapToReportProps(offence: any): MilitaryPoliceReportProps {
  const primary = offence.offenders?.[0]?.offenderDetails || {};
  const secondary = offence.offenders?.[1]?.offenderDetails;

  const val = (v: any) => v || "N/A";

  const mpDetails = offence.onDutyDetailsMPReporting || {};
  // Assuming the first witnessing MP is the main witness
  const witness = offence.onDutyWitnessingMps?.[0] || {};

  return {
    reportNo: offence.reportNumber || "N/A",
    reportDate: new Date(offence.createdAt).toLocaleDateString("en-GB"),
    particulars: {
      primary: {
        aadharCardNo: val(primary.aadharCard),
        name: val(primary.name),
        so: val(primary.fatherName),
        relation: "Father", // Default as per typical usage, or map if available
        armyNo: val(primary.armyNo),
        rank: val(primary.rank),
        unit: val(primary.unit),
        command: "N/A",
        fmn: val(primary.fmn),
        address: val(primary.address),
        iCardNo: val(primary.identityCard),
      },
      secondary: secondary ? {
        aadharCardNo: val(secondary.aadharCard),
        name: val(secondary.name),
        so: val(secondary.fatherName),
        relation: "Father",
        armyNo: val(secondary.armyNo),
        rank: val(secondary.rank),
        unit: val(secondary.unit),
        command: "N/A",
        fmn: val(secondary.fmn),
        address: val(secondary.address),
        iCardNo: val(secondary.identityCard),
      } : undefined,
      vehicle: offence.isVehicleInvolved ? {
        baNo: val(offence.vehicleNumber),
        makeAndTake: val(offence.vehicleName) || val(offence.vehicleType),
      } : undefined,
    },
    occurrence: {
      dateOfDuty: offence.onDutyDetails?.dateOfDuty ? new Date(offence.onDutyDetails.dateOfDuty).toLocaleDateString("en-GB") : "N/A",
      dutyTime: offence.onDutyDetails?.startTime ? new Date(offence.onDutyDetails.startTime).toLocaleTimeString("en-GB") : "N/A",
      dutyLocation: val(offence.onDutyDetails?.dutyLocation),
      nameOfWitnessingOfficial1: val(witness.name) || "N/A",
      nameOfWitnessingOfficial2: "N/A",
      timeOfOffence: offence.offenceOccurenceDetails?.timeOfOffence ? new Date(offence.offenceOccurenceDetails.timeOfOffence).toLocaleTimeString("en-GB") : "N/A",
      locationOfOffence: val(offence.offenceOccurenceDetails?.incidentLocation),
      statement: val(offence.offenceOccurenceDetails?.description),
    },
    offence: {
      type: val(offence.currentOffenceType),
      ref1: "N/A",
      ref2: "N/A",
      description: val(offence.offenceOccurenceDetails?.description),
    },
    witnessSig: {
      armyNo: val(witness.armyNo),
      rank: val(witness.rank),
      name: val(witness.name),
      unit: val(witness.unit),
    },
    mpSig: {
      armyNo: val(mpDetails.armyNumber),
      rank: val(mpDetails.rank),
      name: val(mpDetails.nameReportingMP),
      unit: val(mpDetails.unit),
    },
    remarks: {
      text: val(offence.actionStatusRemark) || val(offence.customFields?.remarks),
      station: "N/A",
      dated: new Date().toLocaleDateString("en-GB"),
    },
  };
}
