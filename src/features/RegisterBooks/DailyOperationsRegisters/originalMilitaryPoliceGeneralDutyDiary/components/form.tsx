"use client";

import React, { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { SuggestionTextarea } from "@/common/component/SuggestionTextarea";
import { IndividualInputFields, IndividualData, Individual } from "@/features/RegisterBooks/components/IndividualInputFields";

import { IndividualsTable } from "@/features/RegisterBooks/components/IndividualsTable";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { useCreateGeneralDutyDiaryRegister, useUpdateGeneralDutyDiaryRegister } from "../hooks";

interface GeneralDutyDiaryFormProps {
    initialData?: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const GeneralDutyDiaryForm = ({ initialData, onSuccess, onCancel }: GeneralDutyDiaryFormProps) => {
    const createMutation = useCreateGeneralDutyDiaryRegister();
    const updateMutation = useUpdateGeneralDutyDiaryRegister();

    const [dateOfDuty, setDateOfDuty] = useState("");
    const [dutyFrom, setDutyFrom] = useState("");
    const [dutyTill, setDutyTill] = useState("");
    const [placeOfDuty, setPlaceOfDuty] = useState("");
    const [typeOfDuty, setTypeOfDuty] = useState("");
    const [totalStrength, setTotalStrength] = useState("");
    const [briefOfDuty, setBriefOfDuty] = useState("");

    const [offenceOccurred, setOffenceOccurred] = useState(false);
    const [reportNo, setReportNo] = useState("");
    const [offenceType, setOffenceType] = useState("");
    const [placeOfOffence, setPlaceOfOffence] = useState("");
    const [occurrenceBrief, setOccurrenceBrief] = useState("");

    const [offenderCategory, setOffenderCategory] = useState("militaryPersonnel");
    const [offenderDetails, setOffenderDetails] = useState<any>({});


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

    const [authData, setAuthData] = useState({
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    });

    useEffect(() => {
        if (initialData) {
            setDateOfDuty(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "");
            setDutyFrom(initialData.details?.dutyFrom || "");
            setDutyTill(initialData.details?.dutyTill || "");
            setPlaceOfDuty(initialData.details?.placeOfDuty || "");
            setTypeOfDuty(initialData.details?.typeOfDuty || "");
            setTotalStrength(initialData.details?.totalStrength || "");
            setBriefOfDuty(initialData.details?.briefOfDuty || "");
            setIndividuals(initialData.details?.individuals || []);

            setOffenceOccurred(initialData.details?.offenceOccurred || false);
            if (initialData.details?.offenceOccurred) {
                setReportNo(initialData.details?.reportNo || "");
                setOffenceType(initialData.details?.offenceType || "");
                setPlaceOfOffence(initialData.details?.placeOfOffence || "");
                setOccurrenceBrief(initialData.details?.occurrenceBrief || "");

                const offender = initialData.offender || {};
                const loadedCategory = offender.offenderType || offender.category || initialData.details?.offenderCategory || "militaryPersonnel";
                setOffenderCategory(loadedCategory);

                let details = (offender.offenderType || offender.category) ? offender.offenderDetails : (initialData.details?.offenderDetails || {});
                // Fix for potentially double-nested offenderDetails caused by previous incorrect saves
                if (details && details.offenderDetails) {
                    details = { ...details, ...details.offenderDetails };
                }
                setOffenderDetails(details || {});
            }

            setAuthData(initialData.authentication || {
                initialsMPCPNCO: "",
                initialsQMSJCO: "",
                initials2IC: "",
            });
        }
    }, [initialData]);

    // Auto-fetch report data when reportNo changes
    useEffect(() => {
        const fetchReportData = async () => {
            if (!reportNo || reportNo.length < 3) return;

            // Avoid fetching if we are populating from initialData to prevent overwrite loop, 
            // but here we rely on user input. 
            // If reportNo matches initialData.reportNo, and we haven't changed it...
            // Actually, fetching fresh data is fine.

            try {
                // Fetch from Registers endpoint to get records created by this form
                const res = await fetch(`/api/registers?reportNo=${reportNo}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.details) { // Check for 'details' which is specific to Register schema
                        // Populate Offence details from Register data
                        if (data.details.offenceType) {
                            setOffenceType(data.details.offenceType);
                        }

                        if (data.details.placeOfOffence) {
                            setPlaceOfOffence(data.details.placeOfOffence);
                        }

                        if (data.details.occurrenceBrief) {
                            setOccurrenceBrief(data.details.occurrenceBrief);
                        }

                        // Populate Offender details
                        const offender = data.offender || {};
                        const category = data.details.offenderCategory || offender.offenderType || offender.category;

                        if (category) {
                            setOffenderCategory(category);
                        }

                        const details = data.details.offenderDetails || offender.offenderDetails;
                        if (details) {
                            setOffenderDetails(details);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching report data:", error);
            }
        };

        const timeoutId = setTimeout(fetchReportData, 800);
        return () => clearTimeout(timeoutId);
    }, [reportNo]);

    const handleFieldChange = (field: keyof IndividualData, value: string) => {
        setCurrentIndividual((prev) => ({ ...prev, [field]: value }));
    };

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

    const handleSubmit = async () => {
        if (offenceOccurred && !offenderCategory) {
            alert("Please select an Offender / Victim category.");
            return;
        }

        const payload = {
            date: dateOfDuty,
            details: {
                dutyFrom,
                dutyTill,
                placeOfDuty,
                typeOfDuty,
                totalStrength,
                briefOfDuty,
                individuals,
                offenceOccurred,
                ...(offenceOccurred ? {
                    reportNo,
                    offenceType,
                    placeOfOffence,
                    occurrenceBrief,
                    offenderCategory,
                    offenderDetails
                } : {})
            },
            authentication: authData
        };

        try {
            if (initialData?._id) {
                await updateMutation.mutateAsync({ id: initialData._id, data: payload });
            } else {
                await createMutation.mutateAsync(payload);
            }
            onSuccess?.();
        } catch (error) {
            console.error("Failed to save:", error);
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-white shadow-sm border border-neutral-200 overflow-hidden font-inter">


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
                                    value={dateOfDuty}
                                    onChange={(e) => setDateOfDuty(e.target.value)}
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
                                    value={dutyFrom}
                                    onChange={(e) => setDutyFrom(e.target.value)}
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
                                    value={dutyTill}
                                    onChange={(e) => setDutyTill(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <SuggestionInput
                            label="Place of Duty"
                            fieldType="placeOfDuty"
                            placeholder="Location"
                            value={placeOfDuty}
                            onChange={setPlaceOfDuty}
                        />
                    </div>

                    <div className="space-y-1">
                        <SuggestionInput
                            label="Type of Duty/Event"
                            fieldType="typeOfDuty"
                            placeholder="eg. Mobile duty"
                            value={typeOfDuty}
                            onChange={setTypeOfDuty}
                        />
                    </div>
                </section>

                {/* Assigned Individuals Section */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Assigned Individuals on Duty
                    </h3>

                    <div className="space-y-1">
                        <SuggestionInput
                            label="Total Strength"
                            fieldType="totalStrength"
                            placeholder="eg. 02"
                            value={totalStrength}
                            onChange={setTotalStrength}
                        />
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

                    <div className="space-y-1">
                        <SuggestionTextarea
                            label="Brief of Duty"
                            fieldType="briefOfDuty"
                            placeholder="Enter remark"
                            className="resize-none min-h-[80px]"
                            value={briefOfDuty}
                            onChange={setBriefOfDuty}
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
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Enter Report No."
                                    fieldType="reportNo"
                                    placeholder="New"
                                    value={reportNo}
                                    onChange={setReportNo}
                                />
                            </div>

                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Offence Type"
                                    fieldType="offenceType"
                                    placeholder="Enter Offence Type"
                                    value={offenceType}
                                    onChange={setOffenceType}
                                />
                            </div>

                            <div className="space-y-4 pt-2">
                                <Label className="text-xs font-medium text-neutral-700">Particulars of Offender / Victim <span className="text-neutral-400 font-normal">(Select one and fill their details)</span></Label>
                                <RadioGroup
                                    value={offenderCategory}
                                    onValueChange={(v) => {
                                        setOffenderCategory(v);
                                    }}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    {[
                                        { id: "militaryPersonnel", label: "Military Personnel" },
                                        { id: "civilian", label: "Civilian" },
                                        { id: "employee", label: "Employee" },
                                        { id: "servantMaid", label: "Servant / Maid" },
                                        { id: "shopKeeper", label: "Shop Keeper" },
                                        { id: "tempHiredWorker", label: "Temporary Hired Worker" },
                                    ].map((type) => (
                                        <label
                                            key={type.id}
                                            className={cn(
                                                "flex items-center space-x-2 rounded-md border h-10 px-3 cursor-pointer hover:bg-neutral-50 transition-colors",
                                                offenderCategory === type.id ? "border-black bg-neutral-50" : "border-neutral-200"
                                            )}
                                        >
                                            <RadioGroupItem value={type.id} id={type.id} />
                                            <span className="text-xs font-medium">{type.label}</span>
                                        </label>
                                    ))}
                                </RadioGroup>

                                {offenderCategory === "militaryPersonnel" && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Army Number"
                                                fieldType="armyNo"
                                                placeholder="e.g. 12345678A"
                                                value={offenderDetails.armyNo || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, armyNo: v }))}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <SuggestionInput
                                                label="Rank"
                                                fieldType="rank"
                                                placeholder="Select rank"
                                                value={offenderDetails.rank || ""}
                                                onChange={(val) => setOffenderDetails((prev: any) => ({ ...prev, rank: val }))}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Name"
                                                    fieldType="name"
                                                    placeholder="e.g. John Apradhi"
                                                    value={offenderDetails.name || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, name: v }))}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <SuggestionInput
                                                    label="Unit"
                                                    fieldType="unit"
                                                    placeholder="Select unit"
                                                    value={offenderDetails.unit || ""}
                                                    onChange={(val) => setOffenderDetails((prev: any) => ({ ...prev, unit: val }))}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <SuggestionInput
                                                    label="FMN"
                                                    fieldType="fmn"
                                                    placeholder="Select FMN"
                                                    value={offenderDetails.fmn || ""}
                                                    onChange={(val) => setOffenderDetails((prev: any) => ({ ...prev, fmn: val }))}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <SuggestionInput
                                                    label="Command"
                                                    fieldType="command"
                                                    placeholder="Select Command"
                                                    value={offenderDetails.command || ""}
                                                    onChange={(val) => setOffenderDetails((prev: any) => ({ ...prev, command: val }))}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Address"
                                                    fieldType="address"
                                                    placeholder="e.g. C/O 56 APO"
                                                    value={offenderDetails.address || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, address: v }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="I Card Number"
                                                    fieldType="iCardNumber"
                                                    placeholder="e.g. A-123456"
                                                    value={offenderDetails.iCardNumber || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, iCardNumber: v }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {offenderCategory === "civilian" && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Name"
                                                fieldType="name"
                                                placeholder="e.g. John Apradhi"
                                                value={offenderDetails.civilianName || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, civilianName: v }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Aadhar Card Number"
                                                fieldType="aadharCardNumber"
                                                placeholder="e.g. 8888 8888 8888"
                                                value={offenderDetails.civilianAadharCardNumber || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, civilianAadharCardNumber: v }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Father's / Husband's Name"
                                                fieldType="fathersName"
                                                placeholder="e.g. Naman"
                                                value={offenderDetails.civilianFathersName || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, civilianFathersName: v }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Address"
                                                fieldType="address"
                                                placeholder="Location"
                                                value={offenderDetails.civilianAddress || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, civilianAddress: v }))}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2 py-2">
                                            <Checkbox
                                                id="isDependent"
                                                checked={offenderDetails.isDependent || false}
                                                onCheckedChange={(checked) => setOffenderDetails({ ...offenderDetails, isDependent: !!checked })}
                                                className="border-neutral-300 data-[state=checked]:bg-black data-[state=checked]:text-white"
                                            />
                                            <Label
                                                htmlFor="isDependent"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Is this person <span className="font-bold">Dependent / Relative</span> of Military Personnel or Other Registered?
                                            </Label>
                                        </div>

                                        {offenderDetails.isDependent && (
                                            <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Name the relation"
                                                        fieldType="relationName"
                                                        placeholder="e.g. Brother-in-law"
                                                        value={offenderDetails.relationName || ""}
                                                        onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relationName: v }))}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Who is it?</Label>
                                                    <RadioGroup
                                                        value={offenderDetails.relativeCategory || ""}
                                                        onValueChange={(v) => setOffenderDetails({ ...offenderDetails, relativeCategory: v })}
                                                        className="grid grid-cols-2 gap-3"
                                                    >
                                                        {[
                                                            { id: "militaryPersonnel", label: "Military Personnel" },
                                                            { id: "servantMaid", label: "Servant / Maid" },
                                                            { id: "shopKeeper", label: "Shop Keeper" },
                                                            { id: "tempHiredWorker", label: "Temporary Hired Worker" },
                                                        ].map((type) => (
                                                            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md p-2" key={type.id}>
                                                                <RadioGroupItem value={type.id} id={`rel-${type.id}`} />
                                                                <Label htmlFor={`rel-${type.id}`} className="font-normal cursor-pointer">{type.label}</Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </div>

                                                {offenderDetails.relativeCategory === "militaryPersonnel" && (
                                                    <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                        <h4 className="text-sm font-semibold text-gray-700">Relative (Military Personnel) Details</h4>
                                                        <div className="space-y-1">
                                                            <SuggestionInput
                                                                label="Army No."
                                                                fieldType="armyNo"
                                                                placeholder="eg. 122334F"
                                                                value={offenderDetails.relativeDetails?.armyNo || ""}
                                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, armyNo: v } }))}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <SuggestionInput
                                                                label="Name"
                                                                fieldType="name"
                                                                placeholder="eg. Naman"
                                                                value={offenderDetails.relativeDetails?.militaryPersonnelName || ""}
                                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, militaryPersonnelName: v } }))}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Rank"
                                                                    fieldType="rank"
                                                                    placeholder="eg. Sepoy"
                                                                    value={offenderDetails.relativeDetails?.militaryPersonnelRank || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, militaryPersonnelRank: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Unit"
                                                                    fieldType="unit"
                                                                    placeholder="eg. 21 corps"
                                                                    value={offenderDetails.relativeDetails?.militaryPersonnelUnit || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, militaryPersonnelUnit: v } }))}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="FMN"
                                                                    fieldType="fmn"
                                                                    placeholder="eg.21 corps"
                                                                    value={offenderDetails.relativeDetails?.militaryPersonnelFMN || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, militaryPersonnelFMN: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Command"
                                                                    fieldType="command"
                                                                    placeholder="eg. south command"
                                                                    value={offenderDetails.relativeDetails?.militaryPersonnelCommand || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, militaryPersonnelCommand: v } }))}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Address"
                                                                    fieldType="address"
                                                                    placeholder="eg. bhopal"
                                                                    value={offenderDetails.relativeDetails?.militaryPersonnelAddress || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, militaryPersonnelAddress: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="I Card Number"
                                                                    fieldType="iCardNumber"
                                                                    placeholder="eg. 123456789"
                                                                    value={offenderDetails.relativeDetails?.militaryPersonnelICardNumber || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, militaryPersonnelICardNumber: v } }))}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {offenderDetails.relativeCategory === "servantMaid" && (
                                                    <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                        <h4 className="text-sm font-semibold text-gray-700">Relative (Servant / Maid) Details</h4>

                                                        <div className="space-y-1">
                                                            <SuggestionInput
                                                                label={<span>Maid/Servant Pass Number <span className="text-red-500">*</span></span>}
                                                                fieldType="passNumber"
                                                                placeholder="e.g. 12345678"
                                                                value={offenderDetails.relativeDetails?.maidPassNumber || ""}
                                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, maidPassNumber: v } }))}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <SuggestionInput
                                                                label="Father's Name (Son of)"
                                                                fieldType="fathersName"
                                                                placeholder="e.g. Naman"
                                                                value={offenderDetails.relativeDetails?.maidFathersName || ""}
                                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, maidFathersName: v } }))}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Pass ID"
                                                                    fieldType="passID"
                                                                    placeholder="e.g. 1234"
                                                                    value={offenderDetails.relativeDetails?.maidPassID || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, maidPassID: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Name"
                                                                    fieldType="name"
                                                                    placeholder="e.g. John "
                                                                    value={offenderDetails.relativeDetails?.maidName || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, maidName: v } }))}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Trade"
                                                                    fieldType="trade"
                                                                    placeholder="Maid Servant"
                                                                    value={offenderDetails.relativeDetails?.maidTrade || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, maidTrade: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Worked at Quarter Number"
                                                                    fieldType="quarterNumber"
                                                                    placeholder="e.g. DM-35/4"
                                                                    value={offenderDetails.relativeDetails?.maidQuarterNumber || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, maidQuarterNumber: v } }))}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <SuggestionInput
                                                                label="Officers Enclave C/O Rank (Army official's details)"
                                                                fieldType="rank"
                                                                placeholder="Select Rank"
                                                                value={offenderDetails.relativeDetails?.officersEnclaveRank || ""}
                                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, officersEnclaveRank: v } }))}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <SuggestionInput
                                                                label="Name"
                                                                fieldType="name"
                                                                placeholder="e.g. John Apradhi"
                                                                value={offenderDetails.relativeDetails?.officersEnclaveName || ""}
                                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, officersEnclaveName: v } }))}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Place of QTR."
                                                                    fieldType="placeOfQtr"
                                                                    placeholder="Enter Location"
                                                                    value={offenderDetails.relativeDetails?.officersEnclavePlaceOfQtr || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, officersEnclavePlaceOfQtr: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Unit"
                                                                    fieldType="unit"
                                                                    placeholder="Select unit"
                                                                    value={offenderDetails.relativeDetails?.officersEnclaveUnit || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, officersEnclaveUnit: v } }))}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="FMN"
                                                                    fieldType="fmn"
                                                                    placeholder="Select FMN"
                                                                    value={offenderDetails.relativeDetails?.officersEnclaveFmn || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, officersEnclaveFmn: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Command"
                                                                    fieldType="command"
                                                                    placeholder="Select Command"
                                                                    value={offenderDetails.relativeDetails?.officersEnclaveCommand || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, officersEnclaveCommand: v } }))}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">

                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Address"
                                                                    fieldType="address"
                                                                    placeholder="e.g. C/O 56 APO"
                                                                    value={offenderDetails.relativeDetails?.officersEnclaveAddress || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, officersEnclaveAddress: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="I Card Number"
                                                                    fieldType="iCardNumber"
                                                                    placeholder="e.g. A-123456"
                                                                    value={offenderDetails.relativeDetails?.officersEnclaveICardNumber || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, officersEnclaveICardNumber: v } }))}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {offenderDetails.relativeCategory === "shopKeeper" && (
                                                    <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                        <h4 className="text-sm font-semibold text-gray-700">Relative (Shop Keeper) Details</h4>

                                                        <div className="space-y-1">
                                                            <SuggestionInput
                                                                label="Shop Owner Name"
                                                                fieldType="name"
                                                                placeholder="e.g. John Keeper"
                                                                value={offenderDetails.relativeDetails?.shopOwnerName || ""}
                                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, shopOwnerName: v } }))}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Shop Address"
                                                                    fieldType="address"
                                                                    placeholder="e.g. C/O 56 APO"
                                                                    value={offenderDetails.relativeDetails?.shopAddress || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, shopAddress: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Shop Name"
                                                                    fieldType="shopName"
                                                                    placeholder="e.g. John Shop"
                                                                    value={offenderDetails.relativeDetails?.shopName || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, shopName: v } }))}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <SuggestionInput
                                                                label="Unit"
                                                                fieldType="unit"
                                                                placeholder="Select unit"
                                                                value={offenderDetails.relativeDetails?.shopUnit || ""}
                                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, shopUnit: v } }))}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <SuggestionInput
                                                                label="Pass No."
                                                                fieldType="passNumber"
                                                                placeholder="Enter Pass No."
                                                                value={offenderDetails.relativeDetails?.shopPassNo || ""}
                                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, shopPassNo: v } }))}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <Label>Pass Issue Date</Label>
                                                                <Input
                                                                    type="date"
                                                                    value={offenderDetails.relativeDetails?.shopPassIssueDate ? new Date(offenderDetails.relativeDetails.shopPassIssueDate).toISOString().split('T')[0] : ""}
                                                                    onChange={(e) => e.target.value && setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, shopPassIssueDate: new Date(e.target.value).toISOString() } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label>Pass Expire Date</Label>
                                                                <Input
                                                                    type="date"
                                                                    value={offenderDetails.relativeDetails?.shopPassExpireDate ? new Date(offenderDetails.relativeDetails.shopPassExpireDate).toISOString().split('T')[0] : ""}
                                                                    onChange={(e) => e.target.value && setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, shopPassExpireDate: new Date(e.target.value).toISOString() } }))}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {offenderDetails.relativeCategory === "tempHiredWorker" && (
                                                    <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                        <h4 className="text-sm font-semibold text-gray-700">Relative (Temporary Hired Worker) Details</h4>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Name"
                                                                    fieldType="name"
                                                                    placeholder="e.g. John Keeper"
                                                                    value={offenderDetails.relativeDetails?.tempWorkerName || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, tempWorkerName: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Place of Stay"
                                                                    fieldType="address"
                                                                    placeholder="e.g. C/O 56 APO"
                                                                    value={offenderDetails.relativeDetails?.tempWorkerPlaceOfStay || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, tempWorkerPlaceOfStay: v } }))}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Place Of Work"
                                                                    fieldType="address"
                                                                    placeholder="e.g. C/O 56 APO"
                                                                    value={offenderDetails.relativeDetails?.tempWorkerPlaceOfWork || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, tempWorkerPlaceOfWork: v } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <SuggestionInput
                                                                    label="Type of Work"
                                                                    fieldType="trade"
                                                                    placeholder="e.g. John Shop"
                                                                    value={offenderDetails.relativeDetails?.tempWorkerTypeOfWork || ""}
                                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, tempWorkerTypeOfWork: v } }))}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <SuggestionInput
                                                                label="Pass No."
                                                                fieldType="passNumber"
                                                                value={offenderDetails.relativeDetails?.tempWorkerPassNo || ""}
                                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, tempWorkerPassNo: v } }))}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <Label>Pass Issue Date</Label>
                                                                <Input
                                                                    type="date"
                                                                    value={offenderDetails.relativeDetails?.tempWorkerPassIssueDate ? new Date(offenderDetails.relativeDetails.tempWorkerPassIssueDate).toISOString().split('T')[0] : ""}
                                                                    onChange={(e) => e.target.value && setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, tempWorkerPassIssueDate: new Date(e.target.value).toISOString() } }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label>Pass Expire Date</Label>
                                                                <Input
                                                                    type="date"
                                                                    value={offenderDetails.relativeDetails?.tempWorkerPassExpireDate ? new Date(offenderDetails.relativeDetails.tempWorkerPassExpireDate).toISOString().split('T')[0] : ""}
                                                                    onChange={(e) => e.target.value && setOffenderDetails((prev: any) => ({ ...prev, relativeDetails: { ...prev.relativeDetails, tempWorkerPassExpireDate: new Date(e.target.value).toISOString() } }))}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}



                                {offenderCategory === "employee" && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label={<span>Service Number <span className="text-red-500">*</span></span>}
                                                fieldType="serviceNumber"
                                                placeholder="e.g. MES-12345678"
                                                value={offenderDetails.employeeServiceNumber || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, employeeServiceNumber: v }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Name"
                                                fieldType="name"
                                                placeholder="e.g. John Doe"
                                                value={offenderDetails.employeeName || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, employeeName: v }))}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Rank"
                                                    fieldType="rank"
                                                    placeholder="Select rank"
                                                    value={offenderDetails.employeeRank || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, employeeRank: v }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Unit"
                                                    fieldType="unit"
                                                    placeholder="Select unit"
                                                    value={offenderDetails.employeeUnit || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, employeeUnit: v }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="FMN"
                                                    fieldType="fmn"
                                                    placeholder="Select FMN"
                                                    value={offenderDetails.employeeFMN || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, employeeFMN: v }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Command"
                                                    fieldType="command"
                                                    placeholder="Select Command"
                                                    value={offenderDetails.employeeCommand || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, employeeCommand: v }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">

                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Address"
                                                    fieldType="address"
                                                    placeholder="e.g. bhopal"
                                                    value={offenderDetails.employeeAddress || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, employeeAddress: v }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="I Card Number"
                                                    fieldType="iCardNumber"
                                                    placeholder="e.g. A-123456"
                                                    value={offenderDetails.employeeICardNumber || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, employeeICardNumber: v }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {offenderCategory === "servantMaid" && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label={<span>Maid/Servant Pass Number <span className="text-red-500">*</span></span>}
                                                fieldType="passNumber"
                                                placeholder="e.g. 12345678"
                                                value={offenderDetails.maidPassNumber || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, maidPassNumber: v }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Father's Name (Son of)"
                                                fieldType="fathersName"
                                                placeholder="e.g. Naman"
                                                value={offenderDetails.maidFathersName || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, maidFathersName: v }))}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Pass ID"
                                                    fieldType="passID"
                                                    placeholder="e.g. 1234"
                                                    value={offenderDetails.maidPassID || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, maidPassID: v }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Name"
                                                    fieldType="name"
                                                    placeholder="john doe"
                                                    value={offenderDetails.maidName || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, maidName: v }))}
                                                />
                                            </div>

                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Trade"
                                                    fieldType="trade"
                                                    placeholder="Maid Servant"
                                                    value={offenderDetails.maidTrade || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, maidTrade: v }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Worked at Quarter Number"
                                                    fieldType="quarterNumber"
                                                    placeholder="e.g. DM-35/4"
                                                    value={offenderDetails.maidQuarterNumber || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, maidQuarterNumber: v }))}
                                                />
                                            </div>

                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Officers Enclave C/O Rank (Army official's details)"
                                                fieldType="rank"
                                                placeholder="Select Rank"
                                                value={offenderDetails.officersEnclave?.officersEnclaveRank || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, officersEnclave: { ...prev.officersEnclave, officersEnclaveRank: v } }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Name"
                                                fieldType="name"
                                                placeholder="e.g. John Apradhi"
                                                value={offenderDetails.officersEnclave?.officersEnclaveName || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, officersEnclave: { ...prev.officersEnclave, officersEnclaveName: v } }))}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Place of QTR."
                                                    fieldType="placeOfQtr"
                                                    placeholder="Enter Location"
                                                    value={offenderDetails.officersEnclave?.placeOfQtr || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, officersEnclave: { ...prev.officersEnclave, placeOfQtr: v } }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Unit"
                                                    fieldType="unit"
                                                    placeholder="Select unit"
                                                    value={offenderDetails.officersEnclave?.unit || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, officersEnclave: { ...prev.officersEnclave, unit: v } }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="FMN"
                                                    fieldType="fmn"
                                                    placeholder="Select FMN"
                                                    value={offenderDetails.officersEnclave?.fmn || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, officersEnclave: { ...prev.officersEnclave, fmn: v } }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Command"
                                                    fieldType="command"
                                                    placeholder="Select Command"
                                                    value={offenderDetails.officersEnclave?.command || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, officersEnclave: { ...prev.officersEnclave, command: v } }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Address"
                                                    fieldType="address"
                                                    placeholder="e.g. C/O A-123456"
                                                    value={offenderDetails.officersEnclave?.address || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, officersEnclave: { ...prev.officersEnclave, address: v } }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="I Card Number"
                                                    fieldType="iCardNumber"
                                                    placeholder="e.g. A-123456"
                                                    value={offenderDetails.officersEnclave?.iCardNumber || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, officersEnclave: { ...prev.officersEnclave, iCardNumber: v } }))}
                                                />
                                            </div>
                                        </div>



                                    </div>
                                )}

                                {offenderCategory === "shopKeeper" && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Shop Owner Name"
                                                fieldType="ownerName"
                                                placeholder="e.g. John Keeper"
                                                value={offenderDetails.shopOwnerName || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, shopOwnerName: v }))}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Shop Address"
                                                    fieldType="address"
                                                    placeholder="e.g. C/O 56 APO"
                                                    value={offenderDetails.shopAddress || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, shopAddress: v }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Shop Name"
                                                    fieldType="shopName"
                                                    placeholder="e.g. John Shop"
                                                    value={offenderDetails.shopName || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, shopName: v }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Pass No."
                                                fieldType="passNumber"
                                                placeholder="Enter Pass No."
                                                value={offenderDetails.shopPassNo || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, shopPassNo: v }))}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label>Pass Issue Date</Label>
                                                <Input
                                                    type="date"
                                                    value={offenderDetails.shopPassIssueDate ? new Date(offenderDetails.shopPassIssueDate).toISOString().split('T')[0] : ""}
                                                    onChange={(e) => e.target.value && setOffenderDetails((prev: any) => ({ ...prev, shopPassIssueDate: new Date(e.target.value).toISOString() }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Pass Expire Date</Label>
                                                <Input
                                                    type="date"
                                                    value={offenderDetails.shopPassExpireDate ? new Date(offenderDetails.shopPassExpireDate).toISOString().split('T')[0] : ""}
                                                    onChange={(e) => e.target.value && setOffenderDetails((prev: any) => ({ ...prev, shopPassExpireDate: new Date(e.target.value).toISOString() }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {offenderCategory === "tempHiredWorker" && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Name"
                                                    fieldType="name"
                                                    placeholder="e.g. John Keeper"
                                                    value={offenderDetails.tempWorkerName || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, tempWorkerName: v }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Place of Stay"
                                                    fieldType="address"
                                                    placeholder="e.g. C/O 56 APO"
                                                    value={offenderDetails.tempWorkerPlaceOfStay || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, tempWorkerPlaceOfStay: v }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Place Of Work"
                                                    fieldType="address"
                                                    placeholder="e.g. C/O 56 APO"
                                                    value={offenderDetails.tempWorkerPlaceOfWork || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, tempWorkerPlaceOfWork: v }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Type of Work"
                                                    fieldType="trade"
                                                    placeholder="e.g. Cleaner"
                                                    value={offenderDetails.tempWorkerTypeOfWork || ""}
                                                    onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, tempWorkerTypeOfWork: v }))}
                                                />
                                            </div>

                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Pass No."
                                                fieldType="passNumber"
                                                value={offenderDetails.tempWorkerPassNo || ""}
                                                onChange={(v) => setOffenderDetails((prev: any) => ({ ...prev, tempWorkerPassNo: v }))}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label>Pass Issue Date</Label>
                                                <Input
                                                    type="date"
                                                    value={offenderDetails.tempWorkerPassIssueDate ? new Date(offenderDetails.tempWorkerPassIssueDate).toISOString().split('T')[0] : ""}
                                                    onChange={(e) => e.target.value && setOffenderDetails((prev: any) => ({ ...prev, tempWorkerPassIssueDate: new Date(e.target.value).toISOString() }))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Pass Expire Date</Label>
                                                <Input
                                                    type="date"
                                                    value={offenderDetails.tempWorkerPassExpireDate ? new Date(offenderDetails.tempWorkerPassExpireDate).toISOString().split('T')[0] : ""}
                                                    onChange={(e) => e.target.value && setOffenderDetails((prev: any) => ({ ...prev, tempWorkerPassExpireDate: new Date(e.target.value).toISOString() }))}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Place of Offence"
                                    fieldType="placeOfOffence"
                                    value={placeOfOffence}
                                    onChange={setPlaceOfOffence}
                                />
                            </div>

                            <div className="space-y-1">
                                <SuggestionTextarea
                                    label="Occurrence Brief"
                                    fieldType="occurrenceBrief"
                                    placeholder="Enter remark"
                                    className="resize-none min-h-[80px]"
                                    value={occurrenceBrief}
                                    onChange={setOccurrenceBrief}
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Initials / Authentication Section */}
                <AuthenticationSection data={authData} onChange={handleAuthChange} />
            </div>

            {/* Footer */}
            <FormFooter
                onSave={handleSubmit}
                onCancel={onCancel}
                saveText={initialData?._id ? "Update" : "Save"}
                isSaving={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default GeneralDutyDiaryForm;
