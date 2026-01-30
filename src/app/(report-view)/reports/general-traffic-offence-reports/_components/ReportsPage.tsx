"use client";

import React, { useState, useMemo, useRef } from "react";
import { Loader2, ArrowLeft, FileSpreadsheet, FileJson, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

import ReportFilterBar from "@/components/common/ReportFilterBar";
import SignedAttachmentsViewer from "@/components/common/SignedAttachmentsViewer";
import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import GroupedList from "./GroupedList";

import { useGetAllTrafficOffences, useGetTrafficOffenceById, useUpdateTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { useCreateTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { csvToJsonWithHiddenKeys } from "@/lib/csvToJson";
import { excelToJson } from "@/lib/excelToJson";
import { processImport } from "@/lib/processImport";
import MultiStepForm from "@/common/component/multi-step-form/MulitstepForm";
import { Button } from "@/components/ui/button";
import FormAttachmentModal, { AttachedItem } from "@/components/ui/FormAttachmentModal";

import MilitaryPoliceReport, {
  MilitaryPoliceReportProps,
} from "@/components/reports/MilitaryPoliceReport";

import { generateWordReport } from "@/utils/generateWordReport";
// IMPORT THE HOOK
import { useExcelExport, ExcelColumn } from "@/hooks/useExcelExport";

/* ================= KEY MAPPING UTILS ================= */
// This section handles the IMPORT logic (mapping Excel back to App)
const KEY_MAPPING: Record<string, string> = {
  "Offence Type": "offenceType",
  "Vehicle Number": "vehicleNumber",
  "Vehicle No": "vehicleNumber",
  "Vehicle Type": "vehicleType",
  "Place of Offence": "offenceOccurenceDetails.incidentLocation",
  "Incident Location": "offenceOccurenceDetails.incidentLocation",
  "Date": "offenceOccurenceDetails.timeOfOffence",
  "Time": "offenceOccurenceDetails.timeOfOffence",
  "Description": "offenceOccurenceDetails.description",
  "Army No": "offenders[0].offenderDetails.armyNumber",
  "Rank": "offenders[0].offenderDetails.rank",
  "Name": "offenders[0].offenderDetails.name",
  "Unit": "offenders[0].offenderDetails.unit",
  "FMN": "offenders[0].offenderDetails.fmn",
  "Father Name": "offenders[0].offenderDetails.fatherName",
  "Relation": "offenders[0].offenderDetails.relation",
  "Address": "offenders[0].offenderDetails.address",
  "Reporting MP Name": "onDutyDetailsMPReporting.nameReportingMP",
  "Reporting MP Rank": "onDutyDetailsMPReporting.rank",
  "Reporting MP Army No": "onDutyDetailsMPReporting.armyNumber",
  "Reporting MP Unit": "onDutyDetailsMPReporting.unit",
};

const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.replace(/\]/g, "").split(/[.\[]/);
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isArray = !isNaN(Number(nextKey));

    if (!current[key]) {
      current[key] = isArray ? [] : {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
};

const mapData = (data: any[]) => {
  return data.map((item) => {
    const newItem: any = {};
    Object.keys(item).forEach((key) => {
      const mappedKey = KEY_MAPPING[key.trim()] || key.trim();
      if (item[key] !== null && item[key] !== undefined && item[key] !== "") {
        setNestedValue(newItem, mappedKey, item[key]);
      }
    });

    if (newItem.vehicleNumber) {
      newItem.isVehicleInvolved = true;
    } else if (newItem.isVehicleInvolved === undefined) {
      newItem.isVehicleInvolved = false;
    }

    return newItem;
  });
};

/* ================= TABLE SECTION ================= */

const TableSection = ({
  groups,
  isVehicleInvolved,
  onView,
  onPrint,
  onEdit,
}: {
  groups: any[];
  isVehicleInvolved: boolean;
  onView: (offence: any) => void;
  onPrint?: (offence: any) => void;
  onEdit?: (offence: any) => void;
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
        onEdit={onEdit}
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
  const [editingReport, setEditingReport] = useState<any>(null); // State for editing
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createTrafficOffence } = useCreateTrafficOffence();
  // INITIALIZE HOOK
  const { exportToExcel } = useExcelExport();

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

        const dataArray = Array.isArray(json) ? json : [json];
        const mappedData = mapData(dataArray);

        await processImport(mappedData, createTrafficOffence);

        toast.success("Records imported successfully!");
        await refetch();
      } catch (error: any) {
        console.error("Error importing file:", error);
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

  // NEW STATE FOR ATTACHMENT MODAL
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const { mutateAsync: updateOffence } = useUpdateTrafficOffence();

  /* ================= FILTER STATE ================= */
  // ...

  // HANDLE ATTACHMENT SAVE
  const handleAttachSave = async (newItems: AttachedItem[]) => {
    if (!viewingReport?._id) return;

    try {
      // Get existing attachments
      const currentAttachments = viewingReport.customFields?.attachments || viewingReport.attachments || [];
      const updatedAttachments = [...currentAttachments, ...newItems];

      // Update API
      await updateOffence({
        id: viewingReport._id,
        data: {
          customFields: {
            ...viewingReport.customFields,
            attachments: updatedAttachments
          }
        }
      });

      toast.success("Attachments Added Successfully");

      // Update local viewing state to reflect changes immediately
      setViewingReport((prev: any) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          attachments: updatedAttachments
        }
      }));

    } catch (error) {
      console.error("Failed to add attachments", error);
      toast.error("Failed to add attachments");
    }
  };

  // HANDLE ATTACHMENT DELETE
  const handleAttachDelete = async (attachment: any) => {
    if (!viewingReport?._id) {
      console.error("No viewing report ID found");
      return;
    }

    console.log("Deleting attachment:", attachment);
    console.log("Current viewingReport:", viewingReport);

    try {
      // Check multiple possible locations for attachments
      const currentAttachments =
        viewingReport.customFields?.attachments ||
        viewingReport.attachments ||
        viewingReport.certificates ||
        [];

      console.log("Current attachments before delete:", currentAttachments);

      // Filter out the deleted attachment by URL (most unique identifier)
      const updatedAttachments = currentAttachments.filter((item: any) => {
        const isSame = item.url === attachment.url;
        if (isSame) console.log("Found matching attachment to delete:", item);
        return !isSame;
      });

      console.log("Updated attachments after filter:", updatedAttachments);

      // Update API - try to preserve the original structure
      const updatePayload: any = {
        id: viewingReport._id,
        data: {}
      };

      // Update in the same location where we found them
      if (viewingReport.customFields?.attachments) {
        updatePayload.data.customFields = {
          ...viewingReport.customFields,
          attachments: updatedAttachments
        };
      } else if (viewingReport.certificates) {
        updatePayload.data.certificates = updatedAttachments;
      } else {
        updatePayload.data.customFields = {
          ...viewingReport.customFields,
          attachments: updatedAttachments
        };
      }

      console.log("Update payload:", updatePayload);

      await updateOffence(updatePayload);

      toast.success("Attachment Deleted Successfully");

      // Update local viewing state to reflect changes immediately
      setViewingReport((prev: any) => {
        const updated = { ...prev };

        if (prev.customFields?.attachments) {
          updated.customFields = {
            ...prev.customFields,
            attachments: updatedAttachments
          };
        } else if (prev.certificates) {
          updated.certificates = updatedAttachments;
        } else {
          updated.customFields = {
            ...prev.customFields,
            attachments: updatedAttachments
          };
        }

        console.log("Updated local state:", updated);
        return updated;
      });

    } catch (error) {
      console.error("Failed to delete attachment", error);
      toast.error("Failed to delete attachment: " + (error as any)?.message || "Unknown error");
    }
  };



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
          (o: any) => o.isVehicleInvolved === true && filterRecord(o)
        ) || [];

      const nv =
        group.offences?.filter(
          (o: any) => (o.isVehicleInvolved === false || o.isVehicleInvolved === null || o.isVehicleInvolved === undefined) && filterRecord(o)
        ) || [];

      if (v.length) vg.push({ ...group, offences: v });
      if (nv.length) nvg.push({ ...group, offences: nv });
    });

    return { vehicleGroups: vg, noVehicleGroups: nvg };
  }, [data, filters]);

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

  /* ================= EXCEL EXPORT HANDLER ================= */

  const activeGroups = viewType === "vehicle" ? vehicleGroups : noVehicleGroups;

  const handleExcelDownload = () => {
    // 1. Flatten the data
    const flatList = activeGroups.flatMap(group => group.offences);

    // 2. Define Columns based on YOUR JSON
    const columns: ExcelColumn[] = [
      { header: "Report No", key: "reportId" },
      { header: "Offence Type", key: "offenceTypes[0]" },

      // Date Formatting
      {
        header: "Date",
        key: "offenceOccurenceDetails.timeOfOffence",
        formatter: (val) => val ? new Date(val).toLocaleDateString("en-GB") : ""
      },
      {
        header: "Time",
        key: "offenceOccurenceDetails.timeOfOffence",
        formatter: (val) => val ? new Date(val).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }) : ""
      },

      { header: "Location", key: "offenceOccurenceDetails.incidentLocation" },
      { header: "Description", key: "offenceOccurenceDetails.description" },

      // Vehicle
      { header: "Vehicle No", key: "vehicleNumber" },
      { header: "Vehicle Type", key: "vehicleType" },
      { header: "Vehicle Name", key: "vehicleName" },

      // Offender (Note: "Select Rank" matches your JSON key)
      { header: "Offender Name", key: "offenders[0].offenderDetails.name" },
      { header: "Rank", key: "offenders[0].offenderDetails.Select Rank" },
      { header: "Army No", key: "offenders[0].offenderDetails.armyNumber" },
      { header: "Unit", key: "offenders[0].offenderDetails.unit" },
      { header: "FMN", key: "offenders[0].offenderDetails.fmn" },
      { header: "Address", key: "offenders[0].offenderDetails.address" },
      { header: "ICard", key: "offenders[0].offenderDetails.iCardNumber" },

      // Reporting MP (Note: Unique key path prevents overwrite)
      { header: "Reporting MP", key: "onDutyDetailsMPReporting.nameReportingMP" },
      { header: "MP Rank", key: "onDutyDetailsMPReporting.rank" },
      { header: "MP Unit", key: "onDutyDetailsMPReporting.unit" },
      { header: "MP Army No", key: "onDutyDetailsMPReporting.armyNumber" },

      { header: "Remarks", key: "remarks" },
    ];

    // 3. Export
    exportToExcel(flatList, `Traffic_Offences_${viewType}`, columns);
  };

  /* ================= RENDER STATES ================= */

  const pageTitle =
    viewType === "vehicle"
      ? "General & Traffic Offence Reports - Vehicle Involved"
      : "General & Traffic Offence Reports - No Vehicle Involved";

  /* ================= VIEW MODE STATE ================= */
  const [viewMode, setViewMode] = useState<"report" | "attachments">("report");

  // When viewing a grouped offence item we may not have the full offence
  // object from the grouped endpoint. Fetch the single offence by id
  // so attachments (`certificates` etc.) are available to the viewer.
  const viewingId = viewingReport?._id ?? viewingReport?.originalData?._id ?? null;
  const viewingIdStr = viewingId ?? "";
  const { data: viewingFullRecordData } = useGetTrafficOffenceById(viewingIdStr);
  const finalViewingRecord = viewingFullRecordData?.data ?? viewingFullRecordData ?? viewingReport?.originalData ?? viewingReport;

  // Edit hydration
  const editingId = editingReport?._id || editingReport?.reportId || "";
  const { data: editingFullData, isLoading: isLoadingEdit } = useGetTrafficOffenceById(editingId);
  const finalEditingRecord = editingFullData?.data ?? editingFullData ?? editingReport;

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Button onClick={() => { setIsCreating(false); setEditingReport(null); }} className="m-4">
          <ArrowLeft /> Back
        </Button>
        {isLoadingEdit && editingId ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
          </div>
        ) : (
          <MultiStepForm existingOffence={finalEditingRecord} />
        )}
      </div>
    );
  }

  if (viewingReport) {
    return (
      <>
        <ReportViewerWrapper
          title="REPORT PREVIEW"
          onBack={() => {
            setViewingReport(null);
            setViewMode("report");
          }}
          isDownloading={isDownloading}
          downloadType={downloadType}
          activeView={viewMode}
          onViewReport={() => setViewMode("report")}
          onViewAttachments={() => setViewMode("attachments")}
          onDownloadWord={() => handleDownloadReport(viewingReport)}
          onDownloadPdf={() => handleDownloadPdf(viewingReport)}
          onPrint={() => window.print()}
          onEdit={() => {
            setEditingReport(viewingReport);
            setIsCreating(true);
            setViewingReport(null);
          }}
        >
          {viewMode === "report" && (
            <MilitaryPoliceReport {...mapToReportProps(viewingReport)} />
          )}

          {viewMode === "attachments" && (
            <SignedAttachmentsViewer
              record={finalViewingRecord}
              onAttachMore={() => setIsAttachModalOpen(true)}
              onDelete={handleAttachDelete}
            />
          )}
        </ReportViewerWrapper>

        <FormAttachmentModal
          isOpen={isAttachModalOpen}
          onClose={() => setIsAttachModalOpen(false)}
          onSave={handleAttachSave}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportPageHeader
        title={pageTitle}
        reportCount={activeGroups.reduce(
          (a: number, g: any) => a + g.offences.length,
          0
        )}
        onDownload={handleExcelDownload}
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
          onEdit={(offense) => {
            setEditingReport(offense);
            setIsCreating(true);
          }}
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