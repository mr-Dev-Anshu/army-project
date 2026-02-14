
"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Loader2,
  ArrowLeft,
  FileSpreadsheet,
  FileJson,
  Plus,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import GroupedList from "./GroupedList";

import {
  useGetAllTrafficOffences,
  useCreateTrafficOffence,
} from "@/features/generalTraficOffence/hooks";
import { useCreateOffender } from "@/features/offender/Hooks";
import { CreateOffenderData } from "@/apis/offender/types";

import { csvToJsonWithHiddenKeys } from "@/lib/csvToJson";
import { excelToJson } from "@/lib/excelToJson";
import MultiStepForm from "@/common/component/multi-step-form/MulitstepForm";
import { Button } from "@/components/ui/button";

import MilitaryPoliceReport, {
  MilitaryPoliceReportProps,
} from "@/components/reports/MilitaryPoliceReport";

import { generateWordReport } from "@/utils/generateWordReport";
import { useExcelExport, ExcelColumn } from "@/hooks/useExcelExport";

/* ================= MAIN PAGE ================= */

export default function ReportsPage({
  viewType = "vehicle",
}: {
  viewType?: "vehicle" | "no-vehicle";
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingOffence, setEditingOffence] = useState<any | null>(null); // ✅ FIX
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createTrafficOffence } = useCreateTrafficOffence();
  const { mutateAsync: createOffender } = useCreateOffender();
  const { exportToExcel } = useExcelExport();

  /* ================= FILTER STATE ================= */

  const [filters, setFilters] = useState({
    search: "",
    offenceType: "All",
    date: "",
    fromDate: "",
    toDate: "",
    unit: "",
    fmn: "",
    placeOfOffence: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

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
    if (filters.placeOfOffence) params.placeOfOffence = filters.placeOfOffence;
    if (filters.date) params.date = filters.date;

    return params;
  }, [filters, viewType]);

  const { data, isLoading, isError, refetch } =
    useGetAllTrafficOffences(apiParams);

  /* ================= GROUP FILTERING ================= */

  const { vehicleGroups, noVehicleGroups } = useMemo(() => {
    if (!data) return { vehicleGroups: [], noVehicleGroups: [] };

    const vg: any[] = [];
    const nvg: any[] = [];

    data.forEach((group: any) => {
      const v =
        group.offences?.filter((o: any) => o.isVehicleInvolved === true) || [];
      const nv =
        group.offences?.filter((o: any) => o.isVehicleInvolved !== true) || [];

      if (v.length) vg.push({ ...group, offences: v });
      if (nv.length) nvg.push({ ...group, offences: nv });
    });

    return { vehicleGroups: vg, noVehicleGroups: nvg };
  }, [data]);

  const activeGroups = viewType === "vehicle" ? vehicleGroups : noVehicleGroups;

  /* ================= CREATE / EDIT ================= */

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Button
          onClick={() => {
            setIsCreating(false);
            setEditingOffence(null);
          }}
          className="m-4"
        >
          <ArrowLeft /> Back
        </Button>

        {/* 🔥 SAME FORM FOR CREATE + EDIT */}
        <MultiStepForm existingOffence={editingOffence} />
      </div>
    );
  }

  /* ================= VIEW ================= */

  if (viewingReport) {
    return (
      <ReportViewerWrapper
        title="REPORT PREVIEW"
        onBack={() => setViewingReport(null)}
        onDownloadWord={() =>
          generateWordReport(mapToReportProps(viewingReport))
        }
        onPrint={() => window.print()}
      >
        <MilitaryPoliceReport {...mapToReportProps(viewingReport)} />
      </ReportViewerWrapper>
    );
  }

  /* ================= LIST ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportPageHeader
        title={
          viewType === "vehicle"
            ? "General & Traffic Offence Reports - Vehicle Involved"
            : "General & Traffic Offence Reports - No Vehicle Involved"
        }
        reportCount={activeGroups.reduce(
          (a: number, g: any) => a + g.offences.length,
          0,
        )}
      />

      <ReportFilterBar
        filters={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        showOffenceType
        showDateRange
        showActionStatus
        showFilter
        onAddNew={() => {
          setEditingOffence(null);
          setIsCreating(true);
        }}
        onReset={() =>
          setFilters({
            search: "",
            offenceType: "All",
            date: "",
            fromDate: "",
            toDate: "",
            unit: "",
            fmn: "",
            placeOfOffence: "",
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
        <GroupedList
          data={activeGroups}
          isVehicleInvolved={viewType === "vehicle"}
          onView={setViewingReport}
          onEdit={(offence) => {
            setEditingOffence(offence); // 🔥 FIX
            setIsCreating(true); // 🔥 FIX
          }}
        />
      ) : (
        <div className="text-center text-gray-500 mt-10">No records found</div>
      )}
    </div>
  );
}

/* ================= REPORT MAPPER ================= */
export function mapToReportProps(offence: any): MilitaryPoliceReportProps {
  const primary = offence.offenders?.[0]?.offenderDetails || {};

  const firstWitness = offence.onDutyWitnessingMps?.[0] || {};
  const reportingMp = offence.onDutyDetailsMPReporting || {};

  return {
    reportNo: offence.reportNo || offence.reportId || "",
    reportDate: new Date(offence.createdAt).toLocaleDateString("en-GB"),

    particulars: {
      primary: {
        aadharCardNo: primary.aadharCardNo || "",
        name: primary.name || "",
        so: primary.so || "",
        relation: primary.relation || "",
        armyNo: primary.armyNumber || primary.armyNo || "",
        rank: primary.rank || "",
        unit: primary.unit || "",
        command: primary.command || "",
        fmn: primary.fmn || "",
        address: primary.address || "",
        iCardNo: primary.iCardNumber || primary.iCardNo || primary.passNo || "",
      },
    },

    occurrence: {
      dateOfDuty: offence.onDutyDetails?.dateOfDuty
        ? new Date(offence.onDutyDetails.dateOfDuty).toLocaleDateString("en-GB")
        : "",

      dutyTime: (() => {
        const start = offence.onDutyDetails?.startTime;
        const end = offence.onDutyDetails?.endTime;
        if (start && end) return `${start} - ${end}`;
        if (start) return start;
        return "";
      })(),

      dutyLocation: offence.onDutyDetails?.dutyLocation || "",

      witnessingMps: Array.isArray(offence.onDutyWitnessingMps)
        ? offence.onDutyWitnessingMps.map((w: any) => ({
            name: w.name || w.nameReportingMP || "",
            rank: w.rank || "",
          }))
        : [],

      locationOfOffence:
        offence.offenceOccurenceDetails?.incidentLocation || "",

      timeOfOffence: offence.offenceOccurenceDetails?.timeOfOffence || "",

      statement: offence.offenceOccurenceDetails?.description || "",
    },

    offence: {
      types: offence.currentOffenceType ? [offence.currentOffenceType] : [],
      refs: Array.isArray(offence.offenceTypeReference)
        ? offence.offenceTypeReference
        : [],
      description: offence.offenceOccurenceDetails?.description || "",
    },

    remarks: {
      text: offence.customFields?.remarks || offence.remarks || "",
      station: offence.onDutyDetails?.dutyLocation || "",
      dated: new Date().toLocaleDateString("en-GB"),
    },

    // ✅ ADD THESE TWO (THIS FIXES THE ERROR)
    witnessSig: {
      armyNo: firstWitness.ArmyNo || firstWitness.armyNumber || "",
      rank: firstWitness.rank || "",
      name: firstWitness.name || "",
      unit: firstWitness.unit || "",
    },

    mpSig: {
      armyNo: reportingMp.armyNumber || "",
      rank: reportingMp.rank || "",
      name: reportingMp.nameReportingMP || "",
      unit: reportingMp.unit || "",
    },
  };
}
