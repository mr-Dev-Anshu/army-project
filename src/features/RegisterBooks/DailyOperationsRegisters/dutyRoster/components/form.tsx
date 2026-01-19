"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";

const DutyRosterForm = () => {
    const [individual, setIndividual] = useState<IndividualData>({
        armyNo: "",
        rank: "",
        name: "",
        unit: "",
        fmn: "",
        command: "",
    });

    const handleFieldChange = (field: keyof IndividualData, value: string) => {
        setIndividual((prev) => ({ ...prev, [field]: value }));
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
                        Add Duty Roster Entry
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Record duty details
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Individual Details Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Individual Particulars
                    </h3>
                    <IndividualInputFields
                        data={individual}
                        onChange={handleFieldChange}
                    />
                </section>

                {/* Duty Details */}
                <section className="space-y-6 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Duty Details</h3>
                    <div className="space-y-1.5">
                        <Label htmlFor="dateOfDuty" className="text-xs font-medium text-neutral-700">
                            Date of Duty
                        </Label>
                        <Input
                            id="dateOfDuty"
                            type="date"
                            className="block w-full max-w-md"
                        />
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-neutral-900">Morning Slot Timing</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="morningDutyFrom" className="text-xs font-medium text-neutral-700">
                                    Duty From
                                </Label>
                                <Input
                                    id="morningDutyFrom"
                                    type="time"
                                    className="block w-full"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="morningDutyTill" className="text-xs font-medium text-neutral-700">
                                    Duty Till
                                </Label>
                                <Input
                                    id="morningDutyTill"
                                    type="time"
                                    className="block w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-neutral-900">Evening Slot Timing</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="eveningDutyFrom" className="text-xs font-medium text-neutral-700">
                                    Duty From
                                </Label>
                                <Input
                                    id="eveningDutyFrom"
                                    type="time"
                                    className="block w-full"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="eveningDutyTill" className="text-xs font-medium text-neutral-700">
                                    Duty Till
                                </Label>
                                <Input
                                    id="eveningDutyTill"
                                    type="time"
                                    className="block w-full"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Initials / Authentication */}
                <AuthenticationSection data={authData} onChange={handleAuthChange} />

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
            </div>

            {/* Footer */}
            <FormFooter />
        </div>
    );
};

export default DutyRosterForm;
