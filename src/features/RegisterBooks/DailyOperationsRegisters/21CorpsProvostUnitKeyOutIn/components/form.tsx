"use client";

import React, { useState, useEffect } from "react";
import { Pen, X, Key } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { useCreateKeyOutInRegister, useUpdateKeyOutInRegister } from "../hooks";

interface KeyOutInFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const KeyOutInForm = ({ initialData, onSuccess, onCancel }: KeyOutInFormProps) => {
    const createMutation = useCreateKeyOutInRegister();
    const updateMutation = useUpdateKeyOutInRegister();

    // Form State
    const [keyOutTime, setKeyOutTime] = useState("");
    const [outSignature, setOutSignature] = useState("");
    const [storeName, setStoreName] = useState("");
    const [keyNumber, setKeyNumber] = useState("");
    const [keyInTime, setKeyInTime] = useState("");
    const [inSignature, setInSignature] = useState("");
    const [remark, setRemark] = useState("");
    const [individual, setIndividual] = useState<IndividualData>({
        armyNo: "",
        rank: "",
        name: "",
        unit: "",
        fmn: "",
        command: "",
    });
    const [authentication, setAuthentication] = useState({
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    });

    useEffect(() => {
        if (initialData) {
            setKeyOutTime(initialData.outTime ? new Date(initialData.outTime).toISOString().substring(11, 16) : "");
            setKeyInTime(initialData.inTime ? new Date(initialData.inTime).toISOString().substring(11, 16) : "");
            setOutSignature(initialData.outSignature?.value || "");
            setInSignature(initialData.inSignature?.value || "");
            setRemark(initialData.remark || "");

            if (initialData.authentication) {
                setAuthentication(initialData.authentication);
            }

            // Details
            if (initialData.details) {
                setStoreName(initialData.details.storeName || "");
                setKeyNumber(initialData.details.keyNumber || "");
                if (initialData.details.individual) {
                    setIndividual(initialData.details.individual);
                }
            }
        }
    }, [initialData]);

    const handleFieldChange = (field: keyof IndividualData, value: string) => {
        setIndividual((prev) => ({ ...prev, [field]: value }));
    };

    const handleAuthenticationChange = (field: string, value: string) => {
        setAuthentication((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!keyOutTime) {
            toast.error("Key OUT Time is required");
            return;
        }
        if (!storeName) {
            toast.error("Store name is required");
            return;
        }
        if (!keyNumber) {
            toast.error("Key number is required");
            return;
        }
        if (!individual.armyNo) {
            toast.error("Army Number is required");
            return;
        }

        const payload: any = {
            type: "key",
            date: new Date().toISOString(), // Or a specific date picker field
            outTime: keyOutTime ? new Date(`1970-01-01T${keyOutTime}:00Z`).toISOString() : undefined, // Simplify for demo
            inTime: keyInTime ? new Date(`1970-01-01T${keyInTime}:00Z`).toISOString() : undefined,
            outSignature: { type: "text", value: outSignature },
            inSignature: { type: "text", value: inSignature },
            remark,
            authentication,
            details: {
                storeName,
                keyNumber,
                individual
            }
        };

        try {
            if (initialData?._id) {
                await updateMutation.mutateAsync({ id: initialData._id, payload });
            } else {
                await createMutation.mutateAsync(payload);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save:", error);
            // Handle error (toast, etc.)
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl bg-white font-inter">
            {/* Note: Header removed as it is handled by the RightSideSheet/Modal usually, or can stay if inline */}

            <div className="p-6 space-y-8">
                {/* Key OUT Details */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">Key OUT Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="keyOutTime" className="text-xs font-medium text-neutral-700">
                                Key OUT Time
                            </Label>
                            <Input
                                id="keyOutTime"
                                type="time"
                                className="block w-full"
                                value={keyOutTime}
                                onChange={(e) => setKeyOutTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="outSignature" className="text-xs font-medium text-neutral-700">
                                OUT Signature
                            </Label>
                            <div className="relative">
                                <Input
                                    id="outSignature"
                                    placeholder="Text / Digital"
                                    className="pr-10"
                                    value={outSignature}
                                    onChange={(e) => setOutSignature(e.target.value)}
                                />
                                <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Key Details</h3>
                    <div className="space-y-1.5">
                        <Label htmlFor="storeName" className="text-xs font-medium text-neutral-700">
                            Store/Office Name
                        </Label>
                        <Input
                            id="storeName"
                            placeholder="eg. Ramu ki dukan"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="keyNumber" className="text-xs font-medium text-neutral-700">
                            Key Number
                        </Label>
                        <div className="relative">
                            <Input
                                id="keyNumber"
                                placeholder="eg. 123456"
                                className="pr-10"
                                value={keyNumber}
                                onChange={(e) => setKeyNumber(e.target.value)}
                            />
                            <Key className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                        </div>
                    </div>
                </section>

                {/* Individual Details Section */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Individual Details
                    </h3>
                    <IndividualInputFields
                        data={individual}
                        onChange={handleFieldChange}
                    />
                </section>

                {/* Key IN Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Key IN Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="keyInTime" className="text-xs font-medium text-neutral-700">
                                Key IN Time
                            </Label>
                            <Input
                                id="keyInTime"
                                type="time"
                                className="block w-full"
                                value={keyInTime}
                                onChange={(e) => setKeyInTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="inSignature" className="text-xs font-medium text-neutral-700">
                                IN Signature
                            </Label>
                            <div className="relative">
                                <Input
                                    id="inSignature"
                                    placeholder="Text / Digital"
                                    className="pr-10"
                                    value={inSignature}
                                    onChange={(e) => setInSignature(e.target.value)}
                                />
                                <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Add Remark */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Add Remark</h3>
                    <div className="space-y-1.5">
                        <Textarea
                            id="remark"
                            placeholder="Enter remark"
                            className="resize-none min-h-[80px]"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                    </div>
                </section>

                {/* Initials / Authentication */}
                <AuthenticationSection
                    data={authentication}
                    onChange={handleAuthenticationChange}
                />
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-100 p-6 flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Entry"}
                </Button>
            </div>
        </div>
    );
};

export default KeyOutInForm;
