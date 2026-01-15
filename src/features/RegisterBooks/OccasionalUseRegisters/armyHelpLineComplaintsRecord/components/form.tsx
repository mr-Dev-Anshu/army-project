"use client";

import React, { useState } from "react";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";

const ArmyHelpLineComplaintsForm = () => {
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
                        Add Army Help Line Complaints Entry
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Record Army Help Line Complaints details
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Complainant Particulars */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Complainant Particulars
                    </h3>
                    <IndividualInputFields
                        data={individual}
                        onChange={handleFieldChange}
                    />
                </section>

                {/* Complaint Information */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Complaint Information
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="dateOfComplaint" className="text-xs font-medium text-neutral-700">
                            Date of Complaint
                        </Label>
                        <Input
                            id="dateOfComplaint"
                            type="date"
                            className="block w-full"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="relatedPoliceStation" className="text-xs font-medium text-neutral-700">
                            Related Police Station
                        </Label>
                        <Input id="relatedPoliceStation" placeholder="Text" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="mobileNo" className="text-xs font-medium text-neutral-700">
                            Mobile No. of Person Complaining
                        </Label>
                        <Input id="mobileNo" placeholder="+91 ----- -----" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="civilAddress" className="text-xs font-medium text-neutral-700">
                            Civil Address
                        </Label>
                        <div className="relative">
                            <Input
                                id="civilAddress"
                                placeholder="Enter Address"
                                className="pr-10"
                            />
                            <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                        </div>
                    </div>
                </section>

                {/* Case Summary */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Case Summary
                    </h3>
                    <Textarea
                        id="briefOfCase"
                        placeholder="Brief of Case"
                        className="resize-none min-h-[80px]"
                    />
                </section>

                {/* Initials / Authentication */}
                <AuthenticationSection />

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

export default ArmyHelpLineComplaintsForm;
