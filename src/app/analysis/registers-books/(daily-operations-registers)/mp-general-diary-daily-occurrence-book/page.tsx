"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MpGeneralDiaryDailyOccurrenceBookTable from "@/features/RegisterBooks/DailyOperationsRegisters/mpGeneralDiaryDailyOccurrenceBook/components/mpGeneralDiaryDailyOccurrenceBookTable";
import MpGeneralDiaryForm from "@/features/RegisterBooks/DailyOperationsRegisters/mpGeneralDiaryDailyOccurrenceBook/components/Form";
import {
    useGetMpGeneralDiaryEntries,
    useUpdateMpGeneralDiaryEntry,
    useCreateMpGeneralDiaryEntry
} from "@/features/RegisterBooks/DailyOperationsRegisters/mpGeneralDiaryDailyOccurrenceBook/hooks";
import ReportViewerWrapper from "@/components/common/ReportViewerWrapper";
import FormAttachmentModal from "@/components/ui/FormAttachmentModal";
import MpOccurrenceReport, { MpOccurrenceReportProps } from "@/components/reports/MpOccurrenceReport";

import RightSideSheet from "@/components/common/RightSideSheet";
import { toast } from "react-toastify";

const Page = () => {
    const router = useRouter();
    const [viewingReport, setViewingReport] = useState<any | null>(null);
    const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

    // Add/Edit State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    // Attachment State
    const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
    const [recordForAttachment, setRecordForAttachment] = useState<any | null>(null);

    const handleAttach = (item: any) => {
        setRecordForAttachment(item);
        setIsAttachModalOpen(true);
    };

    // Fetch Data
    const { data: registers, isLoading } = useGetMpGeneralDiaryEntries({});
    const updateMutation = useUpdateMpGeneralDiaryEntry();
    const createMutation = useCreateMpGeneralDiaryEntry();

    // Auto Print Effect
    React.useEffect(() => {
        if (viewingReport && shouldAutoPrint) {
            const timer = setTimeout(() => {
                window.print();
                setShouldAutoPrint(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [viewingReport, shouldAutoPrint]);

    const handleAddNew = () => {
        // Open the sheet for manual creation instead of redirecting
        setSelectedRecord(null);
        setIsSheetOpen(true);
    };

    const handleView = (details: any) => {
        setViewingReport(details);
    };

    const handlePrint = (details: any) => {
        setViewingReport(details);
        setShouldAutoPrint(true);
    };

    const handleEdit = (record: any) => {
        setSelectedRecord(record);
        setIsSheetOpen(true);
    };

    const handleFormSubmit = async ({ id, payload }: { id?: string, payload: any }) => {
        try {
            if (id) {
                // Update existing
                await updateMutation.mutateAsync({ id, payload });
            } else {
                // Create new
                // We must structure the payload for creation as expected by the generic register API
                // Payload passed here is { details: {...}, remark:..., authentication: ... }
                // We need to wrap it with type, date, etc.
                const newRecord = {
                    type: "mp-general-diary-daily-occurrence-book",
                    date: payload.details.dateOfOccurrence || new Date(),
                    details: payload.details,
                    remark: payload.remark,
                    authentication: payload.authentication,
                    status: "pending_out"
                };
                await createMutation.mutateAsync(newRecord);
            }
            setIsSheetOpen(false);
            setSelectedRecord(null);
        } catch (error) {
            console.error(error);
            // toast handled in hook usually, but adding catch for safety
        }
    }

    const handleAttachSave = async (newAttachments: any[]) => {
        const targetRecord = viewingReport || recordForAttachment;
        if (!targetRecord?._id) {
            console.error("No target record ID found for attachment");
            return;
        }

        try {
            const currentAttachments = targetRecord.customFields?.attachments || targetRecord.attachments || [];
            const updatedAttachments = [...currentAttachments, ...newAttachments];

            await updateMutation.mutateAsync({
                id: targetRecord._id,
                payload: {
                    ...targetRecord,
                    customFields: {
                        ...(targetRecord.customFields || {}),
                        attachments: updatedAttachments
                    }
                }
            });

            toast.success("Attachments Added Successfully");

            // If viewing this report, update local state
            if (viewingReport && viewingReport._id === targetRecord._id) {
                setViewingReport((prev: any) => ({
                    ...prev,
                    customFields: {
                        ...(prev.customFields || {}),
                        attachments: updatedAttachments
                    }
                }));
            }

            setIsAttachModalOpen(false);
            setRecordForAttachment(null);

        } catch (error) {
            console.error(error);
            toast.error("Failed to add attachments");
        }
    };

    // --- Mapper Logic ---
    const mapToReportProps = (data: any): MpOccurrenceReportProps => {
        return {
            reportNo: data.caseNo || "",
            command: "Southern Command",
            firNo: "",
            mpDetails: {
                armyNumber: data.assignedMP?.armyNo || "",
                rank: data.assignedMP?.rank || "",
                name: data.assignedMP?.name || "",
                unit: data.assignedMP?.unit || "",
                fmn: data.assignedMP?.fmn || "HQ 21 CORPs",
                command: ""
            },
            occurrence: {
                types: data.offenceTypes || (data.offenceType ? [data.offenceType] : []),
                refs: [],
                place: data.placeOfOccurrence || "",
                date: data.dateOfOccurrence ? new Date(data.dateOfOccurrence).toLocaleDateString("en-GB") : "",
                time: data.timeOfOccurrence ? new Date(data.timeOfOccurrence).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }) : ""
            },
            people: [{
                sno: 1,
                armyNo: data.individual?.armyNo || "",
                rank: data.individual?.rank || "",
                name: data.individual?.name || "",
                unitName: data.individual?.unit || "",
                role: "Offender/Victim",
                identityCard: "",
                fmn: "",
                address: "",
                remark: "",
                customFields: {}
            }],
            briefOfOccurrence: data.brief || "",
            witnesses: [],
            evidence: {
                eyeSketch: "",
                photos: "",
                videos: ""
            },
            documents: data.documents?.map((d: any) => typeof d === 'string' ? d : (d.statement || d.name || "Attached Document")) || [],
            detailedReport: {
                statement: data.brief || "",
                findings: [],
                opinion: ""
            },
            remarks: {
                analysis: "",
                recommendation: ""
            },
            station: data.assignedMP?.unit || "",
            reportDate: data.dateOfOccurrence ? new Date(data.dateOfOccurrence).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB")
        };
    };



    const handleDownloadPdf = async (details: any) => {
        const id = details.originalReportId;
        if (!id) {
            alert("Cannot download PDF: Original Report ID missing from register entry.");
            return;
        }
        setIsDownloading(true);
        setDownloadType("PDF");
        try {
            const response = await fetch(`/api/mp-occurrence-report/pdf/${id}`);
            if (!response.ok) throw new Error("Failed to generate PDF");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MPOccurrenceReport-${details.caseNo || id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Failed to download PDF report");
        } finally {
            setIsDownloading(false);
            setDownloadType(null);
        }
    };


    if (viewingReport) {
        return (
            <ReportViewerWrapper
                title="MP OCCURRENCE REPORT"
                onBack={() => {
                    setViewingReport(null);
                    setShouldAutoPrint(false);
                }}
                isDownloading={isDownloading}
                downloadType={downloadType}
                onDownloadPdf={() => handleDownloadPdf(viewingReport)}
                onPrint={() => window.print()}
            >
                <MpOccurrenceReport {...mapToReportProps(viewingReport)} />
            </ReportViewerWrapper>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b bg-white px-6 py-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <BookOpen className="h-5 w-5 text-gray-700" />
                    <div className="h-5 w-[1px] bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                        <span className="hover:text-[#0A0A0A] text-[#0A0A0A] transition-colors cursor-pointer">Reports & Analysis</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span
                            className="hover:text-[#0A0A0A] text-[#0A0A0A] transition-colors cursor-pointer"
                            onClick={() => router.push('/analysis/registers-books')}
                        >
                            Registers/Books
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="font-bold text-[#0A0A0A]">
                            MP General Diary & Daily Occurrence Book
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <MpGeneralDiaryDailyOccurrenceBookTable
                        data={registers || []}
                        onEdit={handleEdit}
                        onView={handleView}
                        onAttach={handleAttach}
                    />
                )}
            </div>

            {isAttachModalOpen && (
                <FormAttachmentModal
                    isOpen={isAttachModalOpen}
                    onClose={() => {
                        setIsAttachModalOpen(false);
                        setRecordForAttachment(null);
                    }}
                    onSave={handleAttachSave}
                />
            )}

            <RightSideSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title={selectedRecord ? "Edit MP General Diary & Daily Occurrence Book Entry" : "Add New Occurrence Entry"}
                description={selectedRecord ? "Update the details of the selected occurrence record." : "Create a new entry in the register manually."}
            >
                <MpGeneralDiaryForm
                    initialData={selectedRecord}
                    onCancel={() => setIsSheetOpen(false)}
                    onSubmit={handleFormSubmit}
                    onSuccess={() => { }} // Handled in submit wrapper
                />
            </RightSideSheet>
        </div>
    );
};

export default Page;
