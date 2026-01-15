"use client";

import React from "react";
import { X, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";

const LostAndFoundForm = () => {
    return (
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-white shadow-sm border border-neutral-200 overflow-hidden font-inter">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                        Lost & Found Entry
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Record found / deposited item
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Incident & Item Details */}
                <section className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-neutral-900">
                            Incident & Item Details
                        </h3>
                        <p className="text-xs text-neutral-500">
                            What was found, where, and when
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="date" className="text-xs font-medium text-neutral-700">
                                Date
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                className="block w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="time" className="text-xs font-medium text-neutral-700">
                                Time
                            </Label>
                            <Input
                                id="time"
                                type="time"
                                className="block w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="itemName" className="text-xs font-medium text-neutral-700">
                            Item Name
                        </Label>
                        <Input id="itemName" placeholder="Enter Name of Item Found" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="place" className="text-xs font-medium text-neutral-700">
                            Place
                        </Label>
                        <Input id="place" placeholder="Enter Location" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="handedByName" className="text-xs font-medium text-neutral-700">
                            Handed by (Name)
                        </Label>
                        <Input id="handedByName" placeholder="Enter Location" />
                    </div>
                </section>

                {/* Authorization (At Time of Deposit) */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-neutral-900">
                            Authorization (At Time of Deposit)
                        </h3>
                        <p className="text-xs text-neutral-500">
                            Verification at the time item is deposited
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-neutral-700">Initials of MPCR NCO</Label>
                            <div className="relative">
                                <Input placeholder="Signature" className="pr-10" />
                                <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-neutral-700">Initials of SM/SJCO</Label>
                            <div className="relative">
                                <Input placeholder="Signature" className="pr-10" />
                                <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-neutral-700">Initials of 2IC</Label>
                            <div className="relative">
                                <Input placeholder="Signature" className="pr-10" />
                                <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Takeover / Handover Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-neutral-900">
                            Takeover / Handover Details
                        </h3>
                        <p className="text-xs text-neutral-500">
                            Filled only when item is taken over/returned
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="takeoverBy" className="text-xs font-medium text-neutral-700">
                                Takeover By (Name)
                            </Label>
                            <Input id="takeoverBy" placeholder="Enter Name of Item Found" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="takeoverDate" className="text-xs font-medium text-neutral-700">
                                    Date
                                </Label>
                                <Input
                                    id="takeoverDate"
                                    type="date"
                                    className="block w-full"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="takeoverTime" className="text-xs font-medium text-neutral-700">
                                    Time
                                </Label>
                                <Input
                                    id="takeoverTime"
                                    type="time"
                                    className="block w-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-neutral-700">Initials of MPCR NCO</Label>
                            <div className="relative">
                                <Input placeholder="Signature" className="pr-10" />
                                <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-neutral-700">Initials of SM/SJCO</Label>
                            <div className="relative">
                                <Input placeholder="Signature" className="pr-10" />
                                <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-neutral-700">Initials of 2IC</Label>
                            <div className="relative">
                                <Input placeholder="Signature" className="pr-10" />
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
            </div>

            {/* Footer */}
            <FormFooter />
        </div>
    );
};

export default LostAndFoundForm;
