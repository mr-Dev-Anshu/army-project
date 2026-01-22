"use client";

import React, { useState } from "react";
import { Pen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";

const ConvoyInOutForm = () => {
    const [individual, setIndividual] = useState<IndividualData>({
        armyNo: "",
        rank: "",
        name: "",
    });

    const handleFieldChange = (field: keyof IndividualData, value: string) => {
        setIndividual((prev) => ({ ...prev, [field]: value }));
    };

    const [requirements, setRequirements] = useState({
        off: "", jco: "", ors: "",
        mig: "", ton25: "", als: "",
        amb: "", tatr: "", other: "",
        ins: "", ak47: "",
        amn556: "", amn762: "", mm9: ""
    });

    const handleRequirementChange = (field: string, value: string) => {
        setRequirements(prev => ({ ...prev, [field]: value }));
    };

    const calculateTotal = (fields: string[]) => {
        const total = fields.reduce((sum, field) => {
            const val = parseInt(requirements[field as keyof typeof requirements]) || 0;
            return sum + val;
        }, 0);
        return total > 0 ? total.toString() : "";
    };

    const [authData, setAuthData] = useState({
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    });

    const handleAuthChange = (field: string, value: string) => {
        setAuthData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-white shadow-sm border border-neutral-200 overflow-hidden font-inter">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                        Add Convoy Out Entry
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Record Vehicle departure details
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Convoy OUT Details */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">Convoy OUT Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="convoyOutTime" className="text-xs font-medium text-neutral-700">
                                Convoy OUT Time
                            </Label>
                            <Input
                                id="convoyOutTime"
                                type="time"
                                className="block w-full"
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
                                />
                                <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
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

                {/* Vehicle Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Vehicle Details</h3>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="vehicleBaNumber" className="text-xs font-medium text-neutral-700">
                                Vehicle BA Number
                            </Label>
                            <Input id="vehicleBaNumber" placeholder="eg. 12A123456B" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tacNumber" className="text-xs font-medium text-neutral-700">
                                Tac. Number
                            </Label>
                            <Input id="tacNumber" placeholder="eg. Tec-IV-000" />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-neutral-700">
                                Vehicle Location
                            </Label>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Input placeholder="From: Enter Location" />
                                <Input placeholder="To: Enter Location" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Requirements */}
                <section className="space-y-6 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Requirements</h3>

                    {/* Personnel */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-neutral-900">OFF</Label>
                            <Input
                                placeholder="Value"
                                value={requirements.off}
                                onChange={(e) => handleRequirementChange("off", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-neutral-900">JCO</Label>
                            <Input
                                placeholder="Value"
                                value={requirements.jco}
                                onChange={(e) => handleRequirementChange("jco", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-neutral-900">ORS</Label>
                            <Input
                                placeholder="Value"
                                value={requirements.ors}
                                onChange={(e) => handleRequirementChange("ors", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-neutral-900">Total</Label>
                            <Input
                                placeholder="Value"
                                value={calculateTotal(["off", "jco", "ors"])}
                                readOnly
                                className="font-bold border-neutral-400"
                            />
                        </div>
                    </div>

                    <div className="border-t border-neutral-100" />

                    {/* Vehicles */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-neutral-900">MIG</Label>
                                <Input
                                    placeholder="Value"
                                    value={requirements.mig}
                                    onChange={(e) => handleRequirementChange("mig", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-neutral-900">2.5 Ton</Label>
                                <Input
                                    placeholder="Value"
                                    value={requirements.ton25}
                                    onChange={(e) => handleRequirementChange("ton25", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-neutral-900">ALS</Label>
                                <Input
                                    placeholder="Value"
                                    value={requirements.als}
                                    onChange={(e) => handleRequirementChange("als", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-neutral-900">Amb.</Label>
                                <Input
                                    placeholder="Value"
                                    value={requirements.amb}
                                    onChange={(e) => handleRequirementChange("amb", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-neutral-900">TATR n.</Label>
                                <Input
                                    placeholder="Value"
                                    value={requirements.tatr}
                                    onChange={(e) => handleRequirementChange("tatr", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-neutral-900">Other</Label>
                                <Input
                                    placeholder="Value"
                                    value={requirements.other}
                                    onChange={(e) => handleRequirementChange("other", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-neutral-900">Total</Label>
                                <Input
                                    placeholder="Value"
                                    value={calculateTotal(["mig", "ton25", "als", "amb", "tatr", "other"])}
                                    readOnly
                                    className="font-bold border-neutral-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-neutral-100" />

                    {/* Weapons */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-neutral-900">INS</Label>
                            <Input
                                placeholder="Value"
                                value={requirements.ins}
                                onChange={(e) => handleRequirementChange("ins", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-neutral-900">AK47</Label>
                            <Input
                                placeholder="Value"
                                value={requirements.ak47}
                                onChange={(e) => handleRequirementChange("ak47", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5 col-start-4">
                            <Label className="text-xs font-bold text-neutral-900">Total</Label>
                            <Input
                                placeholder="Value"
                                value={calculateTotal(["ins", "ak47"])}
                                readOnly
                                className="font-bold border-neutral-400"
                            />
                        </div>
                    </div>

                    <div className="border-t border-neutral-100" />

                    {/* Ammo */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-neutral-900">5.56 AMN</Label>
                            <Input
                                placeholder="Value"
                                value={requirements.amn556}
                                onChange={(e) => handleRequirementChange("amn556", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-neutral-900">7.62 AMN</Label>
                            <Input
                                placeholder="Value"
                                value={requirements.amn762}
                                onChange={(e) => handleRequirementChange("amn762", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-neutral-900">9 mm</Label>
                            <Input
                                placeholder="Value"
                                value={requirements.mm9}
                                onChange={(e) => handleRequirementChange("mm9", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-neutral-900">Total</Label>
                            <Input
                                placeholder="Value"
                                value={calculateTotal(["amn556", "amn762", "mm9"])}
                                readOnly
                                className="font-bold border-neutral-400"
                            />
                        </div>
                    </div>
                </section>

                {/* Convoy IN Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Convoy IN Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="convoyInTime" className="text-xs font-medium text-neutral-700">
                                Convoy IN Time
                            </Label>
                            <Input
                                id="convoyInTime"
                                type="time"
                                className="block w-full"
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
                        />
                    </div>
                </section>

                {/* Initials / Authentication */}
                <AuthenticationSection data={authData} onChange={handleAuthChange} />
            </div>

            {/* Footer */}
            <FormFooter />
        </div>
    );
};

export default ConvoyInOutForm;
