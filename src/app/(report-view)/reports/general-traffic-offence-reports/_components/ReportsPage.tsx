// "use client";

// import React, { useState, useMemo, useRef } from "react";
// import { Loader2, ArrowLeft, FileSpreadsheet, FileJson, Plus, X } from "lucide-react";
// import { toast } from "react-toastify";

// import ReportFilterBar from "@/components/common/ReportFilterBar";
// import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";
// import ReportPageHeader from "@/components/common/ReportPageHeader";
// import GroupedList from "./GroupedList";

// import { useGetAllTrafficOffences, useCreateTrafficOffence } from "@/features/generalTraficOffence/hooks";
// // 1. Import Offender Hooks
// import { useCreateOffender } from "@/features/offender/Hooks";
// import { CreateOffenderData } from "@/apis/offender/types";

// import { csvToJsonWithHiddenKeys } from "@/lib/csvToJson";
// import { excelToJson } from "@/lib/excelToJson";
// import MultiStepForm from "@/common/component/multi-step-form/MulitstepForm";
// import { Button } from "@/components/ui/button";

// import MilitaryPoliceReport, {
//   MilitaryPoliceReportProps,
// } from "@/components/reports/MilitaryPoliceReport";

// import { generateWordReport } from "@/utils/generateWordReport";
// import { useExcelExport, ExcelColumn } from "@/hooks/useExcelExport";

// /* ================= KEY MAPPING UTILS ================= */
// const KEY_MAPPING: Record<string, string> = {
//   "Offence Type": "offenceType",
//   "Vehicle Number": "vehicleNumber",
//   "Vehicle No": "vehicleNumber",
//   "Vehicle Type": "vehicleType",
//   "Place of Offence": "offenceOccurenceDetails.incidentLocation",
//   "Incident Location": "offenceOccurenceDetails.incidentLocation",
//   "Date": "offenceOccurenceDetails.timeOfOffence",
//   "Time": "offenceOccurenceDetails.timeOfOffence",
//   "Description": "offenceOccurenceDetails.description",
//   "Army No": "offenders[0].offenderDetails.armyNumber",
//   "Rank": "offenders[0].offenderDetails.rank",
//   "Name": "offenders[0].offenderDetails.name",
//   "Unit": "offenders[0].offenderDetails.unit",
//   "FMN": "offenders[0].offenderDetails.fmn",
//   "Father Name": "offenders[0].offenderDetails.fatherName",
//   "Relation": "offenders[0].offenderDetails.relation",
//   "Address": "offenders[0].offenderDetails.address",
//   "Reporting MP Name": "onDutyDetailsMPReporting.nameReportingMP",
//   "Reporting MP Rank": "onDutyDetailsMPReporting.rank",
//   "Reporting MP Army No": "onDutyDetailsMPReporting.armyNumber",
//   "Reporting MP Unit": "onDutyDetailsMPReporting.unit",
// };

// const setNestedValue = (obj: any, path: string, value: any) => {
//   const keys = path.replace(/\]/g, "").split(/[.\[]/);
//   let current = obj;
//   for (let i = 0; i < keys.length - 1; i++) {
//     const key = keys[i];
//     const nextKey = keys[i + 1];
//     const isArray = !isNaN(Number(nextKey));

//     if (!current[key]) {
//       current[key] = isArray ? [] : {};
//     }
//     current = current[key];
//   }
//   current[keys[keys.length - 1]] = value;
// };

// // Standard mapping for flat CSV/Excel
// const mapData = (data: any[]) => {
//   return data.map((item) => {
//     const newItem: any = {};
//     Object.keys(item).forEach((key) => {
//       const mappedKey = KEY_MAPPING[key.trim()] || key.trim();
//       if (item[key] !== null && item[key] !== undefined && item[key] !== "") {
//         setNestedValue(newItem, mappedKey, item[key]);
//       }
//     });

//     if (newItem.vehicleNumber) {
//         newItem.isVehicleInvolved = true;
//     } else if (newItem.isVehicleInvolved === undefined) {
//         newItem.isVehicleInvolved = false;
//     }

