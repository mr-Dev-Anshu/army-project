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
import { useCreateImmediateReportingIncident, useUpdateImmediateReportingIncident } from "../hooks";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types"; // Ensure this type is exported
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react";
import { uploadFile, uploadMultipleFiles } from "@/lib/uploadFile";

const INITIAL_STATE = {
    individuals: [{
        armyNo: "",
        rank: "",
        name: "",
        age: "",
        totalServiceDuration: "",
        unit: "",
        unitLocation: "",
        fmn: "",
        individualWorkingStatus: "", // "Leave" | "Duty"
    }],
    incidentPlace: "",
    incidentDate: "",
    incidentTime: "",
    incidentBrief: "",
    coordinationWithPolice: "",
    incidentCoveredBy: "",
    relevantPhotos: [] as string[],
};

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: ImmediateReportingIncident;
}

export const ImmediateReportingIncidentForm: React.FC<Props> = ({ onCancel, onSuccess, initialData }) => {
    const { state, dispatch } = useForm();
    // Safely access the form data or default to initial state
    const reportData = state.formData.immediateReportingIncident || INITIAL_STATE;

    // We can use local state for photos not yet saved or manage entirely in global state. 
    // Managing in global state is consistent.

    const { mutateAsync: createRecord, isPending: isCreating } = useCreateImmediateReportingIncident();
    const { mutateAsync: updateRecord, isPending: isUpdating } = useUpdateImmediateReportingIncident();
    const [isUploading, setIsUploading] = useState(false);
    const [photoUrlInput, setPhotoUrlInput] = useState("");

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
            if (!reportData.individuals || reportData.individuals.length === 0) {
                toast.error("At least one individual is required");
                return;
            }
            // Optional: Check if all have armyNo or just the first one
            if (reportData.individuals.some((ind: any) => !ind.armyNo)) {
                toast.error("Army Number is required for all individuals");
                return;
            }

            // Check for unsaved photo URL
            const currentPhotos = [...(reportData.relevantPhotos || [])];
            if (photoUrlInput.trim()) {
                currentPhotos.push(photoUrlInput.trim());
            }

            const payload = { ...reportData, relevantPhotos: currentPhotos };
            // Clean up _id for create
            if (!initialData) {
                delete (payload as any)._id;
                delete (payload as any).createdAt;
                delete (payload as any).updatedAt;
            }

            if (initialData && initialData._id) {
                await updateRecord({ id: initialData._id, data: payload });
                toast.success("Incident Report Updated");
            } else {
                await createRecord(payload);
                toast.success("Incident Report Created");
            }

            // Reset form
            dispatch({
                type: "SET_PATH",
                path: "formData.immediateReportingIncident",
                value: INITIAL_STATE,
            });

            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Operation failed");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true);
            try {
                const files = Array.from(e.target.files);
                const results = await uploadMultipleFiles(files);
                const newPhotoUrls = results.map(res => res.url);
                const newPhotos = [...(reportData.relevantPhotos || []), ...newPhotoUrls];
                setField("relevantPhotos", newPhotos);
                toast.success("Photos uploaded");
            } catch (err) {
                toast.error("Upload failed");
            } finally {
                setIsUploading(false);
                e.target.value = ""; // Reset input
            }
        }
    };

    const addPhotoUrl = () => {
        if (photoUrlInput.trim()) {
            const newPhotos = [...(reportData.relevantPhotos || []), photoUrlInput.trim()];
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
                armyNo: "",
                rank: "",
                name: "",
                age: "",
                totalServiceDuration: "",
                unit: "",
                unitLocation: "",
                fmn: "",
                individualWorkingStatus: "",
            }
        ]);
    };

    const removeIndividual = (index: number) => {
        const newIndividuals = [...(reportData.individuals || [])];
        if (newIndividuals.length > 1) {
            newIndividuals.splice(index, 1);
            setField("individuals", newIndividuals);
        }
    };

    const updateIndividual = (index: number, field: string, value: any) => {
        const newIndividuals = [...(reportData.individuals || [])];
        newIndividuals[index] = { ...newIndividuals[index], [field]: value };
        setField("individuals", newIndividuals);
    };

    return (
        <div className="flex flex-col h-full bg-white font-[Inter] p-6 max-w-5xl mx-auto">
            <div className="space-y-1 mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Create New Immediate Reporting of Incident</h1>
                <p className="text-gray-500 text-sm">Type of incident like injury to serving soldier due to RTA etc.</p>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto pb-6">
                <div className="text-sm font-medium text-gray-700">Fill Details Carefully:</div>

                <div className="space-y-6">
                    {reportData.individuals?.map((individual: any, index: number) => (
                        <div key={index} className="relative border rounded-lg p-6 bg-gray-50/50">
                            {reportData.individuals.length > 1 && (
                                <button
                                    onClick={() => removeIndividual(index)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove Individual"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}

                            <div className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                    {index + 1}
                                </span>
                                Individual Details
                            </div>

                            {/* ROW 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>Army Number</Label>
                                    <SuggestionInput
                                        fieldType="armyNo"
                                        placeholder="e.g. 12345678A"
                                        value={individual.armyNo}
                                        onChange={(v) => updateIndividual(index, "armyNo", v)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Rank</Label>
                                    <SuggestionInput
                                        fieldType="rank"
                                        placeholder="Enter rank"
                                        value={individual.rank}
                                        onChange={(v) => updateIndividual(index, "rank", v)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <SuggestionInput
                                        fieldType="name"
                                        placeholder="e.g. John Apradhi"
                                        value={individual.name}
                                        onChange={(v) => updateIndividual(index, "name", v)}
                                    />
                                </div>
                            </div>

                            {/* ROW 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <Label>Age</Label>
                                    <SuggestionInput
                                        fieldType="age"
                                        placeholder="00"
                                        value={individual.age}
                                        onChange={(v) => updateIndividual(index, "age", v)}
                                        icon={<span className="text-gray-400 text-sm">Years old</span>}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Total Service Duration</Label>
                                    <SuggestionInput
                                        fieldType="totalServiceDuration"
                                        placeholder="00"
                                        value={individual.totalServiceDuration}
                                        onChange={(v) => updateIndividual(index, "totalServiceDuration", v)}
                                        icon={<span className="text-gray-400 text-sm">Years</span>}
                                    />
                                </div>
                            </div>

                            {/* ROW 3 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <Label>Unit</Label>
                                    <SuggestionInput
                                        fieldType="unit"
                                        placeholder="Enter unit"
                                        value={individual.unit}
                                        onChange={(v) => updateIndividual(index, "unit", v)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location of UNIT</Label>
                                    <SuggestionInput
                                        fieldType="unitLocation"
                                        placeholder="e.g. Pune"
                                        value={individual.unitLocation}
                                        onChange={(v) => updateIndividual(index, "unitLocation", v)}
                                    />
                                </div>
                            </div>

                            {/* ROW 4 */}
                            <div className="grid grid-cols-1 gap-6 mt-6">
                                <div className="space-y-2">
                                    <Label>FMN</Label>
                                    <SuggestionInput
                                        fieldType="fmn"
                                        placeholder="Enter FMN"
                                        value={individual.fmn}
                                        onChange={(v) => updateIndividual(index, "fmn", v)}
                                    />
                                </div>
                            </div>

                            {/* ROW 5: Leave/Duty */}
                            <div className="grid grid-cols-1 gap-6 mt-6">
                                <div className="space-y-2">
                                    <Label>Whether Individual on Leave or Duty</Label>
                                    <RadioGroup
                                        value={individual.individualWorkingStatus}
                                        onValueChange={(v) => updateIndividual(index, "individualWorkingStatus", v)}
                                        className="flex gap-4"
                                    >
                                        <label className={cn(
                                            "flex items-center space-x-2 border rounded-md px-4 py-2 w-48 cursor-pointer hover:bg-gray-50",
                                            individual.individualWorkingStatus === "Leave" ? "border-black ring-1 ring-black" : "border-gray-200"
                                        )}>
                                            <RadioGroupItem value="Leave" id={`leave-${index}`} />
                                            <span className="text-sm">Leave</span>
                                        </label>
                                        <label className={cn(
                                            "flex items-center space-x-2 border rounded-md px-4 py-2 w-48 cursor-pointer hover:bg-gray-50",
                                            individual.individualWorkingStatus === "Duty" ? "border-black ring-1 ring-black" : "border-gray-200"
                                        )}>
                                            <RadioGroupItem value="Duty" id={`duty-${index}`} />
                                            <span className="text-sm">Duty</span>
                                        </label>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={addIndividual}
                        className="w-full border-dashed py-6 text-gray-500 hover:text-gray-900 hover:bg-gray-50 mb-6"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Individual
                    </Button>
                </div>

                {/* ROW 6: Incident Place/Date/Time */}
                <div className="grid grid-cols-1 gap-6 pl-6">
                    <div className="space-y-2 relative">
                        <span className="absolute -left-6 top-0 text-sm font-semibold">{(reportData.individuals?.length || 0) + 1}.</span>
                        <Label>Place of Incident</Label>
                        <SuggestionInput
                            fieldType="incidentPlace"
                            placeholder="Enter Address"
                            value={reportData.incidentPlace}
                            onChange={(v) => setField("incidentPlace", v)}
                            icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 2.83301C11.547 2.83309 13.0311 3.44811 14.125 4.54199C15.2187 5.63579 15.8338 7.11923 15.834 8.66602C15.834 10.8632 14.3857 12.9851 13.041 14.498C12.357 15.2676 11.6741 15.9083 11.1631 16.3555C10.9077 16.579 10.6935 16.755 10.543 16.876C10.4679 16.9363 10.4075 16.9837 10.3662 17.0156C10.3459 17.0314 10.3295 17.0443 10.3184 17.0527C10.3132 17.0567 10.3087 17.0602 10.3057 17.0625C10.3044 17.0635 10.3027 17.0648 10.3018 17.0654H10.3008V17.0664C10.1452 17.1831 9.93785 17.1979 9.76953 17.1104L9.7002 17.0664L9.69824 17.0654C9.69743 17.0648 9.69664 17.0635 9.69531 17.0625C9.69225 17.0602 9.68719 17.057 9.68164 17.0527C9.67051 17.0443 9.65437 17.0316 9.63379 17.0156C9.59255 16.9837 9.53318 16.9364 9.45801 16.876C9.30746 16.755 9.09353 16.5791 8.83789 16.3555C8.32687 15.9083 7.64412 15.2677 6.95996 14.498C5.61517 12.9851 4.16699 10.8634 4.16699 8.66602C4.16716 7.11915 4.78217 5.6358 5.87598 4.54199C6.96983 3.44831 8.45317 2.83309 10 2.83301ZM10 3.83301C8.71839 3.83309 7.48933 4.34288 6.58301 5.24902C5.67674 6.1553 5.16716 7.38437 5.16699 8.66602C5.16699 10.4684 6.38533 12.347 7.70703 13.834C8.35616 14.5643 9.00712 15.1747 9.49609 15.6025C9.69482 15.7764 9.86703 15.9189 10 16.0273C10.133 15.9189 10.3061 15.7764 10.5049 15.6025C10.9938 15.1747 11.6441 14.564 12.293 13.834C13.6147 12.347 14.834 10.4684 14.834 8.66602C14.8338 7.38445 14.3241 6.15528 13.418 5.24902C12.5116 4.34267 11.2818 3.83309 10 3.83301ZM10 6.16699C11.3807 6.16699 12.5 7.28628 12.5 8.66699C12.4998 10.0476 11.3806 11.167 10 11.167C8.6194 11.167 7.50018 10.0476 7.5 8.66699C7.5 7.28628 8.61929 6.16699 10 6.16699ZM10 7.16699C9.17157 7.16699 8.5 7.83857 8.5 8.66699C8.50018 9.49527 9.17168 10.167 10 10.167C10.8283 10.167 11.4998 9.49527 11.5 8.66699C11.5 7.83857 10.8284 7.16699 10 7.16699ZM2.00977 2.00977H2V2H2.00977V2.00977Z" fill="#737373" />
                            </svg>
                            }
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Date of Incident</Label>
                            <Input
                                type="date"
                                value={reportData.incidentDate}
                                onChange={(e) => setField("incidentDate", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Time of Incident (24hr format)</Label>
                            <Input
                                type="time"
                                value={reportData.incidentTime}
                                onChange={(e) => setField("incidentTime", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* ROW 7: Brief */}
                <div className="grid grid-cols-1 gap-6 pl-6">
                    <div className="space-y-2 relative">
                        <span className="absolute -left-6 top-0 text-sm font-semibold">{(reportData.individuals?.length || 0) + 2}.</span>
                        <Label>Brief of the Incident</Label>
                        <SuggestionTextarea
                            fieldType="incidentBrief"
                            className="min-h-[100px]"
                            placeholder="Describe"
                            value={reportData.incidentBrief}
                            onChange={(v) => setField("incidentBrief", v)}
                        />
                    </div>
                </div>

                {/* ROW 8: Coord */}
                <div className="grid grid-cols-1 gap-6 pl-6">
                    <div className="space-y-2 relative">
                        <span className="absolute -left-6 top-0 text-sm font-semibold">{(reportData.individuals?.length || 0) + 3}.</span>
                        <Label>Coord with Police on Civ Adm, FIR, Current Sit</Label>
                        <SuggestionTextarea
                            fieldType="coordinationWithPolice"
                            className="min-h-[80px]"
                            placeholder="Enter Here"
                            value={reportData.coordinationWithPolice}
                            onChange={(v) => setField("coordinationWithPolice", v)}
                        />
                    </div>
                </div>

                {/* ROW 9: Covered By */}
                <div className="grid grid-cols-1 gap-6 pl-6">
                    <div className="flex items-center gap-2 relative">
                        <span className="absolute -left-6 top-0 text-sm font-semibold">{(reportData.individuals?.length || 0) + 4}.</span>
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">(Mention Incident being Covered by</span>
                        <div className="w-64">
                            <SuggestionInput
                                fieldType="incidentCoveredBy" // Using suggestion input to track units
                                placeholder=""
                                value={reportData.incidentCoveredBy}
                                onChange={(v) => setField("incidentCoveredBy", v)}
                                className="h-8"
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Pro Unit)</span>
                    </div>
                </div>

                {/* ROW 10: Photos */}
                <div className="grid grid-cols-1 gap-6 pl-6">
                    <div className="space-y-2 relative">
                        <span className="absolute -left-6 top-0 text-sm font-semibold">{(reportData.individuals?.length || 0) + 5}.</span>
                        <Label>Note: Relevant Photos if any may also be attached/shared</Label>
                        <div className="space-y-4 pt-2">
                            <Label className="text-sm text-gray-500 font-normal">Attach Relevant Photos (Optional)</Label>
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-2"
                                    disabled={isUploading}
                                    onClick={() => document.getElementById("photo-upload")?.click()}
                                >
                                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
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
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addPhotoUrl();
                                        }
                                    }}
                                />
                            </div>

                            {/* Photo Previews */}
                            {reportData.relevantPhotos && reportData.relevantPhotos.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {reportData.relevantPhotos.map((url: string, idx: number) => (
                                        <div key={idx} className="relative group border rounded-md overflow-hidden aspect-video bg-gray-100 flex items-center justify-center">
                                            <img src={url} alt={`Evidence ${idx}`} className="w-full h-full object-cover" />
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
                </div>

            </div>

            <div className="flex justify-start gap-4 pt-6 border-t mt-4">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={isPending}>
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Report
                </Button>
            </div>
        </div>
    );
};
