"use client";

import React, { useState, useMemo, useRef } from "react";
import { Loader2, ArrowLeft, Download, FileSpreadsheet, FileJson, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import GroupedList from "./GroupedList";

import { useGetAllTrafficOffences, useCreateTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { csvToJsonWithHiddenKeys } from "@/lib/csvToJson";
import { excelToJson } from "@/lib/excelToJson";
import { processImport } from "@/lib/processImport";
// import { validateTrafficOffenceData } from "@/utils/GeneralTraficOffence";
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
  const [showAddOptions, setShowAddOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createTrafficOffence } = useCreateTrafficOffence();

  /* ================= HANDLERS FOR ADD NEW ================= */
  const handleImportCSV = () => {
    fileInputRef.current?.click();
    setShowAddOptions(false);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    const isJson = file.name.endsWith(".json");
    const reader = new FileReader();

    reader.onload = async (e) => {
      const result = e.target?.result;
      if (!result) return;

      try {
        let json: any;
        if (isExcel && result instanceof ArrayBuffer) {
          json = excelToJson(result);
        } else if (isJson && typeof result === "string") {
          json = JSON.parse(result);
        } else if (typeof result === "string") {
          json = csvToJsonWithHiddenKeys(result);
        }

        // const dataToValidate = Array.isArray(json) ? json : [json];
        // // const validation = validateTrafficOffenceData(dataToValidate);
        // if (!validation.isValid) {
        //   // Show all validation errors instead of just the first one
        //   validation.errors.slice(0, 3).forEach(errorMsg => {
        //     toast.error(errorMsg, { autoClose: 5000 });
        //   });
        //   if (validation.errors.length > 3) {
        //     toast.error(`And ${validation.errors.length - 3} more errors found in the file.`);
        //   }
        //   return;
        // }

        await processImport(json, createTrafficOffence);
        toast.success("Records imported successfully!");
        refetch();
      } catch (error: any) {
        console.error("Error importing file:", error);
        // Check if the error response is HTML (indicates 404 Not Found or 500 Server Error)
        if (error?.response?.data && typeof error.response.data === "string" && error.response.data.includes("<!DOCTYPE html>")) {
          toast.error("API Error: Endpoint not found (404). Please check 'src/apis/generalTraficOffence/create.tsx' and fix the URL typo (likely 'Traffic' instead of 'Trafic').");
        } else {
          const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
          toast.error(`Failed to import records: ${errorMessage}`);
        }
      }
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
    event.target.value = "";
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
    setShowAddOptions(false);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setShowAddOptions(false);
  };

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
    if (filters.fmn) params.fmn = filters.fmn;
    if (filters.placeOfOffence) params.placeOfOffence = filters.placeOfOffence;
    if (filters.date) params.date = filters.date;

    return params;
  }, [filters, viewType]);

  const { data, isLoading, isError, refetch } = useGetAllTrafficOffences(apiParams);

  /* ================= DYNAMIC OPTIONS FROM DATA ================= */
  const { offenceTypeOptions, unitOptions, fmnOptions, placeOptions } = useMemo(() => {
    if (!data) return { offenceTypeOptions: [], unitOptions: [], fmnOptions: [], placeOptions: [] };

    const types = new Set<string>();
    const units = new Set<string>();
    const fmns = new Set<string>();
    const places = new Set<string>();

    data.forEach((group: any) => {
      // Offence Types
      if (group.offenceType) types.add(group.offenceType);
      else if (typeof group._id === 'string') types.add(group._id);

      // Iterate through nested offences in the group to collect other fields
      if (Array.isArray(group.offences)) {
        group.offences.forEach((o: any) => {
          // Unit
          const unit = o.customFields?.unit || o.onDutyDetailsMPReporting?.unit || o.offenders?.[0]?.offenderDetails?.unit;
          if (unit) units.add(unit);

          // FMN
          const fmn = o.customFields?.fmn || o.offenders?.[0]?.offenderDetails?.fmn;
          if (fmn) fmns.add(fmn);

          // Place
          const place = o.customFields?.placeOfOffence || o.onDutyDetails?.dutyLocation || o.offenceOccurenceDetails?.incidentLocation;
          if (place) places.add(place);
        });
      }
    });

    return {
      offenceTypeOptions: Array.from(types).sort(),
      unitOptions: Array.from(units).sort(),
      fmnOptions: Array.from(fmns).sort(),
      placeOptions: Array.from(places).sort(),
    };
  }, [data]);

  /* ================= CLIENT SIDE FILTERING ================= */

  const { vehicleGroups, noVehicleGroups } = useMemo(() => {
    if (!data) return { vehicleGroups: [], noVehicleGroups: [] };

    const filterRecord = (o: any) => {
      // Search
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const rNo = o.reportId || o.reportNumber || "";
        if (
          !rNo.toLowerCase().includes(s) &&
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

        const selectedUnits = filters.unit.split(",");
        if (!unit || !selectedUnits.includes(unit)) return false;
      }

      // FMN
      if (filters.fmn) {
        const fmn =
          o.customFields?.fmn || o.offenders?.[0]?.offenderDetails?.fmn;

        const selectedFmns = filters.fmn.split(",");
        if (!fmn || !selectedFmns.includes(fmn)) return false;
      }

      // Place of Offence
      if (filters.placeOfOffence) {
        const place =
          o.customFields?.placeOfOffence ||
          o.onDutyDetails?.dutyLocation ||
          o.offenceOccurenceDetails?.incidentLocation;

        const selectedPlaces = filters.placeOfOffence.split(",").map(p => p.toLowerCase());

        if (
          !place ||
          !selectedPlaces.includes(place.toLowerCase())
        )
          return false;
      }

      return true;
    };

    const vg: any[] = [];
    const nvg: any[] = [];

    data.forEach((group: any) => {
      const v =
        group.offences?.filter(
          (o: any) => o.isVehicleInvolved && filterRecord(o)
        ) || [];

      const nv =
        group.offences?.filter(
          (o: any) => !o.isVehicleInvolved && filterRecord(o)
        ) || [];

      if (v.length) vg.push({ ...group, offences: v });
      if (nv.length) nvg.push({ ...group, offences: nv });
    });

    return { vehicleGroups: vg, noVehicleGroups: nvg };
  }, [data, filters]);

  /* ================= REPORT HELPERS ================= */

  /* ================= DOWNLOAD STATE ================= */
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

  /* ================= REPORT HELPERS ================= */

  const handleDownloadReport = async (offence: any) => {
    setIsDownloading(true);
    setDownloadType("Word");
    try {
      const props = mapToReportProps(offence);
      await generateWordReport(props);
    } catch (error) {
      console.error("Word Download Error", error);
      alert("Failed to download Word report");
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const handleDownloadPdf = async (offence: any) => {
    const id = offence._id || offence.reportId;
    if (!id) {
      alert("Report ID not found");
      return;
    }

    setIsDownloading(true);
    setDownloadType("PDF");

    try {
      const response = await fetch(`/api/military-police-report/pdf/${id}`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report-${offence.reportNo || id}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download Error", error);
      alert("Failed to download PDF report");
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const handlePrintReport = (offence: any) => {
    setViewingReport(offence);
  };

  /* ================= RENDER STATES ================= */

  const pageTitle =
    viewType === "vehicle"
      ? "General & Traffic Offence Reports - Vehicle Involved"
      : "General & Traffic Offence Reports - No Vehicle Involved";

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
      <ReportViewerWrapper
        title="REPORT PREVIEW"
        onBack={() => {
          setViewingReport(null);
        }}
        isDownloading={isDownloading}
        downloadType={downloadType}
        onDownloadWord={() => handleDownloadReport(viewingReport)}
        onDownloadPdf={() => handleDownloadPdf(viewingReport)}
        onPrint={() => window.print()}
      >
        <MilitaryPoliceReport {...mapToReportProps(viewingReport)} />
      </ReportViewerWrapper>
    );
  }

  const activeGroups = viewType === "vehicle" ? vehicleGroups : noVehicleGroups;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportPageHeader
        title={pageTitle}
        reportCount={activeGroups.reduce(
          (a: number, g: any) => a + g.offences.length,
          0
        )}
      />

      {/* FILTER BAR */}
      <ReportFilterBar
        filters={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        showOffenceType
        showDateRange
        showActionStatus
        showFilter
        onAddNew={() => setShowAddOptions(true)}
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
        <TableSection
          groups={activeGroups}
          isVehicleInvolved={viewType === "vehicle"}
          onView={setViewingReport}
          onPrint={handlePrintReport}
        />
      ) : (
        <div className="text-center text-gray-500 mt-10">No records found</div>
      )}

      {/* ADD OPTIONS MODAL */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv, .xlsx, .xls, .json"
        onChange={handleFileChange}
      />
      {showAddOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add New Record</h3>
                <p className="text-sm text-gray-500 mt-1">Choose how you want to add data to the system</p>
              </div>
              <button
                onClick={() => setShowAddOptions(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={handleImportCSV}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group text-center h-72"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileSpreadsheet className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700">Import CSV / Excel</h4>
                <p className="text-gray-500 leading-relaxed">Upload a CSV or Excel file containing multiple offence records.</p>
              </button>

              <button
                onClick={handleImportJSON}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group text-center h-72"
              >
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileJson className="w-10 h-10 text-orange-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700">Import JSON</h4>
                <p className="text-gray-500 leading-relaxed">Upload a JSON file with structured offence data.</p>
              </button>

              <button
                onClick={handleCreateNew}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-center h-72"
              >
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700">Create Manually</h4>
                <p className="text-gray-500 leading-relaxed">Fill out the form manually to add a single record.</p>
              </button>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
               <Button variant="ghost" onClick={() => setShowAddOptions(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= REPORT MAPPER ================= */

function mapToReportProps(offence: any): MilitaryPoliceReportProps {
  const primary = offence.offenders?.[0]?.offenderDetails || {};
  const secondary = offence.offenders?.[1]?.offenderDetails;

  const val = (v: any) => v || "";
  const dateVal = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "";
  const timeVal = (d: string) =>
    d
      ? new Date(d).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "";

  const mpDetails = offence.onDutyDetailsMPReporting || {};
  const witnesses = offence.onDutyWitnessingMps || [];
  const witness1 = witnesses[0] || {};
  const witness2 = witnesses[1];
  const witness3 = witnesses[2];

  const selectedWitness = offence.customFields?.selectedWitness || {};

  return {
    reportNo:
      offence.reportNo || offence.reportId || offence.reportNumber || "",
    reportDate: dateVal(offence.createdAt),
    particulars: {
      primary: {
        aadharCardNo: val(primary.aadharCard || primary.aadharNumber),
        name: val(primary.name),
        so: val(primary.fatherName || primary.so),
        relation: val(primary.relation),
        armyNo: val(primary.armyNumber || primary.armyNo),
        rank: val(primary.rank || primary["Select Rank"]),
        unit: val(primary.unit),
        command: val(primary.command),
        fmn: val(primary.fmn),
        address: val(primary.address),
        iCardNo: val(
          primary.identityCard ||
          primary.iCardNumber ||
          primary["I Card Number"]
        ),
      },
      secondary: secondary
        ? {
          aadharCardNo: val(secondary.aadharCard || secondary.aadharNumber),
          name: val(secondary.name),
          so: val(secondary.fatherName || secondary.so),
          relation: val(secondary.relation),
          armyNo: val(secondary.armyNumber || secondary.armyNo),
          rank: val(secondary.rank || secondary["Select Rank"]),
          unit: val(secondary.unit),
          command: val(secondary.command),
          fmn: val(secondary.fmn),
          address: val(secondary.address),
          iCardNo: val(
            secondary.identityCard ||
            secondary.iCardNumber ||
            secondary["I Card Number"]
          ),
        }
        : undefined,
      vehicle: offence.isVehicleInvolved
        ? {
          baNo: val(offence.vehicleNumber),
          makeAndTake: val(offence.vehicleName) || val(offence.vehicleType),
          vehicleNumber:
            offence.vehicleType === "DD Vehicle"
              ? "DD Veh. BA No."
              : "Registration No.",
        }
        : undefined,
    },
    occurrence: {
      dateOfDuty: dateVal(offence.onDutyDetails?.dateOfDuty),
      dutyTime: (() => {
        const start = offence.onDutyDetails?.startTime;
        const end = offence.onDutyDetails?.endTime;
        const sVal = timeVal(start);
        const eVal = timeVal(end);
        if (sVal && eVal) return `${sVal} Hrs - ${eVal} Hrs`;
        if (sVal) return `${sVal} Hrs`;
        return "";
      })(),
      dutyLocation: val(offence.onDutyDetails?.dutyLocation),
      witnessingMps:
        witnesses.length > 0
          ? witnesses.map((w: any) => ({
            name: val(w.name),
            rank: val(w.rank),
          }))
          : [],
      timeOfOffence: timeVal(offence.offenceOccurenceDetails?.timeOfOffence)
        ? timeVal(offence.offenceOccurenceDetails?.timeOfOffence) + " Hrs"
        : "",
      locationOfOffence: val(offence.offenceOccurenceDetails?.incidentLocation),
      statement: val(offence.offenceOccurenceDetails?.description),
    },
    offence: {
      types:
        (offence.offenceTypes?.length
          ? offence.offenceTypes
          : offence.offenceOccurenceDetails?.offenceTypes) ||
        (val(offence.currentOffenceType)
          ? [val(offence.currentOffenceType)]
          : []),
      refs:
        (offence.offenceTypeReference?.length
          ? offence.offenceTypeReference
          : offence.offenceOccurenceDetails?.offenceTypeReference) || [],
      description: val(offence.offenceOccurenceDetails?.description),
    },
    witnessSig: {
      armyNo: val(
        selectedWitness?.armyNumber || witness1.armyNumber || witness1.ArmyNo
      ),
      rank: val(selectedWitness?.rank || witness1.rank),
      name: val(selectedWitness?.nameReportingMP || witness1.name),
      unit: val(selectedWitness?.unit || witness1.unit),
    },
    mpSig: {
      armyNo: val(mpDetails.armyNumber),
      rank: val(mpDetails.rank),
      name: val(mpDetails.nameReportingMP),
      unit: val(mpDetails.unit),
    },
    remarks: {
      text: val(offence.customFields?.remarks || offence.remarks),
      station: val(offence.onDutyDetails?.dutyLocation),
      dated: new Date().toLocaleDateString("en-GB"),
    },
  };
}