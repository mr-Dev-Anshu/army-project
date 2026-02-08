// "use client";

// import React, { useMemo, useState, useEffect, useRef } from "react";
// import { Loader2, ArrowLeft, FileSpreadsheet, FileJson, Plus, X } from "lucide-react";
// import { toast } from "react-toastify";

// import StaticSpeedTable from "./_components/StaticSpeedTable";
// import ReportFilterBar from "@/components/common/ReportFilterBar";
// import ReportPageHeader from "@/components/common/ReportPageHeader";
// import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";

// import { useGetStaticSpeedRecords, useGetStaticSpeedRecordById, useUpdateStaticSpeedRecord } from "@/features/staticSpeed/hooks";
// import { useCreateStaticSpeedRecord } from "@/features/staticSpeed/hooks";
// import StaticSpeedReport, {
//   StaticSpeedReportProps,
// } from "@/components/reports/StaticSpeedReport";

// import StaticSpeedForm from "@/common/component/staticSpeedForm/MainForm";
// import SignedAttachmentsViewer from "@/components/common/SignedAttachmentsViewer";
// import { Button } from "@/components/ui/button";
// import { generateStaticSpeedWordReport } from "@/utils/generateStaticSpeedWordReport";
// import FormAttachmentModal, { AttachedItem } from "@/components/ui/FormAttachmentModal";

// import { csvToJsonWithHiddenKeys } from "@/lib/csvToJson";
// import { excelToJson } from "@/lib/excelToJson";
// import { processImport } from "@/lib/processImport";

// /* ================= HELPERS ================= */

// // Recursively removes system fields (_id, __v, createdAt, updatedAt) from any object or array
// const cleanSystemFields = (data: any): any => {
//   if (Array.isArray(data)) {
//     return data.map(cleanSystemFields);
//   } else if (data !== null && typeof data === 'object') {
//     const cleaned: any = {};
//     Object.keys(data).forEach(key => {
//       // Skip system fields
//       if (["_id", "__v", "createdAt", "updatedAt", "id"].includes(key)) return;

//       // Recursively clean children
//       cleaned[key] = cleanSystemFields(data[key]);
//     });
//     return cleaned;
//   }
//   return data;
// };

// /* ================= KEY MAPPING UTILS ================= */
// const KEY_MAPPING: Record<string, string> = {
//   "Report No": "reportId",
//   "Vehicle No": "vehicleNumber",
//   "Vehicle Number": "vehicleNumber",
//   "Vehicle Type": "vehicleType",
//   "Vehicle Name": "vehicleName",
//   "Date": "offenceOccurenceDetails.time",
//   "Time": "offenceOccurenceDetails.time",
//   "Location": "offenceOccurenceDetails.incidentLocation",
//   "Place": "offenceOccurenceDetails.incidentLocation",
//   "Authorized Speed": "offenceOccurenceDetails.authSpeed",
//   "Actual Speed": "offenceOccurenceDetails.actualSpeedNoted",
//   "Over Speed": "offenceOccurenceDetails.overSpeedCalculated",
//   "Description": "offenceOccurenceDetails.description",
//   "Offender Name": "offenders[0].offenderDetails.name",
//   "Rank": "offenders[0].offenderDetails.rank",
//   "Army No": "offenders[0].offenderDetails.armyNumber",
//   "Unit": "offenders[0].offenderDetails.unit",
//   "FMN": "offenders[0].offenderDetails.fmn",
//   "Address": "offenders[0].offenderDetails.address",
//   "Reporting MP Name": "onDutyDetailsMPReporting.nameReportingMP",
//   "Reporting MP Rank": "onDutyDetailsMPReporting.rank",
//   "Reporting MP Army No": "onDutyDetailsMPReporting.armyNumber",
//   "Reporting MP Unit": "onDutyDetailsMPReporting.unit",
//   "Remarks": "remark"
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

// const mapData = (data: any[]) => {
//   return data.map((item) => {
//     const newItem: any = {};
//     Object.keys(item).forEach((key) => {
//       // Skip if it's a system field (extra safety, though cleanSystemFields handles this)
//       if (["_id", "__v", "createdAt", "updatedAt", "id"].includes(key)) return;

//       const mappedKey = KEY_MAPPING[key.trim()] || key.trim();
//       if (item[key] !== null && item[key] !== undefined && item[key] !== "") {
//         setNestedValue(newItem, mappedKey, item[key]);
//       }
//     });
//     return newItem;
//   });
// };

// export default function StaticSpeedCheckReportsPage() {
//   const [filters, setFilters] = useState({
//     search: "",
//     date: "",
//     fromDate: "",
//     toDate: "",
//     unit: "",
//     fmn: "",
//     placeOfOffence: "",
//     actionStatus: "All",
//     sortOrder: "desc" as "asc" | "desc",
//   });

//   const [isCreating, setIsCreating] = useState(false);
//   const [editingReport, setEditingReport] = useState<any>(null);
//   const [viewingReport, setViewingReport] = useState<any | null>(null);
//   const [shouldAutoPrint, setShouldAutoPrint] = useState(false);

//   const [showAddOptions, setShowAddOptions] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { mutateAsync: createStaticSpeedRecord } = useCreateStaticSpeedRecord();

//   /* ================= IMPORT HANDLERS ================= */

//   const handleImportCSV = () => {
//     fileInputRef.current?.click();
//     setShowAddOptions(false);
//   };

//   const handleImportJSON = () => {
//     fileInputRef.current?.click();
//     setShowAddOptions(false);
//   };

