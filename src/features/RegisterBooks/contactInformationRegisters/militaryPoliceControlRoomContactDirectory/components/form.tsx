
"use client";

import React, { useState, useEffect } from "react";
import { X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { useCreateMilitaryPoliceControlRoomRegister, useUpdateMilitaryPoliceControlRoomRegister } from "../hooks";

interface MilitaryPoliceControlRoomContactFormProps {
    initialData?: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const MilitaryPoliceControlRoomContactForm = ({ initialData, onSuccess, onCancel }: MilitaryPoliceControlRoomContactFormProps) => {
    const createMutation = useCreateMilitaryPoliceControlRoomRegister();
    const updateMutation = useUpdateMilitaryPoliceControlRoomRegister();

    const [formData, setFormData] = useState({
        locationOfUnit: "",
        unitName: "",

        coRank: "",
        coName: "",
        coMobileNumber: "",
        coOfficeLandline: "",
        coResidencyTelephone: "",

        ic2Rank: "",
        ic2Name: "",
        ic2MobileNumber: "",
        ic2OfficeLandline: "",
        ic2ResidencyTelephone: "",

        mpcrEmailId: "",
        mpcrMobileNumber: "",
        mpcrArmyLandline: "",
        mpcrBsnlLandline: "",

        remark: "",
    });

    useEffect(() => {
        if (initialData) {
            const d = initialData.details || {};
            setFormData({
                locationOfUnit: d.locationOfUnit || "",
                unitName: d.unitName || "",

                coRank: d.coRank || "",
                coName: d.coName || "",
                coMobileNumber: d.coMobileNumber || "",
                coOfficeLandline: d.coOfficeLandline || "",
                coResidencyTelephone: d.coResidencyTelephone || "",

                ic2Rank: d.ic2Rank || "",
                ic2Name: d.ic2Name || "",
                ic2MobileNumber: d.ic2MobileNumber || "",
                ic2OfficeLandline: d.ic2OfficeLandline || "",
                ic2ResidencyTelephone: d.ic2ResidencyTelephone || "",

                mpcrEmailId: d.mpcrEmailId || "",
                mpcrMobileNumber: d.mpcrMobileNumber || "",
                mpcrArmyLandline: d.mpcrArmyLandline || "",
                mpcrBsnlLandline: d.mpcrBsnlLandline || "",

                remark: initialData.remark || "",
            });
        }
    }, [initialData]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            type: "contact_info_mp_control_room",
            details: {
                locationOfUnit: formData.locationOfUnit,
                unitName: formData.unitName,

                coRank: formData.coRank,
                coName: formData.coName,
                coMobileNumber: formData.coMobileNumber,
                coOfficeLandline: formData.coOfficeLandline,
                coResidencyTelephone: formData.coResidencyTelephone,

                ic2Rank: formData.ic2Rank,
                ic2Name: formData.ic2Name,
                ic2MobileNumber: formData.ic2MobileNumber,
                ic2OfficeLandline: formData.ic2OfficeLandline,
                ic2ResidencyTelephone: formData.ic2ResidencyTelephone,

                mpcrEmailId: formData.mpcrEmailId,
                mpcrMobileNumber: formData.mpcrMobileNumber,
                mpcrArmyLandline: formData.mpcrArmyLandline,
                mpcrBsnlLandline: formData.mpcrBsnlLandline,
            },
            remark: formData.remark,
        };

        try {
            if (initialData?._id) {
                await updateMutation.mutateAsync({ id: initialData._id, payload });
            } else {
                await createMutation.mutateAsync(payload);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    // Helper for SVG icon
    const PhoneIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.333 2.83301C14.3453 2.83301 15.1657 3.65379 15.166 4.66602V15.333C15.166 16.3455 14.3455 17.166 13.333 17.166H6.66602C5.65379 17.1657 4.83301 16.3453 4.83301 15.333V4.66602C4.83336 3.65401 5.65401 2.83336 6.66602 2.83301H13.333ZM6.66602 3.83301C6.20629 3.83336 5.83336 4.20629 5.83301 4.66602V15.333C5.83301 15.793 6.20608 16.1657 6.66602 16.166H13.333C13.7932 16.166 14.166 15.7932 14.166 15.333V4.66602C14.1657 4.20608 13.793 3.83301 13.333 3.83301H6.66602ZM10.0068 13.5C10.2829 13.5001 10.5068 13.7239 10.5068 14C10.5068 14.2761 10.2829 14.4999 10.0068 14.5H10C9.72386 14.5 9.5 14.2761 9.5 14C9.5 13.7239 9.72386 13.5 10 13.5H10.0068ZM2.00977 2.00977H2V2H2.00977V2.00977Z" fill="#737373" />
        </svg>
    );

    return (
        <div className="mx-auto w-full max-w-4xl bg-white font-inter">
            <div className="p-6 space-y-8">
                {/* Unit & Location Details */}
                <section className="space-y-4">
                    <h3 className="text-base font-bold text-neutral-900">
                        Unit & Location Details
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="locationOfUnit" className="text-sm font-medium text-neutral-700">
                            Location of Unit
                        </Label>
                        <SuggestionInput
                            id="locationOfUnit"
                            fieldType="unitLocation"
                            placeholder="e.g. Civil Lines Area, Bhopal – 462001"
                            value={formData.locationOfUnit}
                            onChange={(v) => handleChange("locationOfUnit", v)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="unitName" className="text-sm font-medium text-neutral-700">
                            Unit Name
                        </Label>
                        <SuggestionInput
                            id="unitName"
                            fieldType="unit"
                            placeholder="e.g. Provost Unit"
                            value={formData.unitName}
                            onChange={(v) => handleChange("unitName", v)}
                        />
                    </div>
                </section>

                {/* Commanding Officer (CO) Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-base font-bold text-neutral-900">
                        Commanding Officer (CO) Details
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="coRank" className="text-sm font-medium text-neutral-700">
                            Rank
                        </Label>
                        <SuggestionInput
                            id="coRank"
                            fieldType="rank"
                            placeholder="Col, Brig, Maj Gen"
                            value={formData.coRank}
                            onChange={(v) => handleChange("coRank", v)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="coName" className="text-sm font-medium text-neutral-700">
                                Name of CO
                            </Label>
                            <SuggestionInput
                                id="coName"
                                fieldType="officerName"
                                placeholder="e.g. Roger"
                                value={formData.coName}
                                onChange={(v) => handleChange("coName", v)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="coMobileNumber" className="text-sm font-medium text-neutral-700">
                                Mobile Number
                            </Label>
                            <SuggestionInput
                                id="coMobileNumber"
                                fieldType="mobileNumber"
                                placeholder="+91"
                                value={formData.coMobileNumber}
                                onChange={(v) => handleChange("coMobileNumber", v)}
                                icon={<PhoneIcon />}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="coOfficeLandline" className="text-sm font-medium text-neutral-700">
                                Office Landline Number
                            </Label>
                            <SuggestionInput
                                id="coOfficeLandline"
                                fieldType="landlineNumber"
                                placeholder="STD code allowed"
                                value={formData.coOfficeLandline}
                                onChange={(v) => handleChange("coOfficeLandline", v)}
                                icon={<PhoneIcon />}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="coResidencyTelephone" className="text-sm font-medium text-neutral-700">
                                Residency Telephone No.
                            </Label>
                            <SuggestionInput
                                id="coResidencyTelephone"
                                fieldType="landlineNumber"
                                placeholder="STD code allowed"
                                value={formData.coResidencyTelephone}
                                onChange={(v) => handleChange("coResidencyTelephone", v)}
                                icon={<PhoneIcon />}
                            />
                        </div>
                    </div>
                </section>

                {/* Second In Command (2IC) Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-base font-bold text-neutral-900">
                        Second In Command (2IC) Details
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="ic2Rank" className="text-sm font-medium text-neutral-700">
                            Rank
                        </Label>
                        <SuggestionInput
                            id="ic2Rank"
                            fieldType="rank"
                            placeholder="Lt Col, Col"
                            value={formData.ic2Rank}
                            onChange={(v) => handleChange("ic2Rank", v)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="ic2Name" className="text-sm font-medium text-neutral-700">
                                Name of 2IC
                            </Label>
                            <SuggestionInput
                                id="ic2Name"
                                fieldType="officerName"
                                placeholder="e.g. Roger"
                                value={formData.ic2Name}
                                onChange={(v) => handleChange("ic2Name", v)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="ic2MobileNumber" className="text-sm font-medium text-neutral-700">
                                Mobile Number
                            </Label>
                            <SuggestionInput
                                id="ic2MobileNumber"
                                fieldType="mobileNumber"
                                placeholder="+91"
                                value={formData.ic2MobileNumber}
                                onChange={(v) => handleChange("ic2MobileNumber", v)}
                                icon={<PhoneIcon />}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="ic2OfficeLandline" className="text-sm font-medium text-neutral-700">
                                Office Landline Number
                            </Label>
                            <SuggestionInput
                                id="ic2OfficeLandline"
                                fieldType="landlineNumber"
                                placeholder="STD code allowed"
                                value={formData.ic2OfficeLandline}
                                onChange={(v) => handleChange("ic2OfficeLandline", v)}
                                icon={<PhoneIcon />}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="ic2ResidencyTelephone" className="text-sm font-medium text-neutral-700">
                                Residency Telephone No.
                            </Label>
                            <SuggestionInput
                                id="ic2ResidencyTelephone"
                                fieldType="landlineNumber"
                                placeholder="STD code allowed"
                                value={formData.ic2ResidencyTelephone}
                                onChange={(v) => handleChange("ic2ResidencyTelephone", v)}
                                icon={<PhoneIcon />}
                            />
                        </div>
                    </div>
                </section>

                {/* Military Police Control Room (MPCR) Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-base font-bold text-neutral-900">
                        Military Police Control Room (MPCR) Details
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="mpcrEmailId" className="text-sm font-medium text-neutral-700">
                                Email Id
                            </Label>
                            <SuggestionInput
                                id="mpcrEmailId"
                                fieldType="email"
                                placeholder="e.g. xyzEmailID@gmail.com"
                                value={formData.mpcrEmailId}
                                onChange={(v) => handleChange("mpcrEmailId", v)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="mpcrMobileNumber" className="text-sm font-medium text-neutral-700">
                                Mobile Number
                            </Label>
                            <SuggestionInput
                                id="mpcrMobileNumber"
                                fieldType="mobileNumber"
                                placeholder="+91"
                                value={formData.mpcrMobileNumber}
                                onChange={(v) => handleChange("mpcrMobileNumber", v)}
                                icon={<PhoneIcon />}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="mpcrArmyLandline" className="text-sm font-medium text-neutral-700">
                                Army Landline No
                            </Label>
                            <SuggestionInput
                                id="mpcrArmyLandline"
                                fieldType="landlineNumber"
                                placeholder="0755-"
                                value={formData.mpcrArmyLandline}
                                onChange={(v) => handleChange("mpcrArmyLandline", v)}
                                icon={<PhoneIcon />}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="mpcrBsnlLandline" className="text-sm font-medium text-neutral-700">
                                BSNL Landline No.
                            </Label>
                            <SuggestionInput
                                id="mpcrBsnlLandline"
                                fieldType="landlineNumber"
                                placeholder="0755-"
                                value={formData.mpcrBsnlLandline}
                                onChange={(v) => handleChange("mpcrBsnlLandline", v)}
                                icon={<PhoneIcon />}
                            />
                        </div>
                    </div>
                </section>

                {/* Add Remark */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-base font-bold text-neutral-900">Add Remark</h3>
                    <div className="space-y-1.5">
                        <Textarea
                            id="remark"
                            placeholder="Enter remark"
                            className="resize-none min-h-[80px]"
                            value={formData.remark}
                            onChange={(e) => handleChange("remark", e.target.value)}
                        />
                    </div>
                </section>
            </div>

            {/* Footer */}
            <FormFooter
                onCancel={onCancel}
                onSave={handleSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
                saveLabel={initialData?._id ? "Update Entry" : "Save and Another"}
            />
        </div>
    );
};

export default MilitaryPoliceControlRoomContactForm;
