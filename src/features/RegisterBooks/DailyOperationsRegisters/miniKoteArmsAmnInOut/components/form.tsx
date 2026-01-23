"use client";

import React, { useState, useEffect } from "react";
import { Pen, X } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useCreateMiniKoteArmsAmnInOutRegister, useUpdateMiniKoteArmsAmnInOutRegister } from "../hooks";

interface MiniKoteArmsAmnInOutFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const MiniKoteArmsAmnInOutForm = ({ initialData, onSuccess, onCancel }: MiniKoteArmsAmnInOutFormProps) => {
    const createMutation = useCreateMiniKoteArmsAmnInOutRegister();
    const updateMutation = useUpdateMiniKoteArmsAmnInOutRegister();

    const [individual, setIndividual] = useState<IndividualData>({
        armyNo: "",
        rank: "",
        name: "",
    });

    const [formData, setFormData] = useState({
        typeOfArms: "",
        buttNo: "",
        registrationNo: "",
        typeOfDuty: "",
        typeOfAmn: "",
        quantityOfAmn: "",
        armsOutTime: "",
        outSignature: "",
        armsInTime: "",
        inSignature: "",
    });

    const [remark, setRemark] = useState("");

    const [authData, setAuthData] = useState({
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                typeOfArms: initialData.details?.typeOfArms || "",
                buttNo: initialData.details?.buttNo || "",
                registrationNo: initialData.details?.registrationNo || "",
                typeOfDuty: initialData.details?.typeOfDuty || "",
                typeOfAmn: initialData.details?.typeOfAmn || "",
                quantityOfAmn: initialData.details?.quantityOfAmn || "",
                armsOutTime: initialData.details?.armsOutTime || "",
                outSignature: initialData.details?.outSignature?.value || "",
                armsInTime: initialData.details?.armsInTime || "",
                inSignature: initialData.details?.inSignature?.value || "",
            });
            setRemark(initialData.remark || "");

            if (initialData.details?.individual) {
                setIndividual(initialData.details.individual);
            }