//   const handleCreateNew = () => {
//     setIsCreating(true);
//     setShowAddOptions(false);
//   };

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const fileName = file.name.toLowerCase();
//     const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
//     const isJson = fileName.endsWith(".json");

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

//         // FIX: Unwrap API response wrappers (e.g., { success: true, data: [...] })
//         if (json && !Array.isArray(json) && json.data) {
//           json = json.data;
//         }

//         let dataArray = Array.isArray(json) ? json : [json];

//         // FIX: Deep clean system fields from all objects (nested _id, etc.)
//         dataArray = cleanSystemFields(dataArray);

//         const mappedData = mapData(dataArray);

//         await processImport(mappedData, createStaticSpeedRecord);

//         toast.success("Records imported successfully!");
//         await refetch();
//       } catch (error: any) {
//         console.error("Error importing file:", error);
//         toast.error(`Failed to import records: ${error.message || "Unknown error"}`);
//       }
//     };

//     if (isExcel) {
//       reader.readAsArrayBuffer(file);
//     } else {
//       reader.readAsText(file);
//     }
//     event.target.value = "";
//   };

//   // NEW STATE FOR ATTACHMENT
//   const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
//   const { mutateAsync: updateRecord } = useUpdateStaticSpeedRecord();

//   /* ================= HANDLERS ================= */
//   const handleAttachSave = async (newItems: AttachedItem[]) => {
//     if (!viewingReport?._id) return;

//     try {
//       const currentAttachments = viewingReport.customFields?.attachments || viewingReport.attachments || [];
//       const updatedAttachments = [...currentAttachments, ...newItems];

//       await updateRecord({
//         id: viewingReport._id,
//         data: {
//           customFields: {
//             ...viewingReport.customFields,
//             attachments: updatedAttachments
//           }
//         }
//       });

//       toast.success("Attachments Added Successfully");

//       // Update local state
//       setViewingReport((prev: any) => ({
//         ...prev,
//         customFields: {
//           ...prev.customFields,
//           attachments: updatedAttachments
//         }
//       }));
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to add attachments");
//     }
//   };

//   // HANDLE ATTACHMENT DELETE
//   const handleAttachDelete = async (attachment: any) => {
//     if (!viewingReport?._id) {
//       console.error("No viewing report ID found");
//       return;
//     }

//     console.log("Deleting attachment:", attachment);

//     try {
//       const currentAttachments =
//         viewingReport.customFields?.attachments ||
//         viewingReport.attachments ||
//         viewingReport.certificates ||
//         [];

//       console.log("Current attachments:", currentAttachments);
//       const updatedAttachments = currentAttachments.filter((item: any) => item.url !== attachment.url);
//       console.log("Updated attachments:", updatedAttachments);

//       const updatePayload: any = {
//         id: viewingReport._id,
//         data: {}
//       };

//       if (viewingReport.customFields?.attachments) {
//         updatePayload.data.customFields = {
//           ...viewingReport.customFields,
//           attachments: updatedAttachments
//         };
//       } else if (viewingReport.certificates) {
//         updatePayload.data.certificates = updatedAttachments;
//       } else {
//         updatePayload.data.customFields = {
//           ...viewingReport.customFields,
//           attachments: updatedAttachments
//         };
//       }

//       await updateRecord(updatePayload);
//       toast.success("Attachment Deleted Successfully");

//       setViewingReport((prev: any) => {
//         const updated = { ...prev };
//         if (prev.customFields?.attachments) {
//           updated.customFields = { ...prev.customFields, attachments: updatedAttachments };
//         } else if (prev.certificates) {
//           updated.certificates = updatedAttachments;
//         } else {
//           updated.customFields = { ...prev.customFields, attachments: updatedAttachments };
//         }
//         return updated;
//       });
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to delete attachment: " + (error as any)?.message || "Unknown error");
//     }
//   };

//   /* ================= AUTO PRINT ================= */
//   // ... (rest of the file until return block)

//   useEffect(() => {
//     if (viewingReport && shouldAutoPrint) {
//       const t = setTimeout(() => {
//         window.print();
//         setShouldAutoPrint(false);
//       }, 500);
//       return () => clearTimeout(t);
//     }
//   }, [viewingReport, shouldAutoPrint]);

//   const apiParams = useMemo(() => {
//     const params: any = {};
//     if (filters.unit) params.unit = filters.unit;
//     if (filters.fmn) params.fmn = filters.fmn;
//     if (filters.fromDate) params.fromDate = filters.fromDate;
//     if (filters.toDate) params.toDate = filters.toDate;
//     if (filters.placeOfOffence) params.placeOfOffence = filters.placeOfOffence;
//     if (filters.date) params.date = filters.date;
//     if (filters.actionStatus && filters.actionStatus !== "All") params.status = filters.actionStatus;
//     return params;
//   }, [filters]);

//   const { data, isLoading, isError, refetch } = useGetStaticSpeedRecords(apiParams);

//   const processedData = useMemo(() => {
//     if (!data) return [];

//     const filtered = data.filter((item: any) => {
//       const rawDate = item.offenceOccurenceDetails?.timeOfOffence || item.createdAt;

//       if (filters.fromDate || filters.toDate) {
//         const d = new Date(rawDate).getTime();
//         if (filters.fromDate && d < new Date(filters.fromDate).getTime()) return false;
//         if (filters.toDate && d > new Date(filters.toDate + "T23:59:59.999").getTime()) return false;
//       }

//       if (filters.date) {
//         const recDate = new Date(rawDate).toISOString().split("T")[0];
//         if (recDate !== filters.date) return false;
//       }

