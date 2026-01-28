import React, { useState, useEffect } from "react";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { IndividualInputFields } from "@/features/RegisterBooks/components/IndividualInputFields";

interface MpGeneralDiaryFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export default function MpGeneralDiaryForm({
    initialData,
    onSuccess,
    onCancel,
    onSubmit,
}: MpGeneralDiaryFormProps) {
    const [formData, setFormData] = useState<any>({
        caseNo: "",
        dateOfOccurrence: "",
        timeOfOccurrence: "",
        placeOfOccurrence: "",
        unitOfOccurrence: "",
        offenceType: "",
        individual: {
            armyNo: "",
            rank: "",
            name: "",
            unit: "",
            fmn: "",
            command: ""
        },
        brief: "",
        documents: "",
        assignedMP: {
            armyNo: "",
            rank: "",
            name: "",
            unit: "",
            fmn: ""
        },
        remark: "",
        authentication: {
            initialsMPCPNCO: "",
            initialsQMSJCO: "",
            initials2IC: "",
        },
        ...initialData?.details,
        _id: initialData?._id,
        displayDocuments: "",
    });

    useEffect(() => {
        if (initialData?.details) {
            const d = initialData.details;
            let docsStr = "";
            if (Array.isArray(d.documents)) {
                docsStr = d.documents.map((doc: any, i: number) => `${i + 1}. ${typeof doc === 'string' ? doc : (doc.statement || doc.name)}`).join("\n");
            }

            setFormData((prev: any) => ({
                ...prev,
                ...d,
                displayDocuments: docsStr,
                individual: d.individual || { armyNo: "", rank: "", name: "", unit: "" },
                assignedMP: d.assignedMP || { armyNo: "", rank: "", name: "", unit: "" },
                authentication: initialData.authentication || { initialsMPCPNCO: "", initialsQMSJCO: "", initials2IC: "" },
                remark: initialData.remark || d.remark || ""
            }));
        }
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async () => {
        try {
            const docArray = formData.displayDocuments.split('\n').filter((l: string) => l.trim().length > 0).map((l: string) => l.replace(/^\d+\.\s*/, ''));

            const payload = {
                details: {
                    caseNo: formData.caseNo,
                    dateOfOccurrence: formData.dateOfOccurrence,
                    timeOfOccurrence: formData.timeOfOccurrence,
                    placeOfOccurrence: formData.placeOfOccurrence,
                    unitOfOccurrence: formData.unitOfOccurrence,
                    offenceType: formData.offenceType,
                    individual: formData.individual,
                    brief: formData.brief,
                    documents: docArray,
                    assignedMP: formData.assignedMP,
                },
                remark: formData.remark,
                authentication: formData.authentication
            };

            await onSubmit({ id: formData._id, payload });
            onSuccess();
        } catch (error) {
            console.error("Submit Error", error);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Occurrence Details */}
            <section className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b pb-2">Occurrence Details</h3>

                <div className="space-y-1.5">
                    <SuggestionInput
                        label="Report No."
                        fieldType="reportNo"
                        value={formData.caseNo}
                        onChange={(v) => handleChange("caseNo", v)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Date of Occurrence</label>
                        <input
                            type="date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.dateOfOccurrence ? (new Date(formData.dateOfOccurrence).toISOString().split('T')[0]) : ""}
                            onChange={(e) => handleChange("dateOfOccurrence", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Time of Occurrence</label>
                        <input
                            type="time"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.timeOfOccurrence ? (new Date(formData.timeOfOccurrence).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })) : ""}
                            onChange={(e) => {
                                const [h, m] = e.target.value.split(':');
                                const d = new Date(formData.timeOfOccurrence || new Date());
                                d.setHours(parseInt(h));
                                d.setMinutes(parseInt(m));
                                handleChange("timeOfOccurrence", d.toISOString());
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <SuggestionInput
                        label="Place of Offence"
                        fieldType="place"
                        value={formData.placeOfOccurrence}
                        onChange={(v) => handleChange("placeOfOccurrence", v)}
                    />
                </div>

                <div className="space-y-1.5">
                    <SuggestionInput
                        label="Unit of Occurrence Location"
                        fieldType="unit"
                        value={formData.unitOfOccurrence}
                        onChange={(v) => handleChange("unitOfOccurrence", v)}
                    />
                </div>

                <div className="space-y-1.5">
                    <SuggestionInput
                        label="Offence Type"
                        fieldType="offenceType"
                        value={formData.offenceType}
                        onChange={(v) => handleChange("offenceType", v)}
                    />
                </div>
            </section>

            {/* Particulars of Offender / Victim (READONLY TABLE) */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-gray-900">Particulars of Offender / Victim <span className="text-sm font-normal text-gray-500">(Select one and fill their details)</span></h3>
                </div>

                <div className="border border-gray-300 rounded-md overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-300 w-12 text-center">Sr no.</th>
                                <th className="px-4 py-3 border-r border-gray-300">Army No, Rank & Name</th>
                                <th className="px-4 py-3 border-r border-gray-300 w-24">Identity Card</th>
                                <th className="px-4 py-3 border-r border-gray-300">Unit/Tele No.</th>
                                <th className="px-4 py-3 w-20">Remark</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* Supporting single main offender for now, but structured as table row */}
                            <tr className="bg-white">
                                <td className="px-4 py-3 border-r border-gray-300 text-center font-medium">1</td>
                                <td className="px-4 py-3 border-r border-gray-300">
                                    <div className="flex flex-col space-y-1">
                                        <div className="grid grid-cols-[70px_1fr]">
                                            <span className="font-bold text-gray-900">Army no.:</span>
                                            <span className="text-gray-700">{formData.individual.armyNo || "-"}</span>
                                        </div>
                                        <div className="grid grid-cols-[70px_1fr]">
                                            <span className="font-bold text-gray-900">Rank:</span>
                                            <span className="text-gray-700">{formData.individual.rank || "-"}</span>
                                        </div>
                                        <div className="grid grid-cols-[70px_1fr]">
                                            <span className="font-bold text-gray-900">Name:</span>
                                            <span className="text-gray-700">{formData.individual.name || "-"}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 border-r border-gray-300 align-top">
                                    {formData.individual.identityCard || "-"}
                                </td>
                                <td className="px-4 py-3 border-r border-gray-300 align-top">
                                    <div className="flex flex-col space-y-1">
                                        <div className="grid grid-cols-[60px_1fr]">
                                            <span className="font-bold text-gray-900">Unit:</span>
                                            <span className="text-gray-700">{formData.individual.unit || "-"}</span>
                                        </div>
                                        <div className="grid grid-cols-[60px_1fr]">
                                            <span className="font-bold text-gray-900">FMN:</span>
                                            <span className="text-gray-700">{formData.individual.fmn || "-"}</span>
                                        </div>
                                        <div className="grid grid-cols-[60px_1fr]">
                                            <span className="font-bold text-gray-900">Address:</span>
                                            <span className="text-gray-700">{formData.individual.address || "-"}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 align-top">
                                    --
                                </td>
                            </tr>
                            {/* Potential placeholders for multiple offenders if needed */}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Brief */}
            <section className="space-y-2">
                <h3 className="font-bold text-gray-900">Brief of Occurrence</h3>
                <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.brief}
                    onChange={(e) => handleChange("brief", e.target.value)}
                />
            </section>

            {/* Documents */}
            <section className="space-y-2">
                <h3 className="font-bold text-gray-900">List of Attached Documents & Statements</h3>
                <textarea
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.displayDocuments}
                    onChange={(e) => handleChange("displayDocuments", e.target.value)}
                    placeholder="1. Copy of FIR...&#10;2. Statement of..."
                />
            </section>

            {/* Assigned MPs */}
            <section className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b pb-2">Assigned Individuals on Duty</h3>
                <div className="p-4 border rounded-md bg-gray-50">
                    <h4 className="font-semibold text-sm mb-3">Assigned MP Details</h4>
                    <IndividualInputFields
                        data={formData.assignedMP}
                        onChange={(field, value) => handleNestedChange("assignedMP", field, value)}
                        showExtendedFields
                    />
                </div>
            </section>

            {/* Remark */}
            <section className="space-y-2">
                <h3 className="font-bold text-gray-900">Add Remark</h3>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.remark}
                    onChange={(e) => handleChange("remark", e.target.value)}
                    placeholder="Enter remark"
                />
            </section>

            {/* Authentication */}
            <AuthenticationSection
                data={formData.authentication}
                onChange={(field, value) => handleNestedChange("authentication", field, value)}
            />

            {/* Footer Actions */}
            <div className="fixed bottom-0 right-0 w-full max-w-4xl bg-white border-t p-4 flex justify-between items-center z-50">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>
                    Update Entry
                </Button>
            </div>

        </div>
    );
}
