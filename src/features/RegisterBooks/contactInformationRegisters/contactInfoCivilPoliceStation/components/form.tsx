"use client";

import React from "react";
import { X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";

const ContactInfoCivilPoliceStationForm = () => {
    return (
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-white shadow-sm border border-neutral-200 overflow-hidden font-inter">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                        Add Civil Police Station Contact
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Registers / Contact Info – Civil Police Station
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Police Station Details */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Police Station Details
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="policeStationName" className="text-xs font-medium text-neutral-700">
                            Police Station Name
                        </Label>
                        <Input id="policeStationName" placeholder="Enter Name of Station" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="rankOfStation" className="text-xs font-medium text-neutral-700">
                            Rank of Station
                        </Label>
                        <Input id="rankOfStation" placeholder="District HQ / Sub-Division HQ / Cantt / Local." />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="shoName" className="text-xs font-medium text-neutral-700">
                            Head of Station (SHO) Name
                        </Label>
                        <Input id="shoName" placeholder="SHO Name" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="addressOfStation" className="text-xs font-medium text-neutral-700">
                            Address of Station
                        </Label>
                        <Input id="addressOfStation" placeholder="2–3 lines" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="landmark" className="text-xs font-medium text-neutral-700">
                                Landmark
                            </Label>
                            <Input id="landmark" placeholder="Optional" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="pincode" className="text-xs font-medium text-neutral-700">
                                Pincode
                            </Label>
                            <Input id="pincode" placeholder="6-digit validation" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="district" className="text-xs font-medium text-neutral-700">
                                District
                            </Label>
                            <Input id="district" placeholder="District Name" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="state" className="text-xs font-medium text-neutral-700">
                                State
                            </Label>
                            <Input id="state" placeholder="State" />
                        </div>
                    </div>
                </section>

                {/* Official Contact */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Official Contact
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
                        <Label htmlFor="stationEmailId" className="text-xs font-medium text-neutral-700">
                            Station Email ID
                        </Label>
                        <Input id="stationEmailId" placeholder="Emailid@gmail.com" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="faxNumber" className="text-xs font-medium text-neutral-700">
                            Fax Number (Optional)
                        </Label>
                        <Input id="faxNumber" placeholder="eg. 0172-2601235" />
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

export default ContactInfoCivilPoliceStationForm;