//     return newItem;
//   });
// };

// // 2. Normalizer for JSON: supports { reports: [...] }, { data: [...] }, or array
// const normalizeJSON = (json: any): any[] => {
//   if (json?.reports && Array.isArray(json.reports)) {
//     return json.reports.map((item: any) => normalizeOneTrafficReport(item));
//   }
//   if (json?.data && Array.isArray(json.data)) {
//     return json.data.map((item: any) =>
//       item.report != null ? normalizeOneTrafficReport(item) : mapData([item])[0]
//     );
//   }
//   if (Array.isArray(json)) {
//     return json.map((item: any) =>
//       item.report != null ? normalizeOneTrafficReport(item) : mapData([item])[0]
//     );
//   }
//   return [normalizeOneTrafficReport(json)];
// }

// function normalizeOneTrafficReport(item: any): any {
//   const r = item.report ?? item;
//   const d = item.dutyDetails ?? {};
//   const reporting = d.reportingMP ?? {};
//   const witnessing = d.witnessingMP ?? {};
//   const offenders = Array.isArray(r.offenders)
//     ? r.offenders.map((o: any) => ({
//         offenderType: o.offenderType === "militaryPersonnel" ? "Military Person" : (o.offenderType || "Military Person"),
//         offenderDetails: {
//           armyNumber: o.armyNumber ?? "",
//           rank: o.selectRank ?? o.rank ?? "",
//           name: o.name ?? "",
//           unit: o.unit ?? "",
//           fmn: o.fmn ?? "",
//           command: o.command ?? "",
//           address: o.address ?? "",
//           iCardNumber: o.iCardNumber ?? "",
//         },
//       }))
//     : [];
//   let finalTime = r.timeOfOffence;
//   if (d.dateOfDuty && r.timeOfOffence && typeof r.timeOfOffence === "string" && !r.timeOfOffence.includes("T")) {
//     finalTime = `${d.dateOfDuty}T${r.timeOfOffence}`;
//   } else if (d.dateOfDuty) {
//     finalTime = d.dateOfDuty;
//   }
//   return {
//     vehicleNumber: r.vehicleNumber ?? "",
//     vehicleType: r.vehicleType ?? "",
//     vehicleName: r.vehicleName ?? "",
//     isVehicleInvolved: !!r.vehicleNumber,
//     offenceOccurenceDetails: {
//       incidentLocation: r.incidentLocation ?? "",
//       timeOfOffence: finalTime ?? "",
//       description: r.briefDescription ?? r.reportHeading ?? r.description ?? "",
//     },
//     onDutyDetailsMPReporting: {
//       armyNumber: reporting.armyNo ?? reporting.armyNumber ?? "",
//       rank: reporting.rank ?? "",
//       nameReportingMP: reporting.name ?? "",
//       unit: reporting.unit ?? "",
//     },
//     onDutyWitnessingMps: witnessing.armyNo
//       ? [{ armyNumber: witnessing.armyNo, rank: witnessing.rank, name: witnessing.name, unit: witnessing.unit }]
//       : [],
//     remarks: r.remarks ?? item.remarks ?? "",
//     offenders,
//   };
// }

// /* ================= MAIN PAGE ================= */

// export default function ReportsPage({
//   viewType = "vehicle",
// }: {
//   viewType?: "vehicle" | "no-vehicle";
// }) {
//   const [isCreating, setIsCreating] = useState(false);
//   const [viewingReport, setViewingReport] = useState<any | null>(null);
//   const [showAddOptions, setShowAddOptions] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { mutateAsync: createTrafficOffence } = useCreateTrafficOffence();
//   // 3. Initialize Offender Hook
//   const { mutateAsync: createOffender } = useCreateOffender();

//   const { exportToExcel } = useExcelExport();

//   /* ================= HANDLERS FOR ADD NEW ================= */
//   const handleImportCSV = () => {
//     fileInputRef.current?.click();
//     setShowAddOptions(false);
//   };

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
//     const isJson = file.name.endsWith(".json");
//     const reader = new FileReader();

