"use client";

import React, { useState } from "react";
import { Pen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";

const DutyKeyOutInForm = () => {
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
            {/* ... keeping header ... */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                        Add Duty Out Entry
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Record individual duty departure details
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Duty OUT Details */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">Duty OUT Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="dutyOutTime" className="text-xs font-medium text-neutral-700">
                                Duty OUT Time
                            </Label>
                            <Input
                                id="dutyOutTime"
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

                {/* Duty Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Duty Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="dateOfDuty" className="text-xs font-medium text-neutral-700">
                                Date of Duty
                            </Label>
                            <Input
                                id="dateOfDuty"
                                type="date"
                                className="block w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dutyFrom" className="text-xs font-medium text-neutral-700">
                                Duty From
                            </Label>
                            <Input
                                id="dutyFrom"
                                type="time"
                                className="block w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dutyTill" className="text-xs font-medium text-neutral-700">
                                Duty Till
                            </Label>
                            <Input
                                id="dutyTill"
                                type="time"
                                className="block w-full"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="placeOfDuty" className="text-xs font-medium text-neutral-700">
                            Place of Duty
                        </Label>
                        <Input id="placeOfDuty" placeholder="Location" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="typeOfDuty" className="text-xs font-medium text-neutral-700">
                            Type of Duty/Event
                        </Label>
                        <Input id="typeOfDuty" placeholder="eg. Mobile duty" />
                    </div>
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
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Initials / Authentication</h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="initialsMpcr" className="text-xs font-medium text-neutral-700">
                            Initials of MPCR NCO
                        </Label>
                        <div className="relative">
                            <Input
                                id="initialsMpcr"
                                placeholder="Signature"
                                className="pr-10"
                            />
                            <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="initialsSm" className="text-xs font-medium text-neutral-700">
                            Initials of SM/SJCO
                        </Label>
                        <div className="relative">
                            <Input
                                id="initialsSm"
                                placeholder="Signature"
                                className="pr-10"
                            />
                            <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="initials2ic" className="text-xs font-medium text-neutral-700">
                            Initials of 2IC
                        </Label>
                        <div className="relative">
                            <Input
                                id="initials2ic"
                                placeholder="Signature"
                                className="pr-10"
                            />
                            <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4 bg-white sticky bottom-0 z-10">
                <Button variant="outline" className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 px-6">
                    Cancel
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6">
                    Save & Add Another
                </Button>
            </div>
        </div>
    );
};

export default DutyKeyOutInForm;
