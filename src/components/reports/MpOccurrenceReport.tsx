    import React from 'react';

    export interface MpOccurrenceReportProps {
        reportNo: string;
        command: string;
        firNo: string;
        mpDetails: {
            armyNo: string;
            rank: string;
            name: string;
            unit: string;
            fmn: string;
            command: string;
        };
        occurrence: {
            offenceType: string;
            place: string;
            date: string;
            time: string;
        };
        people: {
            sno: number;
            armyNo: string;
            rank: string;
            name: string;
            identityCard: string;
            unitName: string;
            fmn: string;
            address: string;
            remark: string;
            role: "Victim" | "Offender" | "Unknown";
        }[];
        briefOfOccurrence: string;
        witnesses: {
            sno: number;
            armyNo: string;
            rank: string;
            name: string;
            identityCard: string;
            unitName: string;
            fmn: string;
            address: string;
            remark: string;
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
            <div className={`font-sans text-gray-900 bg-gray-500/10 p-8 flex flex-col gap-8 print:block print:p-0 print:gap-0 ${className || ''}`}>

                {/* Print Only: Fixed Global Page Numbering */}
                <div className="hidden print:block fixed top-0 w-full text-center font-bold text-sm page-number mt-4 z-50"></div>

                {/* ==================== PAGE 1 ==================== */}
                <div className="max-w-[210mm] w-full mx-auto bg-white p-12 min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

                    {/* Header Page 1 */}
                    <div className="text-center font-bold text-xs underline mb-4 print:invisible">RESTRICTED</div>
                    <div className="text-right font-bold text-xs mb-8 print:mt-12">IAFP-1479 (Revised)</div>

                    <h1 className="text-center font-bold text-lg underline mb-8">
                        MP OCCURRENCE & INVESTIGATION REPORT
                    </h1>

                    <div className="flex justify-between items-start mb-8 text-sm">
                        <div className="w-1/3">
                            <span className="font-bold">Report No-</span> {reportNo}<br />
                            <span className="text-xs text-gray-500">(Fill in Desk Room)</span>
                        </div>
                        <div className="w-1/3 text-center">
                            <span className="font-bold">Command-</span> {command}<br />
                            <span className="text-xs text-gray-500">(Origin)</span>
                        </div>
                        <div className="w-1/3 text-right">
                            <span className="font-bold">FIR No.-</span> {firNo}<br />
                            <span className="text-xs text-gray-500">(Att Copy Filed)</span>
                        </div>
                    </div>

                    {/* 1. MP DETAILS */}
                    <div className="mb-6 break-inside-avoid">
                        <div className="font-bold mb-2">1. &nbsp;&nbsp; MP DETAILS:</div>
                        <div className="border border-gray-300 p-4 rounded-sm text-sm">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                                <div className="grid grid-cols-[100px_1fr]">
                                    <span className="font-bold">Army no.</span>
                                    <span>{mpDetails.armyNo}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr]">
                                    <span className="font-bold">Rank</span>
                                    <span>{mpDetails.rank}</span>
                                </div>

                                <div className="grid grid-cols-[100px_1fr]">
                                    <span className="font-bold">Name</span>
                                    <span>{mpDetails.name}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr]">
                                    <span className="font-bold">Unit</span>
                                    <span>{mpDetails.unit}</span>
                                </div>

                                <div className="grid grid-cols-[100px_1fr]">
                                    <span className="font-bold">FMN</span>
                                    <span>{mpDetails.fmn}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr]">
                                    <span className="font-bold">Command</span>
                                    <span>{mpDetails.command}</span>
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-gray-600">
                                (MP must caution witness and ensure presence of independent witness if possible)
                            </div>
                        </div>
                    </div>

                    {/* 2. OCCURRENCE DETAILS */}
                    <div className="mb-6 break-inside-avoid">
                        <div className="font-bold mb-2">2. &nbsp;&nbsp; OCCURRENCE DETAILS:</div>
                        <div className="ml-4 space-y-2 text-sm">
                            <div className="grid grid-cols-[180px_1fr] items-start">
                                <span className="font-bold">Occurrence Offence Type-</span>
                                <span>{occurrence.offenceType}</span>
                            </div>
                            <div className="grid grid-cols-[180px_1fr] items-start">
                                <span className="font-bold">Place of Occurrence-</span>
                                <span>{occurrence.place}</span>
                            </div>
                            <div className="grid grid-cols-[180px_1fr] items-start">
                                <span className="font-bold">Date of Occurrence-</span>
                                <span>{occurrence.date}</span>
                            </div>
                            <div className="grid grid-cols-[180px_1fr] items-start">
                                <span className="font-bold">Time of Occurrence-</span>
                                <span>{occurrence.time} Hrs</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. DETAILS OF VICTIMS/OFFENDERS */}
                    <div className="mb-6">
                        <div className="font-bold mb-2">
                            3. &nbsp;&nbsp; <span className="underline">DETAILS OF VICTIMS/OFFENDERS:</span> <span className="font-normal text-sm ml-2">(MP must verify personal particulars)</span>
                        </div>
                        <table className="w-full border-collapse border border-gray-300 text-sm mb-2 break-inside-auto">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 p-2 w-12 text-center">Sno.</th>
                                    <th className="border border-gray-300 p-2 text-left">Army No., Rank & Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Identity Card</th>
                                    <th className="border border-gray-300 p-2 text-left">Unit/Tele No.</th>
                                    <th className="border border-gray-300 p-2 text-left">Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {people.map((person, index) => (
                                    <tr key={index} className="break-inside-avoid">
                                        <td className="border border-gray-300 p-2 text-center font-bold">{person.sno}.</td>
                                        <td className="border border-gray-300 p-2 align-top">
                                            <div className="grid grid-cols-[60px_1fr] gap-y-1">
                                                <span className="font-bold">Army no.:</span>
                                                <span>{person.armyNo}</span>
                                                <span className="font-bold">Rank:</span>
                                                <span>{person.rank}</span>
                                                <span className="font-bold">Name:</span>
                                                <span>{person.name}</span>
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center align-middle">
                                            {person.identityCard}
                                        </td>
                                        <td className="border border-gray-300 p-2 align-top">
                                            <div className="grid grid-cols-[60px_1fr] gap-y-1">
                                                <span className="font-bold">Unit:</span>
                                                <span>{person.unitName}</span>
                                                <span className="font-bold">FMN:</span>
                                                <span>{person.fmn}</span>
                                                <span className="font-bold">Address:</span>
                                                <span>{person.address}</span>
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 p-2 align-middle text-center">
                                            {person.remark || "--"}
                                        </td>
                                    </tr>
                                ))}
                                {people.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-gray-500">No details available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="text-xs text-gray-700 leading-tight">
                            (To be read out to the Offender(s) by the MP 'above recorded personal particulars have been given by me voluntarily and I certify and sign them as correct. If found otherwise. I am liable for disciplinary action under the Army Act').
                        </div>
                    </div>

                    {/* 4. BRIEF OF OCCURRENCE */}
                    <div className="flex-1">
                        <div className="font-bold mb-2">
                            4. &nbsp;&nbsp; <span className="underline">BRIEF OF OCCURRENCE</span> <span className="font-normal text-sm ml-2">(Details on Reverse) offence:</span>
                        </div>
                        <p className="text-justify text-sm leading-relaxed whitespace-pre-line text-wrap">
                            {briefOfOccurrence}
                        </p>
                    </div>

                    {/* Page 1 Footer */}
                    <div className="mt-8 text-center font-bold">
                        <div className="text-sm print:hidden">-1-</div>
                        <div className="text-xs underline mt-2">RESTRICTED</div>
                    </div>
                </div>


                {/* ==================== PAGE 2 ==================== */}
                <div className="max-w-[210mm] w-full mx-auto bg-white p-12 min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

                    {/* Header Page 2 */}
                    <div className="text-center font-bold mb-8">
                        <div className="text-sm print:hidden">-2-</div>
                        <div className="text-xs underline">RESTRICTED</div>
                    </div>

                    {/* 5. WITNESS */}
                    <div className="mb-6">
                        <div className="font-bold mb-2">
                            5. &nbsp;&nbsp; <span className="underline">WITNESS:</span> <span className="font-normal text-sm ml-2">(Witness must record statement in own hand where possible)</span>
                        </div>
                        <table className="w-full border-collapse border border-gray-300 text-sm mb-2 break-inside-auto">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 p-2 w-12 text-center">Sno.</th>
                                    <th className="border border-gray-300 p-2 text-left">Army No., Rank & Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Identity Card</th>
                                    <th className="border border-gray-300 p-2 text-left">Unit/Tele No.</th>
                                    <th className="border border-gray-300 p-2 text-left">Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {witnesses.length > 0 ? witnesses.map((person, index) => (
                                    <tr key={index} className="break-inside-avoid">
                                        <td className="border border-gray-300 p-2 text-center font-bold">{person.sno}.</td>
                                        <td className="border border-gray-300 p-2 align-top">
                                            <div className="grid grid-cols-[60px_1fr] gap-y-1">
                                                <span className="font-bold">Army no.:</span>
                                                <span>{person.armyNo}</span>
                                                <span className="font-bold">Rank:</span>
                                                <span>{person.rank}</span>
                                                <span className="font-bold">Name:</span>
                                                <span>{person.name}</span>
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center align-middle">
                                            {person.identityCard}
                                        </td>
                                        <td className="border border-gray-300 p-2 align-top">
                                            <div className="grid grid-cols-[60px_1fr] gap-y-1">
                                                <span className="font-bold">Unit:</span>
                                                <span>{person.unitName}</span>
                                                <span className="font-bold">FMN:</span>
                                                <span>{person.fmn}</span>
                                                <span className="font-bold">Address:</span>
                                                <span>{person.address}</span>
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 p-2 align-middle text-center">
                                            {person.remark || "--"}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="p-4 text-center text-gray-400">No witnesses recorded</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 6. EVIDENCE */}
                    <div className="mb-6 break-inside-avoid">
                        <div className="font-bold mb-4">
                            6. &nbsp;&nbsp; <span className="underline">EVIDENCE:</span> <span className="font-normal text-sm ml-2">(Collect and record evidence carefully)</span>
                        </div>
                        <div className="flex justify-between items-end px-4 text-sm mt-8">
                            <div className="border-b border-gray-400 w-1/3 pb-1">
                                <span className="font-bold mr-2">Eye Sketch-</span> {evidence.eyeSketch || "Nil"}
                            </div>
                            <div className="border-b border-gray-400 w-1/3 pb-1 mx-4">
                                <span className="font-bold mr-2">Photos-</span> {evidence.photos || "________"}
                            </div>
                            <div className="border-b border-gray-400 w-1/3 pb-1">
                                <span className="font-bold mr-2">Videos-</span> {evidence.videos || "________"}
                            </div>
                        </div>
                    </div>

                    {/* 7. DOCUMENTS ATTACHED */}
                    <div className="flex-1">
                        <div className="font-bold mb-4">
                            7. &nbsp;&nbsp; <span className="underline">DOCUMENTS ATTACHED</span>
                        </div>
                        <ol className="list-decimal pl-6 space-y-4 text-sm text-justify">
                            {documents.length > 0 ? documents.map((doc, i) => (
                                <li key={i}>{doc}</li>
                            )) : (
                                <li className="text-gray-400">No documents attached.</li>
                            )}
                        </ol>
                    </div>

                    {/* Page 2 Footer */}
                    <div className="mt-8 pt-8 text-center font-bold text-xs underline">RESTRICTED</div>
                </div>

                {/* ==================== PAGE 3 ==================== */}
                <div className="max-w-[210mm] w-full mx-auto bg-white p-12 min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

                    {/* Header Page 3 */}
                    <div className="text-center font-bold mb-4">
                        <div className="text-sm print:hidden">-3-</div>
                        <div className="text-xs underline">RESTRICTED</div>
                    </div>

                    <div className="text-center font-bold underline text-sm mb-6">
                        DETAILED OCCURRENCE REPORT
                    </div>

                    <div className="mb-6">
                        <p className="mb-2 text-sm">Sir,</p>
                        <div className="text-sm text-justify leading-relaxed whitespace-pre-line">
                            {detailedReport.statement || "No detailed statement available."}
                        </div>
                    </div>

                    <div className="mt-6 mb-4 font-bold underline text-sm">
                        POINTS FIND OUT DURING THE INVESTIGATION
                    </div>

                    <ol className="list-decimal pl-6 space-y-4 text-sm text-justify mb-8">
                        {detailedReport.findings.length > 0 ? detailedReport.findings.map((point, i) => (
                            <li key={i}>{point}</li>
                        )) : (
                            <li className="text-gray-400">No investigation points recorded.</li>
                        )}
                    </ol>

                    {/* Page 3 Footer */}
                    <div className="mt-auto pt-8 text-center font-bold text-xs underline">RESTRICTED</div>

                </div>

                {/* ==================== PAGE 4 ==================== */}
                <div className="max-w-[210mm] w-full mx-auto bg-white p-12 min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

                    {/* Header Page 4 */}
                    <div className="text-center font-bold mb-4">
                        <div className="text-sm print:hidden">-4-</div>
                        <div className="text-xs underline">RESTRICTED</div>
                    </div>

                    {/* OPINION */}
                    <div className="mb-6 flex-1">
                        <div className="font-bold underline text-sm mb-4">OPINION:</div>
                        <div className="text-sm text-justify leading-relaxed whitespace-pre-line">
                            {detailedReport.opinion || "No opinion recorded."}
                        </div>
                    </div>

                    <div className="mt-auto pt-16 flex justify-between items-end text-sm font-bold">
                        <div>
                            Dated : {reportDate}
                        </div>
                        <div className="text-center">
                            (Signature of MP JCO/NCO)
                        </div>
                    </div>

                    {/* Page 4 Footer */}
                    <div className="mt-8 pt-8 text-center font-bold text-xs underline">RESTRICTED</div>

                </div>

                {/* ==================== PAGE 5 ==================== */}
                <div className="max-w-[210mm] w-full mx-auto bg-white p-12 min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0">

                    {/* Header Page 5 */}
                    <div className="text-center font-bold mb-4">
                        <div className="text-sm print:hidden">-5-</div>
                        <div className="text-xs underline">RESTRICTED</div>
                    </div>

                    {/* REMARKS HEADING */}
                    <div className="text-center mb-8">
                        <div className="text-sm font-bold underline uppercase">REMARKS CO/2IC PROVOST UNIT</div>
                        <div className="text-xs mt-1">Check evidence gives analysis and recommendation and fill IAFP-901 if required</div>
                    </div>

                    {/* ANALYSIS */}
                    <div className="mb-8">
                        <div className="font-bold underline text-sm mb-4">ANALYSIS-</div>
                        <div className="text-sm text-justify leading-relaxed whitespace-pre-line">
                            {remarks.analysis || "No analysis details recorded."}
                        </div>
                    </div>

                    {/* RECOMMENDATION */}
                    <div className="mb-8 flex-1">
                        <div className="font-bold underline text-sm mb-4">RECOMMENDATION-</div>
                        <div className="text-sm text-justify leading-relaxed whitespace-pre-line">
                            {remarks.recommendation || "No recommendation recorded."}
                        </div>
                    </div>

                    <div className="mt-auto pt-16 flex justify-between items-end text-sm font-bold">
                        <div className="space-y-1">
                            <div>Station : {station}</div>
                            <div>Dated : {reportDate}</div>
                        </div>
                        <div className="text-center">
                            (Signature of CO/2IC with unit seal)
                        </div>
                    </div>

                    {/* Page 5 Footer */}
                    <div className="mt-8 pt-8 text-center font-bold text-xs underline">RESTRICTED</div>

                </div>

            </div>
        );
    };

    export default MpOccurrenceReport;
