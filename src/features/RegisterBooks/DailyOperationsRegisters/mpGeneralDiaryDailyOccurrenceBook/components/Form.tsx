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

                <div className="border border-blue-400 rounded-md overflow-hidden bg-white">
                    {(() => {
                        const individuals = Array.isArray(formData.individual)
                            ? formData.individual
                            : (formData.individual ? [formData.individual] : []);

                        if (individuals.length === 0) return <div className="p-4 text-sm text-gray-500">No details available</div>;

                        return individuals.map((person: any, index: number) => {
                            // Helper to normalize type - logic borrowed from OffenderDetailsCell
                            const rawType = person.offenderType || person.individualType || person.type || (person.armyNo ? "Military Person" : "Civilian");
                            let type = rawType;
                            if (rawType === "Military Person") type = "militaryPersonnel";
                            else if (rawType === "Employee") type = "employee";
                            else if (rawType === "Civilian") type = "civilian";
                            else if (rawType === "Shop Keeper") type = "shopKeeper";
                            else if (rawType === "Servant/Maid") type = "servantMaid";
                            else if (rawType === "Temporary Hired Worker") type = "tempHiredWorker";

                            // Helper to get field values safely (case insensitive for keys)
                            const details = person.offenderDetails || person.individualDetails || person || {};
                            const get = (...keys: string[]) => {
                                for (const k of keys) {
                                    if (details[k]) return details[k];
                                    // Try lowercase match
                                    const lowerK = k.toLowerCase();
                                    const found = Object.keys(details).find(dk => dk.toLowerCase() === lowerK);
                                    if (found) return details[found];
                                }
                                return "";
                            };

                            return (
                                <div key={index} className="flex gap-4 p-4 border-b last:border-b-0 text-sm">
                                    <div className="font-medium text-gray-900 w-6 pt-0.5">{index + 1}.</div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                                        {/* Render based on type */}
                                        {type === 'militaryPersonnel' && (
                                            <>
                                                <div className="space-y-1">
                                                    {get("armyNumber", "armyNo", "militaryPersonnelArmyNo") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Army No.</span>
                                                        <span className="text-gray-900">{get("armyNumber", "armyNo", "militaryPersonnelArmyNo")}</span>
                                                    </div>}
                                                    {get("name", "militaryPersonnelName") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Name</span>
                                                        <span className="text-gray-900">{get("name", "militaryPersonnelName")}</span>
                                                    </div>}
                                                    {get("fmn", "militaryPersonnelFmn", "FMN") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">FMN</span>
                                                        <span className="text-gray-900">{get("fmn", "militaryPersonnelFmn", "FMN")}</span>
                                                    </div>}
                                                    {get("address") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Address</span>
                                                        <span className="text-gray-900">{get("address")}</span>
                                                    </div>}
                                                </div>
                                                <div className="space-y-1">
                                                    {get("rank", "militaryPersonnelRank", "selectRank", "Select Rank") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Rank:</span>
                                                        <span className="text-gray-900">{get("rank", "militaryPersonnelRank", "selectRank", "Select Rank")}</span>
                                                    </div>}
                                                    {get("unit", "militaryPersonnelUnit", "Unit") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Unit:</span>
                                                        <span className="text-gray-900">{get("unit", "militaryPersonnelUnit", "Unit")}</span>
                                                    </div>}
                                                    {get("command",) && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Command:</span>
                                                        <span className="text-gray-900">{get("command",)}</span>
                                                    </div>}
                                                    {get("iCardNumber", "identityCard", "icard", "I Card No") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">I Card No.:</span>
                                                        <span className="text-gray-900">{get("iCardNumber", "identityCard", "icard", "I Card No")}</span>
                                                    </div>
                                                    }
                                                </div>
                                            </>
                                        )}

                                        {type === 'civilian' && (
                                            <>
                                                <div className="space-y-1">
                                                    {get("aadharCardNo", "Aadhar Card No.", "civilianAadharCardNumber") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Aadhar No.</span>
                                                        <span className="text-gray-900">{get("aadharCardNo", "Aadhar Card No.", "civilianAadharCardNumber")}</span>
                                                    </div>}

                                                    {get("name", "civilianName") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Name:</span>
                                                        <span className="text-gray-900">{get("name", "civilianName")}</span>
                                                    </div>}
                                                    {get("fatherOrHusbandName", "so", "civilianFathersName") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Father/Husband:</span>
                                                        <span className="text-gray-900">{get("fatherOrHusbandName", "so", "civilianFathersName")}</span>
                                                    </div>}
                                                    {get("address", "civilianAddress") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Address</span>
                                                        <span className="text-gray-900">{get("address", "civilianAddress")}</span>
                                                    </div>
                                                    }
                                                </div>

                                            </>
                                        )}

                                        {type === "shopKeeper" && (
                                            <>
                                                <div className="space-y-1">
                                                    {get("Shop Owner Name", "shopOwnerName") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Name</span>
                                                        <span className="text-gray-900">{get("Shop Owner Name", "shopOwnerName")}</span>
                                                    </div>}
                                                    {get("unit", "Unit", "shopUnit") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Unit</span>
                                                        <span className="text-gray-900">{get("unit", "Unit", "shopUnit")}</span>
                                                    </div>}
                                                    {get("Shop Address", "shopAddress") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Address</span>
                                                        <span className="text-gray-900">{get("Shop Address", "shopAddress")}</span>
                                                    </div>}
                                                    {get("Pass No.", "shopPassNo", "passNo") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Pass No.</span>
                                                        <span className="text-gray-900">{get("Pass No.", "shopPassNo", "passNo")}</span>
                                                    </div>}
                                                </div>
                                            </>
                                        )}

                                        {/* ================= SERVANT / MAID ================= */}
                                        {type === "servantMaid" && (
                                            <>
                                                <div className="space-y-1">
                                                    {get("name", "maidName") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Name</span>
                                                        <span className="text-gray-900">{get("name", "maidName")}</span>
                                                    </div>}
                                                    {get("so", "Father's Name (Son of)", "maidFathersName") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Father's Name (Son of)</span>
                                                        <span className="text-gray-900">{get("so", "Father's Name (Son of)", "maidFathersName")}</span>
                                                    </div>}
                                                    {get("passNo", "Maid/Servant Pass Number", "maidPassNumber") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Pass No.</span>
                                                        <span className="text-gray-900">{get("passNo", "Maid/Servant Pass Number", "maidPassNumber")}</span>
                                                    </div>}
                                                    {get("Officers Enclave C/O Rank (Army official's details)", "officersEnclaveRank") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">C/O Rank</span>
                                                        <span className="text-gray-900">{get("Officers Enclave C/O Rank (Army official's details)", "officersEnclaveRank")}</span>
                                                    </div>}
                                                </div>
                                                <div className="space-y-1">
                                                    {get("armyOfficialName", "Army Official Name", "officersEnclaveName") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">C/O Name</span>
                                                        <span className="text-gray-900">{get("armyOfficialName", "Army Official Name", "officersEnclaveName")}</span>
                                                    </div>}
                                                    {get("unit", "Unit", "officersEnclaveUnit") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">C/O Unit</span>
                                                        <span className="text-gray-900">{get("unit", "Unit", "officersEnclaveUnit")}</span>
                                                    </div>}
                                                    {get("fmn", "FMN", "officersEnclaveFmn") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">C/O FMN</span>
                                                        <span className="text-gray-900">{get("fmn", "FMN", "officersEnclaveFmn")}</span>
                                                    </div>}

                                                </div>
                                            </>
                                        )}

                                        {/* Employee */}
                                        {type === "employee" && (
                                            <>
                                                <div className="space-y-1">
                                                    {get("Employee ID", "employeeServiceNumber") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Service No.</span>
                                                        <span className="text-gray-900">{get("Employee ID", "employeeServiceNumber")}</span>
                                                    </div>}
                                                    {get("rank", "employeeRank") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Rank</span>
                                                        <span className="text-gray-900">{get("rank", "employeeRank")}</span>
                                                    </div>}
                                                    {get("name", "employeeName") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Name</span>
                                                        <span className="text-gray-900">{get("name", "employeeName")}</span>
                                                    </div>}
                                                    {get("Pass No.", "employeePassNo") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Pass No.</span>
                                                        <span className="text-gray-900">{get("Pass No.", "employeePassNo")}</span>
                                                    </div>}
                                                </div>
                                                <div className="space-y-1">
                                                    {get("Department") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Department</span>
                                                        <span className="text-gray-900">{get("Department")}</span>
                                                    </div>}
                                                    {get("address") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Address</span>
                                                        <span className="text-gray-900">{get("address")}</span>
                                                    </div>}

                                                </div>
                                            </>
                                        )}
                                        {/* TEMP HIRED WORKER */}
                                        {type === "tempHiredWorker" && (
                                            <>
                                                <div className="space-y-1">
                                                    {get("name", "tempWorkerName") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Name</span>
                                                        <span className="text-gray-900">{get("name", "tempWorkerName")}</span>
                                                    </div>}
                                                    {get("Pass No.", "tempWorkerPassNo", "passNo") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Pass No.</span>
                                                        <span className="text-gray-900">{get("Pass No.", "tempWorkerPassNo", "passNo")}</span>
                                                    </div>}
                                                    {get("Place of Work", "tempWorkerPlaceOfWork") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Place of Work</span>
                                                        <span className="text-gray-900">{get("Place of Work", "tempWorkerPlaceOfWork")}</span>
                                                    </div>}

                                                </div>
                                                <div className="space-y-1">
                                                    {get("Type of Work", "tempWorkerTypeOfWork") && <div className="grid grid-cols-[110px_1fr]">
                                                        <span className="font-bold text-gray-900">Type of Work</span>
                                                        <span className="text-gray-900">{get("Type of Work", "tempWorkerTypeOfWork")}</span>
                                                    </div>}

                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        });
                    })()}
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
                hiddenFields={["initials2IC"]}
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
