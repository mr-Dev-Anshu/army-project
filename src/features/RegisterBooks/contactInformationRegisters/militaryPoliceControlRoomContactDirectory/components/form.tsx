"use client";

import React from "react";
import { X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";

const MilitaryPoliceControlRoomContactForm = () => {
    return (
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-white shadow-sm border border-neutral-200 overflow-hidden font-inter">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                        Add Military Police Control Room Contact
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Enter unit, officer, and MPCR contact details
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Unit & Location Details */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Unit & Location Details
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="locationOfUnit" className="text-xs font-medium text-neutral-700">
                            Location of Unit
                        </Label>
                        <Input id="locationOfUnit" placeholder="e.g. Civil Lines Area, Bhopal – 462001" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="unitName" className="text-xs font-medium text-neutral-700">
                            Unit Name
                        </Label>
                        <Input id="unitName" placeholder="e.g. Provost Unit" />
                    </div>
                </section>

                {/* Commanding Officer (CO) Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Commanding Officer (CO) Details
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="coName" className="text-xs font-medium text-neutral-700">
                                Name of CO
                            </Label>
                            <Input id="coName" placeholder="e.g. Roger" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="coMobileNumber" className="text-xs font-medium text-neutral-700">
                                Mobile Number
                            </Label>
                            <div className="relative">
                                <Input
                                    id="coMobileNumber"
                                    placeholder="+91"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="coRank" className="text-xs font-medium text-neutral-700">
                            Rank
                        </Label>
                        <Input id="coRank" placeholder="Col, Brig, Maj Gen" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="coOfficeLandline" className="text-xs font-medium text-neutral-700">
                                Office Landline Number
                            </Label>
                            <div className="relative">
                                <Input
                                    id="coOfficeLandline"
                                    placeholder="STD code allowed"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="coResidencyTelephone" className="text-xs font-medium text-neutral-700">
                                Residency Telephone No.
                            </Label>
                            <div className="relative">
                                <Input
                                    id="coResidencyTelephone"
                                    placeholder="STD code allowed"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Second In Command (2IC) Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Second In Command (2IC) Details
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="ic2Name" className="text-xs font-medium text-neutral-700">
                                Name of 2IC
                            </Label>
                            <Input id="ic2Name" placeholder="e.g. Roger" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="ic2MobileNumber" className="text-xs font-medium text-neutral-700">
                                Mobile Number
                            </Label>
                            <div className="relative">
                                <Input
                                    id="ic2MobileNumber"
                                    placeholder="+91"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="ic2Rank" className="text-xs font-medium text-neutral-700">
                            Rank
                        </Label>
                        <Input id="ic2Rank" placeholder="Lt Col, Col" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="ic2OfficeLandline" className="text-xs font-medium text-neutral-700">
                                Office Landline Number
                            </Label>
                            <div className="relative">
                                <Input
                                    id="ic2OfficeLandline"
                                    placeholder="STD code allowed"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="ic2ResidencyTelephone" className="text-xs font-medium text-neutral-700">
                                Residency Telephone No.
                            </Label>
                            <div className="relative">
                                <Input
                                    id="ic2ResidencyTelephone"
                                    placeholder="STD code allowed"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Military Police Control Room (MPCR) Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Military Police Control Room (MPCR) Details
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="mpcrInChargeName" className="text-xs font-medium text-neutral-700">
                                Name of MPCR In-Charge
                            </Label>
                            <Input id="mpcrInChargeName" placeholder="e.g. Roger" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="mpcrMobileNumber" className="text-xs font-medium text-neutral-700">
                                Mobile Number
                            </Label>
                            <div className="relative">
                                <Input
                                    id="mpcrMobileNumber"
                                    placeholder="+91"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="mpcrRank" className="text-xs font-medium text-neutral-700">
                            Rank
                        </Label>
                        <Input id="mpcrRank" placeholder="Maj, Lt Col" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="mpcrOfficeLandline" className="text-xs font-medium text-neutral-700">
                                Office Landline Number
                            </Label>
                            <div className="relative">
                                <Input
                                    id="mpcrOfficeLandline"
                                    placeholder="STD code allowed"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="mpcrResidencyTelephone" className="text-xs font-medium text-neutral-700">
                                Residency Telephone No.
                            </Label>
                            <div className="relative">
                                <Input
                                    id="mpcrResidencyTelephone"
                                    placeholder="STD code allowed"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
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
            </div>

            {/* Footer */}
            <FormFooter />
        </div>
    );
};

export default MilitaryPoliceControlRoomContactForm;