            if (initialData.authentication) {
                setAuthData(initialData.authentication);
            }
        }
    }, [initialData]);

    const handleFieldChange = (field: keyof IndividualData, value: string) => {
        setIndividual((prev) => ({ ...prev, [field]: value }));
    };

    const handleFormChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAuthChange = (field: string, value: string) => {
        setAuthData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Validation
        const requiredFields = [
            { field: individual.armyNo, message: "Army Number is required" },
            { field: formData.armsOutTime, message: "OUT Time is required" },
        ];

        for (const { field, message } of requiredFields) {
            if (!field) {
                toast.error(message);
                return;
            }
        }

        const payload = {
            type: "arms_amn",
            date: new Date().toISOString(),
            details: {
                ...formData,
                individual,
                outSignature: { type: "text", value: formData.outSignature },
                inSignature: { type: "text", value: formData.inSignature },
            },
            remark,
            authentication: authData
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
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl bg-white font-inter">
            <div className="p-6 space-y-8">
                {/* Individual Details Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Individual Details
                    </h3>
                    <IndividualInputFields
                        data={individual}
                        onChange={handleFieldChange}
                    />
                </section>

                {/* Arms Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Arms Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <SuggestionInput
                                label="Type of Arms"
                                fieldType="typeOfArms"
                                placeholder="eg. Rifles"
                                value={formData.typeOfArms}
                                onChange={(val) => handleFormChange("typeOfArms", val)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <SuggestionInput
                                label="BUTT No."
                                fieldType="buttNo"
                                placeholder="eg. AK-12"
                                value={formData.buttNo}
                                onChange={(val) => handleFormChange("buttNo", val)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <SuggestionInput
                                label="Registration No."
                                fieldType="registrationNo"
                                placeholder="Value"
                                value={formData.registrationNo}
                                onChange={(val) => handleFormChange("registrationNo", val)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <SuggestionInput
                                label="Type of Duty"
                                fieldType="natureOfDuty"
                                placeholder="Value"
                                value={formData.typeOfDuty}
                                onChange={(val) => handleFormChange("typeOfDuty", val)}
                            />
                        </div>
                    </div>
                </section>

                {/* AMN Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">AMN Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <SuggestionInput
                                label="Type of AMN"
                                fieldType="typeOfAmn"
                                placeholder="eg. Small Arms Ammunition"
                                value={formData.typeOfAmn}
                                onChange={(val) => handleFormChange("typeOfAmn", val)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="quantityOfAmn" className="text-xs font-medium text-neutral-700">
                                Quantity of AMN
                            </Label>
                            <Input
                                id="quantityOfAmn"
                                placeholder="eg. 15"
                                value={formData.quantityOfAmn}
                                onChange={(e) => handleFormChange("quantityOfAmn", e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Arms / AMN OUT Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Arms / AMN OUT Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="armsOutTime" className="text-xs font-medium text-neutral-700">
                                OUT Time
                            </Label>
                            <Input
                                id="armsOutTime"
                                type="time"
                                className="block w-full"
                                value={formData.armsOutTime}
                                onChange={(e) => handleFormChange("armsOutTime", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5 relative">
                            <SuggestionInput
                                label="OUT Signature"
                                fieldType="signature"
                                placeholder="Text / Digital"
                                value={formData.outSignature}
                                onChange={(val) => handleFormChange("outSignature", val)}
                            />
                            <div className="absolute right-3 top-7 h-4 w-4 text-neutral-400" >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 15.5C16.2761 15.5 16.5 15.7239 16.5 16C16.5 16.2761 16.2761 16.5 16 16.5H4C3.72386 16.5 3.5 16.2761 3.5 16C3.5 15.7239 3.72386 15.5 4 15.5H16ZM10.5928 2.87207C10.9385 2.80607 11.2952 2.82593 11.6318 2.92871C11.9685 3.03153 12.2755 3.21498 12.5254 3.46289C12.7751 3.71076 12.961 4.01587 13.0664 4.35156C13.1718 4.68736 13.1941 5.0444 13.1309 5.39062C13.0675 5.73671 12.9204 6.06216 12.7031 6.33887C12.4857 6.61568 12.2042 6.83596 11.8828 6.97949C11.6307 7.09207 11.3343 6.97871 11.2217 6.72656C11.1092 6.47455 11.2227 6.17908 11.4746 6.06641C11.6477 5.98913 11.7999 5.8707 11.917 5.72168C12.034 5.57263 12.1124 5.39639 12.1465 5.20996C12.1804 5.02374 12.169 4.83198 12.1123 4.65137C12.0556 4.47075 11.9556 4.30625 11.8213 4.17285C11.6867 4.03938 11.5211 3.94012 11.3398 3.88477C11.1586 3.82944 10.9664 3.81896 10.7803 3.85449C10.5942 3.89003 10.4196 3.9707 10.2715 4.08887C10.1235 4.20702 10.0066 4.35971 9.93066 4.5332C9.87134 4.66904 9.80282 4.90625 9.72559 5.25098C9.65021 5.58744 9.57276 5.99388 9.4873 6.45117C9.3177 7.3588 9.11883 8.45591 8.85156 9.50781C8.81991 9.63238 8.7859 9.75675 8.75195 9.88086C9.13618 9.98267 9.49717 10.1032 9.82617 10.2461C10.924 10.7229 11.8329 11.5115 11.833 12.667C11.8331 12.7109 11.8509 12.7531 11.8818 12.7842C11.9131 12.8154 11.9558 12.833 12 12.833H13.333C13.3772 12.833 13.4199 12.8154 13.4512 12.7842C13.4822 12.7531 13.4999 12.7109 13.5 12.667V12.333C13.4994 12.1713 13.5459 12.0128 13.6338 11.877L13.707 11.7793C13.7874 11.6878 13.8875 11.6145 14 11.5654C14.1126 11.5163 14.2346 11.4937 14.3564 11.4971L14.4775 11.5088L14.5957 11.5391C14.7039 11.575 14.8033 11.6335 14.8887 11.71H14.8896L16.3271 12.9551C16.5357 13.1358 16.5584 13.4514 16.3779 13.6602C16.1971 13.8688 15.8816 13.8917 15.6729 13.7109L14.498 12.6934C14.4911 12.993 14.3706 13.2788 14.1582 13.4912C13.9394 13.71 13.6424 13.833 13.333 13.833H12C11.6906 13.833 11.3936 13.71 11.1748 13.4912C10.9563 13.2726 10.8331 12.9761 10.833 12.667C10.8329 12.126 10.4116 11.5904 9.42773 11.1631C9.13742 11.037 8.81129 10.9297 8.45801 10.8379C8.26315 11.4058 8.03765 11.9395 7.76758 12.3906C7.29792 13.175 6.62269 13.8329 5.66699 13.833C5.09236 13.833 4.54109 13.6046 4.13477 13.1982C3.72865 12.792 3.50013 12.2414 3.5 11.667C3.50004 11.0924 3.72852 10.5411 4.13477 10.1348C4.54109 9.72848 5.09239 9.5 5.66699 9.5H5.66992C6.39354 9.50481 7.10453 9.56357 7.77148 9.67285C7.80892 9.53771 7.84653 9.40066 7.88184 9.26172C8.13954 8.24746 8.33342 7.18518 8.50488 6.26758C8.58992 5.81252 8.67014 5.38874 8.75 5.03223C8.82797 4.68424 8.91258 4.36429 9.01367 4.13281C9.15464 3.81035 9.37243 3.5272 9.64746 3.30762C9.92257 3.08802 10.247 2.93809 10.5928 2.87207ZM5.66504 10.5C5.35624 10.5004 5.0602 10.6234 4.8418 10.8418C4.62309 11.0605 4.50004 11.3577 4.5 11.667C4.50013 11.9762 4.62322 12.2725 4.8418 12.4912C5.06059 12.71 5.35757 12.833 5.66699 12.833C6.09521 12.8329 6.50723 12.55 6.91016 11.877C7.11861 11.5287 7.30295 11.1072 7.46973 10.6387C6.9041 10.5536 6.2956 10.5043 5.66504 10.5ZM2.00977 2.00977H2V2H2.00977V2.00977Z" fill="#737373" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Arms / AMN IN Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Arms / AMN IN Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="armsInTime" className="text-xs font-medium text-neutral-700">
                                IN Time
                            </Label>
                            <Input
                                id="armsInTime"
                                type="time"
                                className="block w-full"
                                value={formData.armsInTime}
                                onChange={(e) => handleFormChange("armsInTime", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5 relative">
                            <SuggestionInput
                                label="IN Signature"
                                fieldType="signature"
                                placeholder="Text / Digital"
                                value={formData.inSignature}
                                onChange={(val) => handleFormChange("inSignature", val)}
                            />
                            <div className="absolute right-3 top-7 h-4 w-4 text-neutral-400" >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 15.5C16.2761 15.5 16.5 15.7239 16.5 16C16.5 16.2761 16.2761 16.5 16 16.5H4C3.72386 16.5 3.5 16.2761 3.5 16C3.5 15.7239 3.72386 15.5 4 15.5H16ZM10.5928 2.87207C10.9385 2.80607 11.2952 2.82593 11.6318 2.92871C11.9685 3.03153 12.2755 3.21498 12.5254 3.46289C12.7751 3.71076 12.961 4.01587 13.0664 4.35156C13.1718 4.68736 13.1941 5.0444 13.1309 5.39062C13.0675 5.73671 12.9204 6.06216 12.7031 6.33887C12.4857 6.61568 12.2042 6.83596 11.8828 6.97949C11.6307 7.09207 11.3343 6.97871 11.2217 6.72656C11.1092 6.47455 11.2227 6.17908 11.4746 6.06641C11.6477 5.98913 11.7999 5.8707 11.917 5.72168C12.034 5.57263 12.1124 5.39639 12.1465 5.20996C12.1804 5.02374 12.169 4.83198 12.1123 4.65137C12.0556 4.47075 11.9556 4.30625 11.8213 4.17285C11.6867 4.03938 11.5211 3.94012 11.3398 3.88477C11.1586 3.82944 10.9664 3.81896 10.7803 3.85449C10.5942 3.89003 10.4196 3.9707 10.2715 4.08887C10.1235 4.20702 10.0066 4.35971 9.93066 4.5332C9.87134 4.66904 9.80282 4.90625 9.72559 5.25098C9.65021 5.58744 9.57276 5.99388 9.4873 6.45117C9.3177 7.3588 9.11883 8.45591 8.85156 9.50781C8.81991 9.63238 8.7859 9.75675 8.75195 9.88086C9.13618 9.98267 9.49717 10.1032 9.82617 10.2461C10.924 10.7229 11.8329 11.5115 11.833 12.667C11.8331 12.7109 11.8509 12.7531 11.8818 12.7842C11.9131 12.8154 11.9558 12.833 12 12.833H13.333C13.3772 12.833 13.4199 12.8154 13.4512 12.7842C13.4822 12.7531 13.4999 12.7109 13.5 12.667V12.333C13.4994 12.1713 13.5459 12.0128 13.6338 11.877L13.707 11.7793C13.7874 11.6878 13.8875 11.6145 14 11.5654C14.1126 11.5163 14.2346 11.4937 14.3564 11.4971L14.4775 11.5088L14.5957 11.5391C14.7039 11.575 14.8033 11.6335 14.8887 11.71H14.8896L16.3271 12.9551C16.5357 13.1358 16.5584 13.4514 16.3779 13.6602C16.1971 13.8688 15.8816 13.8917 15.6729 13.7109L14.498 12.6934C14.4911 12.993 14.3706 13.2788 14.1582 13.4912C13.9394 13.71 13.6424 13.833 13.333 13.833H12C11.6906 13.833 11.3936 13.71 11.1748 13.4912C10.9563 13.2726 10.8331 12.9761 10.833 12.667C10.8329 12.126 10.4116 11.5904 9.42773 11.1631C9.13742 11.037 8.81129 10.9297 8.45801 10.8379C8.26315 11.4058 8.03765 11.9395 7.76758 12.3906C7.29792 13.175 6.62269 13.8329 5.66699 13.833C5.09236 13.833 4.54109 13.6046 4.13477 13.1982C3.72865 12.792 3.50013 12.2414 3.5 11.667C3.50004 11.0924 3.72852 10.5411 4.13477 10.1348C4.54109 9.72848 5.09239 9.5 5.66699 9.5H5.66992C6.39354 9.50481 7.10453 9.56357 7.77148 9.67285C7.80892 9.53771 7.84653 9.40066 7.88184 9.26172C8.13954 8.24746 8.33342 7.18518 8.50488 6.26758C8.58992 5.81252 8.67014 5.38874 8.75 5.03223C8.82797 4.68424 8.91258 4.36429 9.01367 4.13281C9.15464 3.81035 9.37243 3.5272 9.64746 3.30762C9.92257 3.08802 10.247 2.93809 10.5928 2.87207ZM5.66504 10.5C5.35624 10.5004 5.0602 10.6234 4.8418 10.8418C4.62309 11.0605 4.50004 11.3577 4.5 11.667C4.50013 11.9762 4.62322 12.2725 4.8418 12.4912C5.06059 12.71 5.35757 12.833 5.66699 12.833C6.09521 12.8329 6.50723 12.55 6.91016 11.877C7.11861 11.5287 7.30295 11.1072 7.46973 10.6387C6.9041 10.5536 6.2956 10.5043 5.66504 10.5ZM2.00977 2.00977H2V2H2.00977V2.00977Z" fill="#737373" />
                                </svg>
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
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                    </div>
                </section>

                {/* Initials / Authentication */}
                <AuthenticationSection data={authData} onChange={handleAuthChange} />
            </div>

            {/* Footer */}
            <FormFooter
                onCancel={onCancel}
                onSave={handleSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
                saveLabel={initialData?._id ? "Update Entry" : "Save & Add Another"}
            />
        </div>
    );
};

export default MiniKoteArmsAmnInOutForm;
