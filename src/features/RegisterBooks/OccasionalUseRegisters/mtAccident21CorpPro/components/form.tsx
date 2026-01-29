"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useMTAccidentReport } from "../hooks/useMTAccidentReport";

const INITIAL_DATA = {
    individualDetails: {
        individualType: "militaryPersonnel",
        individualDetails: {} as any
    },
    accidentDetails: {
        accidentDate: "",
        accidentTime: "",
        placeOfAccident: "",
        accidentType: "normal",
        causeOfAccident: ""
    },
    vehicleDetails: {
        vehicleNumber: "",
        vehicleModel: ""
    },
    casualtyDetails: {
        injuredCivil: "",
        injuredMilitary: "",
        diedCivil: "",
        diedMilitary: ""
    },
    firMactDetails: {
        firMactNumber: "",
        firDate: "",
        firPoliceStation: ""
    },
    actionStatus: "pending",
    actionStatusRemark: "",
    remark: ""
};

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: any;
}

const MTAccidentReportForm: React.FC<Props> = ({ onCancel, onSuccess, initialData }) => {
    const [formData, setFormData] = useState(INITIAL_DATA);
    const { createReport, updateReport, isCreating, isUpdating } = useMTAccidentReport();
    const isPending = isCreating || isUpdating;

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...INITIAL_DATA,
                ...initialData,
                individualDetails: {
                    ...INITIAL_DATA.individualDetails,
                    ...(initialData.individualDetails || {}),
                    individualDetails: initialData.individualDetails?.individualDetails || {}
                },
                accidentDetails: {
                    ...INITIAL_DATA.accidentDetails,
                    ...(initialData.accidentDetails || {})
                },
                vehicleDetails: {
                    ...INITIAL_DATA.vehicleDetails,
                    ...(initialData.vehicleDetails || {})
                },
                casualtyDetails: {
                    ...INITIAL_DATA.casualtyDetails,
                    ...(initialData.casualtyDetails || {})
                },
                firMactDetails: {
                    ...INITIAL_DATA.firMactDetails,
                    ...(initialData.firMactDetails || {})
                }
            });
        }
    }, [initialData]);

    const handleChange = (path: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev };
            const keys = path.split('.');
            let current: any = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const handleSubmit = async () => {
        try {
            if (initialData) {
                await updateReport({ id: initialData._id, data: formData });
            } else {
                await createReport(formData);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save report", error);
        }
    };

    const iv = formData.individualDetails;

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Individual / Victim Details */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Individual / Victim Details</h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-3">Select Individual & Fill Details ?</p>
                            <RadioGroup
                                value={iv.individualType}
                                onValueChange={(v) => handleChange("individualDetails.individualType", v)}
                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
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
                                            "flex items-center space-x-3 rounded-lg border bg-white p-3 cursor-pointer transition-all hover:bg-gray-50",
                                            iv.individualType === type.id
                                                ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/10"
                                                : "border-gray-200"
                                        )}
                                    >
                                        <RadioGroupItem value={type.id} id={type.id} className="text-blue-600" />
                                        <span className="text-sm font-medium text-gray-700">{type.label}</span>
                                    </label>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Conditional Fields based on Individual Type */}
                    {iv.individualType === "militaryPersonnel" && (
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Army No."
                                        fieldType="armyNo"
                                        placeholder="eg. 122334F"
                                        value={iv.individualDetails?.militaryPersonnelArmyNo || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.militaryPersonnelArmyNo", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Rank"
                                        fieldType="rank"
                                        placeholder="eg. Sepoy"
                                        value={iv.individualDetails?.militaryPersonnelRank || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.militaryPersonnelRank", v)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Unit"
                                        fieldType="unit"
                                        placeholder="eg. "
                                        value={iv.individualDetails?.militaryPersonnelUnit || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.militaryPersonnelUnit", v)}
                                    />
                                </div>
                                {/* Rest of Military Personnel Fields - keeping structure but ensuring spacing */}
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Name"
                                        fieldType="name"
                                        placeholder="eg. John Doe"
                                        value={iv.individualDetails?.militaryPersonnelName || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.militaryPersonnelName", v)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="FMN"
                                        fieldType="fmn"
                                        placeholder="eg."
                                        value={iv.individualDetails?.militaryPersonnelFmn || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.militaryPersonnelFmn", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Command"
                                        fieldType="command"
                                        placeholder="eg."
                                        value={iv.individualDetails?.militaryPersonnelCommand || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.militaryPersonnelCommand", v)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Address"
                                        fieldType="address"
                                        placeholder="e.g. A-123456"
                                        value={iv.individualDetails?.militaryPersonnelAddress || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.militaryPersonnelAddress", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="I Card Number"
                                        fieldType="iCardNumber"
                                        placeholder="e.g. A-123456"
                                        value={iv.individualDetails?.militaryPersonnelICardNumber || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.militaryPersonnelICardNumber", v)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {iv.individualType === "employee" && (
                        <div className="space-y-4 pt-2">
                            {/* Employee fields block */}
                            <div className="space-y-1">
                                <SuggestionInput
                                    label={<span>Service Number <span className="text-red-500">*</span></span>}
                                    fieldType="serviceNumber"
                                    placeholder="e.g. MES-12345678"
                                    value={iv.individualDetails?.employeeServiceNumber || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.employeeServiceNumber", v)}
                                />
                            </div>
                            <div className="space-y-1">
                                <SuggestionInput
                                    label={"Name"}
                                    fieldType="name"
                                    placeholder="e.g. John Doe"
                                    value={iv.individualDetails?.employeeName || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.employeeName", v)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Rank"
                                        fieldType="rank"
                                        placeholder="Select rank"
                                        value={iv.individualDetails?.employeeRank || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.employeeRank", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Unit"
                                        fieldType="unit"
                                        placeholder="Select unit"
                                        value={iv.individualDetails?.employeeUnit || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.employeeUnit", v)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="FMN"
                                        fieldType="fmn"
                                        placeholder="Select FMN"
                                        value={iv.individualDetails?.employeeFmn || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.employeeFmn", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Command"
                                        fieldType="command"
                                        placeholder="Select Command"
                                        value={iv.individualDetails?.employeeCommand || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.employeeCommand", v)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Address"
                                        fieldType="address"
                                        placeholder="e.g. A-123456"
                                        value={iv.individualDetails?.employeeAddress || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.employeeAddress", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="I Card Number"
                                        fieldType="iCardNumber"
                                        placeholder="e.g. A-123456"
                                        value={iv.individualDetails?.employeeICardNumber || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.employeeICardNumber", v)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {iv.individualType === "servantMaid" && (
                        <div className="space-y-4 pt-2">
                            <div className="space-y-1">
                                <SuggestionInput
                                    label={<span>Maid/Servant Pass Number <span className="text-red-500">*</span></span>}
                                    fieldType="maidPassNumber"
                                    placeholder="e.g. 12345678"
                                    value={iv.individualDetails?.maidPassNumber || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.maidPassNumber", v)}
                                />
                            </div>

                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Father's Name (Son of)"
                                    fieldType="fathersName"
                                    placeholder="e.g. Name"
                                    value={iv.individualDetails?.maidFathersName || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.maidFathersName", v)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Pass ID"
                                        fieldType="passID"
                                        placeholder="e.g. 1234"
                                        value={iv.individualDetails?.maidPassID || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.maidPassID", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Name"
                                        fieldType="name"
                                        placeholder="e.g. John Doe"
                                        value={iv.individualDetails?.maidName || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.maidName", v)}
                                    />
                                </div>
                            </div>


                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Trade"
                                        fieldType="trade"
                                        placeholder="Maid Servant"
                                        value={iv.individualDetails?.maidTrade || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.maidTrade", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Worked at Quarter Number"
                                        fieldType="quarterNumber"
                                        placeholder="e.g. DM-35/4"
                                        value={iv.individualDetails?.maidQuarterNumber || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.maidQuarterNumber", v)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Officers Enclave C/O Rank"
                                    fieldType="rank"
                                    placeholder="Select Rank"
                                    value={iv.individualDetails?.officersEnclaveRank || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.officersEnclaveRank", v)}
                                />
                            </div>
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Name"
                                    fieldType="name"
                                    placeholder="Name"
                                    value={iv.individualDetails?.officersEnclaveName || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.officersEnclaveName", v)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Place of QTR."
                                        fieldType="placeOfQtr"
                                        placeholder="Enter Location"
                                        value={iv.individualDetails?.officersEnclavePlaceOfQtr || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.officersEnclavePlaceOfQtr", v)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Unit"
                                        fieldType="unit"
                                        placeholder="Select unit"
                                        value={iv.individualDetails?.officersEnclaveUnit || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.officersEnclaveUnit", v)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="FMN"
                                        fieldType="fmn"
                                        placeholder="Select FMN"
                                        value={iv.individualDetails?.officersEnclaveFmn || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.officersEnclaveFmn", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Command"
                                        fieldType="command"
                                        placeholder="Select Command"
                                        value={iv.individualDetails?.officersEnclaveCommand || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.officersEnclaveCommand", v)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Address"
                                        fieldType="address"
                                        placeholder="e.g. A-123456"
                                        value={iv.individualDetails?.officersEnclaveAddress || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.officersEnclaveAddress", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="I Card Number"
                                        fieldType="iCardNumber"
                                        placeholder="e.g. A-123456"
                                        value={iv.individualDetails?.officersEnclaveICardNumber || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.officersEnclaveICardNumber", v)}
                                    />
                                </div>
                            </div>
                        </div>

                    )}

                    {iv.individualType === "shopKeeper" && (
                        <div className="space-y-4 pt-2">
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Shop Owner Name"
                                    fieldType="name"
                                    placeholder="Enter Shop Owner Name"
                                    value={iv.individualDetails?.shopOwnerName || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.shopOwnerName", v)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Shop Address"
                                        fieldType="address"
                                        placeholder="e.g. C/O 56 APO"
                                        value={iv.individualDetails?.shopAddress || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.shopAddress", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Shop Name"
                                        fieldType="shopName"
                                        placeholder="Shop Name"
                                        value={iv.individualDetails?.shopName || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.shopName", v)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Unit"
                                    fieldType="unit"
                                    placeholder="Select unit"
                                    value={iv.individualDetails?.shopUnit || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.shopUnit", v)}
                                />
                            </div>
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Pass No."
                                    fieldType="passNumber"
                                    placeholder="Enter Pass No."
                                    value={iv.individualDetails?.shopPassNo || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.shopPassNo", v)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Pass Issue Date</Label>
                                    <Input
                                        type="date"
                                        value={iv.individualDetails?.shopPassIssueDate ? new Date(iv.individualDetails.shopPassIssueDate).toISOString().split('T')[0] : ""}
                                        onChange={(e) => e.target.value && handleChange("individualDetails.individualDetails.shopPassIssueDate", new Date(e.target.value).toISOString())}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Pass Expire Date</Label>
                                    <Input
                                        type="date"
                                        value={iv.individualDetails?.shopPassExpireDate ? new Date(iv.individualDetails.shopPassExpireDate).toISOString().split('T')[0] : ""}
                                        onChange={(e) => e.target.value && handleChange("individualDetails.individualDetails.shopPassExpireDate", new Date(e.target.value).toISOString())}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {iv.individualType === "tempHiredWorker" && (
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Name"
                                        fieldType="name"
                                        placeholder="e.g. John Doe"
                                        value={iv.individualDetails?.tempWorkerName || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.tempWorkerName", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Place of Stay"
                                        fieldType="address"
                                        placeholder="e.g. C/O 56 APO"
                                        value={iv.individualDetails?.tempWorkerPlaceOfStay || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.tempWorkerPlaceOfStay", v)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Place Of Work"
                                        fieldType="address"
                                        placeholder="e.g. C/O 56 APO"
                                        value={iv.individualDetails?.tempWorkerPlaceOfWork || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.tempWorkerPlaceOfWork", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Type of Work"
                                        fieldType="trade"
                                        placeholder="e.g. John Shop"
                                        value={iv.individualDetails?.tempWorkerTypeOfWork || ""}
                                        onChange={(v) => handleChange("individualDetails.individualDetails.tempWorkerTypeOfWork", v)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Pass No."
                                    fieldType="passNumber"
                                    value={iv.individualDetails?.tempWorkerPassNo || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.tempWorkerPassNo", v)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Pass Issue Date</Label>
                                    <Input
                                        type="date"
                                        value={iv.individualDetails?.tempWorkerPassIssueDate ? new Date(iv.individualDetails.tempWorkerPassIssueDate).toISOString().split('T')[0] : ""}
                                        onChange={(e) => e.target.value && handleChange("individualDetails.individualDetails.tempWorkerPassIssueDate", new Date(e.target.value).toISOString())}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Pass Expire Date</Label>
                                    <Input
                                        type="date"
                                        value={iv.individualDetails?.tempWorkerPassExpireDate ? new Date(iv.individualDetails.tempWorkerPassExpireDate).toISOString().split('T')[0] : ""}
                                        onChange={(e) => e.target.value && handleChange("individualDetails.individualDetails.tempWorkerPassExpireDate", new Date(e.target.value).toISOString())}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {iv.individualType === "civilian" && (
                        <div className="space-y-4 pt-2">
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Name"
                                    fieldType="name"
                                    placeholder="e.g. John Doe"
                                    value={iv.individualDetails?.civilianName || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.civilianName", v)}
                                />
                            </div>
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Aadhar Card Number"
                                    fieldType="aadharCardNumber"
                                    placeholder="e.g. 8888 8888 8888"
                                    value={iv.individualDetails?.civilianAadharCardNumber || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.civilianAadharCardNumber", v)}
                                />
                            </div>
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Father's / Husband's Name"
                                    fieldType="fathersName"
                                    placeholder="e.g. Naman"
                                    value={iv.individualDetails?.civilianFathersName || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.civilianFathersName", v)}
                                />
                            </div>
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Address"
                                    fieldType="address"
                                    placeholder="e.g. 123 Main St"
                                    value={iv.individualDetails?.civilianAddress || ""}
                                    onChange={(v) => handleChange("individualDetails.individualDetails.civilianAddress", v)}
                                />
                            </div>

                            <div className="flex items-center space-x-2 py-2">
                                <Checkbox
                                    id="isDependent"
                                    checked={iv.individualDetails?.isDependent || false}
                                    onCheckedChange={(checked) => handleChange("individualDetails.individualDetails.isDependent", checked)}
                                />
                                <label
                                    htmlFor="isDependent"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Is this person <span className="font-bold">Dependent / Relative</span> of Military Personnel or Other Registered?
                                </label>
                            </div>

                            {iv.individualDetails?.isDependent && (
                                <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Name the relation"
                                            fieldType="relationName"
                                            placeholder="e.g. Brother-in-law"
                                            value={iv.individualDetails?.relationName || ""}
                                            onChange={(v) => handleChange("individualDetails.individualDetails.relationName", v)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Who is it?</Label>
                                        <RadioGroup
                                            value={iv.individualDetails?.relativeCategory || ""}
                                            onValueChange={(v) => handleChange("individualDetails.individualDetails.relativeCategory", v)}
                                            className="grid grid-cols-2 gap-3"
                                        >
                                            {[
                                                { id: "militaryPersonnel", label: "Military Personnel" },
                                                { id: "servantMaid", label: "Servant / Maid" },
                                                { id: "shopKeeper", label: "Shop Keeper" },
                                                { id: "tempHiredWorker", label: "Temporary Hired Worker" },
                                                { id: "employee", label: "Employee" },
                                            ].map((type) => (
                                                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md p-2" key={type.id}>
                                                    <RadioGroupItem value={type.id} id={`rel-${type.id}`} />
                                                    <Label htmlFor={`rel-${type.id}`} className="font-normal cursor-pointer">{type.label}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    {/* Nested Relative Details */}
                                    {iv.individualDetails?.relativeCategory === "militaryPersonnel" && (
                                        <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-700">Relative (Military Personnel) Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Army No."
                                                        fieldType="armyNo"
                                                        placeholder="eg. 122334F"
                                                        value={iv.individualDetails?.relativeDetails?.armyNo || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.armyNo", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Name"
                                                        fieldType="name"
                                                        placeholder="eg. John Doe"
                                                        value={iv.individualDetails?.relativeDetails?.militaryPersonnelName || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.militaryPersonnelName", v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">

                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Rank"
                                                        fieldType="rank"
                                                        placeholder="eg. Sepoy"
                                                        value={iv.individualDetails?.relativeDetails?.rank || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.rank", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Unit"
                                                        fieldType="unit"
                                                        placeholder="eg."
                                                        value={iv.individualDetails?.relativeDetails?.militaryPersonnelUnit || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.militaryPersonnelUnit", v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="FMN"
                                                        fieldType="fmn"
                                                        placeholder="eg."
                                                        value={iv.individualDetails?.relativeDetails?.militaryPersonnelFmn || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.militaryPersonnelFmn", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Command"
                                                        fieldType="command"
                                                        placeholder="eg."
                                                        value={iv.individualDetails?.relativeDetails?.militaryPersonnelCommand || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.militaryPersonnelCommand", v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Address"
                                                        fieldType="address"
                                                        placeholder="e.g. CO 21-123456"
                                                        value={iv.individualDetails?.relativeDetails?.militaryPersonnelAddress || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.militaryPersonnelAddress", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="I Card Number"
                                                        fieldType="iCardNumber"
                                                        placeholder="e.g. A-123456"
                                                        value={iv.individualDetails?.relativeDetails?.militaryPersonnelICardNumber || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.militaryPersonnelICardNumber", v)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {iv.individualDetails?.relativeCategory === "employee" && (
                                        <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-700">Relative (Employee) Details</h4>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label={<span>Service Number <span className="text-red-500">*</span></span>}
                                                    fieldType="serviceNumber"
                                                    placeholder="e.g. MES-12345678"
                                                    value={iv.individualDetails?.relativeDetails?.employeeServiceNumber || ""}
                                                    onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.employeeServiceNumber", v)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label={"Name"}
                                                    fieldType="name"
                                                    placeholder="e.g. John Doe"
                                                    value={iv.individualDetails?.relativeDetails?.employeeName || ""}
                                                    onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.employeeName", v)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Rank"
                                                        fieldType="rank"
                                                        placeholder="Select rank"
                                                        value={iv.individualDetails?.relativeDetails?.employeeRank || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.employeeRank", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Unit"
                                                        fieldType="unit"
                                                        placeholder="Select unit"
                                                        value={iv.individualDetails?.relativeDetails?.employeeUnit || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.employeeUnit", v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="FMN"
                                                        fieldType="fmn"
                                                        placeholder="Select FMN"
                                                        value={iv.individualDetails?.relativeDetails?.employeeFmn || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.employeeFmn", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Command"
                                                        fieldType="command"
                                                        placeholder="Select Command"
                                                        value={iv.individualDetails?.relativeDetails?.employeeCommand || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.employeeCommand", v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Address"
                                                        fieldType="address"
                                                        placeholder="e.g. A-123456"
                                                        value={iv.individualDetails?.relativeDetails?.employeeAddress || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.employeeAddress", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="I Card Number"
                                                        fieldType="iCardNumber"
                                                        placeholder="e.g. A-123456"
                                                        value={iv.individualDetails?.employeeICardNumber || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.employeeICardNumber", v)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {iv.individualDetails?.relativeCategory === "servantMaid" && (
                                        <div className="space-y-4 pt-2">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label={<span>Maid/Servant Pass Number <span className="text-red-500">*</span></span>}
                                                    fieldType="maidPassNumber"
                                                    placeholder="e.g. 12345678"
                                                    value={iv.individualDetails?.relativeDetails?.maidPassNumber || ""}
                                                    onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.maidPassNumber", v)}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Father's Name (Son of)"
                                                    fieldType="fathersName"
                                                    placeholder="e.g. Name"
                                                    value={iv.individualDetails?.relativeDetails?.maidFathersName || ""}
                                                    onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.maidFathersName", v)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Pass ID"
                                                        fieldType="passID"
                                                        placeholder="e.g. 1234"
                                                        value={iv.individualDetails?.relativeDetails?.maidPassID || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.maidPassID", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Name"
                                                        fieldType="name"
                                                        placeholder="e.g. John Doe"
                                                        value={iv.individualDetails?.relativeDetails?.maidName || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.maidName", v)}
                                                    />
                                                </div>
                                            </div>


                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Trade"
                                                        fieldType="trade"
                                                        placeholder="Maid Servant"
                                                        value={iv.individualDetails?.relativeDetails?.maidTrade || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.maidTrade", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Worked at Quarter Number"
                                                        fieldType="quarterNumber"
                                                        placeholder="e.g. DM-35/4"
                                                        value={iv.individualDetails?.relativeDetails?.maidQuarterNumber || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.maidQuarterNumber", v)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Officers Enclave C/O Rank"
                                                    fieldType="rank"
                                                    placeholder="Select Rank"
                                                    value={iv.individualDetails?.relativeDetails?.officersEnclaveRank || ""}
                                                    onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.officersEnclaveRank", v)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Name"
                                                    fieldType="name"
                                                    placeholder="Name"
                                                    value={iv.individualDetails?.relativeDetails?.officersEnclaveName || ""}
                                                    onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.officersEnclaveName", v)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Place of QTR."
                                                        fieldType="placeOfQtr"
                                                        placeholder="Enter Location"
                                                        value={iv.individualDetails?.relativeDetails?.officersEnclavePlaceOfQtr || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.officersEnclavePlaceOfQtr", v)}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Unit"
                                                        fieldType="unit"
                                                        placeholder="Select unit"
                                                        value={iv.individualDetails?.relativeDetails?.officersEnclaveUnit || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.officersEnclaveUnit", v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="FMN"
                                                        fieldType="fmn"
                                                        placeholder="Select FMN"
                                                        value={iv.individualDetails?.relativeDetails?.officersEnclaveFmn || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.officersEnclaveFmn", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Command"
                                                        fieldType="command"
                                                        placeholder="Select Command"
                                                        value={iv.individualDetails?.relativeDetails?.officersEnclaveCommand || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.officersEnclaveCommand", v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Address"
                                                        fieldType="address"
                                                        placeholder="e.g. A-123456"
                                                        value={iv.individualDetails?.relativeDetails?.officersEnclaveAddress || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.officersEnclaveAddress", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="I Card Number"
                                                        fieldType="iCardNumber"
                                                        placeholder="e.g. A-123456"
                                                        value={iv.individualDetails?.relativeDetails?.officersEnclaveICardNumber || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.officersEnclaveICardNumber", v)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    )}

                                    {iv.individualDetails?.relativeCategory === "shopKeeper" && (
                                        <div className="space-y-4 pt-2">
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Shop Owner Name"
                                                    fieldType="name"
                                                    placeholder="Enter Shop Owner Name"
                                                    value={iv.individualDetails?.relativeDetails?.shopOwnerName || ""}
                                                    onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.shopOwnerName", v)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Shop Address"
                                                        fieldType="address"
                                                        placeholder="e.g. C/O 56 APO"
                                                        value={iv.individualDetails?.relativeDetails?.shopAddress || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.shopAddress", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Shop Name"
                                                        fieldType="shopName"
                                                        placeholder="Shop Name"
                                                        value={iv.individualDetails?.relativeDetails?.shopName || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.shopName", v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Unit"
                                                    fieldType="unit"
                                                    placeholder="Select unit"
                                                    value={iv.individualDetails?.relativeDetails?.shopUnit || ""}
                                                    onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.shopUnit", v)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Pass No."
                                                    fieldType="passNumber"
                                                    placeholder="Enter Pass No."
                                                    value={iv.individualDetails?.relativeDetails?.shopPassNo || ""}
                                                    onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.shopPassNo", v)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label>Pass Issue Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={iv.individualDetails?.relativeDetails?.shopPassIssueDate ? new Date(iv.individualDetails.relativeDetails.shopPassIssueDate).toISOString().split('T')[0] : ""}
                                                        onChange={(e) => e.target.value && handleChange("individualDetails.individualDetails.relativeDetails.shopPassIssueDate", new Date(e.target.value).toISOString())}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Pass Expire Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={iv.individualDetails?.relativeDetails?.shopPassExpireDate ? new Date(iv.individualDetails.relativeDetails.shopPassExpireDate).toISOString().split('T')[0] : ""}
                                                        onChange={(e) => e.target.value && handleChange("individualDetails.individualDetails.relativeDetails.shopPassExpireDate", new Date(e.target.value).toISOString())}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {iv.individualDetails?.relativeCategory === "tempHiredWorker" && (
                                        <div className="space-y-4 pt-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Name"
                                                        fieldType="name"
                                                        placeholder="e.g. John Doe"
                                                        value={iv.individualDetails?.relativeDetails?.tempWorkerName || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.tempWorkerName", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Place of Stay"
                                                        fieldType="address"
                                                        placeholder="e.g. C/O 56 APO"
                                                        value={iv.individualDetails?.relativeDetails?.tempWorkerPlaceOfStay || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.tempWorkerPlaceOfStay", v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Place Of Work"
                                                        fieldType="address"
                                                        placeholder="e.g. C/O 56 APO"
                                                        value={iv.individualDetails?.relativeDetails?.tempWorkerPlaceOfWork || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.tempWorkerPlaceOfWork", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Type of Work"
                                                        fieldType="trade"
                                                        placeholder="e.g. John Shop"
                                                        value={iv.individualDetails?.relativeDetails?.tempWorkerTypeOfWork || ""}
                                                        onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.tempWorkerTypeOfWork", v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <SuggestionInput
                                                    label="Pass No."
                                                    fieldType="passNumber"
                                                    value={iv.individualDetails?.relativeDetails?.tempWorkerPassNo || ""}
                                                    onChange={(v) => handleChange("individualDetails.individualDetails.relativeDetails.tempWorkerPassNo", v)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label>Pass Issue Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={iv.individualDetails?.relativeDetails?.tempWorkerPassIssueDate ? new Date(iv.individualDetails.relativeDetails.tempWorkerPassIssueDate).toISOString().split('T')[0] : ""}
                                                        onChange={(e) => e.target.value && handleChange("individualDetails.individualDetails.relativeDetails.tempWorkerPassIssueDate", new Date(e.target.value).toISOString())}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Pass Expire Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={iv.individualDetails?.relativeDetails?.tempWorkerPassExpireDate ? new Date(iv.individualDetails.relativeDetails.tempWorkerPassExpireDate).toISOString().split('T')[0] : ""}
                                                        onChange={(e) => e.target.value && handleChange("individualDetails.individualDetails.relativeDetails.tempWorkerPassExpireDate", new Date(e.target.value).toISOString())}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Accident Details */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Accident Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Date of Accident</Label>
                            <Input
                                type="date"
                                value={formData.accidentDetails.accidentDate ? new Date(formData.accidentDetails.accidentDate).toISOString().split('T')[0] : ""}
                                onChange={(e) => e.target.value && handleChange("accidentDetails.accidentDate", new Date(e.target.value).toISOString())}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Time of Accident (24hr format)</Label>
                            <Input
                                type="time"
                                value={formData.accidentDetails.accidentTime}
                                onChange={(e) => handleChange("accidentDetails.accidentTime", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Place of Accident"
                            fieldType="address"
                            placeholder="Enter Address"
                            value={formData.accidentDetails.placeOfAccident}
                            onChange={(v) => handleChange("accidentDetails.placeOfAccident", v)}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>Type of Accident</Label>
                        <RadioGroup
                            value={formData.accidentDetails.accidentType}
                            onValueChange={(v) => handleChange("accidentDetails.accidentType", v)}
                            className="flex flex-wrap gap-3"
                        >
                            {[
                                { id: "normal", label: "Normal" },
                                { id: "serious", label: "Serious" },
                                { id: "fatal", label: "Fatal" },
                                { id: "verySerious", label: "Very Serious" },
                            ].map((type) => (
                                <label
                                    key={type.id}
                                    className={cn(
                                        "flex items-center space-x-2 rounded-full border px-4 py-2 cursor-pointer transition-all hover:bg-gray-50",
                                        formData.accidentDetails.accidentType === type.id
                                            ? "border-blue-500 bg-blue-50/20 text-blue-700 font-medium"
                                            : "border-gray-200 text-gray-700"
                                    )}
                                >
                                    <RadioGroupItem value={type.id} id={`acc-${type.id}`} className="text-blue-600 border-gray-300" />
                                    <span className="text-sm">{type.label}</span>
                                </label>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-1">
                        <Label>Probable Cause of Accident</Label>
                        <Input
                            value={formData.accidentDetails.causeOfAccident}
                            onChange={(e) => handleChange("accidentDetails.causeOfAccident", e.target.value)}
                            placeholder="Briefly explain cause"
                        />
                    </div>
                </section>

                {/* Vehicle Details */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Vehicle Details</h3>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Vehicle BA No. / Civil Vehicle Registration No."
                            fieldType="vehicleNumber"
                            placeholder="eg. UP 16 AP 1234"
                            value={formData.vehicleDetails.vehicleNumber}
                            onChange={(v) => handleChange("vehicleDetails.vehicleNumber", v)}
                        />
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Make & Take"
                            fieldType="vehicleType"
                            placeholder="Model / Type"
                            value={formData.vehicleDetails.vehicleModel}
                            onChange={(v) => handleChange("vehicleDetails.vehicleModel", v)}
                        />
                    </div>
                </section>

                {/* Casualty Details */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Casualty Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <Label>Injured (Civil)</Label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.casualtyDetails.injuredCivil}
                                onChange={(e) => handleChange("casualtyDetails.injuredCivil", e.target.value)}
                                placeholder="Value"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Injured (Mil)</Label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.casualtyDetails.injuredMilitary}
                                onChange={(e) => handleChange("casualtyDetails.injuredMilitary", e.target.value)}
                                placeholder="Value"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Died (Civil)</Label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.casualtyDetails.diedCivil}
                                onChange={(e) => handleChange("casualtyDetails.diedCivil", e.target.value)}
                                placeholder="Value"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Died (Mil)</Label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.casualtyDetails.diedMilitary}
                                onChange={(e) => handleChange("casualtyDetails.diedMilitary", e.target.value)}
                                placeholder="Value"
                            />
                        </div>
                    </div>
                </section>

                {/* FIR / MACT Details */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">FIR / MACT Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>FIR / MACT No.</Label>
                            <Input
                                value={formData.firMactDetails.firMactNumber}
                                onChange={(e) => handleChange("firMactDetails.firMactNumber", e.target.value)}
                                placeholder="Value"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>FIR Date</Label>
                            <Input
                                type="date"
                                value={formData.firMactDetails.firDate ? new Date(formData.firMactDetails.firDate).toISOString().split('T')[0] : ""}
                                onChange={(e) => e.target.value && handleChange("firMactDetails.firDate", new Date(e.target.value).toISOString())}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="FIR Police Station"
                            fieldType="policeStation"
                            placeholder="Enter Station Name"
                            value={formData.firMactDetails.firPoliceStation}
                            onChange={(v) => handleChange("firMactDetails.firPoliceStation", v)}
                        />
                    </div>
                </section>

                {/* Action */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Action</h3>
                    <div className="space-y-3">
                        <Label>Action Status</Label>
                        <RadioGroup
                            value={formData.actionStatus}
                            onValueChange={(v) => handleChange("actionStatus", v)}
                            className="flex gap-4"
                        >
                            <label
                                className={cn(
                                    "flex items-center justify-start space-x-3 border rounded-lg px-4 py-3 w-full cursor-pointer transition-all hover:bg-gray-50",
                                    formData.actionStatus === "pending"
                                        ? "border-red-500 bg-red-50/10 ring-1 ring-red-500"
                                        : "border-gray-200"
                                )}
                            >
                                <RadioGroupItem value="pending" id="action-pending" className="text-red-600" />
                                <span className={cn("font-medium", formData.actionStatus === "pending" ? "text-red-700" : "text-gray-700")}>Action Pending</span>
                            </label>

                            <label
                                className={cn(
                                    "flex items-center justify-start space-x-3 border rounded-lg px-4 py-3 w-full cursor-pointer transition-all hover:bg-gray-50",
                                    formData.actionStatus === "taken"
                                        ? "border-green-500 bg-green-50/10 ring-1 ring-green-500"
                                        : "border-gray-200"
                                )}
                            >
                                <RadioGroupItem value="taken" id="action-taken" className="text-green-600" />
                                <span className={cn("font-medium", formData.actionStatus === "taken" ? "text-green-700" : "text-gray-700")}>Action Taken</span>
                            </label>
                        </RadioGroup>
                    </div>

                    <div className="space-y-1">
                        <Label>Add Remark</Label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter remark"
                            value={formData.remark}
                            onChange={(e) => handleChange("remark", e.target.value)}
                        />
                    </div>
                </section>

            </div >

            <div className="p-6 border-t flex justify-end gap-2 bg-white sticky bottom-0 z-10 w-full rounded-b-xl border-gray-200">
                <Button variant="outline" onClick={onCancel} type="button" className="px-6 h-10 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">Cancel</Button>
                <Button type="button" onClick={handleSubmit} disabled={isPending} className="bg-[#0088FF] hover:bg-[#0069D9] px-6 h-10 rounded-lg text-white font-medium shadow-sm transition-colors">
                    {isPending ? "Saving..." : (initialData ? "Update & Save" : "Save & Add Another")}
                </Button>
            </div>
        </div >
    );
};

export default MTAccidentReportForm;
