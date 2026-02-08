
import React from 'react';

export interface MpOccurrenceReportProps {
    reportNo: string;
    command: string;
    firNo: string;
    mpDetails?: {
        armyNumber: string;
        rank: string;
        name: string;
        unit: string;
        fmn: string;
        command: string;
    };
    occurrence: {
        types: string[]; // 3.1 - Dynamic List
        refs: string[];
        place: string;
        date: string;
        time: string;
    };
    people: {
        sno: number;
        armyNo?: string;
        rank?: string;
        name?: string;
        identityCard?: string;
        unitName?: string;
        fmn?: string;
        address?: string;
        remark?: string;
        role: "Victim" | "Offender" | "Unknown" | string;
        customFields?: Record<string, any>;
    }[];
    briefOfOccurrence: string;
    witnesses: {
        sno: number;
        armyNo?: string;
        rank?: string;
        name?: string;
        identityCard?: string;
        unitName?: string;
        fmn?: string;
        address?: string;
        remark?: string;
        customFields?: Record<string, any>;
    }[];
    evidence?: {
        eyeSketch: string;
        photos: string;
        videos: string;
    };
    documents: string[];
    detailedReport: {
        statement: string;
        findings: string[];
        opinion: string;
    };
    remarks: {
        analysis: string;
        recommendation: string;
    };
    station: string;
    reportDate: string;
    className?: string;
}

const DataField = ({ label, value, className = "grid-cols-[100px_1fr]" }: { label: React.ReactNode; value?: string; className?: string }) => {
    if (!value || value === "N/A" || value === "") return null;
    return (
        <div className={`grid ${className}`}>
            <span className="font-bold">{label}</span>
            <span>{value}</span>
        </div>
    );
};

