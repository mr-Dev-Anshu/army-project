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
        assignedMPs: [], // Changed to array
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

            // Handle legacy single assignedMP vs new array
            let mps = [];
            if (d.assignedMPs && Array.isArray(d.assignedMPs)) {
                mps = d.assignedMPs;
            } else if (d.assignedMP) {
                mps = [d.assignedMP];
            } else {
                mps = [{ armyNo: "", rank: "", name: "", unit: "", fmn: "" }];
            }

            setFormData((prev: any) => ({
                ...prev,
                ...d,
                displayDocuments: docsStr,
                individual: d.individual || { armyNo: "", rank: "", name: "", unit: "" },
                assignedMPs: mps,
                authentication: initialData.authentication || { initialsMPCPNCO: "", initialsQMSJCO: "", initials2IC: "" },
                remark: initialData.remark || d.remark || "",
                offenceType: (Array.isArray(d.offenceTypes) && d.offenceTypes.length > 0) ? d.offenceTypes.join(", ") : (d.offenceType || "")
            }));
        } else {
            // Default init for new form
            setFormData((prev: any) => ({
                ...prev,
                assignedMPs: [{ armyNo: "", rank: "", name: "", unit: "", fmn: "" }]
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

    const handleAssignedMPChange = (index: number, field: string, value: string) => {
        const newMPs = [...formData.assignedMPs];
        newMPs[index] = { ...newMPs[index], [field]: value };
        setFormData((prev: any) => ({ ...prev, assignedMPs: newMPs }));
    };

    const handleAddMP = () => {
        setFormData((prev: any) => ({
            ...prev,
            assignedMPs: [...prev.assignedMPs, { armyNo: "", rank: "", name: "", unit: "", fmn: "" }]
        }));
    };

    const handleRemoveMP = (index: number) => {
        if (formData.assignedMPs.length > 1) {
            const newMPs = formData.assignedMPs.filter((_: any, i: number) => i !== index);
            setFormData((prev: any) => ({ ...prev, assignedMPs: newMPs }));
        }
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
                    assignedMPs: formData.assignedMPs,
                    assignedMP: formData.assignedMPs[0] || {}, // Backward compatibility
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
                    <label className="text-sm font-semibold text-gray-700">Report No.</label>
                    <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-blue-400 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.caseNo || ""}
                        readOnly
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Date of Occurrence</label>
                        <input
                            type="text"
                            className="flex h-10 w-full rounded-md border border-blue-400 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.dateOfOccurrence ? new Date(formData.dateOfOccurrence).toLocaleDateString("en-GB") : ""}
                            readOnly
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Time of Occurrence</label>
                        <input
                            type="text"
                            className="flex h-10 w-full rounded-md border border-blue-400 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.timeOfOccurrence ? new Date(formData.timeOfOccurrence).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ""}
                            readOnly
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Place of Offence</label>
                    <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-blue-400 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.placeOfOccurrence || ""}
                        readOnly
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Unit of Occurrence Location</label>
                    <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-blue-400 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.unitOfOccurrence || ""}
                        readOnly
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Offence Type</label>
                    <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-blue-400 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.offenceType || ""}
                        readOnly
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
                                    {formData.individual.iCardNumber || "-"}
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
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Brief */}
            <section className="space-y-2">
                <h3 className="font-bold text-gray-900">Brief of Occurrence</h3>
                <textarea
                    className="flex min-h-[200px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.brief}
                    onChange={(e) => handleChange("brief", e.target.value)}
                />
            </section>

            {/* Documents */}
            <section className="space-y-2">
                <h3 className="font-bold text-gray-900 mb-2">List of Attached Documents & Statements</h3>
                <textarea
                    className="flex min-h-[200px] w-full rounded-md border border-blue-400 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.displayDocuments}
                    readOnly
                />
            </section>

            {/* Assigned Individuals on Duty */}
            <section className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b pb-2">Assigned Individuals on Duty</h3>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Total Strength</label>
                    <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-blue-500 bg-white px-3 py-2 text-sm focus-visible:outline-none"
                        value={formData.assignedMPs?.length.toString().padStart(2, '0') || "00"}
                        readOnly
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900">List of Assigned MPs on Duty:</label>
                    <div className="overflow-hidden border border-gray-300 rounded-md mt-2">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-gray-900 border-b border-gray-300 bg-gray-50">
                                    <th className="py-2 pl-4 pr-4 font-medium w-12 border-r border-gray-300">Sr no.</th>
                                    <th className="py-2 px-4 font-medium w-32 border-r border-gray-300">Army No.</th>
                                    <th className="py-2 px-4 font-medium w-24 border-r border-gray-300">Rank</th>
                                    <th className="py-2 px-4 font-medium w-40 border-r border-gray-300">Name</th>
                                    <th className="py-2 px-4 font-medium w-32 border-r border-gray-300">Unit</th>
                                    <th className="py-2 px-4 font-medium border-r border-gray-300">FMN</th>
                                    <th className="py-2 px-4 font-medium w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {formData.assignedMPs?.map((mp: any, index: number) => (
                                    <tr key={index} className="group bg-white">
                                        <td className="py-3 pl-4 pr-4 align-top text-gray-900 font-medium border-r border-gray-300">{index + 1}.</td>
                                        <td className="py-2 px-2 align-top text-gray-700 border-r border-gray-300">
                                            <input
                                                className="w-full bg-transparent outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 px-1"
                                                value={mp.armyNo || ""}
                                                onChange={(e) => handleAssignedMPChange(index, 'armyNo', e.target.value)}
                                                placeholder="Army No"
                                            />
                                        </td>
                                        <td className="py-2 px-2 align-top text-gray-700 border-r border-gray-300">
                                            <input
                                                className="w-full bg-transparent outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 px-1"
                                                value={mp.rank || ""}
                                                onChange={(e) => handleAssignedMPChange(index, 'rank', e.target.value)}
                                                placeholder="Rank"
                                            />
                                        </td>
                                        <td className="py-2 px-2 align-top text-gray-700 border-r border-gray-300">
                                            <input
                                                className="w-full bg-transparent outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 px-1"
                                                value={mp.name || ""}
                                                onChange={(e) => handleAssignedMPChange(index, 'name', e.target.value)}
                                                placeholder="Name"
                                            />
                                        </td>
                                        <td className="py-2 px-2 align-top text-gray-700 border-r border-gray-300">
                                            <input
                                                className="w-full bg-transparent outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 px-1"
                                                value={mp.unit || ""}
                                                onChange={(e) => handleAssignedMPChange(index, 'unit', e.target.value)}
                                                placeholder="Unit"
                                            />
                                        </td>
                                        <td className="py-2 px-2 align-top text-gray-700 border-r border-gray-300">
                                            <input
                                                className="w-full bg-transparent outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 px-1"
                                                value={mp.fmn || ""}
                                                onChange={(e) => handleAssignedMPChange(index, 'fmn', e.target.value)}
                                                placeholder="FMN"
                                            />
                                        </td>
                                        <td className="py-2 px-2 align-middle text-center">
                                            {formData.assignedMPs.length > 1 && (
                                                <button
                                                    onClick={() => handleRemoveMP(index)}
                                                    className="text-red-400 hover:text-red-600 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button variant="secondary" onClick={handleAddMP} className="bg-gray-100 hover:bg-gray-200 text-gray-900 gap-2 text-xs font-medium h-9">
                            <Plus className="w-3.5 h-3.5" />
                            Add more individual to list
                        </Button>
                    </div>
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