//       if (filters.actionStatus !== "All") {
//         const isTaken = item.actionStatus === true;
//         if ((filters.actionStatus === "Taken" && !isTaken) || (filters.actionStatus === "Pending" && isTaken)) return false;
//       }

//       if (filters.unit) {
//         const unit = item.onDutyDetailsMPReporting?.unit || item.offenders?.[0]?.offenderDetails?.unit;
//         if (!unit || unit !== filters.unit) return false;
//       }

//       if (filters.fmn) {
//         const fmn = item.fmn || item.offenders?.[0]?.offenderDetails?.fmn;
//         if (!fmn || fmn !== filters.fmn) return false;
//       }

//       if (filters.placeOfOffence) {
//         const place = item.placeOfOffence || item.offenceOccurenceDetails?.incidentLocation || item.incidentLocation;
//         if (!place || place.toLowerCase() !== filters.placeOfOffence.toLowerCase()) return false;
//       }

//       if (filters.search) {
//         const s = filters.search.toLowerCase();
//         const rNo = item.reportId || item.reportNumber || item.reportNo || "";
//         if (!rNo.toLowerCase().includes(s) && !item.vehicleNumber?.toLowerCase().includes(s)) return false;
//       }

//       return true;
//     });

//     if (filters.sortOrder) {
//       filtered.sort((a: any, b: any) => {
//         const dA = new Date(a.offenceOccurenceDetails?.timeOfOffence || a.createdAt).getTime();
//         const dB = new Date(b.offenceOccurenceDetails?.timeOfOffence || b.createdAt).getTime();
//         return filters.sortOrder === "asc" ? dA - dB : dB - dA;
//       });
//     }

//     return filtered.map((item: any) => {
//       const offence = item.offenceOccurenceDetails || {};
//       const driver = item.offenders?.[0]?.offenderDetails || {};
//       const dateObj = new Date(offence.timeOfOffence || item.createdAt);

//       return {
//         _id: item._id,
//         placeOfOffence: offence.incidentLocation || "Unknown",
//         date: dateObj.toLocaleDateString("en-GB"),
//         time: dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
//         driverDetails: {
//           name: driver.name,
//           armyNumber: driver.armyNumber,
//           rank: driver.rank,
//         },
//         mpName: item.onDutyDetailsMPReporting?.nameReportingMP || "Unknown",
//         unit: item.onDutyDetailsMPReporting?.unit || driver.unit || "MP Unit",
//         fmn: item.fmn || driver.fmn,
//         vehicleNo: item.vehicleNumber,
//         vehicleModel: item.vehicleName,
//         reportNo: item.reportId || item.reportNumber || item.reportNo || "N/A",
//         actionStatus: item.actionStatus,
//         offenceBrief: offence.description || "N/A",
//         authSpeed: offence.authSpeed || "-",
//         actualSpeed: offence.actualSpeedNoted || "-",
//         overSpeed: offence.overSpeedCalculated || "-",
//         remarks: item.remark || item.remarks || "N/A",
//         originalData: item,
//       };
//     });
//   }, [data, filters]);

//   const mapToReportProps = (item: any): StaticSpeedReportProps => {
//     const raw = item.originalData;
//     const offence = raw.offenceOccurenceDetails || {};
//     const offender = raw.offenders?.[0]?.offenderDetails || {};
//     const mp = raw.onDutyDetailsMPReporting || {};
//     const witness1 = raw.onDutyWitnessingMps?.[0] || {};
//     const witness2 = raw.onDutyWitnessingMps?.[1] || {};
//     const val = (v: any) => v || "";

//     return {
//       reportNo: raw.reportId || item.reportNo,
//       reportDate: new Date(raw.createdAt).toLocaleDateString("en-GB"),
//       unitName: mp.unit || offender.unit,
//       particulars: {
//         rider: {
//           armyNo: val(offender.armyNumber),
//           name: val(offender.name),
//           rank: val(offender.rank),
//           unit: val(mp.unit || offender.unit),
//           fmn: val(raw.fmn || offender.fmn),
//           address: val(raw.address || offender.address),
//           command: val(raw.command || offender.command),
//           iCardNo: val(offender.iCardNumber),
//         },
//         vehicle: {
//           baNo: val(raw.vehicleNumber),
//           makeAndTake: val(raw.vehicleName),
//         },
//       },
//       occurrence: {
//         dateOfDuty: val(item.date),
//         dutyLocation: val(item.placeOfOffence),
//         dutyTime: item.time ? `${item.time} Hrs` : "",
//         nameOfWitnessingOfficial1: val(witness1.name),
//         rankOfWitnessingOfficial1: val(witness1.rank),
//         nameOfWitnessingOfficial2: val(witness2.name),
//         rankOfWitnessingOfficial2: val(witness2.rank),
//         statement: val(offence.description),
//       },
//       offence: {
//         actualSpeed: val(offence.actualSpeedNoted),
//         authSpeed: val(offence.authSpeed),
//         overSpeed: val(offence.overSpeedCalculated),
//       },
//       witnessSig: {
//         armyNo: val(witness1.armyNumber || witness1.ArmyNo),
//         rank: val(witness1.rank),
//         name: val(witness1.name),
//         unit: val(witness1.unit),
//       },
//       mpSig: {
//         armyNo: val(mp.armyNumber),
//         name: val(mp.nameReportingMP),
//         rank: val(mp.rank),
//         unit: val(mp.unit),
//       },
//       remarks: {
//         text: val(raw.remark || raw.remarks),
//         station: val(raw.station || item.placeOfOffence),
//         dated: new Date().toLocaleDateString("en-GB"),
//       },
//     };
//   };

