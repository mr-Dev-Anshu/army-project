"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
        armyNo: "",
        rank: "",
        unit: "",
        fmn: "",
        command: "",
        address: "",
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
                                        value={vehiclePass.ownerInformation.armyNo || ""}
                                        onChange={(v) => setField("ownerInformation.armyNo", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Rank"
                                        fieldType="rank"
                                        placeholder="eg. Sepoy"
                                        value={vehiclePass.ownerInformation.rank || ""}
                                        onChange={(v) => setField("ownerInformation.rank", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Name (as per records)"
                                        fieldType="ownerName"
                                        placeholder="eg."
                                        value={vehiclePass.ownerInformation.name}
                                        onChange={(v) => setField("ownerInformation.name", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Unit"
                                        fieldType="unit"
                                        placeholder="eg."
                                        value={vehiclePass.ownerInformation.unit || ""}
                                        onChange={(v) => setField("ownerInformation.unit", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="FMN"
                                        fieldType="fmn"
                                        placeholder="eg."
                                        value={vehiclePass.ownerInformation.fmn || ""}
                                        onChange={(v) => setField("ownerInformation.fmn", v)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <SuggestionInput
                                        label="Command"
                                        fieldType="command"
                                        placeholder="eg."
                                        value={vehiclePass.ownerInformation.command || ""}
                                        onChange={(v) => setField("ownerInformation.command", v)}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Address"
                                fieldType="address"
                                placeholder="Location"
                                value={vehiclePass.ownerInformation.address}
                                onChange={(v) => setField("ownerInformation.address", v)}
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