//     reader.onload = async (e) => {
//       const result = e.target?.result;
//       if (!result) return;

//       try {
//         let json: any;
//         if (isExcel && result instanceof ArrayBuffer) {
//           json = excelToJson(result);
//         } else if (isJson && typeof result === "string") {
//           json = JSON.parse(result);
//         } else if (typeof result === "string") {
//           json = csvToJsonWithHiddenKeys(result);
//         }

//         const originalJson = json;
//         if (json && !Array.isArray(json) && json.data) {
//           json = json.data;
//         }
//         const dataArray = Array.isArray(json) ? json : [json];

//         // 4. Normalize (supports { reports: [...] }, { data: [...] }, or array)
//         const mappedData = normalizeJSON(originalJson ?? dataArray);
//         if (!mappedData.length) {
//           toast.warning("No valid records found in the file.");
//           return;
//         }

//         let successCount = 0;
//         let failCount = 0;

//         const handleImportRecord = async (item: any) => {
//           try {
//             const { offenders, ...reportPayload } = item;
//             const createdOffence = await createTrafficOffence(reportPayload);

//             if (createdOffence?._id && Array.isArray(offenders)) {
//               for (const offender of offenders) {
//                 if (offender.offenderDetails) {
//                   const offenderPayload: CreateOffenderData = {
//                     offenceId: createdOffence._id,
//                     offenderType: offender.offenderType || "Military Person",
//                     offenderDetails: offender.offenderDetails,
//                   };
//                   await createOffender(offenderPayload);
//                 }
//               }
//             }
//             successCount++;
//             return createdOffence;
//           } catch (err) {
//             console.error("Failed to import traffic offence:", err);
//             failCount++;
//             return null;
//           }
//         };

//         for (const record of mappedData) {
//           await handleImportRecord(record);
//         }

//         if (failCount === 0) {
//           toast.success(`All ${successCount} record(s) and linked offenders imported successfully!`);
//         } else {
//           toast.warning(`Import partial: ${successCount} succeeded, ${failCount} failed.`);
//         }
//         await refetch();
//       } catch (error: any) {
//         console.error("Error importing file:", error);
//         if (error?.response?.data && typeof error.response.data === "string" && error.response.data.includes("<!DOCTYPE html>")) {
//           toast.error("API Error: Endpoint not found.");
//         } else {
//           toast.error(`Failed to import records: ${error.message || "Unknown error"}`);
//         }
//       }
//     };

//     if (isExcel) {
//       reader.readAsArrayBuffer(file);
//     } else {
//       reader.readAsText(file);
//     }
//     event.target.value = "";
//   };

//   const handleImportJSON = () => {
//     fileInputRef.current?.click();
//     setShowAddOptions(false);
//   };

//   const handleCreateNew = () => {
//     setIsCreating(true);
//     setShowAddOptions(false);
//   };

//   /* ================= FILTER STATE ================= */

//   const [filters, setFilters] = useState({
//     search: "",
//     offenceType: "All",
//     date: "",
//     fromDate: "",
//     toDate: "",
//     unit: "",
//     fmn: "",
//     placeOfOffence: "",
//     actionStatus: "All",
//     sortOrder: "desc" as "asc" | "desc",
//   });

//   /* ================= API PARAMS ================= */

//   const apiParams = useMemo(() => {
//     const params: any = {
//       groupBy: "offenceType",
//       isVehicleInvolved: viewType === "vehicle",
//     };

//     if (filters.offenceType !== "All") params.offenceType = filters.offenceType;
//     if (filters.actionStatus !== "All") params.status = filters.actionStatus;
//     if (filters.fromDate) params.fromDate = filters.fromDate;
//     if (filters.toDate) params.toDate = filters.toDate;
//     if (filters.unit) params.unit = filters.unit;
//     if (filters.fmn) params.fmn = filters.fmn;
//     if (filters.placeOfOffence) params.placeOfOffence = filters.placeOfOffence;
//     if (filters.date) params.date = filters.date;

//     return params;
//   }, [filters, viewType]);

