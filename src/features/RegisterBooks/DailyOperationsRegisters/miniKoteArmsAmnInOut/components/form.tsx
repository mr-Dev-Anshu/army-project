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

const MiniKoteArmsAmnInOutForm = () => {
    const [individual, setIndividual] = useState<IndividualData>({
        armyNo: "",
        rank: "",
        name: "",
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
                        Add MINI Kote Arms / AMN Out Entry
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Record MINI Kote Arms / AMN departure details
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
                        Individual Details
                    </h3>
                    <IndividualInputFields
                        data={individual}
                        onChange={handleFieldChange}
                    />
                </section>

                {/* Arms Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Arms Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="typeOfArms" className="text-xs font-medium text-neutral-700">
                                Type of Arms
                            </Label>
                            <Input id="typeOfArms" placeholder="eg. Rifles" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="buttNo" className="text-xs font-medium text-neutral-700">
                                BUTT No.
                            </Label>
                            <Input id="buttNo" placeholder="eg. AK-12" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="registrationNo" className="text-xs font-medium text-neutral-700">
                            Registration No.
                        </Label>
                        <Input id="registrationNo" placeholder="Value" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="typeOfDuty" className="text-xs font-medium text-neutral-700">
                            Type of Duty
                        </Label>
                        <Input id="typeOfDuty" placeholder="Value" />
                    </div>
                </section>

                {/* AMN Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">AMN Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="typeOfAmn" className="text-xs font-medium text-neutral-700">
                                Type of AMN
                            </Label>
                            <Input id="typeOfAmn" placeholder="eg. Small Arms Ammunition" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="quantityOfAmn" className="text-xs font-medium text-neutral-700">
                                Quantity of AMN
                            </Label>
                            <Input id="quantityOfAmn" placeholder="eg. 15" />
                        </div>
                    </div>
                </section>

                {/* Arms / AMN OUT Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Arms / AMN OUT Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="outTime" className="text-xs font-medium text-neutral-700">
                                OUT Time
                            </Label>
                            <Input
                                id="outTime"
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

                {/* Arms / AMN IN Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Arms / AMN IN Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="inTime" className="text-xs font-medium text-neutral-700">
                                IN Time
                            </Label>
                            <Input
                                id="inTime"
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

export default MiniKoteArmsAmnInOutForm;
