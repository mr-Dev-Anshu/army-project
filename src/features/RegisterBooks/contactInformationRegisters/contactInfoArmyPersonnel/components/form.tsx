"use client";

import React from "react";
import { X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";

const ContactInfoArmyPersonnelForm = () => {
    return (
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-white shadow-sm border border-neutral-200 overflow-hidden font-inter">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                        Add Army Personnel Contact
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Enter contact and appointment details
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Personal & Service Details */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Personal & Service Details
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="rank" className="text-xs font-medium text-neutral-700">
                            Rank
                        </Label>
                        <Input id="rank" placeholder="Lt Col, Maj, Sub Maj, Hav (MP)" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-medium text-neutral-700">
                                Name of Individual
                            </Label>
                            <Input id="name" placeholder="e.g. Roger" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="mobileNumber" className="text-xs font-medium text-neutral-700">
                                Mobile Number
                            </Label>
                            <div className="relative">
                                <Input
                                    id="mobileNumber"
                                    placeholder="+91"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="appointment" className="text-xs font-medium text-neutral-700">
                            Appointment
                        </Label>
                        <Input id="appointment" placeholder="Deputy Provost Marshal, Regimental JCO, MP Duty In-charge" />
                    </div>
                </section>

                {/* Unit & Posting Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Unit & Posting Details
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="unit" className="text-xs font-medium text-neutral-700">
                            Unit
                        </Label>
                        <Input id="unit" placeholder="e.g. HQ 21 Corps, 36 RAPID Div" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="postedAt" className="text-xs font-medium text-neutral-700">
                            Posted At (Location)
                        </Label>
                        <Input id="postedAt" placeholder="e.g. Bhopal (Corps HQ), Jhansi" />
                    </div>
                </section>

                {/* Contact Information */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Contact Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="officeLandlineNumber" className="text-xs font-medium text-neutral-700">
                                Office Landline Number
                            </Label>
                            <div className="relative">
                                <Input
                                    id="officeLandlineNumber"
                                    placeholder="STD code allowed"
                                    className="pr-10"
                                />
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="residencyNo" className="text-xs font-medium text-neutral-700">
                                Residency No.
                            </Label>
                            <div className="relative">
                                <Input
                                    id="residencyNo"
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

export default ContactInfoArmyPersonnelForm;
