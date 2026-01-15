"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useCreateVehiclesSecurityPass, useUpdateVehiclesSecurityPass } from "../hooks";
import { VehiclesSecurityPassManagement } from "@/apis/vehiclesSecurityPassManagement/types";

// Initial state for resetting the form
const INITIAL_VEHICLE_PASS_STATE = {
    vehicleIdentification: {
        registrationNumber: "",
        color: "",
        category: "",
        type: "",
    },
    ownerInformation: {
        name: "",
        mobileNumber: "",
        ownerType: "militaryPersonnel",
        ownerDetails: {},
    },
    vehiclePassDetails: {
        isAvailable: false,
        passNumber: "",
        issuedDate: "",
        validFrom: "",
        validTo: "",
        issuingAuthority: "",
    },
    authentication: {
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    },
    remark: "",
};

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: VehiclesSecurityPassManagement;
}

const VehiclesSecurityPassForm: React.FC<Props> = ({ onCancel, onSuccess, initialData }) => {
    const { state, dispatch } = useForm();
    const vehiclePass = state.formData.vehiclesSecurityPassManagement;
    const { mutateAsync: createPass, isPending: isCreating } = useCreateVehiclesSecurityPass();
    const { mutateAsync: updatePass, isPending: isUpdating } = useUpdateVehiclesSecurityPass();

    const isPending = isCreating || isUpdating;

    useEffect(() => {
        if (initialData) {
            dispatch({
                type: "SET_PATH",
                path: "formData.vehiclesSecurityPassManagement",
                value: {
                    ...INITIAL_VEHICLE_PASS_STATE,
                    ...initialData,
                },
            });
        } else {
            dispatch({
                type: "SET_PATH",
                path: "formData.vehiclesSecurityPassManagement",
                value: INITIAL_VEHICLE_PASS_STATE,
            });
        }
    }, [initialData, dispatch]);

    const setField = (path: string, value: any) => {
        dispatch({
            type: "SET_PATH",
            path: `formData.vehiclesSecurityPassManagement.${path}`,
            value,
        });
    };

    const handleSave = async () => {
        try {
            // Basic Validation
            if (!vehiclePass.vehicleIdentification.registrationNumber) {
                toast.error("Vehicle Registration Number is required");
                return;
            }
            if (!vehiclePass.ownerInformation.name) {
                toast.error("Owner Name is required");
                return;
            }

            if (vehiclePass.vehiclePassDetails.isAvailable) {
                if (!vehiclePass.vehiclePassDetails.passNumber) {
                    toast.error("Pass Number is required when pass is available");
                    return;
                }
                if (!vehiclePass.vehiclePassDetails.issuedDate || !vehiclePass.vehiclePassDetails.validFrom || !vehiclePass.vehiclePassDetails.validTo) {
                    toast.error("Please fill all pass dates");
                    return;
                }
            }

            const payload = { ...vehiclePass };

            // Clean up _id for create
            if (!initialData) {
                delete (payload as any)._id;
                delete (payload as any).createdAt;
                delete (payload as any).updatedAt;
            }

            if (initialData && initialData._id) {
                await updatePass({ id: initialData._id, data: payload });
                toast.success("Security Pass Updated Successfully");
            } else {
                await createPass(payload);
                toast.success("Security Pass Created Successfully");
            }

            // Reset form logic is handled by parent re-init or here if needed, 
            // but usually closing the modal is enough.
            // Resetting here just in case:
            dispatch({
                type: "SET_PATH",
                path: "formData.vehiclesSecurityPassManagement",
                value: INITIAL_VEHICLE_PASS_STATE,
            });

            onSuccess();
        } catch (error: any) {
            console.error(error);
            const msg = error?.response?.data?.message || "Operation failed";
            toast.error(msg);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white font-[Arial]">
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Vehicle Identification */}
                <section>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Vehicle Identification</h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Vehicle Registration No."
                                fieldType="registrationNumber"
                                placeholder="eg. --"
                                value={vehiclePass.vehicleIdentification.registrationNumber}
                                onChange={(v) => setField("vehicleIdentification.registrationNumber", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Vehicle Color"
                                fieldType="vehicleColor"
                                placeholder="eg. White, Black, Red, Blue, etc."
                                value={vehiclePass.vehicleIdentification.color}
                                onChange={(v) => setField("vehicleIdentification.color", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Vehicle Category"
                                fieldType="vehicleCategory"
                                placeholder="eg. 2-Wheeler / 4-Wheeler"
                                value={vehiclePass.vehicleIdentification.category}
                                onChange={(v) => setField("vehicleIdentification.category", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Vehicle Type (Make & Type)"
                                fieldType="vehicleType"
                                placeholder="eg. Car, Bike, Scooter, Truck"
                                value={vehiclePass.vehicleIdentification.type}
                                onChange={(v) => setField("vehicleIdentification.type", v)}
                            />
                        </div>
                    </div>
                </section>

                {/* Owner Information */}
                <section>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Owner Information</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Owner Name"
                                    fieldType="ownerName"
                                    placeholder="eg. Robert"
                                    value={vehiclePass.ownerInformation.name}
                                    onChange={(v) => setField("ownerInformation.name", v)}
                                />
                            </div>
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Mobile Number"
                                    fieldType="mobileNumber"
                                    placeholder="eg. +91 12345 67890"
                                    value={vehiclePass.ownerInformation.mobileNumber}
                                    onChange={(v) => setField("ownerInformation.mobileNumber", v)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Owner Type (Select one)</Label>
                            <RadioGroup
                                value={vehiclePass.ownerInformation.ownerType || "militaryPersonnel"}
                                onValueChange={(v) => setField("ownerInformation.ownerType", v)}
                                className="grid grid-cols-3 gap-3"
                            >
                                {[
                                    { id: "militaryPersonnel", label: "Military Personnel" },
                                    { id: "employee", label: "Employee" },
                                    { id: "civilian", label: "Civilian" },
                                    { id: "servantMaid", label: "Servant / Maid" },
                                    { id: "shopKeeper", label: "Shop Keeper" },
                                    { id: "tempHiredWorker", label: "Temp. Hired Worker" },
                                ].map((type) => (
                                    <label
                                        key={type.id}
                                        className={cn(
                                            "flex items-center space-x-2 rounded-md border h-10 px-3 cursor-pointer hover:bg-gray-50 transition-colors",
                                            vehiclePass.ownerInformation.ownerType === type.id ? "border-black bg-gray-50" : "border-gray-200"
                                        )}
                                    >
                                        <RadioGroupItem value={type.id} id={type.id} />
                                        <span className="text-xs font-medium">{type.label}</span>
                                    </label>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* Conditional Owner Particulars based on Owner Type? */}
                        {/* Reference image shows fields active for Military Personnel. I will keep them always visible or maybe tailor them if needed, but the request implies standard fields. */}
                        {vehiclePass.ownerInformation.ownerType === "militaryPersonnel" && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Army No."
                                        fieldType="armyNo"
                                        placeholder="eg. 122334F"
                                        value={vehiclePass.ownerInformation.ownerDetails?.armyNo || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.armyNo", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Rank"
                                        fieldType="rank"
                                        placeholder="eg. Sepoy"
                                        value={vehiclePass.ownerInformation.ownerDetails?.rank || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.rank", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Unit"
                                        fieldType="unit"
                                        placeholder="eg."
                                        value={vehiclePass.ownerInformation.ownerDetails?.unit || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.unit", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="FMN"
                                        fieldType="fmn"
                                        placeholder="eg."
                                        value={vehiclePass.ownerInformation.ownerDetails?.fmn || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.fmn", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Command"
                                        fieldType="command"
                                        placeholder="eg."
                                        value={vehiclePass.ownerInformation.ownerDetails?.command || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.command", v)}
                                    />
                                </div>
                            </div>
                        )}

                        {vehiclePass.ownerInformation.ownerType === "employee" && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label={<span>Service Number <span className="text-red-500">*</span></span>}
                                        fieldType="serviceNumber"
                                        placeholder="e.g. MES-12345678"
                                        value={vehiclePass.ownerInformation.ownerDetails?.serviceNumber || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.serviceNumber", v)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Rank"
                                            fieldType="rank"
                                            placeholder="Select rank"
                                            value={vehiclePass.ownerInformation.ownerDetails?.employeeRank || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.employeeRank", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Unit"
                                            fieldType="unit"
                                            placeholder="Select unit"
                                            value={vehiclePass.ownerInformation.ownerDetails?.employeeUnit || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.employeeUnit", v)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="FMN"
                                            fieldType="fmn"
                                            placeholder="Select FMN"
                                            value={vehiclePass.ownerInformation.ownerDetails?.employeeFmn || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.employeeFmn", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Command"
                                            fieldType="command"
                                            placeholder="Select Command"
                                            value={vehiclePass.ownerInformation.ownerDetails?.employeeCommand || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.employeeCommand", v)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="I Card Number"
                                        fieldType="iCardNumber"
                                        placeholder="e.g. A-123456"
                                        value={vehiclePass.ownerInformation.ownerDetails?.employeeICardNumber || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.employeeICardNumber", v)}
                                    />
                                </div>
                            </div>
                        )}

                        {vehiclePass.ownerInformation.ownerType === "servantMaid" && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label={<span>Maid/Servant Pass Number <span className="text-red-500">*</span></span>}
                                        fieldType="maidPassNumber"
                                        placeholder="e.g. 12345678"
                                        value={vehiclePass.ownerInformation.ownerDetails?.maidPassNumber || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.maidPassNumber", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Father's Name (Son of)"
                                        fieldType="fathersName"
                                        placeholder="e.g. Apradhi k Papa"
                                        value={vehiclePass.ownerInformation.ownerDetails?.maidFathersName || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.maidFathersName", v)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Pass ID"
                                        fieldType="passID"
                                        placeholder="e.g. 1234"
                                        value={vehiclePass.ownerInformation.ownerDetails?.maidPassID || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.maidPassID", v)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Trade"
                                            fieldType="trade"
                                            placeholder="Maid Servant"
                                            value={vehiclePass.ownerInformation.ownerDetails?.maidTrade || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.maidTrade", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Worked at Quarter Number"
                                            fieldType="quarterNumber"
                                            placeholder="e.g. DM-35/4"
                                            value={vehiclePass.ownerInformation.ownerDetails?.maidQuarterNumber || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.maidQuarterNumber", v)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Officers Enclave C/O Rank (Army official's details)"
                                        fieldType="rank"
                                        placeholder="Select Rank"
                                        value={vehiclePass.ownerInformation.ownerDetails?.officersEnclaveRank || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.officersEnclaveRank", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Name"
                                        fieldType="ownerName"
                                        placeholder="e.g. John Apradhi"
                                        value={vehiclePass.ownerInformation.ownerDetails?.officersEnclaveName || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.officersEnclaveName", v)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Place of QTR."
                                            fieldType="placeOfQtr"
                                            placeholder="Enter Location"
                                            value={vehiclePass.ownerInformation.ownerDetails?.maidPlaceOfQtr || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.maidPlaceOfQtr", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Unit"
                                            fieldType="unit"
                                            placeholder="Select unit"
                                            value={vehiclePass.ownerInformation.ownerDetails?.maidUnit || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.maidUnit", v)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="FMN"
                                            fieldType="fmn"
                                            placeholder="Select FMN"
                                            value={vehiclePass.ownerInformation.ownerDetails?.maidFmn || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.maidFmn", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Command"
                                            fieldType="command"
                                            placeholder="Select Command"
                                            value={vehiclePass.ownerInformation.ownerDetails?.maidCommand || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.maidCommand", v)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="I Card Number"
                                        fieldType="iCardNumber"
                                        placeholder="e.g. A-123456"
                                        value={vehiclePass.ownerInformation.ownerDetails?.maidICardNumber || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.maidICardNumber", v)}
                                    />
                                </div>
                            </div>
                        )}

                        {vehiclePass.ownerInformation.ownerType === "shopKeeper" && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Shop Owner Name"
                                        fieldType="ownerName"
                                        placeholder="e.g. John Keeper"
                                        value={vehiclePass.ownerInformation.ownerDetails?.shopOwnerName || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.shopOwnerName", v)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Shop Address"
                                            fieldType="address"
                                            placeholder="e.g. C/O 56 APO"
                                            value={vehiclePass.ownerInformation.ownerDetails?.shopAddress || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.shopAddress", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Shop Name"
                                            fieldType="shopName"
                                            placeholder="e.g. John Shop"
                                            value={vehiclePass.ownerInformation.ownerDetails?.shopName || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.shopName", v)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Unit"
                                        fieldType="unit"
                                        placeholder="Select unit"
                                        value={vehiclePass.ownerInformation.ownerDetails?.shopUnit || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.shopUnit", v)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Pass No."
                                        fieldType="passNumber"
                                        placeholder="Enter Pass No."
                                        value={vehiclePass.ownerInformation.ownerDetails?.shopPassNo || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.shopPassNo", v)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Pass Issue Date</Label>
                                        <Input
                                            type="date"
                                            value={vehiclePass.ownerInformation.ownerDetails?.shopPassIssueDate ? new Date(vehiclePass.ownerInformation.ownerDetails.shopPassIssueDate).toISOString().split('T')[0] : ""}
                                            onChange={(e) => e.target.value && setField("ownerInformation.ownerDetails.shopPassIssueDate", new Date(e.target.value).toISOString())}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Pass Expire Date</Label>
                                        <Input
                                            type="date"
                                            value={vehiclePass.ownerInformation.ownerDetails?.shopPassExpireDate ? new Date(vehiclePass.ownerInformation.ownerDetails.shopPassExpireDate).toISOString().split('T')[0] : ""}
                                            onChange={(e) => e.target.value && setField("ownerInformation.ownerDetails.shopPassExpireDate", new Date(e.target.value).toISOString())}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {vehiclePass.ownerInformation.ownerType === "tempHiredWorker" && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Name"
                                            fieldType="ownerName"
                                            placeholder="e.g. John Keeper"
                                            value={vehiclePass.ownerInformation.ownerDetails?.tempWorkerName || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.tempWorkerName", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Place of Stay"
                                            fieldType="address"
                                            placeholder="e.g. C/O 56 APO"
                                            value={vehiclePass.ownerInformation.ownerDetails?.placeOfStay || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.placeOfStay", v)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Place Of Work"
                                            fieldType="address"
                                            placeholder="e.g. C/O 56 APO"
                                            value={vehiclePass.ownerInformation.ownerDetails?.placeOfWork || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.placeOfWork", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Type of Work"
                                            fieldType="trade"
                                            placeholder="e.g. John Shop"
                                            value={vehiclePass.ownerInformation.ownerDetails?.typeOfWork || ""}
                                            onChange={(v) => setField("ownerInformation.ownerDetails.typeOfWork", v)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Pass No."
                                        fieldType="passNumber"
                                        value={vehiclePass.ownerInformation.ownerDetails?.tempWorkerPassNo || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.tempWorkerPassNo", v)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Pass Issue Date</Label>
                                        <Input
                                            type="date"
                                            value={vehiclePass.ownerInformation.ownerDetails?.tempWorkerPassIssueDate ? new Date(vehiclePass.ownerInformation.ownerDetails.tempWorkerPassIssueDate).toISOString().split('T')[0] : ""}
                                            onChange={(e) => e.target.value && setField("ownerInformation.ownerDetails.tempWorkerPassIssueDate", new Date(e.target.value).toISOString())}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Pass Expire Date</Label>
                                        <Input
                                            type="date"
                                            value={vehiclePass.ownerInformation.ownerDetails?.tempWorkerPassExpireDate ? new Date(vehiclePass.ownerInformation.ownerDetails.tempWorkerPassExpireDate).toISOString().split('T')[0] : ""}
                                            onChange={(e) => e.target.value && setField("ownerInformation.ownerDetails.tempWorkerPassExpireDate", new Date(e.target.value).toISOString())}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {vehiclePass.ownerInformation.ownerType === "civilian" && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Aadhar Card Number"
                                        fieldType="aadharCardNumber"
                                        placeholder="e.g. 8888 8888 8888"
                                        value={vehiclePass.ownerInformation.ownerDetails?.aadharCardNumber || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.aadharCardNumber", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Father's / Husband's Name"
                                        fieldType="fathersName"
                                        placeholder="e.g. Apradhi k Papa"
                                        value={vehiclePass.ownerInformation.ownerDetails?.fathersName || ""}
                                        onChange={(v) => setField("ownerInformation.ownerDetails.fathersName", v)}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 py-2">
                                    <Checkbox
                                        id="isDependent"
                                        checked={vehiclePass.ownerInformation.ownerDetails?.isDependent || false}
                                        onCheckedChange={(checked) => setField("ownerInformation.ownerDetails.isDependent", checked)}
                                    />
                                    <label
                                        htmlFor="isDependent"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Is this person <span className="font-bold">Dependent / Relative</span> of Military Personnel or Other Registered?
                                    </label>
                                </div>

                                {vehiclePass.ownerInformation.ownerDetails?.isDependent && (
                                    <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Name the relation"
                                                fieldType="relationName"
                                                placeholder="e.g. Brother-in-law"
                                                value={vehiclePass.ownerInformation.ownerDetails?.relationName || ""}
                                                onChange={(v) => setField("ownerInformation.ownerDetails.relationName", v)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Who is it?</Label>
                                            <RadioGroup
                                                value={vehiclePass.ownerInformation.ownerDetails?.relativeCategory || ""}
                                                onValueChange={(v) => setField("ownerInformation.ownerDetails.relativeCategory", v)}
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

                                        {vehiclePass.ownerInformation.ownerDetails?.relativeCategory === "militaryPersonnel" && (
                                            <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                <h4 className="text-sm font-semibold text-gray-700">Relative (Military Personnel) Details</h4>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Army No."
                                                        fieldType="armyNo"
                                                        placeholder="eg. 122334F"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.armyNo || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.armyNo", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Rank"
                                                        fieldType="rank"
                                                        placeholder="eg. Sepoy"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.rank || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.rank", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Unit"
                                                        fieldType="unit"
                                                        placeholder="eg."
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.unit || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.unit", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="FMN"
                                                        fieldType="fmn"
                                                        placeholder="eg."
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.fmn || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.fmn", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Command"
                                                        fieldType="command"
                                                        placeholder="eg."
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.command || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.command", v)}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {vehiclePass.ownerInformation.ownerDetails?.relativeCategory === "servantMaid" && (
                                            <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                <h4 className="text-sm font-semibold text-gray-700">Relative (Servant / Maid) Details</h4>

                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label={<span>Maid/Servant Pass Number <span className="text-red-500">*</span></span>}
                                                        fieldType="maidPassNumber"
                                                        placeholder="e.g. 12345678"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.maidPassNumber || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.maidPassNumber", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Father's Name (Son of)"
                                                        fieldType="fathersName"
                                                        placeholder="e.g. Naman"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.maidFathersName || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.maidFathersName", v)}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Pass ID"
                                                            fieldType="passID"
                                                            placeholder="e.g. 1234"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.maidPassID || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.maidPassID", v)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Name"
                                                            fieldType="ownerName"
                                                            placeholder="e.g. John "
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.relativeName || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.relativeName", v)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Trade"
                                                            fieldType="trade"
                                                            placeholder="Maid Servant"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.maidTrade || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.maidTrade", v)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Worked at Quarter Number"
                                                            fieldType="quarterNumber"
                                                            placeholder="e.g. DM-35/4"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.maidQuarterNumber || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.maidQuarterNumber", v)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Officers Enclave C/O Rank (Army official's details)"
                                                        fieldType="rank"
                                                        placeholder="Select Rank"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.officersEnclaveRank || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.officersEnclaveRank", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Name"
                                                        fieldType="ownerName"
                                                        placeholder="e.g. John Apradhi"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.officersEnclaveName || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.officersEnclaveName", v)}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Place of QTR."
                                                            fieldType="placeOfQtr"
                                                            placeholder="Enter Location"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.maidPlaceOfQtr || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.maidPlaceOfQtr", v)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Unit"
                                                            fieldType="unit"
                                                            placeholder="Select unit"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.maidUnit || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.maidUnit", v)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="FMN"
                                                            fieldType="fmn"
                                                            placeholder="Select FMN"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.maidFmn || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.maidFmn", v)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Command"
                                                            fieldType="command"
                                                            placeholder="Select Command"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.maidCommand || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.maidCommand", v)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Address"
                                                        fieldType="address"
                                                        placeholder="e.g. C/O 56 APO"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.relativeAddress || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.relativeAddress", v)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="I Card Number"
                                                        fieldType="iCardNumber"
                                                        placeholder="e.g. A-123456"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.maidICardNumber || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.maidICardNumber", v)}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {vehiclePass.ownerInformation.ownerDetails?.relativeCategory === "shopKeeper" && (
                                            <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                <h4 className="text-sm font-semibold text-gray-700">Relative (Shop Keeper) Details</h4>

                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Shop Owner Name"
                                                        fieldType="ownerName"
                                                        placeholder="e.g. John Keeper"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.shopOwnerName || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.shopOwnerName", v)}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Shop Address"
                                                            fieldType="address"
                                                            placeholder="e.g. C/O 56 APO"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.shopAddress || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.shopAddress", v)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Shop Name"
                                                            fieldType="shopName"
                                                            placeholder="e.g. John Shop"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.shopName || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.shopName", v)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Unit"
                                                        fieldType="unit"
                                                        placeholder="Select unit"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.shopUnit || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.shopUnit", v)}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Pass No."
                                                        fieldType="passNumber"
                                                        placeholder="Enter Pass No."
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.shopPassNo || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.shopPassNo", v)}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <Label>Pass Issue Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.shopPassIssueDate ? new Date(vehiclePass.ownerInformation.ownerDetails.relativeDetails.shopPassIssueDate).toISOString().split('T')[0] : ""}
                                                            onChange={(e) => e.target.value && setField("ownerInformation.ownerDetails.relativeDetails.shopPassIssueDate", new Date(e.target.value).toISOString())}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label>Pass Expire Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.shopPassExpireDate ? new Date(vehiclePass.ownerInformation.ownerDetails.relativeDetails.shopPassExpireDate).toISOString().split('T')[0] : ""}
                                                            onChange={(e) => e.target.value && setField("ownerInformation.ownerDetails.relativeDetails.shopPassExpireDate", new Date(e.target.value).toISOString())}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {vehiclePass.ownerInformation.ownerDetails?.relativeCategory === "tempHiredWorker" && (
                                            <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                <h4 className="text-sm font-semibold text-gray-700">Relative (Temporary Hired Worker) Details</h4>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Name"
                                                            fieldType="ownerName"
                                                            placeholder="e.g. John Keeper"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.tempWorkerName || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.tempWorkerName", v)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Place of Stay"
                                                            fieldType="address"
                                                            placeholder="e.g. C/O 56 APO"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.tempWorkerPlaceOfStay || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.tempWorkerPlaceOfStay", v)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Place Of Work"
                                                            fieldType="address"
                                                            placeholder="e.g. C/O 56 APO"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.tempWorkerPlaceOfWork || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.tempWorkerPlaceOfWork", v)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <SuggestionInput
                                                            label="Type of Work"
                                                            fieldType="trade"
                                                            placeholder="e.g. John Shop"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.tempWorkerTypeOfWork || ""}
                                                            onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.tempWorkerTypeOfWork", v)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <SuggestionInput
                                                        label="Pass No."
                                                        fieldType="passNumber"
                                                        value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.tempWorkerPassNo || ""}
                                                        onChange={(v) => setField("ownerInformation.ownerDetails.relativeDetails.tempWorkerPassNo", v)}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <Label>Pass Issue Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.tempWorkerPassIssueDate ? new Date(vehiclePass.ownerInformation.ownerDetails.relativeDetails.tempWorkerPassIssueDate).toISOString().split('T')[0] : ""}
                                                            onChange={(e) => e.target.value && setField("ownerInformation.ownerDetails.relativeDetails.tempWorkerPassIssueDate", new Date(e.target.value).toISOString())}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label>Pass Expire Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={vehiclePass.ownerInformation.ownerDetails?.relativeDetails?.tempWorkerPassExpireDate ? new Date(vehiclePass.ownerInformation.ownerDetails.relativeDetails.tempWorkerPassExpireDate).toISOString().split('T')[0] : ""}
                                                            onChange={(e) => e.target.value && setField("ownerInformation.ownerDetails.relativeDetails.tempWorkerPassExpireDate", new Date(e.target.value).toISOString())}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Address"
                                fieldType="address"
                                placeholder="Location"
                                value={vehiclePass.ownerInformation.ownerDetails?.address || ""}
                                onChange={(v) => setField("ownerInformation.ownerDetails.address", v)}
                            />
                        </div>
                    </div>
                </section>

                {/* Vehicle Pass Details */}
                <section>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Vehicle Pass Details</h3>
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="space-y-2">
                            <Label>Pass Available?</Label>
                            <RadioGroup
                                className="flex space-x-4"
                                value={vehiclePass.vehiclePassDetails.isAvailable ? "yes" : "no"}
                                onValueChange={(v) => setField("vehiclePassDetails.isAvailable", v === "yes")}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="pass-yes" />
                                    <Label htmlFor="pass-yes" className="font-normal cursor-pointer">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="pass-no" />
                                    <Label htmlFor="pass-no" className="font-normal cursor-pointer">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-1">
                            <div className={cn(!vehiclePass.vehiclePassDetails.isAvailable && "text-gray-400")}>
                                <Label>Pass No. <span className="text-red-500 text-xs font-normal">Visible only if Yes</span></Label>
                                <SuggestionInput
                                    fieldType="passNumber"
                                    placeholder="Enter pass number"
                                    disabled={!vehiclePass.vehiclePassDetails.isAvailable}
                                    value={vehiclePass.vehiclePassDetails.passNumber || ""}
                                    onChange={(v) => setField("vehiclePassDetails.passNumber", v)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={cn("space-y-4 mt-4 transition-opacity", !vehiclePass.vehiclePassDetails.isAvailable && "opacity-50 pointer-events-none")}>
                        <div className="space-y-1">
                            <Label>Pass Issued Date</Label>
                            <Input
                                type="date"
                                placeholder="Enter Date"
                                value={vehiclePass.vehiclePassDetails.issuedDate ? new Date(vehiclePass.vehiclePassDetails.issuedDate).toISOString().split('T')[0] : ""}
                                onChange={(e) => e.target.value && setField("vehiclePassDetails.issuedDate", new Date(e.target.value).toISOString())}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Pass Valid Date From</Label>
                                <Input
                                    type="date"
                                    value={vehiclePass.vehiclePassDetails.validFrom ? new Date(vehiclePass.vehiclePassDetails.validFrom).toISOString().split('T')[0] : ""}
                                    onChange={(e) => e.target.value && setField("vehiclePassDetails.validFrom", new Date(e.target.value).toISOString())}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>To</Label>
                                <Input
                                    type="date"
                                    value={vehiclePass.vehiclePassDetails.validTo ? new Date(vehiclePass.vehiclePassDetails.validTo).toISOString().split('T')[0] : ""}
                                    onChange={(e) => e.target.value && setField("vehiclePassDetails.validTo", new Date(e.target.value).toISOString())}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Issuing Authority"
                                fieldType="issuingAuthority"
                                placeholder="Enter Authority Name"
                                value={vehiclePass.vehiclePassDetails.issuingAuthority || ""}
                                onChange={(v) => setField("vehiclePassDetails.issuingAuthority", v)}
                            />
                        </div>
                    </div>
                </section>

                {/* Add Remark */}
                <section>
                    <SuggestionInput
                        label="Add Remark"
                        fieldType="remark"
                        placeholder="Enter remark"
                        value={vehiclePass.remark || ""}
                        onChange={(v) => setField("remark", v)}
                    />
                </section>

                {/* Initials / Authentication */}
                <section>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Initials / Authentication</h3>
                    <div className="space-y-4">
                        <div className="space-y-1 relative">
                            <SuggestionInput
                                label="Initials of MPCR NCO"
                                fieldType="initialsMPCPNCO"
                                placeholder="Signature"
                                value={vehiclePass.authentication.initialsMPCPNCO || ""}
                                onChange={(v) => setField("authentication.initialsMPCPNCO", v)}
                            />
                            {/* Fake signature icon */}
                            <div className="absolute right-3 top-8 text-gray-400 z-10 pointer-events-none">✍️</div>
                        </div>
                        <div className="space-y-1 relative">
                            <SuggestionInput
                                label="Initials of SM/SJCO"
                                fieldType="initialsQMSJCO"
                                placeholder="Signature"
                                value={vehiclePass.authentication.initialsQMSJCO || ""}
                                onChange={(v) => setField("authentication.initialsQMSJCO", v)}
                            />
                            <div className="absolute right-3 top-8 text-gray-400 z-10 pointer-events-none">✍️</div>
                        </div>
                        <div className="space-y-1 relative">
                            <SuggestionInput
                                label="Initials of 2IC"
                                fieldType="initials2IC"
                                placeholder="Signature"
                                value={vehiclePass.authentication.initials2IC || ""}
                                onChange={(v) => setField("authentication.initials2IC", v)}
                            />
                            <div className="absolute right-3 top-8 text-gray-400 z-10 pointer-events-none">✍️</div>
                        </div>
                    </div>
                </section>

            </div>
            <div className="p-4 border-t flex justify-between gap-2 bg-gray-50">
                <Button variant="outline" onClick={onCancel} type="button" className="px-6">Cancel</Button>
                <Button type="button" onClick={handleSave} disabled={isPending} className="bg-[#0088FF] hover:bg-blue-700 px-6">
                    {isPending ? "Saving..." : (initialData ? "Update & Save" : "Save & Add Another")}
                </Button>
            </div>
        </div>
    );
};

export default VehiclesSecurityPassForm;
