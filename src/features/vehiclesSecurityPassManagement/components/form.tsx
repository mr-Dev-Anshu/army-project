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


    const [errors, setErrors] = React.useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            dispatch({
                type: "SET_PATH",
                path: "formData.vehiclesSecurityPassManagement",
                value: {
                    ...INITIAL_VEHICLE_PASS_STATE,
                    ...initialData,
                    ownerInformation: {
                        ...INITIAL_VEHICLE_PASS_STATE.ownerInformation,
                        ...(initialData.ownerInformation || {}),
                        ownerType: initialData.ownerInformation?.ownerType || INITIAL_VEHICLE_PASS_STATE.ownerInformation.ownerType || "militaryPersonnel",
                    },
                    vehicleIdentification: {
                        ...INITIAL_VEHICLE_PASS_STATE.vehicleIdentification,
                        ...(initialData.vehicleIdentification || {}),
                    },
                    vehiclePassDetails: {
                        ...INITIAL_VEHICLE_PASS_STATE.vehiclePassDetails,
                        ...(initialData.vehiclePassDetails || {}),
                    },
                    authentication: {
                        ...INITIAL_VEHICLE_PASS_STATE.authentication,
                        ...(initialData.authentication || {}),
                    }
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
        setErrors({}); // Clear previous errors
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

            const payload = JSON.parse(JSON.stringify(vehiclePass)); // Deep copy to avoid mutating state
            // Logic to clean up relative details if not civilian
            const ownerInfo = payload.ownerInformation;
            if (ownerInfo?.ownerType !== "civilian" && ownerInfo?.ownerDetails) {
                delete ownerInfo.ownerDetails.isDependent;
                delete ownerInfo.ownerDetails.relationName;
                delete ownerInfo.ownerDetails.relativeCategory;
                delete ownerInfo.ownerDetails.relativeDetails;
            }

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

            if (msg.includes("E11000 duplicate key error") && msg.includes("vehicleIdentification.registrationNumber")) {
                setErrors((prev) => ({ ...prev, registrationNumber: "Registration Number already exists" }));
                toast.error("Duplicate Registration Number");
            } else {
                toast.error(msg);
            }
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
                                error={errors.registrationNumber}
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
                                value={vehiclePass.ownerInformation.ownerType}
                                onValueChange={(v) => setField("ownerInformation.ownerType", v)}
                                className="grid grid-cols-3 gap-3"
                            >
                                {[
                                    { id: "militaryPersonnel", label: "Military Personnel" },
                                    { id: "employee", label: "Employee" },
                                    { id: "civilian", label: "Civilian" },
                                    { id: "servantMaid", label: "Servant / Maid" },
                                    { id: "shopKeeper", label: "Shop Keeper" },
                                    { id: "tempHiredWorker", label: "Temporary Hired Worker" },
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
                                        placeholder="eg. "
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
                                        placeholder="e.g. Naman"
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
                                className="flex gap-4"
                                value={vehiclePass.vehiclePassDetails.isAvailable ? "yes" : "no"}
                                onValueChange={(v) => setField("vehiclePassDetails.isAvailable", v === "yes")}
                            >
                                <label
                                    className={cn(
                                        "flex flex-1 items-center space-x-3 rounded-lg border px-4 py-2 cursor-pointer transition-colors",
                                        vehiclePass.vehiclePassDetails.isAvailable
                                            ? "border-blue-500 bg-white"
                                            : "border-gray-200 hover:bg-gray-50"
                                    )}
                                >
                                    <RadioGroupItem value="yes" id="pass-yes" />
                                    <span className="text-sm font-medium">Yes</span>
                                </label>
                                <label
                                    className={cn(
                                        "flex flex-1 items-center space-x-3 rounded-lg border px-4 py-2 cursor-pointer transition-colors",
                                        !vehiclePass.vehiclePassDetails.isAvailable
                                            ? "border-gray-200 bg-white" // Standard style for "No" or selected style if desired
                                            : "border-gray-200 hover:bg-gray-50"
                                    )}
                                >
                                    <RadioGroupItem value="no" id="pass-no" />
                                    <span className="text-sm font-medium">No</span>
                                </label>
                            </RadioGroup>
                        </div>
                        {vehiclePass.vehiclePassDetails.isAvailable && (
                            <div className="space-y-1">
                                <Label>Pass No.</Label>
                                <SuggestionInput
                                    fieldType="passNumber"
                                    placeholder="Enter pass number"
                                    value={vehiclePass.vehiclePassDetails.passNumber || ""}
                                    onChange={(v) => setField("vehiclePassDetails.passNumber", v)}
                                />
                            </div>
                        )}
                    </div>

                    {vehiclePass.vehiclePassDetails.isAvailable && (
                        <div className="space-y-4 mt-4">
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
                    )}
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
                            <div className="absolute right-3 top-8 text-gray-400 z-10 pointer-events-none"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 15.5C16.2761 15.5 16.5 15.7239 16.5 16C16.5 16.2761 16.2761 16.5 16 16.5H4C3.72386 16.5 3.5 16.2761 3.5 16C3.5 15.7239 3.72386 15.5 4 15.5H16ZM10.5928 2.87207C10.9385 2.80607 11.2952 2.82593 11.6318 2.92871C11.9685 3.03153 12.2755 3.21498 12.5254 3.46289C12.7751 3.71076 12.961 4.01587 13.0664 4.35156C13.1718 4.68736 13.1941 5.0444 13.1309 5.39062C13.0675 5.73671 12.9204 6.06216 12.7031 6.33887C12.4857 6.61568 12.2042 6.83596 11.8828 6.97949C11.6307 7.09207 11.3343 6.97871 11.2217 6.72656C11.1092 6.47455 11.2227 6.17908 11.4746 6.06641C11.6477 5.98913 11.7999 5.8707 11.917 5.72168C12.034 5.57263 12.1124 5.39639 12.1465 5.20996C12.1804 5.02374 12.169 4.83198 12.1123 4.65137C12.0556 4.47075 11.9556 4.30625 11.8213 4.17285C11.6867 4.03938 11.5211 3.94012 11.3398 3.88477C11.1586 3.82944 10.9664 3.81896 10.7803 3.85449C10.5942 3.89003 10.4196 3.9707 10.2715 4.08887C10.1235 4.20702 10.0066 4.35971 9.93066 4.5332C9.87134 4.66904 9.80282 4.90625 9.72559 5.25098C9.65021 5.58744 9.57276 5.99388 9.4873 6.45117C9.3177 7.3588 9.11883 8.45591 8.85156 9.50781C8.81991 9.63238 8.7859 9.75675 8.75195 9.88086C9.13618 9.98267 9.49717 10.1032 9.82617 10.2461C10.924 10.7229 11.8329 11.5115 11.833 12.667C11.8331 12.7109 11.8509 12.7531 11.8818 12.7842C11.9131 12.8154 11.9558 12.833 12 12.833H13.333C13.3772 12.833 13.4199 12.8154 13.4512 12.7842C13.4822 12.7531 13.4999 12.7109 13.5 12.667V12.333C13.4994 12.1713 13.5459 12.0128 13.6338 11.877L13.707 11.7793C13.7874 11.6878 13.8875 11.6145 14 11.5654C14.1127 11.5163 14.2346 11.4937 14.3564 11.4971L14.4775 11.5088L14.5957 11.5391C14.7039 11.575 14.8033 11.6335 14.8887 11.71H14.8896L16.3271 12.9551C16.5357 13.1358 16.5584 13.4514 16.3779 13.6602C16.1971 13.8688 15.8816 13.8917 15.6729 13.7109L14.498 12.6934C14.4911 12.993 14.3706 13.2788 14.1582 13.4912C13.9394 13.71 13.6424 13.833 13.333 13.833H12C11.6906 13.833 11.3936 13.71 11.1748 13.4912C10.9563 13.2726 10.8331 12.9761 10.833 12.667C10.8329 12.126 10.4116 11.5904 9.42773 11.1631C9.13742 11.037 8.81129 10.9297 8.45801 10.8379C8.26315 11.4058 8.03765 11.9395 7.76758 12.3906C7.29792 13.175 6.62269 13.8329 5.66699 13.833C5.09236 13.833 4.54109 13.6046 4.13477 13.1982C3.72865 12.792 3.50013 12.2414 3.5 11.667C3.50004 11.0924 3.72852 10.5411 4.13477 10.1348C4.54109 9.72848 5.09239 9.5 5.66699 9.5H5.66992C6.39354 9.50481 7.10453 9.56357 7.77148 9.67285C7.80892 9.53771 7.84653 9.40066 7.88184 9.26172C8.13954 8.24746 8.33342 7.18518 8.50488 6.26758C8.58992 5.81252 8.67014 5.38874 8.75 5.03223C8.82797 4.68424 8.91258 4.36429 9.01367 4.13281C9.15464 3.81035 9.37243 3.5272 9.64746 3.30762C9.92257 3.08802 10.247 2.93809 10.5928 2.87207ZM5.66504 10.5C5.35624 10.5004 5.0602 10.6234 4.8418 10.8418C4.62309 11.0605 4.50004 11.3577 4.5 11.667C4.50013 11.9762 4.62322 12.2725 4.8418 12.4912C5.06059 12.71 5.35757 12.833 5.66699 12.833C6.09521 12.8329 6.50723 12.55 6.91016 11.877C7.11861 11.5287 7.30295 11.1072 7.46973 10.6387C6.9041 10.5536 6.2956 10.5043 5.66504 10.5ZM2.00977 2.00977H2V2H2.00977V2.00977Z" fill="#737373" />
                            </svg>
                            </div>
                        </div>
                        <div className="space-y-1 relative">
                            <SuggestionInput
                                label="Initials of SM/SJCO"
                                fieldType="initialsQMSJCO"
                                placeholder="Signature"
                                value={vehiclePass.authentication.initialsQMSJCO || ""}
                                onChange={(v) => setField("authentication.initialsQMSJCO", v)}
                            />
                            <div className="absolute right-3 top-8 text-gray-400 z-10 pointer-events-none"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 15.5C16.2761 15.5 16.5 15.7239 16.5 16C16.5 16.2761 16.2761 16.5 16 16.5H4C3.72386 16.5 3.5 16.2761 3.5 16C3.5 15.7239 3.72386 15.5 4 15.5H16ZM10.5928 2.87207C10.9385 2.80607 11.2952 2.82593 11.6318 2.92871C11.9685 3.03153 12.2755 3.21498 12.5254 3.46289C12.7751 3.71076 12.961 4.01587 13.0664 4.35156C13.1718 4.68736 13.1941 5.0444 13.1309 5.39062C13.0675 5.73671 12.9204 6.06216 12.7031 6.33887C12.4857 6.61568 12.2042 6.83596 11.8828 6.97949C11.6307 7.09207 11.3343 6.97871 11.2217 6.72656C11.1092 6.47455 11.2227 6.17908 11.4746 6.06641C11.6477 5.98913 11.7999 5.8707 11.917 5.72168C12.034 5.57263 12.1124 5.39639 12.1465 5.20996C12.1804 5.02374 12.169 4.83198 12.1123 4.65137C12.0556 4.47075 11.9556 4.30625 11.8213 4.17285C11.6867 4.03938 11.5211 3.94012 11.3398 3.88477C11.1586 3.82944 10.9664 3.81896 10.7803 3.85449C10.5942 3.89003 10.4196 3.9707 10.2715 4.08887C10.1235 4.20702 10.0066 4.35971 9.93066 4.5332C9.87134 4.66904 9.80282 4.90625 9.72559 5.25098C9.65021 5.58744 9.57276 5.99388 9.4873 6.45117C9.3177 7.3588 9.11883 8.45591 8.85156 9.50781C8.81991 9.63238 8.7859 9.75675 8.75195 9.88086C9.13618 9.98267 9.49717 10.1032 9.82617 10.2461C10.924 10.7229 11.8329 11.5115 11.833 12.667C11.8331 12.7109 11.8509 12.7531 11.8818 12.7842C11.9131 12.8154 11.9558 12.833 12 12.833H13.333C13.3772 12.833 13.4199 12.8154 13.4512 12.7842C13.4822 12.7531 13.4999 12.7109 13.5 12.667V12.333C13.4994 12.1713 13.5459 12.0128 13.6338 11.877L13.707 11.7793C13.7874 11.6878 13.8875 11.6145 14 11.5654C14.1127 11.5163 14.2346 11.4937 14.3564 11.4971L14.4775 11.5088L14.5957 11.5391C14.7039 11.575 14.8033 11.6335 14.8887 11.71H14.8896L16.3271 12.9551C16.5357 13.1358 16.5584 13.4514 16.3779 13.6602C16.1971 13.8688 15.8816 13.8917 15.6729 13.7109L14.498 12.6934C14.4911 12.993 14.3706 13.2788 14.1582 13.4912C13.9394 13.71 13.6424 13.833 13.333 13.833H12C11.6906 13.833 11.3936 13.71 11.1748 13.4912C10.9563 13.2726 10.8331 12.9761 10.833 12.667C10.8329 12.126 10.4116 11.5904 9.42773 11.1631C9.13742 11.037 8.81129 10.9297 8.45801 10.8379C8.26315 11.4058 8.03765 11.9395 7.76758 12.3906C7.29792 13.175 6.62269 13.8329 5.66699 13.833C5.09236 13.833 4.54109 13.6046 4.13477 13.1982C3.72865 12.792 3.50013 12.2414 3.5 11.667C3.50004 11.0924 3.72852 10.5411 4.13477 10.1348C4.54109 9.72848 5.09239 9.5 5.66699 9.5H5.66992C6.39354 9.50481 7.10453 9.56357 7.77148 9.67285C7.80892 9.53771 7.84653 9.40066 7.88184 9.26172C8.13954 8.24746 8.33342 7.18518 8.50488 6.26758C8.58992 5.81252 8.67014 5.38874 8.75 5.03223C8.82797 4.68424 8.91258 4.36429 9.01367 4.13281C9.15464 3.81035 9.37243 3.5272 9.64746 3.30762C9.92257 3.08802 10.247 2.93809 10.5928 2.87207ZM5.66504 10.5C5.35624 10.5004 5.0602 10.6234 4.8418 10.8418C4.62309 11.0605 4.50004 11.3577 4.5 11.667C4.50013 11.9762 4.62322 12.2725 4.8418 12.4912C5.06059 12.71 5.35757 12.833 5.66699 12.833C6.09521 12.8329 6.50723 12.55 6.91016 11.877C7.11861 11.5287 7.30295 11.1072 7.46973 10.6387C6.9041 10.5536 6.2956 10.5043 5.66504 10.5ZM2.00977 2.00977H2V2H2.00977V2.00977Z" fill="#737373" />
                            </svg>
                            </div>
                        </div>
                        <div className="space-y-1 relative">
                            <SuggestionInput
                                label="Initials of 2IC"
                                fieldType="initials2IC"
                                placeholder="Signature"
                                value={vehiclePass.authentication.initials2IC || ""}
                                onChange={(v) => setField("authentication.initials2IC", v)}
                            />
                            <div className="absolute right-3 top-8 text-gray-400 z-10 pointer-events-none"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 15.5C16.2761 15.5 16.5 15.7239 16.5 16C16.5 16.2761 16.2761 16.5 16 16.5H4C3.72386 16.5 3.5 16.2761 3.5 16C3.5 15.7239 3.72386 15.5 4 15.5H16ZM10.5928 2.87207C10.9385 2.80607 11.2952 2.82593 11.6318 2.92871C11.9685 3.03153 12.2755 3.21498 12.5254 3.46289C12.7751 3.71076 12.961 4.01587 13.0664 4.35156C13.1718 4.68736 13.1941 5.0444 13.1309 5.39062C13.0675 5.73671 12.9204 6.06216 12.7031 6.33887C12.4857 6.61568 12.2042 6.83596 11.8828 6.97949C11.6307 7.09207 11.3343 6.97871 11.2217 6.72656C11.1092 6.47455 11.2227 6.17908 11.4746 6.06641C11.6477 5.98913 11.7999 5.8707 11.917 5.72168C12.034 5.57263 12.1124 5.39639 12.1465 5.20996C12.1804 5.02374 12.169 4.83198 12.1123 4.65137C12.0556 4.47075 11.9556 4.30625 11.8213 4.17285C11.6867 4.03938 11.5211 3.94012 11.3398 3.88477C11.1586 3.82944 10.9664 3.81896 10.7803 3.85449C10.5942 3.89003 10.4196 3.9707 10.2715 4.08887C10.1235 4.20702 10.0066 4.35971 9.93066 4.5332C9.87134 4.66904 9.80282 4.90625 9.72559 5.25098C9.65021 5.58744 9.57276 5.99388 9.4873 6.45117C9.3177 7.3588 9.11883 8.45591 8.85156 9.50781C8.81991 9.63238 8.7859 9.75675 8.75195 9.88086C9.13618 9.98267 9.49717 10.1032 9.82617 10.2461C10.924 10.7229 11.8329 11.5115 11.833 12.667C11.8331 12.7109 11.8509 12.7531 11.8818 12.7842C11.9131 12.8154 11.9558 12.833 12 12.833H13.333C13.3772 12.833 13.4199 12.8154 13.4512 12.7842C13.4822 12.7531 13.4999 12.7109 13.5 12.667V12.333C13.4994 12.1713 13.5459 12.0128 13.6338 11.877L13.707 11.7793C13.7874 11.6878 13.8875 11.6145 14 11.5654C14.1127 11.5163 14.2346 11.4937 14.3564 11.4971L14.4775 11.5088L14.5957 11.5391C14.7039 11.575 14.8033 11.6335 14.8887 11.71H14.8896L16.3271 12.9551C16.5357 13.1358 16.5584 13.4514 16.3779 13.6602C16.1971 13.8688 15.8816 13.8917 15.6729 13.7109L14.498 12.6934C14.4911 12.993 14.3706 13.2788 14.1582 13.4912C13.9394 13.71 13.6424 13.833 13.333 13.833H12C11.6906 13.833 11.3936 13.71 11.1748 13.4912C10.9563 13.2726 10.8331 12.9761 10.833 12.667C10.8329 12.126 10.4116 11.5904 9.42773 11.1631C9.13742 11.037 8.81129 10.9297 8.45801 10.8379C8.26315 11.4058 8.03765 11.9395 7.76758 12.3906C7.29792 13.175 6.62269 13.8329 5.66699 13.833C5.09236 13.833 4.54109 13.6046 4.13477 13.1982C3.72865 12.792 3.50013 12.2414 3.5 11.667C3.50004 11.0924 3.72852 10.5411 4.13477 10.1348C4.54109 9.72848 5.09239 9.5 5.66699 9.5H5.66992C6.39354 9.50481 7.10453 9.56357 7.77148 9.67285C7.80892 9.53771 7.84653 9.40066 7.88184 9.26172C8.13954 8.24746 8.33342 7.18518 8.50488 6.26758C8.58992 5.81252 8.67014 5.38874 8.75 5.03223C8.82797 4.68424 8.91258 4.36429 9.01367 4.13281C9.15464 3.81035 9.37243 3.5272 9.64746 3.30762C9.92257 3.08802 10.247 2.93809 10.5928 2.87207ZM5.66504 10.5C5.35624 10.5004 5.0602 10.6234 4.8418 10.8418C4.62309 11.0605 4.50004 11.3577 4.5 11.667C4.50013 11.9762 4.62322 12.2725 4.8418 12.4912C5.06059 12.71 5.35757 12.833 5.66699 12.833C6.09521 12.8329 6.50723 12.55 6.91016 11.877C7.11861 11.5287 7.30295 11.1072 7.46973 10.6387C6.9041 10.5536 6.2956 10.5043 5.66504 10.5ZM2.00977 2.00977H2V2H2.00977V2.00977Z" fill="#737373" />
                            </svg>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            <div className="p-6 border-t flex justify-between gap-2 bg-white sticky bottom-0 z-10 w-full rounded-b-xl border-gray-200">
                <Button variant="outline" onClick={onCancel} type="button" className="px-6 h-10 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">Cancel</Button>
                <Button type="button" onClick={handleSave} disabled={isPending} className="bg-[#0088FF] hover:bg-[#0069D9] px-6 h-10 rounded-lg text-white font-medium shadow-sm transition-colors">
                    {isPending ? "Saving..." : (initialData ? "Update & Save" : "Save & Add Another")}
                </Button>
            </div>
        </div >
    );
};

export default VehiclesSecurityPassForm;
