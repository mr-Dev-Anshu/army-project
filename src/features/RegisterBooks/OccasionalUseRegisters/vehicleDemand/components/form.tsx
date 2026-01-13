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

const VehicleDemandForm = () => {
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
                        Add Vehicle Demand Entry
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Record Vehicle Demand details
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Requestor Particulars */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Requestor Particulars
                    </h3>
                    <IndividualInputFields
                        data={individual}
                        onChange={handleFieldChange}
                    />
                </section>

                {/* Demand Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Demand Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="dateOfRequest" className="text-xs font-medium text-neutral-700">
                                Date of Request
                            </Label>
                            <Input
                                id="dateOfRequest"
                                type="date"
                                className="block w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dateOfDemand" className="text-xs font-medium text-neutral-700">
                                Date of Demand
                            </Label>
                            <Input
                                id="dateOfDemand"
                                type="date"
                                className="block w-full"
                            />
                        </div>
                    </div>
                </section>

                {/* Vehicle Requirement */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Vehicle Requirement
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="typeOfVehicle" className="text-xs font-medium text-neutral-700">
                            Type of Vehicle
                        </Label>
                        <Input id="typeOfVehicle" placeholder="eg. jeep" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="purposeOfDemand" className="text-xs font-medium text-neutral-700">
                            Purpose of Vehicle Demand
                        </Label>
                        <Input id="purposeOfDemand" placeholder="Enter reason here" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-neutral-500">
                            Movement Details:
                        </Label>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="fromLocation" className="text-xs font-medium text-neutral-700">
                                    From Location
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="fromLocation"
                                        placeholder="Enter Address"
                                        className="pr-10"
                                    />
                                    <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="toLocation" className="text-xs font-medium text-neutral-700">
                                    To Location
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="toLocation"
                                        placeholder="Enter Address"
                                        className="pr-10"
                                    />
                                    <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                                </div>
                            </div>
                        </div>
                    </div>
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

export default VehicleDemandForm;