//   const { data, isLoading, isError, refetch } = useGetAllTrafficOffences(apiParams);

//   /* ================= DYNAMIC OPTIONS FROM DATA ================= */
//   const { offenceTypeOptions, unitOptions, fmnOptions, placeOptions } = useMemo(() => {
//     if (!data) return { offenceTypeOptions: [], unitOptions: [], fmnOptions: [], placeOptions: [] };

//     const types = new Set<string>();
//     const units = new Set<string>();
//     const fmns = new Set<string>();
//     const places = new Set<string>();

//     data.forEach((group: any) => {
//       if (group.offenceType) types.add(group.offenceType);
//       else if (typeof group._id === 'string') types.add(group._id);

//       if (Array.isArray(group.offences)) {
//         group.offences.forEach((o: any) => {
//           const unit = o.customFields?.unit || o.onDutyDetailsMPReporting?.unit || o.offenders?.[0]?.offenderDetails?.unit;
//           if (unit) units.add(unit);

//           const fmn = o.customFields?.fmn || o.offenders?.[0]?.offenderDetails?.fmn;
//           if (fmn) fmns.add(fmn);

//           const place = o.customFields?.placeOfOffence || o.onDutyDetails?.dutyLocation || o.offenceOccurenceDetails?.incidentLocation;
//           if (place) places.add(place);
//         });
//       }
//     });

//     return {
//       offenceTypeOptions: Array.from(types).sort(),
//       unitOptions: Array.from(units).sort(),
//       fmnOptions: Array.from(fmns).sort(),
//       placeOptions: Array.from(places).sort(),
//     };
//   }, [data]);

//   /* ================= CLIENT SIDE FILTERING ================= */

//   const { vehicleGroups, noVehicleGroups } = useMemo(() => {
//     if (!data) return { vehicleGroups: [], noVehicleGroups: [] };

//     const filterRecord = (o: any) => {
//       if (filters.search) {
//         const s = filters.search.toLowerCase();
//         const rNo = o.reportId || o.reportNumber || "";
//         if (!rNo.toLowerCase().includes(s) && !o.currentOffenceType?.toLowerCase().includes(s)) {
//           return false;
//         }
//       }

//       if (filters.unit) {
//         const unit = o.customFields?.unit || o.onDutyDetailsMPReporting?.unit || o.offenders?.[0]?.offenderDetails?.unit;
//         const selectedUnits = filters.unit.split(",");
//         if (!unit || !selectedUnits.includes(unit)) return false;
//       }

//       if (filters.fmn) {
//         const fmn = o.customFields?.fmn || o.offenders?.[0]?.offenderDetails?.fmn;
//         const selectedFmns = filters.fmn.split(",");
//         if (!fmn || !selectedFmns.includes(fmn)) return false;
//       }

//       if (filters.placeOfOffence) {
//         const place = o.customFields?.placeOfOffence || o.onDutyDetails?.dutyLocation || o.offenceOccurenceDetails?.incidentLocation;
//         const selectedPlaces = filters.placeOfOffence.split(",").map(p => p.toLowerCase());
//         if (!place || !selectedPlaces.includes(place.toLowerCase())) return false;
//       }

//       return true;
//     };

//     const vg: any[] = [];
//     const nvg: any[] = [];

//     data.forEach((group: any) => {
//       const v = group.offences?.filter((o: any) => o.isVehicleInvolved === true && filterRecord(o)) || [];
//       const nv = group.offences?.filter((o: any) => (o.isVehicleInvolved === false || o.isVehicleInvolved === null || o.isVehicleInvolved === undefined) && filterRecord(o)) || [];

//       if (v.length) vg.push({ ...group, offences: v });
//       if (nv.length) nvg.push({ ...group, offences: nv });
//     });

//     return { vehicleGroups: vg, noVehicleGroups: nvg };
//   }, [data, filters]);

//   /* ================= DOWNLOAD STATE ================= */
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

//   /* ================= REPORT HELPERS ================= */