const MpOccurrenceReport: React.FC<MpOccurrenceReportProps> = ({
    reportNo,
    command,
    firNo,
    mpDetails,
    occurrence,
    people,
    briefOfOccurrence,
    witnesses,
    evidence,
    documents,
    detailedReport,
    remarks,
    station,
    reportDate,
    className
}) => {
    return (
        <div className={`font-[Arial] text-[#0A0A0A] w-full items-center flex flex-col gap-8 print:block print:gap-0 print:bg-white text-[12px] ${className || ''}`}>
            <style type="text/css" media="print">
                {`
                  @page {
                    size: A4;
                    margin: 0mm;
                  }
                  body {
                    background-color: white !important;
                    -webkit-print-color-adjust: exact;
                  }
                `}
            </style>

            {/* ==================== PAGE 1 ==================== */}
            <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col print:px-[48px] print:pb-[48px] print:pt-[20px]" style={{ pageBreakAfter: 'always' }}>

                {/* Header Page 1 */}
                <div className="text-center font-bold text-[12px] underline mb-4 print:hidden">RESTRICTED</div>
                <div className="text-right font-bold text-[12px] mb-8 underline">IAFP-1479 (Revised)</div>

                <h1 className="text-center font-bold text-[16px] underline mb-8">
                    MP OCCURRENCE & INVESTIGATION REPORT
                </h1>

                <div className="grid grid-cols-3 items-start mb-8 text-[12px]">
                    {reportNo && <div className="text-left">
                        <span className="font-bold">Report No-</span> {reportNo}<br />
                        <span>(Fill in Desk Room)</span>
                    </div>}
                    {command && <div className="justify-self-center text-left">
                        <span className="font-bold">Command-</span> {command}<br />
                        <span>(Origin)</span>
                    </div>}
                    {firNo && <div className="justify-self-end text-left">
                        <span className="font-bold">FIR No.-</span> {firNo}<br />
                        <span>(Att Copy Filed)</span>
                    </div>}
                </div>

                {/* 1. MP DETAILS */}
                {mpDetails && <div className="mb-6 break-inside-avoid">
                    <div className="font-bold mb-2 text-[12px]">1. &nbsp;&nbsp; MP DETAILS:</div>
                    <div className="border border-gray-300 p-6 rounded-sm text-[12px] mb-2">
                        <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                            <DataField label="Army no." value={mpDetails.armyNumber} />
                            <DataField label="Rank" value={mpDetails.rank} />
                            <DataField label="Name" value={mpDetails.name} />
                            <DataField label="Unit" value={mpDetails.unit} />
                            <DataField label="FMN" value={mpDetails.fmn} />
                            <DataField label="Command" value={mpDetails.command} />
                        </div>
                    </div>
                    <div className="text-[12px] text-gray-600 pl-1">
                        (MP must caution witness and ensure presence of independent witness if possible)
                    </div>
                </div>}

                {/* 2. OCCURRENCE DETAILS */}
                {occurrence.types && occurrence.types.length > 0 && <div className="mb-6 break-inside-avoid">
                    <div className="font-bold mb-2 text-[12px]">
                        2. &nbsp;&nbsp; <span className="underline">OCCURRENCE DETAILS:</span>
                    </div>
                    <div className="pl-4 space-y-2 text-[12px] ">
                        {occurrence.types && occurrence.types.length > 0 && (
                            <div className="flex mb-2">
                                <span className="w-8 shrink-0">2.1</span>
                                <div className="flex-1">
                                    <div className="flex mb-1">
                                        <span className="font-bold">Occurrence Offence Type-</span>
                                        <span className="ml-2 leading-relaxed">
                                            {occurrence.types.filter(Boolean).join(", ")}
                                        </span>
                                    </div>

                                    {/* References */}
                                    {occurrence.refs && occurrence.refs.length > 0 && (
                                        <div className="flex mt-1">
                                            <span className="font-bold mr-2 whitespace-nowrap">Ref :-</span>
                                            <div className="flex flex-col gap-1 w-full">
                                                {occurrence.refs.map((ref, i) => (
                                                    <div className="flex" key={i}>
                                                        <span className="mr-2 min-w-[20px]">{i + 1}.</span>
                                                        <span className="leading-tight">{ref}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {occurrence.place && occurrence.place.trim() !== "" && (
                            <div className="flex">
                                <span className="w-8 ">2.2</span>
                                <div className="flex-1">
                                    <span className="font-bold">Place of Occurrence-</span> <span className="ml-2">{occurrence.place}</span>
                                </div>
                            </div>
                        )}
                        {occurrence.date && occurrence.date.trim() !== "" && (
                            <div className="flex">
                                <span className="w-8 ">2.3</span>
                                <div className="flex-1">
                                    <span className="font-bold">Date of Occurrence-</span> <span className="ml-2">{occurrence.date}</span>
                                </div>
                            </div>
                        )}
                        {occurrence.time && occurrence.time.trim() !== "" && (
                            <div className="flex">
                                <span className="w-8 ">2.4</span>
                                <div className="flex-1">
                                    <span className="font-bold">Time of Occurrence-</span> <span className="ml-2">{occurrence.time} Hrs</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>}

                {/* 3. DETAILS OF VICTIMS/OFFENDERS */}
                {people.filter(p => p.name || p.armyNo || p.rank || p.unitName).length > 0 && <div className="mb-6">
                    <div className="font-bold mb-2 text-[12px]">
                        3. &nbsp;&nbsp; <span className="underline">DETAILS OF VICTIMS/OFFENDERS:</span> <span className="font-normal text-[12px] ml-2">(MP must verify personal particulars)</span>
                    </div>
                    <table className="w-full border-collapse border border-gray-300 text-[12px] mb-2 break-inside-auto">
                        <thead>
                            <tr className="bg-white">
                                <th className="border border-gray-300 p-2 w-16 text-center align-middle">Sr no.</th>
                                <th className="border border-gray-300 p-2 text-left align-middle">Particulars</th>
                                <th className="border border-gray-300 p-2 text-left align-middle">Identity Card</th>
                                <th className="border border-gray-300 p-2 text-left align-middle">Unit/Tele No.</th>
                                <th className="border border-gray-300 p-2 text-left align-middle">Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {people
                                .filter(person => {
                                    const hasData = [person.name, person.armyNo, person.rank, person.unitName, person.identityCard, person.remark,
                                    // Also check custom fields existence
                                    person.customFields && Object.values(person.customFields).some(v => v && v !== "")
                                    ].some(val => val && val !== "" && val !== "Nil" && val !== "--");
                                    return hasData;
                                })
                                .map((person, index) => {
                                    // Helper to resolve value from prop or customFields (case-insensitive search in customFields)
                                    const getVal = (keys: string[], propVal?: string) => {
                                        if (propVal && propVal !== "" && propVal !== "Nil") return propVal;
                                        if (!person.customFields) return null;

                                        for (const key of keys) {
                                            // Exact match
                                            if (person.customFields[key]) return person.customFields[key];

                                            // Case insensitive match
                                            const lowerKey = key.toLowerCase();
                                            const foundKey = Object.keys(person.customFields).find(k => k.toLowerCase() === lowerKey || k.toLowerCase().replace(/\s/g, '') === lowerKey);
                                            if (foundKey) return person.customFields[foundKey];
                                        }
                                        return null;
                                    };

                                    const armyNo = getVal(['armyNo', 'armyNumber', 'serviceNumber'], person.armyNo);
                                    const rank = getVal(['rank'], person.rank);
                                    const name = getVal(['name', 'personName', 'witnessName'], person.name);
                                    const iCard = getVal(['iCardNumber', 'identityCard', 'icard', 'idCard', 'passNo'], person.identityCard);
                                    const unit = getVal(['unit', 'unitName'], person.unitName);
                                    const fmn = getVal(['fmn', 'fmnName'], person.fmn);
                                    const address = getVal(['address'], person.address);

                                    // New Civilian Fields
                                    const aadhar = getVal(['aadhar', 'aadharCard', 'aadharCardNo', 'adhar']);
                                    const so = getVal(['so', 's/o', 'fatherName', 'father']);
                                    const relation = getVal(['relation', 'relationship', 'nametheRelation']);
                                    const tele = getVal(['tele', 'mobile', 'contact', 'phone']);

                                    return (
                                        <tr key={index} className="break-inside-avoid">
                                            <td className="border border-gray-300 p-2 text-center font-bold align-middle">3.{index + 1}</td>
                                            <td className="border border-gray-300 p-2 align-top">
                                                <div className="grid grid-cols-[110px_1fr] gap-y-1">
                                                    {aadhar && (
                                                        <>
                                                            <span className="font-bold">Aadhar Card No.:</span>
                                                            <span className="break-words">{aadhar}</span>
                                                        </>
                                                    )}
                                                    {armyNo && (
                                                        <>
                                                            <span className="font-bold">Army no.:</span>
                                                            <span className="break-words">{armyNo}</span>
                                                        </>
                                                    )}

                                                    {rank && (
                                                        <>
                                                            <span className="font-bold">Rank:</span>
                                                            <span className="break-words">{rank}</span>
                                                        </>
                                                    )}

                                                    {name && (
                                                        <>
                                                            <span className="font-bold">Name:</span>
                                                            <span className="break-words">{name}</span>
                                                        </>
                                                    )}

                                                    {so && (
                                                        <>
                                                            <span className="font-bold">S/O:</span>
                                                            <span className="break-words">{so}</span>
                                                        </>
                                                    )}
                                                    {relation && (
                                                        <>
                                                            <span className="font-bold">Relation:</span>
                                                            <span className="break-words">{relation}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center align-middle break-words max-w-[100px]">
                                                {iCard || "--"}
                                            </td>
                                            <td className="border border-gray-300 p-2 align-top">
                                                <div className="grid grid-cols-[60px_1fr] gap-y-1">
                                                    {unit && (
                                                        <>
                                                            <span className="font-bold">Unit:</span>
                                                            <span className="break-words">{unit}</span>
                                                        </>
                                                    )}

                                                    {tele && (
                                                        <>
                                                            <span className="font-bold">Tele:</span>
                                                            <span className="break-words">{tele}</span>
                                                        </>
                                                    )}

                                                    {fmn && (
                                                        <>
                                                            <span className="font-bold">FMN:</span>
                                                            <span className="break-words">{fmn}</span>
                                                        </>
                                                    )}

                                                    {address && (
                                                        <>
                                                            <span className="font-bold">Address:</span>
                                                            <span className="break-words">{address}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-2 align-middle text-center">
                                                {person.remark || "--"}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    <div className="text-[12px] text-gray-700 leading-tight text-justify">
                        (To be read out to the Offender(s) by the MP 'above recorded personal particulars have been given by me voluntarily and I certify and sign them as correct. If found otherwise. I am liable for disciplinary action under the Army Act').
                    </div>
                </div>}

                {/* 4. BRIEF OF OCCURRENCE */}
                {briefOfOccurrence && <div className="flex-1">
                    <div className="flex items-baseline mb-2 text-[12px]">
                        <span className="font-bold w-8">4.</span>
                        <div>
                            <span className="font-bold underline">BRIEF OF OCCURRENCE</span> <span className="ml-1">(Details on Reverse) offence:</span>
                        </div>
                    </div>
                    <div className="pl-8">
                        <p className="text-justify text-[12px] leading-relaxed whitespace-pre-line text-wrap">
                            {briefOfOccurrence}
                        </p>
                    </div>
                </div>}

                {/* Page 1 Footer */}
                <div className="mt-auto text-center font-bold">
                    <div className="text-[12px]  underline mt-2">RESTRICTED</div>
                </div>
            </div>


            {/* ==================== PAGE 2 ==================== */}
            <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col print:p-[48px]" style={{ pageBreakAfter: 'always' }}>

                {/* Header Page 2 */}
                <div className="text-center font-bold mb-8">
                    <div className="text-sm ">-2-</div>
                    <div className="text-xs underline">RESTRICTED</div>
                </div>

                {/* 5. WITNESS */}
                {witnesses
                    .filter(person => {
                        const hasData = [
                            person.name, person.armyNo, person.rank, person.unitName, person.identityCard, person.remark,
                            // Also check custom fields existence
                            person.customFields && Object.values(person.customFields).some(v => v && v !== "")
                        ].some(val => val && val !== "" && val !== "Nil" && val !== "--");
                        return hasData;
                    })
                    .length > 0 && <div className="mb-6">
                        <div className="font-bold mb-2 text-[12px]">
                            5. &nbsp;&nbsp; <span className="underline">WITNESS:</span> <span className="font-normal text-[12px] ml-2">(Witness must record statement in own hand where possible)</span>
                        </div>
                        <table className="w-full border-collapse border border-gray-300 text-[12px] mb-2 break-inside-auto">
                            <thead>
                                <tr className="bg-white">
                                    <th className="border border-gray-300 p-2 w-16 text-center align-middle">Sr no.</th>
                                    <th className="border border-gray-300 p-2 text-left align-middle">Particulars</th>
                                    <th className="border border-gray-300 p-2 text-left align-middle">Identity Card</th>
                                    <th className="border border-gray-300 p-2 text-left align-middle">Unit/Tele No.</th>
                                    <th className="border border-gray-300 p-2 text-left align-middle">Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {witnesses
                                    .filter(person => {
                                        const hasData = [
                                            person.name, person.armyNo, person.rank, person.unitName, person.identityCard, person.remark,
                                            // Also check custom fields existence
                                            person.customFields && Object.values(person.customFields).some(v => v && v !== "")
                                        ].some(val => val && val !== "" && val !== "Nil" && val !== "--");
                                        return hasData;
                                    })
                                    .map((person, index) => {
                                        // Helper to resolve value from prop or customFields (case-insensitive search in customFields)
                                        const getVal = (keys: string[], propVal?: string) => {
                                            if (propVal && propVal !== "" && propVal !== "Nil") return propVal;
                                            if (!person.customFields) return null;

                                            for (const key of keys) {
                                                // Exact match
                                                if (person.customFields[key]) return person.customFields[key];

                                                // Case insensitive match
                                                const lowerKey = key.toLowerCase();
                                                const foundKey = Object.keys(person.customFields).find(k => k.toLowerCase() === lowerKey || k.toLowerCase().replace(/\s/g, '') === lowerKey);
                                                if (foundKey) return person.customFields[foundKey];
                                            }
                                            return null;
                                        };

                                        const armyNo = getVal(['armyNo', 'armyNumber', 'serviceNumber'], person.armyNo);
                                        const rank = getVal(['rank'], person.rank);
                                        const name = getVal(['name', 'personName', 'witnessName'], person.name);
                                        const iCard = getVal(['iCardNumber', 'identityCard', 'icard', 'idCard', 'passNo'], person.identityCard);
                                        const unit = getVal(['unit', 'unitName'], person.unitName);
                                        const fmn = getVal(['fmn', 'fmnName'], person.fmn);
                                        const address = getVal(['address'], person.address);

                                        // New Civilian Fields used in witnesses too
                                        const aadhar = getVal(['aadhar', 'aadharCard', 'aadharCardNo', 'adhar']);
                                        const so = getVal(['so', 's/o', 'fatherName', 'father']);
                                        const relation = getVal(['relation', 'relationship', 'nametheRelation']);
                                        const tele = getVal(['tele', 'mobile', 'contact', 'phone']);

                                        return (
                                            <tr key={index} className="break-inside-avoid">
                                                <td className="border border-gray-300 p-2 text-center font-bold align-middle">5.{index + 1}</td>
                                                <td className="border border-gray-300 p-2 align-top">
                                                    <div className="grid grid-cols-[110px_1fr] gap-y-1">
                                                        {aadhar && (
                                                            <>
                                                                <span className="font-bold">Aadhar Card No.:</span>
                                                                <span className="break-words">{aadhar}</span>
                                                            </>
                                                        )}
                                                        {armyNo && (
                                                            <>
                                                                <span className="font-bold">Army no.:</span>
                                                                <span className="break-words">{armyNo}</span>
                                                            </>
                                                        )}

                                                        {rank && (
                                                            <>
                                                                <span className="font-bold">Rank:</span>
                                                                <span className="break-words">{rank}</span>
                                                            </>
                                                        )}

                                                        {name && (
                                                            <>
                                                                <span className="font-bold">Name:</span>
                                                                <span className="break-words">{name}</span>
                                                            </>
                                                        )}
                                                        {so && (
                                                            <>
                                                                <span className="font-bold">S/O:</span>
                                                                <span className="break-words">{so}</span>
                                                            </>
                                                        )}
                                                        {relation && (
                                                            <>
                                                                <span className="font-bold">Relation:</span>
                                                                <span className="break-words">{relation}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center align-middle break-words max-w-[100px]">
                                                    {iCard || "--"}
                                                </td>
                                                <td className="border border-gray-300 p-2 align-top">
                                                    <div className="grid grid-cols-[60px_1fr] gap-y-1">
                                                        {unit && (
                                                            <>
                                                                <span className="font-bold">Unit:</span>
                                                                <span className="break-words">{unit}</span>
                                                            </>
                                                        )}
                                                        {tele && (
                                                            <>
                                                                <span className="font-bold">Tele:</span>
                                                                <span className="break-words">{tele}</span>
                                                            </>
                                                        )}

                                                        {fmn && (
                                                            <>
                                                                <span className="font-bold">FMN:</span>
                                                                <span className="break-words">{fmn}</span>
                                                            </>
                                                        )}

                                                        {address && (
                                                            <>
                                                                <span className="font-bold">Address:</span>
                                                                <span className="break-words">{address}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 p-2 align-middle text-center">
                                                    {person.remark || "--"}
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div>}

                {/* 6. EVIDENCE */}
                {evidence && <div className="mb-6 break-inside-avoid">
                    <div className="font-bold mb-4 text-[12px]">
                        6. &nbsp;&nbsp; <span className="underline">EVIDENCE:</span> <span className="font-normal text-[12px] ml-2">(Collect and record evidence carefully)</span>
                    </div>
                    <div className="flex justify-between items-end px-4 text-[12px] mt-8 gap-8">
                        <div className="border-b border-gray-400 flex-1 pb-1">
                            <span className="font-bold mr-2">6.1 Eye Sketch-</span> {evidence.eyeSketch || "Nil"}
                        </div>
                        <div className="border-b border-gray-400 flex-1 pb-1 mx-4">
                            <span className="font-bold mr-2">6.2 Photos-</span> {evidence.photos || "Nil"}
                        </div>
                        <div className="border-b border-gray-400 flex-1 pb-1">
                            <span className="font-bold mr-2">6.3 Videos-</span> {evidence.videos || "Nil"}
                        </div>
                    </div>
                </div>}

                {/* 7. DOCUMENTS ATTACHED */}
                {documents.length > 0 && <div className="flex-1">
                    <div className="font-bold mb-4 text-[12px]">
                        7. &nbsp;&nbsp; <span className="underline">DOCUMENTS ATTACHED</span>
                    </div>
                    <div className="pl-4 space-y-4 text-[12px]">
                        {documents.map((doc, i) => (
                            <div key={i} className="flex items-start">
                                <span className="w-8 shrink-0">7.{i + 1}</span>
                                <span className="text-justify leading-relaxed">{doc}</span>
                            </div>
                        ))}
                    </div>
                </div>}

                {/* Page 2 Footer */}
                <div className="mt-auto pt-8 text-center font-bold text-xs underline">RESTRICTED</div>
            </div>

            {/* ==================== PAGE 3 ==================== */}
            {
                detailedReport.statement && <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col print:p-[48px]" style={{ pageBreakAfter: 'always' }}>

                    {/* Header Page 3 */}
                    <div className="text-center font-bold mb-4">
                        <div className="text-sm ">-3-</div>
                        <div className="text-[12px] underline">RESTRICTED</div>
                    </div>

                    {/* 8. DETAILED OCCURRENCE REPORT */}
                    <div className="mb-6">
                        <div className="font-bold mb-4 text-[12px]">
                            8. &nbsp;&nbsp; <span className="underline">DETAILED OCCURRENCE REPORT</span>
                        </div>

                        <p className="mb-4 text-[12px] pl-4">Sir,</p>

                        <div className="pl-4 space-y-4 text-[12px]">
                            {
                                detailedReport.statement.split('\n').filter(line => line.trim() !== '').map((paragraph, index) => (
                                    <div key={index} className="flex items-start">
                                        <span className="w-10 shrink-0">8.{index + 1}</span>
                                        <span className="text-justify leading-relaxed">{paragraph}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>



                    {/* Page 3 Footer */}
                    <div className="mt-auto pt-8 text-center font-bold text-xs underline">RESTRICTED</div>

                </div>
            }

            {/* ==================== PAGE 4 ==================== */}
            {
                detailedReport.findings.length > 0 && (<div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col print:p-[48px]" style={{ pageBreakAfter: 'always' }}>

                    {/* Header Page 4 */}
                    <div className="text-center font-bold mb-4">
                        <div className="text-sm ">-4-</div>
                        <div className="text-xs underline">RESTRICTED</div>
                    </div>

                    {/* 9. POINTS FIND OUT DURING THE INVESTIGATION */}
                    {detailedReport.findings.length > 0 && (<div className="mb-6">
                        <div className="font-bold mb-4 text-[12px]">
                            9. &nbsp;&nbsp; <span className="underline uppercase">POINTS FIND OUT DURING THE INVESTIGATION</span>
                        </div>

                        <div className="pl-4 space-y-4 text-[12px]">
                            {detailedReport.findings.map((point, i) => (
                                <div key={i} className="flex items-start">
                                    <span className="w-10 shrink-0">9.{i + 1}</span>
                                    <span className="text-justify leading-relaxed">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>)}

                    {/* Page 4 Footer */}
                    <div className="mt-auto pt-8 text-center font-bold text-[12px] underline">RESTRICTED</div>

                </div>)
            }

            {/* ==================== PAGE 5 ==================== */}
            {
                detailedReport.opinion && (<div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col print:p-[48px]" style={{ pageBreakAfter: 'always' }}>

                    {/* Header Page 5 */}
                    <div className="text-center font-bold mb-4">
                        <div className="text-sm ">-5-</div>
                        <div className="text-xs underline">RESTRICTED</div>
                    </div>

                    {/* 10. OPINION */}
                    {
                        detailedReport.opinion && (
                            <div className="mb-6">
                                <div className="font-bold text-[12px] mb-4">10. &nbsp;&nbsp; <span className="underline">OPINION:</span></div>
                                <div className="pl-4 space-y-4 text-[12px]">
                                    {
                                        detailedReport.opinion.split('\n').filter(line => line.trim() !== '').map((paragraph, index) => (
                                            <div key={index} className="flex items-start">
                                                <span className="w-10 shrink-0">10.{index + 1}</span>
                                                <span className="text-justify leading-relaxed">{paragraph}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }


                    {reportDate && (<div className="pt-8 flex justify-between items-end text-[12px] mb-32">
                        <div>
                            <span className="font-bold">Dated :</span> <span>{reportDate}</span>
                        </div>
                        <div className="text-center">
                            (Signature of MP JCO/NCO)
                        </div>
                    </div>)}

                    <div className="text-center mt-auto pt-8 font-bold text-[12px] underline">RESTRICTED</div>

                </div>)
            }

            {/* ==================== PAGE 6 ==================== */}
            {
                remarks.analysis &&
                <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col print:p-[48px]">

                    {/* Header Page 6 */}
                    <div className="text-center font-bold mb-4">
                        <div className="text-sm ">-6-</div>
                        <div className="text-xs underline">RESTRICTED</div>
                    </div>

                    {/* 11. REMARKS CO/2IC PROVOST UNIT */}
                    <div className="mb-6">
                        <div className="flex items-baseline mb-1 text-[12px]">
                            <span className="font-bold w-8 shrink-0">11.</span>
                            <span className="font-bold underline">REMARKS CO/2IC PROVOST UNIT</span>
                        </div>
                        <div className="text-[12px] mb-6 pl-8">
                            Check evidence gives analysis and recommendation and fill IAFD-901 if required
                        </div>

                        {/* 11.1 ANALYSIS */}
                        {
                            remarks?.analysis && (
                                <div className="mb-6">
                                    <div className="flex items-baseline mb-4 text-[12px] pl-8">
                                        <span className="font-bold w-10 shrink-0">11.1</span>
                                        <span className="font-bold underline">ANALYSIS-</span>
                                    </div>
                                    <div className="pl-8 space-y-4 text-[12px]">
                                        {
                                            remarks.analysis.split('\n').filter(line => line.trim() !== '').map((paragraph, index) => (
                                                <div key={index} className="flex items-start">
                                                    <span className="w-12 shrink-0">11.1.{index + 1}</span>
                                                    <span className="text-justify leading-relaxed">{paragraph}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }

                        {/* 11.2 RECOMMENDATION */}
                        {
                            remarks?.recommendation && (
                                <div className="mb-6">
                                    <div className="flex items-baseline mb-4 text-[12px] pl-8">
                                        <span className="font-bold w-10 shrink-0">11.2</span>
                                        <span className="font-bold underline">RECOMMENDATION-</span>
                                    </div>
                                    <div className="pl-8 space-y-4 text-[12px]">
                                        {
                                            remarks.recommendation.split('\n').filter(line => line.trim() !== '').map((paragraph, index) => (
                                                <div key={index} className="flex items-start">
                                                    <span className="w-12 shrink-0">11.2.{index + 1}</span>
                                                    <span className="text-justify leading-relaxed">{paragraph}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    {
                        station && reportDate && (
                            <div className="mt-auto pt-16 flex justify-between items-end text-[12px] mb-32">
                                <div className="space-y-1">
                                    <div>
                                        <span className="font-bold">Station :</span> <span>{station}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold">Dated :</span> <span>{reportDate}</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    (Signature of CO/2IC with unit seal)
                                </div>
                            </div>
                        )
                    }


                    <div className="text-center mt-auto pt-8 font-bold text-[12px] underline">RESTRICTED</div>
                </div>
            }

        </div >
    );

};

export default MpOccurrenceReport;