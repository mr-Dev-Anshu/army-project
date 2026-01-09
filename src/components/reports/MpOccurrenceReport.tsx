import React from 'react';

export interface MpOccurrenceReportProps {
    reportNo: string;
    command: string;
    firNo: string;
    mpDetails: {
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
    evidence: {
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
        <div className={`font-[Arial] text-[#0A0A0A]  p-8 flex flex-col gap-8 print:block print:p-0 print:gap-0 print:bg-white text-[12px] ${className || ''}`}>
            <style type="text/css" media="print">
                {`
                  @page {
                    size: A4;
                    margin: 20mm;
                  }
                  body {
                    background-color: white !important;
                    -webkit-print-color-adjust: exact;
                  }
                `}
            </style>

            {/* Print Only: Fixed Global Page Numbering */}
            <div className="hidden print:block fixed top-0 w-full text-center font-bold text-sm page-number mt-4 z-50"></div>

            {/* ==================== PAGE 1 ==================== */}
            <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

                {/* Header Page 1 */}
                <div className="text-center font-bold text-[12px] underline mb-4 print:invisible">RESTRICTED</div>
                <div className="text-right font-bold text-[12px] mb-8 print:mt-12 underline">IAFP-1479 (Revised)</div>

                <h1 className="text-center font-bold text-[16px] underline mb-8">
                    MP OCCURRENCE & INVESTIGATION REPORT
                </h1>

                <div className="grid grid-cols-3 items-start mb-8 text-[12px]">
                    <div className="text-left">
                        <span className="font-bold">Report No-</span> {reportNo}<br />
                        <span>(Fill in Desk Room)</span>
                    </div>
                    <div className="justify-self-center text-left">
                        <span className="font-bold">Command-</span> {command}<br />
                        <span>(Origin)</span>
                    </div>
                    <div className="justify-self-end text-left">
                        <span className="font-bold">FIR No.-</span> {firNo}<br />
                        <span>(Att Copy Filed)</span>
                    </div>
                </div>

                {/* 1. MP DETAILS */}
                <div className="mb-6 break-inside-avoid">
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
                </div>

                {/* 2. OCCURRENCE DETAILS */}
                <div className="mb-6 break-inside-avoid">
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
                        {occurrence.place && (
                            <div className="flex">
                                <span className="w-8 ">2.2</span>
                                <div className="flex-1">
                                    <span className="font-bold">Place of Occurrence-</span> <span className="ml-2">{occurrence.place}</span>
                                </div>
                            </div>
                        )}
                        {occurrence.date && (
                            <div className="flex">
                                <span className="w-8 ">2.3</span>
                                <div className="flex-1">
                                    <span className="font-bold">Date of Occurrence-</span> <span className="ml-2">{occurrence.date}</span>
                                </div>
                            </div>
                        )}
                        {occurrence.time && (
                            <div className="flex">
                                <span className="w-8 ">2.4</span>
                                <div className="flex-1">
                                    <span className="font-bold">Time of Occurrence-</span> <span className="ml-2">{occurrence.time} Hrs</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. DETAILS OF VICTIMS/OFFENDERS */}
                <div className="mb-6">
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
                            {people.map((person, index) => {
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

                                return (
                                    <tr key={index} className="break-inside-avoid">
                                        <td className="border border-gray-300 p-2 text-center font-bold align-middle">3.{person.sno}</td>
                                        <td className="border border-gray-300 p-2 align-top">
                                            <div className="grid grid-cols-[80px_1fr] gap-y-1">
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
                            {people.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">No details available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="text-[12px] text-gray-700 leading-tight text-justify">
                        (To be read out to the Offender(s) by the MP 'above recorded personal particulars have been given by me voluntarily and I certify and sign them as correct. If found otherwise. I am liable for disciplinary action under the Army Act').
                    </div>
                </div>

                {/* 4. BRIEF OF OCCURRENCE */}
                <div className="flex-1">
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
                </div>

                {/* Page 1 Footer */}
                <div className="mt-8 text-center font-bold">
                    <div className="text-[12px] underline mt-2">RESTRICTED</div>
                </div>
            </div>


            {/* ==================== PAGE 2 ==================== */}
            <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

                {/* Header Page 2 */}
                <div className="text-center font-bold mb-8">
                    <div className="text-sm print:hidden">-2-</div>
                    <div className="text-xs underline">RESTRICTED</div>
                </div>

                {/* 5. WITNESS */}
                <div className="mb-6">
                    <div className="font-bold mb-2 text-[12px]">
                        5. &nbsp;&nbsp; <span className="underline">WITNESS:</span> <span className="font-normal text-[12px] ml-2">(Witness must record statement in own hand where possible)</span>
                    </div>
                    <table className="w-full border-collapse border border-gray-300 text-[12px] mb-2 break-inside-auto">
                        <thead>
                            <tr className="bg-white">
                                <th className="border border-gray-300 p-2 w-16 text-center align-middle">Sr no.</th>
                                <th className="border border-gray-300 p-2 text-left align-middle">Army No, Rank & Name</th>
                                <th className="border border-gray-300 p-2 text-left align-middle">Identity Card</th>
                                <th className="border border-gray-300 p-2 text-left align-middle">Unit/Tele No.</th>
                                <th className="border border-gray-300 p-2 text-left align-middle">Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {witnesses.length > 0 ? witnesses.map((person, index) => {
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

                                return (
                                    <tr key={index} className="break-inside-avoid">
                                        <td className="border border-gray-300 p-2 text-center font-bold align-middle">5.{person.sno}</td>
                                        <td className="border border-gray-300 p-2 align-top">
                                            <div className="grid grid-cols-[80px_1fr] gap-y-1">
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
                            }) : (
                                <tr><td colSpan={5} className="p-4 text-center text-gray-400">No witnesses recorded</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 6. EVIDENCE */}
                <div className="mb-6 break-inside-avoid">
                    <div className="font-bold mb-4 text-[12px]">
                        6. &nbsp;&nbsp; <span className="underline">EVIDENCE:</span> <span className="font-normal text-[12px] ml-2">(Collect and record evidence carefully)</span>
                    </div>
                    <div className="flex justify-between items-end px-4 text-[12px] mt-8 gap-8">
                        {evidence.eyeSketch && (
                            <div className="border-b border-gray-400 flex-1 pb-1">
                                <span className="font-bold mr-2">6.1 Eye Sketch-</span> {evidence.eyeSketch}
                            </div>
                        )}
                        {evidence.photos && (
                            <div className="border-b border-gray-400 flex-1 pb-1 mx-4">
                                <span className="font-bold mr-2">6.2 Photos-</span> {evidence.photos}
                            </div>
                        )}
                        {evidence.videos && (
                            <div className="border-b border-gray-400 flex-1 pb-1">
                                <span className="font-bold mr-2">6.3 Videos-</span> {evidence.videos}
                            </div>
                        )}
                    </div>
                </div>

                {/* 7. DOCUMENTS ATTACHED */}
                <div className="flex-1">
                    <div className="font-bold mb-4 text-[12px]">
                        7. &nbsp;&nbsp; <span className="underline">DOCUMENTS ATTACHED</span>
                    </div>
                    <div className="pl-4 space-y-4 text-[12px]">
                        {documents.length > 0 ? documents.map((doc, i) => (
                            <div key={i} className="flex items-start">
                                <span className="w-8 shrink-0">7.{i + 1}</span>
                                <span className="text-justify leading-relaxed">{doc}</span>
                            </div>
                        )) : (
                            <div className="text-gray-400">No documents attached.</div>
                        )}
                    </div>
                </div>

                {/* Page 2 Footer */}
                <div className="mt-8 pt-8 text-center font-bold text-xs underline">RESTRICTED</div>
            </div>

            {/* ==================== PAGE 3 ==================== */}
            <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

                {/* Header Page 3 */}
                <div className="text-center font-bold mb-4">
                    <div className="text-sm print:hidden">-3-</div>
                    <div className="text-[12px] underline">RESTRICTED</div>
                </div>

                {/* 8. DETAILED OCCURRENCE REPORT */}
                <div className="mb-6">
                    <div className="font-bold mb-4 text-[12px]">
                        8. &nbsp;&nbsp; <span className="underline">DETAILED OCCURRENCE REPORT</span>
                    </div>

                    <p className="mb-4 text-[12px] pl-4">Sir,</p>

                    <div className="pl-4 space-y-4 text-[12px]">
                        {detailedReport.statement ? (
                            detailedReport.statement.split('\n').filter(line => line.trim() !== '').map((paragraph, index) => (
                                <div key={index} className="flex items-start">
                                    <span className="w-10 shrink-0">8.{index + 1}</span>
                                    <span className="text-justify leading-relaxed">{paragraph}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400">No detailed statement available.</div>
                        )}
                    </div>
                </div>



                {/* Page 3 Footer */}
                <div className="mt-auto pt-8 text-center font-bold text-xs underline">RESTRICTED</div>

            </div>

            {/* ==================== PAGE 4 ==================== */}
            <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

                {/* Header Page 4 */}
                <div className="text-center font-bold mb-4">
                    <div className="text-sm print:hidden">-4-</div>
                    <div className="text-xs underline">RESTRICTED</div>
                </div>

                {/* 9. POINTS FIND OUT DURING THE INVESTIGATION */}
                <div className="mb-6">
                    <div className="font-bold mb-4 text-[12px]">
                        9. &nbsp;&nbsp; <span className="underline uppercase">POINTS FIND OUT DURING THE INVESTIGATION</span>
                    </div>

                    <div className="pl-4 space-y-4 text-[12px]">
                        {detailedReport.findings.length > 0 ? detailedReport.findings.map((point, i) => (
                            <div key={i} className="flex items-start">
                                <span className="w-10 shrink-0">9.{i + 1}</span>
                                <span className="text-justify leading-relaxed">{point}</span>
                            </div>
                        )) : (
                            <div className="text-gray-400">No investigation points recorded.</div>
                        )}
                    </div>
                </div>

                {/* Page 4 Footer */}
                <div className="mt-8 pt-8 text-center font-bold text-[12px] underline">RESTRICTED</div>

            </div>

            {/* ==================== PAGE 5 ==================== */}
            <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0">

                {/* Header Page 5 */}
                <div className="text-center font-bold mb-4">
                    <div className="text-sm print:hidden">-5-</div>
                    <div className="text-xs underline">RESTRICTED</div>
                </div>

                {/* 10. OPINION */}
                <div className="mb-6">
                    <div className="font-bold text-[12px] mb-4">10. &nbsp;&nbsp; <span className="underline">OPINION:</span></div>
                    <div className="pl-4 space-y-4 text-[12px]">
                        {detailedReport.opinion ? (
                            detailedReport.opinion.split('\n').filter(line => line.trim() !== '').map((paragraph, index) => (
                                <div key={index} className="flex items-start">
                                    <span className="w-10 shrink-0">10.{index + 1}</span>
                                    <span className="text-justify leading-relaxed">{paragraph}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400">No opinion recorded.</div>
                        )}
                    </div>
                </div>

                <div className="pt-8 flex justify-between items-end text-[12px] mb-32">
                    <div>
                        <span className="font-bold">Dated :</span> <span>{reportDate}</span>
                    </div>
                    <div className="text-center">
                        (Signature of MP JCO/NCO)
                    </div>
                </div>

                <div className="text-center font-bold text-[12px] underline">RESTRICTED</div>

            </div>

            {/* ==================== PAGE 6 ==================== */}
            <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0">

                {/* Header Page 6 */}
                <div className="text-center font-bold mb-4">
                    <div className="text-sm print:hidden">-6-</div>
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
                    <div className="mb-6">
                        <div className="flex items-baseline mb-4 text-[12px] pl-8">
                            <span className="font-bold w-10 shrink-0">11.1</span>
                            <span className="font-bold underline">ANALYSIS-</span>
                        </div>
                        <div className="pl-8 space-y-4 text-[12px]">
                            {remarks.analysis ? (
                                remarks.analysis.split('\n').filter(line => line.trim() !== '').map((paragraph, index) => (
                                    <div key={index} className="flex items-start">
                                        <span className="w-12 shrink-0">11.1.{index + 1}</span>
                                        <span className="text-justify leading-relaxed">{paragraph}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400">No analysis details recorded.</div>
                            )}
                        </div>
                    </div>

                    {/* 11.2 RECOMMENDATION */}
                    <div className="mb-6">
                        <div className="flex items-baseline mb-4 text-[12px] pl-8">
                            <span className="font-bold w-10 shrink-0">11.2</span>
                            <span className="font-bold underline">RECOMMENDATION-</span>
                        </div>
                        <div className="pl-8 space-y-4 text-[12px]">
                            {remarks.recommendation ? (
                                remarks.recommendation.split('\n').filter(line => line.trim() !== '').map((paragraph, index) => (
                                    <div key={index} className="flex items-start">
                                        <span className="w-12 shrink-0">11.2.{index + 1}</span>
                                        <span className="text-justify leading-relaxed">{paragraph}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400">No recommendation recorded.</div>
                            )}
                        </div>
                    </div>
                </div>

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

                <div className="text-center font-bold text-[12px] underline">RESTRICTED</div>
            </div>

        </div>
    );

};

export default MpOccurrenceReport;