//   const handleDownloadReport = async (offence: any) => {
//     setIsDownloading(true);
//     setDownloadType("Word");
//     try {
//       const props = mapToReportProps(offence);
//       await generateWordReport(props);
//     } catch (error) {
//       console.error("Word Download Error", error);
//       alert("Failed to download Word report");
//     } finally {
//       setIsDownloading(false);
//       setDownloadType(null);
//     }
//   };

//   const handleDownloadPdf = async (offence: any) => {
//     const id = offence._id || offence.reportId;
//     if (!id) {
//       alert("Report ID not found");
//       return;
//     }

//     setIsDownloading(true);
//     setDownloadType("PDF");

//     try {
//       const response = await fetch(`/api/military-police-report/pdf/${id}`);
//       if (!response.ok) throw new Error("Failed to generate PDF");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `Report-${offence.reportNo || id}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("PDF Download Error", error);
//       alert("Failed to download PDF report");
//     } finally {
//       setIsDownloading(false);
//       setDownloadType(null);
//     }
//   };

//   const handlePrintReport = (offence: any) => {
//     setViewingReport(offence);
//   };

//   const activeGroups = viewType === "vehicle" ? vehicleGroups : noVehicleGroups;

//   const handleExcelDownload = () => {
//     const flatList = activeGroups.flatMap(group => group.offences);
//     const columns: ExcelColumn[] = [
//       { header: "Report No", key: "reportId" },
//       { header: "Offence Type", key: "offenceTypes[0]" },
//       { header: "Date", key: "offenceOccurenceDetails.timeOfOffence", formatter: (val) => val ? new Date(val).toLocaleDateString("en-GB") : "" },
//       { header: "Time", key: "offenceOccurenceDetails.timeOfOffence", formatter: (val) => val ? new Date(val).toLocaleTimeString("en-GB", {hour: '2-digit', minute:'2-digit'}) : "" },
//       { header: "Location", key: "offenceOccurenceDetails.incidentLocation" },
//       { header: "Description", key: "offenceOccurenceDetails.description" },
//       { header: "Vehicle No", key: "vehicleNumber" },
//       { header: "Vehicle Type", key: "vehicleType" },
//       { header: "Vehicle Name", key: "vehicleName" },
//       { header: "Offender Name", key: "offenders[0].offenderDetails.name" },
//       { header: "Rank", key: "offenders[0].offenderDetails.Select Rank" },
//       { header: "Army No", key: "offenders[0].offenderDetails.armyNumber" },
//       { header: "Unit", key: "offenders[0].offenderDetails.unit" },
//       { header: "FMN", key: "offenders[0].offenderDetails.fmn" },
//       { header: "Address", key: "offenders[0].offenderDetails.address" },
//       { header: "ICard", key: "offenders[0].offenderDetails.iCardNumber" },
//       { header: "Reporting MP", key: "onDutyDetailsMPReporting.nameReportingMP" },
//       { header: "MP Rank", key: "onDutyDetailsMPReporting.rank" },
//       { header: "MP Unit", key: "onDutyDetailsMPReporting.unit" },
//       { header: "MP Army No", key: "onDutyDetailsMPReporting.armyNumber" },
//       { header: "Remarks", key: "remarks" },
//     ];
//     exportToExcel(flatList, `Traffic_Offences_${viewType}`, columns);
//   };

//   /* ================= RENDER STATES ================= */

//   const pageTitle =
//     viewType === "vehicle"
//       ? "General & Traffic Offence Reports - Vehicle Involved"
//       : "General & Traffic Offence Reports - No Vehicle Involved";

//   if (isCreating) {
//     return (
//       <div className="min-h-screen bg-gray-100">
//         <Button onClick={() => setIsCreating(false)} className="m-4">
//           <ArrowLeft /> Back
//         </Button>
//         <MultiStepForm />
//       </div>
//     );
//   }

