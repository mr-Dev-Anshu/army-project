"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { toast } from "react-toastify";
import { RankMasterList } from "@/apis/rankMasterList/types";
import { useCreateRankMasterList, useUpdateRankMasterList } from "../hooks";

interface RankMasterListFormProps {
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: RankMasterList | null;
}

const INITIAL_STATE = {
    rankCategory: "",
    rank: "",
    rankShortForm: "",
    rankSeniorityOrder: "",
    rankActiveStatus: false,
    serviceArm: "",
    remarks: "",
};

const RankMasterListForm: React.FC<RankMasterListFormProps> = ({ onCancel, onSuccess, initialData }) => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const { mutate: createRank, isPending: isCreating } = useCreateRankMasterList();
    const { mutate: updateRank, isPending: isUpdating } = useUpdateRankMasterList();

    const isPending = isCreating || isUpdating;

    useEffect(() => {
        if (initialData) {
            setFormData({
                rankCategory: initialData.rankCategory || "",
                rank: initialData.rank || "",
                rankShortForm: initialData.rankShortForm || "",
                rankSeniorityOrder: initialData.rankSeniorityOrder || "",
                rankActiveStatus: initialData.rankActiveStatus ?? true,
                serviceArm: initialData.serviceArm || "",
                remarks: initialData.remarks || "",
            });
        } else {
            setFormData(INITIAL_STATE);
        }
    }, [initialData]);

    const handleChange = (field: keyof typeof INITIAL_STATE, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Validation
        if (!formData.rankCategory.trim()) {
            toast.error("Rank Category is required");
            return;
        }
        if (!formData.rank.trim()) {
            toast.error("Rank Name is required");
            return;
        }
        if (!formData.rankShortForm.trim()) {
            toast.error("Rank Short Form is required");
            return;
        }
        if (!formData.serviceArm.trim()) {
            toast.error("Service / Arm is required");
            return;
        }
        if (!formData.rankSeniorityOrder.trim()) {
            toast.error("Seniority Order is required");
            return;
        }

        const payload = { ...formData };

        if (initialData?._id) {
            updateRank(
                { id: initialData._id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Rank updated successfully");
                        onSuccess();
                    },
                    onError: (error: any) => {
                        console.error("Error updating rank:", error);
                        toast.error(error.message || "Failed to update rank");
                    },
                }
            );
        } else {
            createRank(payload, {
                onSuccess: () => {
                    toast.success("Rank created successfully");
                    setFormData(INITIAL_STATE);
                    onSuccess();
                },
                onError: (error: any) => {
                    console.error("Error creating rank:", error);
                    toast.error(error.message || "Failed to create rank");
                },
            });
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-1 overflow-y-auto">
                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-base font-semibold text-gray-900">Rank Details</h3>
                    <p className="text-sm text-gray-500">Core identity of the rank</p>
                </div>

                <div className="space-y-6">
                    {/* Rank Category */}
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Rank Category"
                            placeholder="Enter Rank Category"
                            value={formData.rankCategory}
                            onChange={(val) => handleChange("rankCategory", val)}
                            fieldType="rankCategory"
                        />
                    </div>

                    {/* Rank Name & Short Form */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Rank Name (Full)"
                                placeholder="Enter Rank Name"
                                value={formData.rank}
                                onChange={(val) => handleChange("rank", val)}
                                fieldType="rank"
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Rank Short Form"
                                placeholder="Enter Short Form"
                                value={formData.rankShortForm}
                                onChange={(val) => handleChange("rankShortForm", val)}
                                fieldType="rankShortForm"
                            />
                        </div>
                    </div>

                    {/* Service Arm & Seniority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Service / Arm"
                                placeholder="Enter Service / Arm"
                                value={formData.serviceArm}
                                onChange={(val) => handleChange("serviceArm", val)}
                                fieldType="serviceArm"
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Seniority Order"
                                placeholder="Enter Seniority Order"
                                value={formData.rankSeniorityOrder}
                                onChange={(val) => handleChange("rankSeniorityOrder", val)}
                                fieldType="rankSeniorityOrder"
                            />
                        </div>
                    </div>

                    {/* Is Active Toggle */}
                    <div className="p-4 border rounded-lg bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold text-gray-900">Is Active</Label>
                                <p className="text-sm text-gray-500">
                                    Rank Status: {formData.rankActiveStatus ? "Active" : "Inactive"}
                                </p>
                            </div>
                            <Switch
                                checked={formData.rankActiveStatus}
                                onCheckedChange={(checked) => handleChange("rankActiveStatus", checked)}
                                className="data-[state=checked]:bg-[#34C759]"
                            />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-900">Add Remark (Optional)</Label>
                        <Textarea
                            placeholder="Write Guiding/Supporting Remark"
                            value={formData.remarks}
                            onChange={(e) => handleChange("remarks", e.target.value)}
                            className="min-h-[100px] resize-none"
                        />
                    </div>
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
                        {isPending ? "Saving..." : initialData ? "Update Rank" : "Save & Add Another"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RankMasterListForm;
