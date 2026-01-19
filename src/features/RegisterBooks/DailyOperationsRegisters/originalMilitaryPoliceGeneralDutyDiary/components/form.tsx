"use client";

import React, { useState } from "react";
import {
    Pen,
    X,
    Plus,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { IndividualInputFields, IndividualData, Individual } from "@/features/RegisterBooks/components/IndividualInputFields";
import { IndividualsTable } from "@/features/RegisterBooks/components/IndividualsTable";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";

const GeneralDutyDiaryForm = () => {
    const [offenceOccurred, setOffenceOccurred] = useState(true);
    const [individuals, setIndividuals] = useState<Individual[]>([]);

    // Individual Input State
    const [currentIndividual, setCurrentIndividual] = useState<Omit<Individual, "id">>({
        armyNo: "",
        rank: "",
        name: "",
        unit: "",
        fmn: "",
        command: "",
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleFieldChange = (field: keyof IndividualData, value: string) => {
        setCurrentIndividual((prev) => ({ ...prev, [field]: value }));
    };

    const [authData, setAuthData] = useState({
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    });

    const handleAuthChange = (field: string, value: string) => {
        setAuthData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddIndividual = () => {
        if (!currentIndividual.armyNo || !currentIndividual.name) return; // Basic validation
        setIndividuals([
            ...individuals,
            { ...currentIndividual, id: Math.random().toString(36).substr(2, 9) },
        ]);
        setCurrentIndividual({
            armyNo: "",
            rank: "",
            name: "",
            unit: "",
            fmn: "",
            command: "",
        });
        setIsEditing(false);
    };

    const handleRemoveIndividual = (id: string) => {
        setIndividuals(individuals.filter((ind) => ind.id !== id));
    };

    const handleEditIndividual = (individual: Individual) => {
        setCurrentIndividual({
            armyNo: individual.armyNo,
            rank: individual.rank,
            name: individual.name,
            unit: individual.unit,
            fmn: individual.fmn,
            command: individual.command,
        });
        handleRemoveIndividual(individual.id);
        setIsEditing(true);
    };

    return (
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-white shadow-sm border border-neutral-200 overflow-hidden font-inter">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                        Add General Duty Diary Entry
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Record daily MP duty deployment and activity
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 space-y-8">
                {/* Duty Details Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">Duty Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="dateOfDuty" className="text-xs font-medium text-neutral-700">
                                Date of Duty
                            </Label>
                            <div className="relative">
                                <Input
                                    id="dateOfDuty"
                                    type="date"
                                    className="block w-full"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dutyFrom" className="text-xs font-medium text-neutral-700">
                                Duty From
                            </Label>
                            <div className="relative">
                                <Input
                                    id="dutyFrom"
                                    type="time"
                                    className="block w-full"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dutyTill" className="text-xs font-medium text-neutral-700">
                                Duty Till
                            </Label>
                            <div className="relative">
                                <Input
                                    id="dutyTill"
                                    type="time"
                                    className="block w-full"
                                />
                            </div>
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

                {/* Assigned Individuals Section */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Assigned Individuals on Duty
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="totalStrength" className="text-xs font-medium text-neutral-700">
                            Total Strength
                        </Label>
                        <Input id="totalStrength" placeholder="eg. 02" />
                    </div>

                    <div className="space-y-3">
                        <div>
                            <Label className="text-xs font-medium text-neutral-700">
                                Enter Each Individuals Details
                            </Label>
                            <p className="text-[10px] text-neutral-400">
                                Click on "Add Worker button" to add all individuals details
                            </p>
                        </div>

                        <IndividualInputFields
                            data={currentIndividual}
                            onChange={handleFieldChange}
                        />

                        <div className="flex justify-end pt-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleAddIndividual}
                                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200"
                            >
                                {isEditing ? (
                                    <Save className="mr-2 h-4 w-4" />
                                ) : (
                                    <Plus className="mr-2 h-4 w-4" />
                                )}
                                {isEditing ? "Update Individual" : "Add Individual to list"}
                            </Button>
                        </div>
                    </div>

                    <IndividualsTable
                        individuals={individuals}
                        onRemove={handleRemoveIndividual}
                        onEdit={handleEditIndividual}
                    />
                </section>

                {/* Duty Description Section */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Duty Description</h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="briefOfDuty" className="text-xs font-medium text-neutral-700">
                            Brief of Duty
                        </Label>
                        <Textarea
                            id="briefOfDuty"
                            placeholder="Enter remark"
                            className="resize-none min-h-[80px]"
                        />
                    </div>

                    <div className="flex items-center space-x-2 py-2">
                        <Checkbox
                            id="offenceOccurred"
                            checked={offenceOccurred}
                            onCheckedChange={(c) => setOffenceOccurred(!!c)}
                            className="border-neutral-300 data-[state=checked]:bg-black data-[state=checked]:text-white"
                        />
                        <Label
                            htmlFor="offenceOccurred"
                            className="text-xs font-medium text-neutral-700 cursor-pointer"
                        >
                            Offence Occurred During Duty
                        </Label>
                    </div>

                    {offenceOccurred && (
                        <div className="space-y-4 pl-1">
                            <div className="space-y-1.5">
                                <Label htmlFor="reportNo" className="text-xs font-medium text-neutral-700">
                                    Enter Report No.
                                </Label>
                                <Input id="reportNo" placeholder="New" />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="offenceType" className="text-xs font-medium text-neutral-700">
                                    Offence Type{" "}
                                    <span className="text-neutral-400 font-normal">(Auto Fill from report)</span>
                                </Label>
                                <Input id="offenceType" className="bg-neutral-50" disabled />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="placeOfOffence" className="text-xs font-medium text-neutral-700">
                                    Place of Offence
                                </Label>
                                <Input id="placeOfOffence" />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="occurrenceBrief" className="text-xs font-medium text-neutral-700">
                                    Occurrence Brief
                                </Label>
                                <Textarea
                                    id="occurrenceBrief"
                                    placeholder="Enter remark"
                                    className="resize-none min-h-[80px]"
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Initials / Authentication Section */}
                <AuthenticationSection data={authData} onChange={handleAuthChange} />
            </div>

            {/* Footer */}
            <FormFooter />
        </div>
    );
};

export default GeneralDutyDiaryForm;