//   if (viewingReport) {
//     return (
//       <ReportViewerWrapper
//         title="REPORT PREVIEW"
//         onBack={() => {
//           setViewingReport(null);
//         }}
//         isDownloading={isDownloading}
//         downloadType={downloadType}
//         onDownloadWord={() => handleDownloadReport(viewingReport)}
//         onDownloadPdf={() => handleDownloadPdf(viewingReport)}
//         onPrint={() => window.print()}
//       >
//         <MilitaryPoliceReport {...mapToReportProps(viewingReport)} />
//       </ReportViewerWrapper>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <ReportPageHeader
//         title={pageTitle}
//         reportCount={activeGroups.reduce(
//           (a: number, g: any) => a + g.offences.length,
//           0
//         )}
//         onDownload={handleExcelDownload}
//       />

//       <ReportFilterBar
//         filters={filters}
//         onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
//         showOffenceType
//         showDateRange
//         showActionStatus
//         showFilter
//         onAddNew={() => setShowAddOptions(true)}
//         onReset={() =>
//           setFilters({
//             search: "",
//             offenceType: "All",
//             date: "",
//             fromDate: "",
//             toDate: "",
//             unit: "",
//             fmn: "",
//             placeOfOffence: "",
//             actionStatus: "All",
//             sortOrder: "desc",
//           })
//         }
//       />

//       {isLoading ? (
//         <div className="flex justify-center p-10">
//           <Loader2 className="animate-spin w-8 h-8" />
//         </div>
//       ) : isError ? (
//         <div className="text-red-500 p-6">Failed to load data</div>
//       ) : activeGroups.length ? (
//         <GroupedList
//           data={activeGroups}
//           isVehicleInvolved={viewType === "vehicle"}
//           onView={setViewingReport}
//           onPrint={handlePrintReport}
//         />
//       ) : (
//         <div className="text-center text-gray-500 mt-10">No records found</div>
//       )}

//       <input
//         type="file"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         accept=".csv, .xlsx, .xls, .json"
//         onChange={handleFileChange}
//       />
//       {showAddOptions && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">Add New Record</h3>
//                 <p className="text-sm text-gray-500 mt-1">Choose how you want to add data to the system</p>
//               </div>
//               <button
//                 onClick={() => setShowAddOptions(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//               <button
//                 onClick={handleImportCSV}
//                 className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group text-center h-72"
//               >
//                 <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
//                   <FileSpreadsheet className="w-10 h-10 text-green-600" />
//                 </div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700">Import CSV / Excel</h4>
//                 <p className="text-gray-500 leading-relaxed">Upload a CSV or Excel file containing multiple offence records.</p>
//               </button>

//               <button
//                 onClick={handleImportJSON}
//                 className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group text-center h-72"
//               >
//                 <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
//                   <FileJson className="w-10 h-10 text-orange-600" />
//                 </div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700">Import JSON</h4>
//                 <p className="text-gray-500 leading-relaxed">Upload a JSON file with structured offence data.</p>
//               </button>

//               <button
//                 onClick={handleCreateNew}
//                 className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-center h-72"
//               >
//                 <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
//                   <Plus className="w-10 h-10 text-blue-600" />
//                 </div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700">Create Manually</h4>
//                 <p className="text-gray-500 leading-relaxed">Fill out the form manually to add a single record.</p>
//               </button>
//             </div>

//             <div className="bg-gray-50 px-6 py-4 flex justify-end">
//                <Button variant="ghost" onClick={() => setShowAddOptions(false)}>Cancel</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= EXPORTED REPORT MAPPER ================= */

// export function mapToReportProps(offence: any): MilitaryPoliceReportProps {
//   const primary = offence.offenders?.[0]?.offenderDetails || {};
//   const secondary = offence.offenders?.[1]?.offenderDetails;

//   const val = (v: any) => v || "";
//   const dateVal = (d: string) => d ? new Date(d).toLocaleDateString("en-GB") : "";
//   const timeVal = (d: string) => d ? new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";

//   const mpDetails = offence.onDutyDetailsMPReporting || {};
//   const witnesses = offence.onDutyWitnessingMps || [];
//   const witness1 = witnesses[0] || {};

//   const selectedWitness = offence.customFields?.selectedWitness || {};

