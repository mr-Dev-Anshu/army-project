"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { SuggestionTextarea } from "@/common/component/SuggestionTextarea";
import {
    useCreateImmediateReportingIncident,
    useUpdateImmediateReportingIncident,
} from "../hooks";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";
import {
    Loader2,
    Upload,
    X,
    Plus,
    Trash2,
    CheckCheck,
    PanelLeft,
    Paperclip,
    FileText,
} from "lucide-react";
import { uploadFile, uploadMultipleFiles } from "@/lib/uploadFile";
import Link from "next/link";
import { IndividualVictimDetails } from "@/components/IndividualVictimDetails";
import FormAttachmentModal, {
    AttachedItem,
} from "@/components/ui/FormAttachmentModal";

const INITIAL_STATE = {
    reportHeading: "",
    vehicleType: "Civil Vehicle",
    vehicleNumber: "",
    vehicleName: "",
    individuals: [
        {
            individualType: "militaryPersonnel",
            individualDetails: {
                armyNo: "",
                rank: "",
                name: "",
                unit: "",
                fmn: "",
            },
            age: "",
            totalServiceDuration: "",
            unitLocation: "",
            individualWorkingStatus: "", // "Leave" | "Duty"
        },
    ],
    placeOfOccurrence: "",
    dateOfOccurrence: "",
    timeOfOccurrence: "",
    description: "",
    coordWith: "",
    incidentCoveredBy: "",
    relevantPhotos: [] as string[],
    attachments: [] as AttachedItem[],
};

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: ImmediateReportingIncident;
}