//   const [isDownloading, setIsDownloading] = useState(false);
//   const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

//   const handleDownloadReport = async (item: any) => {
//     setIsDownloading(true);
//     setDownloadType("Word");
//     try {
//       generateStaticSpeedWordReport(mapToReportProps(item));
//       await new Promise(resolve => setTimeout(resolve, 500));
//     } catch (e) {
//       console.error(e);
//       alert("Failed to download Word report");
//     } finally {
//       setIsDownloading(false);
//       setDownloadType(null);
//     }
//   };

//   const handleDownloadPdf = async (item: any) => {
//     const id = item._id || item.reportId;
//     if (!id) {
//       alert("Report ID not found");
//       return;
//     }
//     setIsDownloading(true);
//     setDownloadType("PDF");
//     try {
//       const response = await fetch(`/api/static-speed-report/pdf/${id}`);
//       if (!response.ok) throw new Error("Failed to generate PDF");
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `StaticSpeedReport-${item.reportNo || id}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("PDF Download Error", error);
//       alert("Failed to download PDF");
//     } finally {
//       setIsDownloading(false);
//       setDownloadType(null);
//     }
//   };

//   const handlePrintReport = (item: any) => {
//     setViewingReport(item);
//     setShouldAutoPrint(true);
//   };

//   if (isCreating) {
//     return (
//       <div className="min-h-screen bg-gray-100">
//         <Button onClick={() => setIsCreating(false)} className="m-4">
//           <ArrowLeft /> Back
//         </Button>
//         <StaticSpeedForm onCancel={() => setIsCreating(false)} />
//       </div>
//     );
//   }

//   /* ================= VIEW MODE STATE ================= */
//   const [viewMode, setViewMode] = useState<"report" | "attachments">("report");

//   // Debug logging
//   useEffect(() => {
//     if (viewingReport) {
//       console.log("=== STATIC SPEED - Viewing Report ===");
//       console.log("Full Report Object:", viewingReport);
//       console.log("Certificates field:", viewingReport.certificates);
//       console.log("Custom Fields:", viewingReport.customFields);
//       console.log("All keys:", Object.keys(viewingReport));
//     }
//   }, [viewingReport]);

//   // When a report is selected for viewing we may only have a lightweight
//   // item from the list endpoint. Fetch the full record (including
//   // certificates/attachments) by id and prefer that when rendering
//   // the attachments viewer.
//   const viewingId = viewingReport?._id ?? viewingReport?.originalData?._id ?? null;
//   const viewingIdStr = viewingId ?? "";
//   const { data: viewingFullRecordData, isLoading: isViewingRecordLoading } = useGetStaticSpeedRecordById(viewingIdStr);
//   const finalViewingRecord = viewingFullRecordData?.data ?? viewingFullRecordData ?? viewingReport?.originalData ?? viewingReport;

//   if (isCreating) {
//     return (
//       <div className="min-h-screen bg-gray-100">
//         <Button onClick={() => { setIsCreating(false); setEditingReport(null); }} className="m-4">
//           <ArrowLeft /> Back
//         </Button>
//         <StaticSpeedForm onCancel={() => { setIsCreating(false); setEditingReport(null); }} existingReport={editingReport} />
//       </div>
//     );
//   }

//   if (viewingReport) {
//     return (
//       <>
//         <ReportViewerWrapper
//           title="STATIC SPEED CHECK REPORT"
//           onBack={() => {
//             setViewingReport(null);
//             setShouldAutoPrint(false);
//             setViewMode("report");
//           }}
//           isDownloading={isDownloading}
//           downloadType={downloadType}
//           activeView={viewMode}
//           onViewReport={() => setViewMode("report")}
//           onViewAttachments={() => setViewMode("attachments")}
//           onDownloadWord={() => handleDownloadReport(viewingReport)}
//           onDownloadPdf={() => handleDownloadPdf(viewingReport)}
//           onPrint={() => window.print()}
//           onEdit={() => {
//             setEditingReport(finalViewingRecord);
//             setIsCreating(true);
//             setViewingReport(null);
//           }}
//         >
//           {viewMode === "report" && (
//             <StaticSpeedReport {...mapToReportProps(viewingReport)} />
//           )}

//           {viewMode === "attachments" && (
//             <SignedAttachmentsViewer
//               record={finalViewingRecord}
//               onAttachMore={() => setIsAttachModalOpen(true)}
//               onDelete={handleAttachDelete}
//             />
//           )}
//         </ReportViewerWrapper>

//         <FormAttachmentModal
//           isOpen={isAttachModalOpen}
//           onClose={() => setIsAttachModalOpen(false)}
//           onSave={handleAttachSave}
//         />
//       </>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <ReportPageHeader
//         title="Static Speed Check Reports"
//         reportCount={processedData.length}
//       />

//       <ReportFilterBar
//         filters={filters}
//         onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
//         showOffenceType={false}
//         placeholder="Search by report no or vehicle..."
//         onAddNew={() => setShowAddOptions(true)}
//         showFilter
//         onReset={() =>
//           setFilters({
//             search: "",
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
//         <div className="flex justify-center p-12">
//           <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
//         </div>
//       ) : isError ? (
//         <div className="p-8 text-red-500 text-center">Failed to load reports</div>
//       ) : (
//         <StaticSpeedTable
//           data={processedData}
//           onView={setViewingReport}
//           onPrint={handlePrintReport}
//           onDownload={handleDownloadReport}
//           onEdit={(report) => {
//             setEditingReport(report);
//             setIsCreating(true);
//           }}
//         />
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
//                 <p className="text-gray-500 leading-relaxed">Upload a CSV or Excel file containing multiple records.</p>
//               </button>

//               <button
//                 onClick={handleImportJSON}
//                 className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group text-center h-72"
//               >
//                 <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
//                   <FileJson className="w-10 h-10 text-orange-600" />
//                 </div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700">Import JSON</h4>
//                 <p className="text-gray-500 leading-relaxed">Upload a JSON file with structured data.</p>
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
//               <Button variant="ghost" onClick={() => setShowAddOptions(false)}>Cancel</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Loader2,
  ArrowLeft,
  FileSpreadsheet,
  FileJson,
  Plus,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import StaticSpeedTable from "./_components/StaticSpeedTable";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";

import {
  useGetStaticSpeedRecords,
  useCreateStaticSpeedRecord,
} from "@/features/staticSpeed/hooks";
import { useCreateOffender } from "@/features/offender/Hooks";
import { CreateOffenderData } from "@/apis/offender/types";

import StaticSpeedReport, {
  StaticSpeedReportProps,
} from "@/components/reports/StaticSpeedReport";

import StaticSpeedForm from "@/common/component/staticSpeedForm/MainForm";
import { Button } from "@/components/ui/button";
import { generateStaticSpeedWordReport } from "@/utils/generateStaticSpeedWordReport";

import { csvToJsonWithHiddenKeys } from "@/lib/csvToJson";
import { excelToJson } from "@/lib/excelToJson";

/* ================= HELPERS ================= */

const cleanSystemFields = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(cleanSystemFields);
  } else if (data !== null && typeof data === "object") {
    const cleaned: any = {};
    Object.keys(data).forEach((key) => {
      if (["_id", "__v", "createdAt", "updatedAt", "id"].includes(key)) return;
      cleaned[key] = cleanSystemFields(data[key]);
    });
    return cleaned;
  }
  return data;
};

/* ================= KEY MAPPING UTILS (CSV/Flat JSON) ================= */
const KEY_MAPPING: Record<string, string> = {
  "Report No": "reportId",
  "Vehicle No": "vehicleNumber",
  "Vehicle Number": "vehicleNumber",
  "Vehicle Type": "vehicleType",
  "Vehicle Name": "vehicleName",
  Date: "offenceOccurenceDetails.time",
  Time: "offenceOccurenceDetails.time",
  Location: "offenceOccurenceDetails.incidentLocation",
  Place: "offenceOccurenceDetails.incidentLocation",
  "Authorized Speed": "offenceOccurenceDetails.authSpeed",
  "Actual Speed": "offenceOccurenceDetails.actualSpeedNoted",
  "Over Speed": "offenceOccurenceDetails.overSpeedCalculated",
  Description: "offenceOccurenceDetails.description",
  "Offender Name": "offenders[0].offenderDetails.name",
  Rank: "offenders[0].offenderDetails.rank",
  "Army No": "offenders[0].offenderDetails.armyNumber",
  Unit: "offenders[0].offenderDetails.unit",
  FMN: "offenders[0].offenderDetails.fmn",
  Address: "offenders[0].offenderDetails.address",
  "Reporting MP Name": "onDutyDetailsMPReporting.nameReportingMP",
  "Reporting MP Rank": "onDutyDetailsMPReporting.rank",
  "Reporting MP Army No": "onDutyDetailsMPReporting.armyNumber",
  "Reporting MP Unit": "onDutyDetailsMPReporting.unit",
  Remarks: "remark",
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
      if (["_id", "__v", "createdAt", "updatedAt", "id"].includes(key)) return;
      const mappedKey = KEY_MAPPING[key.trim()] || key.trim();
      if (item[key] !== null && item[key] !== undefined && item[key] !== "") {
        setNestedValue(newItem, mappedKey, item[key]);
      }
    });
    return newItem;
  });
};

/* ================= JSON NORMALIZER ================= */
const normalizeOneStaticSpeed = (item: any): any => {
  const r = item.report ?? item;
  const d = item.dutyDetails ?? {};
  const reporting = d.reportingMP ?? {};
  const witnessing = d.witnessingMP ?? {};

  const offenders = Array.isArray(r.offenders)
    ? r.offenders.map((o: any) => ({
        offenderType:
          o.offenderType === "militaryPersonnel"
            ? "Military Person"
            : o.offenderType || "Military Person",
        offenderDetails: {
          armyNumber: o.armyNumber ?? "",
          rank: o.selectRank ?? o.rank ?? "",
          name: o.name ?? "",
          unit: o.unit ?? "",
          fmn: o.fmn ?? "",
          command: o.command ?? "",
          address: o.address ?? "",
          iCardNumber: o.iCardNumber ?? "",
        },
      }))
    : [];

  let finalTime: string | undefined;
  if (d.dateOfDuty && r.timeOfOffence) {
    const timePart =
      typeof r.timeOfOffence === "string" && r.timeOfOffence.length === 5
        ? `${r.timeOfOffence}:00`
        : r.timeOfOffence;
    finalTime = `${d.dateOfDuty}T${timePart}`;
  } else if (d.dateOfDuty) {
    finalTime = d.dateOfDuty;
  } else {
    finalTime = r.timeOfOffence;
  }

  return {
    vehicleNumber: r.vehicleNumber ?? "",
    vehicleType: r.vehicleType ?? "",
    vehicleName: r.vehicleName ?? "",
    offenceOccurenceDetails: {
      incidentLocation: r.incidentLocation ?? "",
      timeOfOffence: finalTime,
      authSpeed: r.authSpeed ?? "",
      actualSpeedNoted: r.actualSpeedNoted ?? "",
      overSpeedCalculated: r.overSpeedCalculated ?? "",
      description: r.reportHeading ?? r.description ?? "",
    },
    onDutyDetailsMPReporting: {
      armyNumber: reporting.armyNo ?? reporting.armyNumber ?? "",
      rank: reporting.rank ?? "",
      nameReportingMP: reporting.name ?? "",
      unit: reporting.unit ?? "",
    },
    onDutyWitnessingMps: witnessing.armyNo
      ? [
          {
            armyNumber: witnessing.armyNo,
            rank: witnessing.rank,
            name: witnessing.name,
            unit: witnessing.unit,
          },
        ]
      : [],
    remarks: r.remarks ?? item.remarks ?? "",
    offenders,
  };
};

const normalizeJSON = (json: any): any[] => {
  if (json?.reports && Array.isArray(json.reports)) {
    return json.reports.map((item: any) => normalizeOneStaticSpeed(item));
  }
  if (json?.data && Array.isArray(json.data)) {
    return json.data.map((item: any) =>
      item.report != null ? normalizeOneStaticSpeed(item) : mapData([item])[0],
    );
  }
  if (Array.isArray(json)) {
    return json.map((item: any) =>
      item.report != null ? normalizeOneStaticSpeed(item) : mapData([item])[0],
    );
  }
  return [normalizeOneStaticSpeed(json)];
};

/** Maps a normalized import item to the exact shape the API/DB expect (time, remark, etc.) */
const mapItemToApiPayload = (item: any) => {
  const { offenders, offenceOccurenceDetails: occRaw, remarks, ...rest } = item;
  const occ = occRaw || {};
  const { timeOfOffence, ...occRest } = occ;
  const offenceOccurenceDetails = {
    ...occRest,
    time: occ.time ?? timeOfOffence,
  };
  return {
    ...rest,
    offenceOccurenceDetails,
    remark: rest.remark ?? remarks ?? "",
  };
};

export default function StaticSpeedCheckReportsPage() {
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    fromDate: "",
    toDate: "",
    unit: "",
    fmn: "",
    placeOfOffence: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks for creating records - Using mutateAsync for sequential processing
  const { mutateAsync: createStaticSpeedRecord } = useCreateStaticSpeedRecord();
  const { mutateAsync: createOffender } = useCreateOffender();

  const handleImportCSV = () => {
    fileInputRef.current?.click();
    setShowAddOptions(false);
  };
  const handleImportJSON = () => {
    fileInputRef.current?.click();
    setShowAddOptions(false);
  };
  const handleCreateNew = () => {
    setIsCreating(true);
    setShowAddOptions(false);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
    const isJson = fileName.endsWith(".json");
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

        const originalJson = json;
        if (json && !Array.isArray(json) && json.data) {
          json = json.data;
        }
        const dataArray = Array.isArray(json) ? json : [json];
        const mappedData = normalizeJSON(originalJson ?? dataArray);
        if (!mappedData.length) {
          toast.warning("No valid records found in the file.");
          return;
        }
        let successCount = 0;
        let failCount = 0;

        const handleImportRecord = async (item: any) => {
          try {
            // 1. Destructure offenders array and map rest to API payload shape (time, remark, etc.)
            const { offenders } = item;
            const reportPayload = mapItemToApiPayload(item);

            // 2. Create the main Speed Report first to get the database _id
            const createdRecord = await createStaticSpeedRecord(reportPayload);

            // 3. If report creation successful, iterate and create offenders linked to this ID
            if (createdRecord?._id && Array.isArray(offenders)) {
              for (const offender of offenders) {
                if (offender.offenderDetails) {
                  const offenderPayload: CreateOffenderData = {
                    offenceId: createdRecord._id, // LINKING ID FROM DB
                    offenderType: offender.offenderType || "Military Person",
                    offenderDetails: {
                      armyNumber: offender.offenderDetails.armyNumber || "",
                      rank: offender.offenderDetails.rank || "",
                      name: offender.offenderDetails.name || "",
                      unit: offender.offenderDetails.unit || "",
                      fmn: offender.offenderDetails.fmn || "",
                      command: offender.offenderDetails.command || "",
                      address: offender.offenderDetails.address || "",
                      iCardNumber: offender.offenderDetails.iCardNumber || "",
                    },
                  };
                  // Call the Offender API for each person in the JSON array
                  await createOffender(offenderPayload);
                }
              }
            }

            successCount++;
            return createdRecord;
          } catch (err) {
            console.error("Failed to import record/offenders:", err);
            failCount++;
            return null;
          }
        };

        // Process each record sequentially so each is saved as a separate DB record
        for (const record of mappedData) {
          await handleImportRecord(record);
        }

        if (failCount === 0) {
          toast.success(
            `All ${successCount} record(s) and linked offenders imported successfully!`,
          );
        } else {
          toast.warning(
            `Import partial: ${successCount} succeeded, ${failCount} failed.`,
          );
        }

        await refetch();
      } catch (error: any) {
        console.error("Error importing file:", error);
        toast.error(`Failed to import: ${error.message || "Unknown error"}`);
      }
    };

    if (isExcel) reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
    event.target.value = "";
  };

  /* ... rest of your component logic (useEffect, apiParams, processedData, mapToReportProps, etc) ... */

  useEffect(() => {
    if (viewingReport && shouldAutoPrint) {
      setTimeout(() => {
        window.print();
        setShouldAutoPrint(false);
      }, 400);
    }
  }, [viewingReport, shouldAutoPrint]);

  /* ================= API ================= */

  const apiParams = useMemo(() => {
    const p: any = {};
    if (filters.unit) p.unit = filters.unit;
    if (filters.fmn) p.fmn = filters.fmn;
    if (filters.fromDate) p.fromDate = filters.fromDate;
    if (filters.toDate) p.toDate = filters.toDate;
    if (filters.placeOfOffence) p.placeOfOffence = filters.placeOfOffence;
    if (filters.date) p.date = filters.date;
    if (filters.actionStatus !== "All") p.status = filters.actionStatus;
    return p;
  }, [filters]);

  const { data, isLoading, isError, refetch } =
    useGetStaticSpeedRecords(apiParams);

  const processedData = useMemo(() => {
    if (!data) return [];
    const filtered = data.filter((item: any) => {
      const rawDate =
        item.offenceOccurenceDetails?.timeOfOffence || item.createdAt;
      if (filters.fromDate || filters.toDate) {
        const d = new Date(rawDate).getTime();
        if (filters.fromDate && d < new Date(filters.fromDate).getTime())
          return false;
        if (
          filters.toDate &&
          d > new Date(filters.toDate + "T23:59:59.999").getTime()
        )
          return false;
      }
      if (filters.date) {
        const recDate = new Date(rawDate).toISOString().split("T")[0];
        if (recDate !== filters.date) return false;
      }
      if (filters.actionStatus !== "All") {
        const isTaken = item.actionStatus === true;
        if (
          (filters.actionStatus === "Taken" && !isTaken) ||
          (filters.actionStatus === "Pending" && isTaken)
        )
          return false;
      }
      if (filters.unit) {
        const unit =
          item.onDutyDetailsMPReporting?.unit ||
          item.offenders?.[0]?.offenderDetails?.unit ||
          "";
        if (unit.toLowerCase() !== filters.unit.toLowerCase()) return false;
      }
      if (filters.fmn) {
        const fmn = item.fmn || item.offenders?.[0]?.offenderDetails?.fmn;
        if (!fmn || fmn !== filters.fmn) return false;
      }
      if (filters.placeOfOffence) {
        const place =
          item.placeOfOffence ||
          item.offenceOccurenceDetails?.incidentLocation ||
          item.incidentLocation;
        if (
          !place ||
          place.toLowerCase() !== filters.placeOfOffence.toLowerCase()
        )
          return false;
      }
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const searchableFields = [
          item.reportId || item.reportNumber || item.reportNo || "",
          item.vehicleNumber || "",
          item.vehicleName || "",
          item.offenceOccurenceDetails?.incidentLocation || "",
          item.offenders?.[0]?.offenderDetails?.name || "",
          item.offenders?.[0]?.offenderDetails?.armyNumber || "",
          item.onDutyDetailsMPReporting?.nameReportingMP || "",
        ];
        const matchFound = searchableFields.some((field) =>
          field.toLowerCase().includes(s),
        );
        if (!matchFound) return false;
      }
      return true;
    });

    if (filters.sortOrder) {
      filtered.sort((a: any, b: any) => {
        const dA = new Date(
          a.offenceOccurenceDetails?.timeOfOffence || a.createdAt,
        ).getTime();
        const dB = new Date(
          b.offenceOccurenceDetails?.timeOfOffence || b.createdAt,
        ).getTime();
        if (isNaN(dA)) return 1;
        if (isNaN(dB)) return -1;
        return filters.sortOrder === "asc" ? dA - dB : dB - dA;
      });
    }

    return filtered.map((item: any) => {
      const offence = item.offenceOccurenceDetails || {};
      const offendersList = item.offenders ?? [];
      const driverOffender =
        offendersList.find((o: any) => o?.offenderDetails?.type === "Driver") ??
        offendersList[0];
      const coDriverOffender =
        offendersList.find(
          (o: any) => o?.offenderDetails?.type === "Co-Driver",
        ) ?? offendersList[1];
      const driver = driverOffender?.offenderDetails ?? {};
      const dateObj = new Date(offence.timeOfOffence || item.createdAt);
      return {
        _id: item._id,
        placeOfOffence: offence.incidentLocation || "Unknown",
        date: isNaN(dateObj.getTime())
          ? "Invalid Date"
          : dateObj.toLocaleDateString("en-GB"),
        time: isNaN(dateObj.getTime())
          ? "--:--"
          : dateObj.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
        driverDetails: driverOffender
          ? {
              ...driverOffender,
              offenderDetails: driverOffender.offenderDetails ?? driverOffender,
            }
          : undefined,
        coDriverDetails: coDriverOffender
          ? {
              ...coDriverOffender,
              offenderDetails:
                coDriverOffender.offenderDetails ?? coDriverOffender,
            }
          : undefined,
        mpName: item.onDutyDetailsMPReporting?.nameReportingMP || "Unknown",
        unit: item.onDutyDetailsMPReporting?.unit || driver.unit || "MP Unit",
        fmn: item.fmn || driver.fmn,
        vehicleNo: item.vehicleNumber,
        vehicleModel: item.vehicleName,
        reportNo: item.reportId || item.reportNumber || item.reportNo || "N/A",
        actionStatus: item.actionStatus,
        offenceBrief: offence.description || "N/A",
        authSpeed: offence.authSpeed || "-",
        actualSpeed: offence.actualSpeedNoted || "-",
        overSpeed: offence.overSpeedCalculated || "-",
        remarks: item.remark || item.remarks || "N/A",
        originalData: item,
      };
    });
  }, [data, filters]);

  const mapToReportProps = (item: any): StaticSpeedReportProps => {
    const raw = item.originalData;
    const offence = raw.offenceOccurenceDetails || {};
    const offender = raw.offenders?.[0]?.offenderDetails || {};
    const mp = raw.onDutyDetailsMPReporting || {};
    const witness1 = raw.onDutyWitnessingMps?.[0] || {};
    const witness2 = raw.onDutyWitnessingMps?.[1] || {};
    const val = (v: any) => v || "";
    return {
      reportNo: raw.reportId || item.reportNo,
      reportDate: new Date(raw.createdAt).toLocaleDateString("en-GB"),
      unitName: mp.unit || offender.unit,
      particulars: {
        rider: {
          armyNo: val(offender.armyNumber),
          name: val(offender.name),
          rank: val(offender.rank),
          unit: val(mp.unit || offender.unit),
          fmn: val(raw.fmn || offender.fmn),
          address: val(raw.address || offender.address),
          command: val(raw.command || offender.command),
          iCardNo: val(offender.iCardNumber),
        },
        vehicle: {
          baNo: val(raw.vehicleNumber),
          makeAndTake: val(raw.vehicleName),
        },
      },
      occurrence: {
        dateOfDuty: val(item.date),
        dutyLocation: val(item.placeOfOffence),
        dutyTime: item.time ? `${item.time} Hrs` : "",
        nameOfWitnessingOfficial1: val(witness1.name),
        rankOfWitnessingOfficial1: val(witness1.rank),
        nameOfWitnessingOfficial2: val(witness2.name),
        rankOfWitnessingOfficial2: val(witness2.rank),
        statement: val(offence.description),
      },
      offence: {
        actualSpeed: val(offence.actualSpeedNoted),
        authSpeed: val(offence.authSpeed),
        overSpeed: val(offence.overSpeedCalculated),
      },
      witnessSig: {
        armyNo: val(witness1.armyNumber || witness1.ArmyNo),
        rank: val(witness1.rank),
        name: val(witness1.name),
        unit: val(witness1.unit),
      },
      mpSig: {
        armyNo: val(mp.armyNumber),
        name: val(mp.nameReportingMP),
        rank: val(mp.rank),
        unit: val(mp.unit),
      },
      remarks: {
        text: val(raw.remark || raw.remarks),
        station: val(raw.station || item.placeOfOffence),
        dated: new Date().toLocaleDateString("en-GB"),
      },
    };
  };

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

  const handleDownloadReport = async (item: any) => {
    setIsDownloading(true);
    setDownloadType("Word");
    try {
      generateStaticSpeedWordReport(mapToReportProps(item));
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(e);
      alert("Failed to download Word report");
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const handleDownloadPdf = async (item: any) => {
    const id = item._id || item.reportId;
    if (!id) return alert("Report ID not found");
    setIsDownloading(true);
    setDownloadType("PDF");
    try {
      const response = await fetch(`/api/static-speed-report/pdf/${id}`);
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `StaticSpeedReport-${item.reportNo || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Error", error);
      alert("Failed to download PDF");
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const handlePrintReport = (item: any) => {
    setViewingReport(item);
    setShouldAutoPrint(true);
  };

  if (isCreating)
    return (
      <div className="min-h-screen bg-gray-100">
        <Button onClick={() => setIsCreating(false)} className="m-4">
          <ArrowLeft /> Back
        </Button>
        <StaticSpeedForm
          existingReport={editingReport}
          onCancel={() => {
            setIsCreating(false);
            setEditingReport(null);
          }}
        />
      </div>
    );

  if (viewingReport)
    return (
      <ReportViewerWrapper
        title="STATIC SPEED CHECK REPORT"
        onBack={() => {
          setViewingReport(null);
          setShouldAutoPrint(false);
        }}
        isDownloading={isDownloading}
        downloadType={downloadType}
        onDownloadWord={() => handleDownloadReport(viewingReport)}
        onDownloadPdf={() => handleDownloadPdf(viewingReport)}
        onPrint={() => window.print()}
      >
        <StaticSpeedReport {...mapToReportProps(viewingReport)} />
      </ReportViewerWrapper>
    );

  /* ================= MAIN LIST ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportPageHeader
        title="Static Speed Check Reports"
        reportCount={processedData.length}
      />
      <ReportFilterBar
        filters={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        showOffenceType={false}
        placeholder="Search by report no or vehicle..."
        onAddNew={() => setShowAddOptions(true)}
        showFilter
        onReset={() =>
          setFilters({
            search: "",
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
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">Failed to load</div>
      ) : (
        <StaticSpeedTable
          data={processedData}
          onView={setViewingReport}
          onPrint={handlePrintReport}
          onDownload={handleDownloadReport}
          onEdit={(report) => {
            setEditingReport(report.originalData || report);
            setIsCreating(true);
          }}
        />
      )}
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
                <h3 className="text-xl font-bold text-gray-900">
                  Add New Record
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Choose how you want to add data to the system
                </p>
              </div>
              <button
                onClick={() => setShowAddOptions(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={handleImportCSV}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 group h-72"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <FileSpreadsheet className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">Import CSV / Excel</h4>
                <p className="text-gray-500">
                  Upload a CSV or Excel file containing multiple records.
                </p>
              </button>
              <button
                onClick={handleImportJSON}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50 group h-72"
              >
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                  <FileJson className="w-10 h-10 text-orange-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">Import JSON</h4>
                <p className="text-gray-500">
                  Upload a JSON file with structured data.
                </p>
              </button>
              <button
                onClick={handleCreateNew}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 group h-72"
              >
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Plus className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">Create Manually</h4>
                <p className="text-gray-500">
                  Fill out the form manually to add a single record.
                </p>
              </button>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <Button variant="ghost" onClick={() => setShowAddOptions(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