//   return {
//     reportNo: offence.reportNo || offence.reportId || offence.reportNumber || "",
//     reportDate: dateVal(offence.createdAt),
//     particulars: {
//       primary: {
//         aadharCardNo: val(primary.aadharCard || primary.aadharNumber),
//         name: val(primary.name),
//         so: val(primary.fatherName || primary.so),
//         relation: val(primary.relation),
//         armyNo: val(primary.armyNumber || primary.armyNo),
//         rank: val(primary.rank || primary["Select Rank"]),
//         unit: val(primary.unit),
//         command: val(primary.command),
//         fmn: val(primary.fmn),
//         address: val(primary.address),
//         iCardNo: val(primary.identityCard || primary.iCardNumber || primary["I Card Number"]),
//       },
//       secondary: secondary
//         ? {
//           aadharCardNo: val(secondary.aadharCard || secondary.aadharNumber),
//           name: val(secondary.name),
//           so: val(secondary.fatherName || secondary.so),
//           relation: val(secondary.relation),
//           armyNo: val(secondary.armyNumber || secondary.armyNo),
//           rank: val(secondary.rank || secondary["Select Rank"]),
//           unit: val(secondary.unit),
//           command: val(secondary.command),
//           fmn: val(secondary.fmn),
//           address: val(secondary.address),
//           iCardNo: val(secondary.identityCard || secondary.iCardNumber || secondary["I Card Number"]),
//         }
//         : undefined,
//       vehicle: offence.isVehicleInvolved
//         ? {
//           baNo: val(offence.vehicleNumber),
//           makeAndTake: val(offence.vehicleName) || val(offence.vehicleType),
//           vehicleNumber: offence.vehicleType === "DD Vehicle" ? "DD Veh. BA No." : "Registration No.",
//         }
//         : undefined,
//     },
//     occurrence: {
//       dateOfDuty: dateVal(offence.onDutyDetails?.dateOfDuty),
//       dutyTime: (() => {
//         const start = offence.onDutyDetails?.startTime;
//         const end = offence.onDutyDetails?.endTime;
//         const sVal = timeVal(start);
//         const eVal = timeVal(end);
//         if (sVal && eVal) return `${sVal} Hrs - ${eVal} Hrs`;
//         if (sVal) return `${sVal} Hrs`;
//         return "";
//       })(),
//       dutyLocation: val(offence.onDutyDetails?.dutyLocation),
//       witnessingMps: witnesses.length > 0 ? witnesses.map((w: any) => ({ name: val(w.name), rank: val(w.rank) })) : [],
//       timeOfOffence: timeVal(offence.offenceOccurenceDetails?.timeOfOffence) ? timeVal(offence.offenceOccurenceDetails?.timeOfOffence) + " Hrs" : "",
//       locationOfOffence: val(offence.offenceOccurenceDetails?.incidentLocation),
//       statement: val(offence.offenceOccurenceDetails?.description),
//     },
//     offence: {
//       types: (offence.offenceTypes?.length ? offence.offenceTypes : offence.offenceOccurenceDetails?.offenceTypes) || (val(offence.currentOffenceType) ? [val(offence.currentOffenceType)] : []),
//       refs: (offence.offenceTypeReference?.length ? offence.offenceTypeReference : offence.offenceOccurenceDetails?.offenceTypeReference) || [],
//       description: val(offence.offenceOccurenceDetails?.description),
//     },
//     witnessSig: {
//       armyNo: val(selectedWitness?.armyNumber || witness1.armyNumber || witness1.ArmyNo),
//       rank: val(selectedWitness?.rank || witness1.rank),
//       name: val(selectedWitness?.nameReportingMP || witness1.name),
//       unit: val(selectedWitness?.unit || witness1.unit),
//     },
//     mpSig: {
//       armyNo: val(mpDetails.armyNumber),
//       rank: val(mpDetails.rank),
//       name: val(mpDetails.nameReportingMP),
//       unit: val(mpDetails.unit),
//     },
//     remarks: {
//       text: val(offence.customFields?.remarks || offence.remarks),
//       station: val(offence.onDutyDetails?.dutyLocation),
//       dated: new Date().toLocaleDateString("en-GB"),
//     },
//   };
// }




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
