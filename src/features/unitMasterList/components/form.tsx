"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { toast } from "react-toastify";
import { UnitMasterList } from "@/apis/unitMasterList/types";
import { useCreateUnitMasterList, useUpdateUnitMasterList } from "../hooks";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface UnitMasterListFormProps {
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: UnitMasterList | null;
}

const INITIAL_STATE = {
    unitIdentifier: {
        unitType: "",
        unit: "",
        unitShortForm: "",
        serviceArm: "",
        parentFormation: "",
        locationStation: "",
    },
    unitHierarchyAndControl: {
        command: "",
        corps: "",
        brigade: "",
        division: "",
        seniorityOrder: "",
    },
    unitClassification: {
        unitStatus: "permanent",
        attachmentValidFrom: undefined as string | undefined,
        attachmentValidTo: undefined as string | undefined,
        attachedTo: "",
    },
    unitActiveStatus: false,
    remarks: "",
};

const UnitMasterListForm: React.FC<UnitMasterListFormProps> = ({ onCancel, onSuccess, initialData }) => {
    // Determine initial state with potential missing fields
    const getInitialState = () => {
        if (!initialData) return JSON.parse(JSON.stringify(INITIAL_STATE));
        return {
            unitIdentifier: {
                unitType: initialData.unitIdentifier.unitType || "",
                unitName: initialData.unitIdentifier.unit || "",
                unitShortForm: initialData.unitIdentifier.unitShortForm || "",
                serviceArm: initialData.unitIdentifier.serviceArm || "",
                parentFormation: initialData.unitIdentifier.parentFormation || "",
                locationStation: initialData.unitIdentifier.locationStation || "",
            },
            unitHierarchyAndControl: {
                command: initialData.unitHierarchyAndControl.command || "",
                corps: initialData.unitHierarchyAndControl.corps || "",
                brigade: initialData.unitHierarchyAndControl.brigade || "",
                division: initialData.unitHierarchyAndControl.division || "",
                seniorityOrder: initialData.unitHierarchyAndControl.seniorityOrder || "",
            },
            unitClassification: {
                unitStatus: initialData.unitClassification?.unitStatus || "permanent",
                attachmentValidFrom: initialData.unitClassification?.attachmentValidFrom || undefined,
                attachmentValidTo: initialData.unitClassification?.attachmentValidTo || undefined,
                attachedTo: initialData.unitClassification?.attachedTo || "",
            },
            unitActiveStatus: initialData.unitActiveStatus ?? false,
            remarks: initialData.remarks || "",
        };
    };

    const [formData, setFormData] = useState(getInitialState());

    const { mutate: createUnit, isPending: isCreating } = useCreateUnitMasterList();
    const { mutate: updateUnit, isPending: isUpdating } = useUpdateUnitMasterList();

    const isPending = isCreating || isUpdating;

    useEffect(() => {
        setFormData(getInitialState());
    }, [initialData]);

    const handleChange = (section: string, field: string, value: any) => {
        if (section === "root") {
            setFormData((prev: any) => ({ ...prev, [field]: value }));
        } else {
            setFormData((prev: any) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const handleSave = () => {
        // Validation
        const uid = formData.unitIdentifier;
        if (!uid.unitType?.trim()) return toast.error("Unit Type is required");
        if (!uid.unit?.trim()) return toast.error("Unit Name is required");
        if (!uid.unitShortForm?.trim()) return toast.error("Unit Short Form is required");
        if (!uid.serviceArm?.trim()) return toast.error("Service / Arm is required");
        if (!uid.parentFormation?.trim()) return toast.error("Parent Formation is required");
        if (!uid.locationStation?.trim()) return toast.error("Location / Station is required");

        const hierarchy = formData.unitHierarchyAndControl;
        if (!hierarchy.command?.trim()) return toast.error("Command is required");
        if (!hierarchy.corps?.trim()) return toast.error("Corps is required");
        if (!hierarchy.brigade?.trim()) return toast.error("Brigade is required");
        if (!hierarchy.division?.trim()) return toast.error("Division is required");
        if (!hierarchy.seniorityOrder?.trim()) return toast.error("Seniority Order is required");

        const classification = formData.unitClassification;
        if (classification.unitStatus !== "permanent") {
            if (!classification.attachmentValidFrom) return toast.error("Attachment Valid From is required");
            if (!classification.attachmentValidTo) return toast.error("Attachment Valid To is required");
            if (!classification.attachedTo?.trim()) return toast.error("Attached To is required");
        }

        const payload = { ...formData };

        if (initialData?._id) {
            updateUnit(
                { id: initialData._id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Unit updated successfully");
                        onSuccess();
                    },
                    onError: (error: any) => {
                        console.error("Error updating unit:", error);
                        toast.error(error.message || "Failed to update unit");
                    },
                }
            );
        } else {
            createUnit(payload, {
                onSuccess: () => {
                    toast.success("Unit created successfully");
                    setFormData(JSON.parse(JSON.stringify(INITIAL_STATE)));
                    onSuccess();
                },
                onError: (error: any) => {
                    console.error("Error creating unit:", error);
                    toast.error(error.message || "Failed to create unit");
                },
            });
        }
    };

    const statusOptions = [
        { value: "permanent", label: "Permanent" },
        { value: "attached", label: "Attached" },
        { value: "visiting", label: "Visiting" },
        { value: "detached", label: "Detached" },
        { value: "onTemporaryDuty", label: "On Temporary Duty" },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-1 overflow-y-auto">
                <div className="space-y-8">

                    {/* Unit Identity */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Unit Identity</h3>
                        <p className="text-sm text-gray-500 mb-4">Primary information</p>

                        <div className="space-y-4">
                            <SuggestionInput
                                label="Unit Type"
                                placeholder="eg. Corps / Regiment / Company / Section"
                                value={formData.unitIdentifier.unitType}
                                onChange={(val) => handleChange("unitIdentifier", "unitType", val)}
                                fieldType="unitType"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <SuggestionInput
                                    label="Unit Name (Full)"
                                    placeholder="Enter Unit Name"
                                    value={formData.unitIdentifier.unit}
                                    onChange={(val) => handleChange("unitIdentifier", "unit", val)}
                                    fieldType="unit"
                                />
                                <SuggestionInput
                                    label="Unit Short Form"
                                    placeholder="Enter Short Form"
                                    value={formData.unitIdentifier.unitShortForm}
                                    onChange={(val) => handleChange("unitIdentifier", "unitShortForm", val)}
                                    fieldType="unitShortForm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <SuggestionInput
                                    label="Service / Arm (Unit Category)"
                                    placeholder="eg. Signals / Infantry / Engineers / MP"
                                    value={formData.unitIdentifier.serviceArm}
                                    onChange={(val) => handleChange("unitIdentifier", "serviceArm", val)}
                                    fieldType="serviceArm"
                                />
                                <SuggestionInput
                                    label="Parent Formation"
                                    placeholder="Enter Parent Formation"
                                    value={formData.unitIdentifier.parentFormation}
                                    onChange={(val) => handleChange("unitIdentifier", "parentFormation", val)}
                                    fieldType="parentFormation"
                                />
                            </div>

                            <SuggestionInput
                                label="Location / Station"
                                placeholder="Enter Location"
                                value={formData.unitIdentifier.locationStation}
                                onChange={(val) => handleChange("unitIdentifier", "locationStation", val)}
                                fieldType="locationStation"
                                icon={<span className="text-gray-400">📍</span>}
                            />
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Hierarchy & Control */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Hierarchy & Control</h3>
                        <p className="text-sm text-gray-500 mb-4">How the unit fits in the structure</p>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <SuggestionInput
                                    label="Command"
                                    value={formData.unitHierarchyAndControl.command}
                                    onChange={(val) => handleChange("unitHierarchyAndControl", "command", val)}
                                    fieldType="command"
                                />
                                <SuggestionInput
                                    label="Corps"
                                    value={formData.unitHierarchyAndControl.corps}
                                    onChange={(val) => handleChange("unitHierarchyAndControl", "corps", val)}
                                    fieldType="corps"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <SuggestionInput
                                    label="Division"
                                    value={formData.unitHierarchyAndControl.division}
                                    onChange={(val) => handleChange("unitHierarchyAndControl", "division", val)}
                                    fieldType="division"
                                />
                                <SuggestionInput
                                    label="Brigade"
                                    value={formData.unitHierarchyAndControl.brigade}
                                    onChange={(val) => handleChange("unitHierarchyAndControl", "brigade", val)}
                                    fieldType="brigade"
                                />
                            </div>

                            <SuggestionInput
                                label="Unit Seniority Order"
                                placeholder="Number"
                                value={formData.unitHierarchyAndControl.seniorityOrder}
                                onChange={(val) => handleChange("unitHierarchyAndControl", "seniorityOrder", val)}
                                fieldType="seniorityOrder"
                            />
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Status */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Status</h3>
                        <div className="p-4 border rounded-lg bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-semibold text-gray-900">Is Active</Label>
                                    <p className="text-sm text-gray-500">
                                        Unit Status: {formData.unitActiveStatus ? "Active" : "Inactive"}
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.unitActiveStatus}
                                    onCheckedChange={(checked) => handleChange("root", "unitActiveStatus", checked)}
                                    className="data-[state=checked]:bg-[#34C759]"
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Classification */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Classification</h3>
                        <p className="text-sm text-gray-500 mb-4">Operational behavior</p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Unit Status</Label>
                                <div className="flex flex-wrap gap-3">
                                    {statusOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-colors text-sm",
                                                formData.unitClassification.unitStatus === option.value
                                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                                    : "bg-white border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="unitStatus"
                                                className="hidden" // Hiding default radio, could style customized if needed
                                                checked={formData.unitClassification.unitStatus === option.value}
                                                onChange={() => handleChange("unitClassification", "unitStatus", option.value)}
                                            />
                                            <div className={cn(
                                                "w-4 h-4 rounded-full border flex items-center justify-center",
                                                formData.unitClassification.unitStatus === option.value ? "border-blue-500" : "border-gray-400"
                                            )}>
                                                {formData.unitClassification.unitStatus === option.value && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {formData.unitClassification.unitStatus !== "permanent" && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="space-y-2">
                                        <Label>Attachment Valid From</Label>
                                        <Input
                                            type="date"
                                            value={formData.unitClassification.attachmentValidFrom ? format(new Date(formData.unitClassification.attachmentValidFrom), "yyyy-MM-dd") : ""}
                                            onChange={(e) => handleChange("unitClassification", "attachmentValidFrom", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Attachment Valid To</Label>
                                        <Input
                                            type="date"
                                            value={formData.unitClassification.attachmentValidTo ? format(new Date(formData.unitClassification.attachmentValidTo), "yyyy-MM-dd") : ""}
                                            onChange={(e) => handleChange("unitClassification", "attachmentValidTo", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <SuggestionInput
                                            label="Attached To"
                                            value={formData.unitClassification.attachedTo}
                                            onChange={(val) => handleChange("unitClassification", "attachedTo", val)}
                                            fieldType="attachedTo"
                                        />
                                    </div>
                                </div>
                            )}

                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Remarks */}
                    <section className="space-y-2">
                        <Label className="font-semibold text-gray-900">Add Remark (Optional)</Label>
                        <Textarea
                            placeholder="Write Guiding/Supporting Remark"
                            value={formData.remarks}
                            onChange={(e) => handleChange("root", "remarks", e.target.value)}
                            className="min-h-[100px] resize-none"
                        />
                    </section>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t mt-4 bg-white sticky bottom-0 z-10">
                <div className="flex justify-between gap-4">
                    <Button variant="outline" onClick={onCancel} className="px-8">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-[#0088FF] hover:bg-blue-700 px-8 text-white"
                    >
                        {isPending ? "Saving..." : initialData ? "Update Unit" : "Save & Add Another"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UnitMasterListForm;