export const ImmediateReportingIncidentForm: React.FC<Props> = ({
    onCancel,
    onSuccess,
    initialData,
}) => {
    const { state, dispatch } = useForm();
    const reportData = state.formData.immediateReportingIncident || INITIAL_STATE;

    const { mutateAsync: createRecord, isPending: isCreating } =
        useCreateImmediateReportingIncident();
    const { mutateAsync: updateRecord, isPending: isUpdating } =
        useUpdateImmediateReportingIncident();
    const [isUploading, setIsUploading] = useState(false);
    const [photoUrlInput, setPhotoUrlInput] = useState("");
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);

    const isPending = isCreating || isUpdating;

    useEffect(() => {
        if (initialData) {
            dispatch({
                type: "SET_PATH",
                path: "formData.immediateReportingIncident",
                value: { ...INITIAL_STATE, ...initialData },
            });
        } else {
            dispatch({
                type: "SET_PATH",
                path: "formData.immediateReportingIncident",
                value: INITIAL_STATE,
            });
        }
    }, [initialData, dispatch]);

    const setField = (path: string, value: any) => {
        dispatch({
            type: "SET_PATH",
            path: `formData.immediateReportingIncident.${path}`,
            value,
        });
    };

    const handleSave = async () => {
        try {
            const cleanedData = structuredClone(reportData);

            /* =========================================
                 STEP 1 — SAFETY CHECK
              ========================================= */

            if (
                !Array.isArray(cleanedData.individuals) ||
                cleanedData.individuals.length === 0
            ) {
                toast.error("At least one individual is required");
                return;
            }

            if (
                cleanedData.individuals.some(
                    (ind: any) =>
                        (ind.individualType === "militaryPersonnel" ||
                            !ind.individualType) &&
                        !ind?.individualDetails?.armyNo
                )
            ) {
                toast.error("Army Number is required for all individuals");
                return;
            }

            /* =========================================
                 STEP 2 — CLEAN EMPTY VALUES (LIKE MT)
              ========================================= */

            cleanedData.individuals = cleanedData.individuals.map((ind: any) => {
                const newInd = { ...ind };

                // remove empty strings
                Object.keys(newInd).forEach((key) => {
                    if (newInd[key] === "") {
                        delete newInd[key];
                    }
                });

                if (newInd.individualDetails) {
                    Object.keys(newInd.individualDetails).forEach((key) => {
                        if (newInd.individualDetails[key] === "") {
                            delete newInd.individualDetails[key];
                        }
                    });
                }

                return newInd;
            });

            /* =========================================
                 STEP 3 — FINAL PAYLOAD (NO STRUCTURE CHANGE)
              ========================================= */

            const payload = {
                ...cleanedData,
                individuals: cleanedData.individuals || [],
            };

            console.log("🚀 FINAL IMMEDIATE REPORT PAYLOAD =>", payload);

            /* =========================================
                 STEP 4 — SAVE
              ========================================= */

            if (initialData && initialData._id) {
                await updateRecord({
                    id: initialData._id,
                    data: payload,
                });
                toast.success("Incident Report Updated");
            } else {
                await createRecord(payload);
                toast.success("Incident Report Created");
            }

            dispatch({
                type: "SET_PATH",
                path: "formData.immediateReportingIncident",
                value: INITIAL_STATE,
            });

            onSuccess();
        } catch (error: any) {
            console.error("❌ SUBMIT ERROR", error);
            toast.error(error?.response?.data?.message || "Operation failed");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true);
            try {
                const files = Array.from(e.target.files);
                const results = await uploadMultipleFiles(files);
                const newPhotoUrls = results.map((res) => res.url);
                const newPhotos = [
                    ...(reportData.relevantPhotos || []),
                    ...newPhotoUrls,
                ];
                setField("relevantPhotos", newPhotos);
                toast.success("Photos uploaded");
            } catch (err) {
                toast.error("Upload failed");
            } finally {
                setIsUploading(false);
                e.target.value = "";
            }
        }
    };

    const addPhotoUrl = () => {
        if (photoUrlInput.trim()) {
            const newPhotos = [
                ...(reportData.relevantPhotos || []),
                photoUrlInput.trim(),
            ];
            setField("relevantPhotos", newPhotos);
            setPhotoUrlInput("");
        }
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...(reportData.relevantPhotos || [])];
        newPhotos.splice(index, 1);
        setField("relevantPhotos", newPhotos);
    };

    const addIndividual = () => {
        setField("individuals", [
            ...(reportData.individuals || []),
            {
                individualType: "militaryPersonnel",
                individualDetails: {
                    armyNo: "",
                    rank: "",
                    name: "",
                    unit: "",
                    fmn: "",
                },
                age: "",
                totalServiceDuration: "",
                unitLocation: "",
                individualWorkingStatus: "",
            },
        ]);
    };

    const removeIndividual = (index: number) => {
        const newIndividuals = [...(reportData.individuals || [])];
        if (newIndividuals.length > 1) {
            newIndividuals.splice(index, 1);
            setField("individuals", newIndividuals);
        }
    };

    const updateIndividualData = (index: number, path: string, value: any) => {
        const newIndividuals = [...(reportData.individuals || [])];
        const currentInd = { ...newIndividuals[index] };

        // Handle path traversal string "individualDetails.armyNo"
        if (path.includes(".")) {
            const parts = path.split(".");
            let obj: any = currentInd;
            for (let i = 0; i < parts.length - 1; i++) {
                if (!obj[parts[i]]) obj[parts[i]] = {};
                obj = obj[parts[i]];
            }
            const key = parts[parts.length - 1];
            obj[key] = value;

            // Mapping for compatibility with IndividualVictimDetails component
            if (parts.length === 2 && parts[0] === "individualDetails") {
                if (key === "militaryPersonnelArmyNo") obj["armyNo"] = value;
                if (key === "militaryPersonnelRank") obj["rank"] = value;
                if (key === "militaryPersonnelName") obj["name"] = value;
                if (key === "militaryPersonnelUnit") obj["unit"] = value;
                if (key === "militaryPersonnelFmn") obj["fmn"] = value;
            }
        } else {
            (currentInd as any)[path] = value;
        }

        newIndividuals[index] = currentInd;
        setField("individuals", newIndividuals);
    };

    return (
        <div className="flex flex-col h-full bg-white font-[Inter] p-6 mx-auto">
            {/* Header Section */}
            <div className="space-y-1 mb-6 border-b pb-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">
                        Create New Immediate Reporting of Incident
                    </h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCancel}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <p className="text-gray-500 text-sm">
                    Type of incident like injury to serving soldier due to RTA etc.
                </p>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                <div className="space-y-4">
                    <Label className="text-base font-medium">
                        Fill Details Carefully:
                    </Label>

                    <div className="space-y-2">
                        <Label>Heading of Report</Label>
                        <Input
                            placeholder="eg. INITIAL REPORTING OF INCIDENT"
                            value={reportData.reportHeading}
                            onChange={(e) => setField("reportHeading", e.target.value)}
                        />
                    </div>
                </div>

                {/* 2. Particulars of Offender / Victim (Loop) */}
                {reportData.individuals?.map((individual: any, index: number) => (
                    <div key={index} className="space-y-6">
                        <div className="border rounded-lg p-6 relative">
                            {reportData.individuals.length > 1 && (
                                <button
                                    onClick={() => removeIndividual(index)}
                                    className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold flex gap-2 mb-2">
                                    <span>{index === 0 ? "1." : ""}</span>
                                    Particulars of Offender / Victim{" "}
                                    {reportData.individuals.length > 1 ? `#${index + 1}` : ""}
                                </h3>
                            </div>

                            <IndividualVictimDetails
                                data={individual}
                                onChange={(path, value) => {
                                    updateIndividualData(index, path, value);

                                    // ✅ SYNC VEHICLE DATA TO MAIN FORM
                                    if (path === "vehicleRegistration") {
                                        setField("vehicleNumber", value);
                                    }

                                    if (path === "vehicleMakeType") {
                                        setField("vehicleName", value);
                                    }

                                    if (path === "vehicleType") {
                                        setField("vehicleType", value);
                                    }
                                }}
                                hideHeader={true}
                            />

                            <div className="flex justify-end mt-4">
                                <Button
                                    type="button"
                                    onClick={addIndividual}
                                    size="sm"
                                    className="bg-black text-white hover:bg-gray-800"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add More People
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* 3. Age & Total Service Duration */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-semibold">2. Age & Service</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Age (Years)</Label>
                            <Input
                                type="number"
                                placeholder="00"
                                value={reportData.age || ""}
                                onChange={(e) => setField("age", e.target.value)}
                                className="pr-16"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Service Duration (Years)</Label>
                            <Input
                                type="number"
                                placeholder="00"
                                value={reportData.totalServiceDuration || ""}
                                onChange={(e) =>
                                    setField("totalServiceDuration", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Leave / Duty */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-semibold">
                        3. Whether Individual on Leave or Duty
                    </h3>
                    <RadioGroup
                        value={reportData.individualWorkingStatus || ""}
                        onValueChange={(v) => setField("individualWorkingStatus", v)}
                        className="flex gap-4"
                    >
                        <label
                            className={cn(
                                "flex items-center space-x-2 border rounded-md px-6 py-2 cursor-pointer hover:bg-gray-50 min-w-[120px]",
                                reportData.individualWorkingStatus === "Leave"
                                    ? "border-gray-900"
                                    : "border-gray-200",
                            )}
                        >
                            <RadioGroupItem value="Leave" id="leave-global" />
                            <span className="text-sm">Leave</span>
                        </label>
                        <label
                            className={cn(
                                "flex items-center space-x-2 border rounded-md px-6 py-2 cursor-pointer hover:bg-gray-50 min-w-[120px]",
                                reportData.individualWorkingStatus === "Duty"
                                    ? "border-gray-900"
                                    : "border-gray-200",
                            )}
                        >
                            <RadioGroupItem value="Duty" id="duty-global" />
                            <span className="text-sm">Duty</span>
                        </label>
                    </RadioGroup>
                </div>

                {/* 6. Place of Incident */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold">5. Place of Incident</h3>
                    <SuggestionInput
                        fieldType="placeOfOccurrence"
                        placeholder="Enter Address"
                        value={reportData.placeOfOccurrence}
                        onChange={(v) => setField("placeOfOccurrence", v)}
                        icon={<PanelLeft className="w-4 h-4 text-gray-400" />}
                    />
                </div>

                {/* 7. Date & Time */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold">6. Date & Time of Incident</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Date of Incident</Label>
                            <Input
                                type="date"
                                value={reportData.dateOfOccurrence}
                                onChange={(e) => setField("dateOfOccurrence", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Time of Incident (24hr format)</Label>
                            <Input
                                type="time"
                                value={reportData.timeOfOccurrence}
                                onChange={(e) => setField("timeOfOccurrence", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* 8. Brief of the Incident */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold">7. Brief of the Incident</h3>
                    <SuggestionTextarea
                        fieldType="description"
                        className="min-h-[100px]"
                        placeholder="Describe"
                        value={reportData.description}
                        onChange={(v) => setField("description", v)}
                    />
                </div>

                {/* 9. Coord */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold">
                        8. Coord with Police on Civ Adm, FIR, Current Sit
                    </h3>
                    <SuggestionTextarea
                        fieldType="coordWith"
                        className="min-h-[80px]"
                        placeholder="Enter Here"
                        value={reportData.coordWith}
                        onChange={(v) => setField("coordWith", v)}
                    />
                </div>

                {/* 8. Covered By */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">
                        9. Mention Incident being Covered by
                    </span>
                    <div className="w-64">
                        <SuggestionInput
                            fieldType="incidentCoveredBy"
                            placeholder=""
                            value={reportData.incidentCoveredBy}
                            onChange={(v) => setField("incidentCoveredBy", v)}
                            className="h-8"
                        />
                    </div>
                    <span className="text-sm font-semibold">Pro Unit</span>
                </div>

                {/* 9. Photos */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold">
                        10. Note: Relevant Photos if any may also be attached/shared
                    </h3>

                    <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-normal">
                            Attach Relevant Photos (Optional)
                        </Label>
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2 bg-white"
                                disabled={isUploading}
                                onClick={() => document.getElementById("photo-upload")?.click()}
                            >
                                {isUploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4" />
                                )}
                                Upload File
                            </Button>
                            <input
                                id="photo-upload"
                                type="file"
                                multiple
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />

                            <Input
                                placeholder="Enter URL"
                                className="flex-1"
                                value={photoUrlInput}
                                onChange={(e) => setPhotoUrlInput(e.target.value)}
                                onBlur={addPhotoUrl}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && (e.preventDefault(), addPhotoUrl())
                                }
                            />
                        </div>

                        {reportData.relevantPhotos &&
                            reportData.relevantPhotos.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {reportData.relevantPhotos.map((url: string, idx: number) => (
                                        <div
                                            key={idx}
                                            className="relative group border rounded-md overflow-hidden aspect-video bg-gray-100 flex items-center justify-center"
                                        >
                                            <img
                                                src={url}
                                                alt={`Evidence ${idx}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
                </div>

                {/* 11. Upload Supporting Documents */}
                <div className="space-y-4 border-t pt-6">
                    <h3 className="text-sm font-semibold">
                        11. Upload Supporting Documents (Optional)
                    </h3>
                    <p className="text-xs text-gray-500">
                        Upload certificates, forms, or letters to attach to this report
                    </p>

                    <Button
                        type="button"
                        onClick={() => setShowAttachmentModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                        <Paperclip className="w-4 h-4" />
                        Upload Documents
                    </Button>

                    {/* Display uploaded attachments */}
                    {reportData.attachments && reportData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {reportData.attachments.map((att: AttachedItem, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {att.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {att.type?.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newAttachments = [
                                                ...(reportData.attachments || []),
                                            ];
                                            newAttachments.splice(idx, 1);
                                            setField("attachments", newAttachments);
                                        }}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Attachment Modal */}
            <FormAttachmentModal
                isOpen={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                onSave={(newAttachments: AttachedItem[]) => {
                    setField("attachments", [
                        ...(reportData.attachments || []),
                        ...newAttachments,
                    ]);
                }}
            />

            {/* Footer */}
            <div className="flex justify-between gap-4 pt-6 border-t mt-8 bg-white sticky bottom-0 z-10 p-4">
                <Button variant="outline" onClick={onCancel} className="px-8">
                    Cancel
                </Button>
                <Button
                    className="bg-[#0088FF] hover:bg-blue-600 text-white flex-1"
                    onClick={handleSave}
                    disabled={isPending}
                >
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <CheckCheck className="w-4 h-4 mr-2" />{" "}
                    {initialData ? "Update Report" : "Save Report"}
                </Button>
            </div>
        </div>
    );
};
