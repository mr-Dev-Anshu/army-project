
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { useCreateContactInfoCivilPoliceRegister, useUpdateContactInfoCivilPoliceRegister } from "../hooks";
import { toast } from "react-toastify";

interface ContactInfoCivilPoliceStationFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const ContactInfoCivilPoliceStationForm = ({ initialData, onSuccess, onCancel }: ContactInfoCivilPoliceStationFormProps) => {
    const createMutation = useCreateContactInfoCivilPoliceRegister();
    const updateMutation = useUpdateContactInfoCivilPoliceRegister();

    const [formData, setFormData] = useState({
        policeStationName: "",
        rankOfStation: "",
        shoName: "",
        addressOfStation: "",
        landmark: "",
        pincode: "",
        district: "",
        state: "",
        officeLandlineNumber: "",
        mobileNumber: "",
        stationEmailId: "",
        faxNumber: "",
        remark: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                policeStationName: initialData.details?.policeStationName || "",
                rankOfStation: initialData.details?.rankOfStation || "",
                shoName: initialData.details?.shoName || "",
                addressOfStation: initialData.details?.addressOfStation || "",
                landmark: initialData.details?.landmark || "",
                pincode: initialData.details?.pincode || "",
                district: initialData.details?.district || "",
                state: initialData.details?.state || "",
                officeLandlineNumber: initialData.details?.officeLandlineNumber || "",
                mobileNumber: initialData.details?.mobileNumber || "",
                stationEmailId: initialData.details?.stationEmailId || "",
                faxNumber: initialData.details?.faxNumber || "",
                remark: initialData.remark || "",
            });
        }
    }, [initialData]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.policeStationName) {
            toast.error("Police Station Name is required");
            return;
        }

        const payload = {
            type: "contact_info_civil_police",
            details: {
                policeStationName: formData.policeStationName,
                rankOfStation: formData.rankOfStation,
                shoName: formData.shoName,
                addressOfStation: formData.addressOfStation,
                landmark: formData.landmark,
                pincode: formData.pincode,
                district: formData.district,
                state: formData.state,
                officeLandlineNumber: formData.officeLandlineNumber,
                mobileNumber: formData.mobileNumber,
                stationEmailId: formData.stationEmailId,
                faxNumber: formData.faxNumber,
            },
            remark: formData.remark,
        };

        try {
            if (initialData?._id) {
                await updateMutation.mutateAsync({ id: initialData._id, payload });
            } else {
                await createMutation.mutateAsync(payload);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save:", error);
            // Error toast handled by hook
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl bg-white font-inter">
            {/* Header not needed inside sheet logic usually, checking previous patterns */}
            {/* The previous form snippet had a header with X button inside correct container styling. 
                If this is used in a Sheet, the Sheet provides header.
                However, if user uses it standalone, it needs header.
                In Page.tsx (later) I'll use RightSideSheet.
                So I can omit the header here or make it conditional.
                I'll stick to the pattern used in ContactInfoArmy. 
                Army form omitted header comment.
            */}

            <div className="p-6 space-y-8">
                {/* Police Station Details */}
                <section className="space-y-4">
                    <h3 className="text-base font-bold text-neutral-900">
                        Police Station Details
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="policeStationName" className="text-sm font-medium text-neutral-700">
                            Police Station Name
                        </Label>
                        <SuggestionInput
                            id="policeStationName"
                            fieldType="policeStation"
                            placeholder="Enter Name of Station"
                            value={formData.policeStationName}
                            onChange={(val) => handleChange("policeStationName", val)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="rankOfStation" className="text-sm font-medium text-neutral-700">
                            Rank of Station
                        </Label>
                        <SuggestionInput
                            id="rankOfStation"
                            fieldType="rankOfStation"
                            placeholder="District HQ / Sub-Division HQ / Cantt / Local."
                            value={formData.rankOfStation}
                            onChange={(val) => handleChange("rankOfStation", val)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="shoName" className="text-sm font-medium text-neutral-700">
                            Head of Station (SHO) Name
                        </Label>
                        <SuggestionInput
                            id="shoName"
                            fieldType="shoName"
                            placeholder="SHO Name"
                            value={formData.shoName}
                            onChange={(val) => handleChange("shoName", val)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="addressOfStation" className="text-sm font-medium text-neutral-700">
                            Address of Station
                        </Label>
                        <SuggestionInput
                            id="addressOfStation"
                            fieldType="address"
                            placeholder="2–3 lines"
                            value={formData.addressOfStation}
                            onChange={(val) => handleChange("addressOfStation", val)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="landmark" className="text-sm font-medium text-neutral-700">
                                Landmark
                            </Label>
                            <SuggestionInput
                                id="landmark"
                                fieldType="landmark"
                                placeholder="Optional"
                                value={formData.landmark}
                                onChange={(val) => handleChange("landmark", val)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="pincode" className="text-sm font-medium text-neutral-700">
                                Pincode
                            </Label>
                            <Input
                                id="pincode"
                                placeholder="6-digit validation"
                                value={formData.pincode}
                                onChange={(e) => handleChange("pincode", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="district" className="text-sm font-medium text-neutral-700">
                                District
                            </Label>
                            <SuggestionInput
                                id="district"
                                fieldType="district"
                                placeholder="District Name"
                                value={formData.district}
                                onChange={(val) => handleChange("district", val)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="state" className="text-sm font-medium text-neutral-700">
                                State
                            </Label>
                            <SuggestionInput
                                id="state"
                                fieldType="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={(val) => handleChange("state", val)}
                            />
                        </div>
                    </div>
                </section>

                {/* Official Contact */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-base font-bold text-neutral-900">
                        Official Contact
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="officeLandlineNumber" className="text-sm font-medium text-neutral-700">
                                Office Landline Number
                            </Label>
                            <SuggestionInput
                                id="officeLandlineNumber"
                                fieldType="landlineNumber"
                                placeholder="STD code allowed"
                                value={formData.officeLandlineNumber}
                                onChange={(val) => handleChange("officeLandlineNumber", val)}
                                icon={
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.333 2.83301C14.3453 2.83301 15.1657 3.65379 15.166 4.66602V15.333C15.166 16.3455 14.3455 17.166 13.333 17.166H6.66602C5.65379 17.1657 4.83301 16.3453 4.83301 15.333V4.66602C4.83336 3.65401 5.65401 2.83336 6.66602 2.83301H13.333ZM6.66602 3.83301C6.20629 3.83336 5.83336 4.20629 5.83301 4.66602V15.333C5.83301 15.793 6.20608 16.1657 6.66602 16.166H13.333C13.7932 16.166 14.166 15.7932 14.166 15.333V4.66602C14.1657 4.20608 13.793 3.83301 13.333 3.83301H6.66602ZM10.0068 13.5C10.2829 13.5001 10.5068 13.7239 10.5068 14C10.5068 14.2761 10.2829 14.4999 10.0068 14.5H10C9.72386 14.5 9.5 14.2761 9.5 14C9.5 13.7239 9.72386 13.5 10 13.5H10.0068ZM2.00977 2.00977H2V2H2.00977V2.00977Z" fill="#737373" />
                                    </svg>
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="mobileNumber" className="text-sm font-medium text-neutral-700">
                                Mobile Number
                            </Label>
                            <SuggestionInput
                                id="mobileNumber"
                                fieldType="mobileNumber"
                                placeholder="+91"
                                value={formData.mobileNumber}
                                onChange={(val) => handleChange("mobileNumber", val)}
                                icon={
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.333 2.83301C14.3453 2.83301 15.1657 3.65379 15.166 4.66602V15.333C15.166 16.3455 14.3455 17.166 13.333 17.166H6.66602C5.65379 17.1657 4.83301 16.3453 4.83301 15.333V4.66602C4.83336 3.65401 5.65401 2.83336 6.66602 2.83301H13.333ZM6.66602 3.83301C6.20629 3.83336 5.83336 4.20629 5.83301 4.66602V15.333C5.83301 15.793 6.20608 16.1657 6.66602 16.166H13.333C13.7932 16.166 14.166 15.7932 14.166 15.333V4.66602C14.1657 4.20608 13.793 3.83301 13.333 3.83301H6.66602ZM10.0068 13.5C10.2829 13.5001 10.5068 13.7239 10.5068 14C10.5068 14.2761 10.2829 14.4999 10.0068 14.5H10C9.72386 14.5 9.5 14.2761 9.5 14C9.5 13.7239 9.72386 13.5 10 13.5H10.0068ZM2.00977 2.00977H2V2H2.00977V2.00977Z" fill="#737373" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="stationEmailId" className="text-sm font-medium text-neutral-700">
                            Station Email ID
                        </Label>
                        <SuggestionInput
                            id="stationEmailId"
                            fieldType="email"
                            placeholder="Emailid@gmail.com"
                            value={formData.stationEmailId}
                            onChange={(val) => handleChange("stationEmailId", val)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="faxNumber" className="text-sm font-medium text-neutral-700">
                            Fax Number (Optional)
                        </Label>
                        <SuggestionInput
                            id="faxNumber"
                            fieldType="landlineNumber"
                            placeholder="eg. 0172-2601235"
                            value={formData.faxNumber}
                            onChange={(val) => handleChange("faxNumber", val)}
                        />
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

export default ContactInfoCivilPoliceStationForm;
