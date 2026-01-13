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

const RecceInOutForm = () => {
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

    return (
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-white shadow-sm border border-neutral-200 overflow-hidden font-inter">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                        Add Recce Out Entry
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Record Recce departure details
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Recce Details */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">Recce Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="dateOfRecce" className="text-xs font-medium text-neutral-700">
                                Date of Recce
                            </Label>
                            <Input
                                id="dateOfRecce"
                                type="date"
                                className="block w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="recceFrom" className="text-xs font-medium text-neutral-700">
                                From
                            </Label>
                            <Input
                                id="recceFrom"
                                type="time"
                                className="block w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="recceTill" className="text-xs font-medium text-neutral-700">
                                Till
                            </Label>
                            <Input
                                id="recceTill"
                                type="time"
                                className="block w-full"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="placeOfRecce" className="text-xs font-medium text-neutral-700">
                            Place of Recce
                        </Label>
                        <Input id="placeOfRecce" placeholder="Location" />
                    </div>
                </section>

                {/* Recce OUT Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Recce OUT Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="recceOutTime" className="text-xs font-medium text-neutral-700">
                                Recce OUT Time
                            </Label>
                            <Input
                                id="recceOutTime"
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

                {/* Duty IN Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Duty IN Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="dutyInTime" className="text-xs font-medium text-neutral-700">
                                Duty IN Time
                            </Label>
                            <Input
                                id="dutyInTime"
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
                <AuthenticationSection />
            </div>

            {/* Footer */}
            <FormFooter />
        </div>
    );
};

export default RecceInOutForm;
