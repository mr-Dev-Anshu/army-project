
import React from 'react';
import { format } from "date-fns";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";
import { cn } from "@/lib/utils";

interface ImmediateReportingIncidentReportProps {
    data: ImmediateReportingIncident;
}

const ImmediateReportingIncidentReport: React.FC<ImmediateReportingIncidentReportProps> = ({ data }) => {
    const individuals = data.individuals || [];

    const getIndividualInfo = (ind: any) => {
        const details = { ...(ind.individualDetails || {}), ...(ind.offenderDetails || {}) };

        // Helper to pick first non-empty value
        const pick = (...args: any[]) => args.find(a => a !== undefined && a !== null && a !== "");

        // Common Fields map
        let info = {
            armyNo: pick(details.militaryPersonnelArmyNo, details.employeeServiceNumber, details.maidPassNumber, details.shopPassNo, details.tempWorkerPassNo, details.civilianAadharCardNumber, details.armyNo),
            rank: pick(details.militaryPersonnelRank, details.employeeRank, details.officersEnclaveRank, details.rank),
            name: pick(details.militaryPersonnelName, details.employeeName, details.maidName, details.officersEnclaveName, details.shopOwnerName, details.tempWorkerName, details.civilianName, details.name),
            unit: pick(details.militaryPersonnelUnit, details.employeeUnit, details.officersEnclaveUnit, details.shopUnit, details.unit),
            fmn: pick(details.militaryPersonnelFmn, details.employeeFmn, details.officersEnclaveFmn, details.fmn),
            command: pick(details.militaryPersonnelCommand, details.employeeCommand, details.officersEnclaveCommand, details.command),
            address: pick(details.militaryPersonnelAddress, details.employeeAddress, details.officersEnclaveAddress, details.shopAddress, details.tempWorkerPlaceOfStay, details.civilianAddress, details.address),
            iCard: pick(details.militaryPersonnelICardNumber, details.employeeICardNumber, details.officersEnclaveICardNumber, details.iCardNumber),

            // Special fields
            fatherName: pick(details.civilianFathersName, details.maidFathersName),
            relation: details.relationName,

            // Relative (Nested)
            relative: null as any
        };

        if (details.relativeDetails && Object.keys(details.relativeDetails).length > 0) {
            const rel = details.relativeDetails;
            info.relative = {
                armyNo: pick(rel.armyNo, rel.employeeServiceNumber, rel.maidPassNumber),
                rank: pick(rel.rank, rel.employeeRank, rel.officersEnclaveRank),
                name: pick(rel.militaryPersonnelName, rel.employeeName, rel.maidName, rel.officersEnclaveName),
                unit: pick(rel.militaryPersonnelUnit, rel.employeeUnit, rel.officersEnclaveUnit, rel.maidUnit),
                fmn: pick(rel.militaryPersonnelFmn, rel.employeeFmn, rel.officersEnclaveFmn, rel.maidFmn),
                command: pick(rel.militaryPersonnelCommand, rel.employeeCommand, rel.officersEnclaveCommand),
                address: pick(rel.militaryPersonnelAddress, rel.employeeAddress),
                iCard: pick(rel.militaryPersonnelICardNumber, rel.employeeICardNumber),
            };
        }

        return info;
    };

    return (
        <div className="font-[Arial] text-[14px] w-[210mm] min-h-[297mm] mx-auto bg-white p-12 text-black leading-relaxed shadow-lg print:shadow-none print:w-full print:min-h-0 print:p-0">
            <div className="text-right mb-6 font-[Arial] font-bold">Appx 'A'</div>

            <div className="text-center mb-8">
                <div className="font-bold uppercase mb-1">IMMEDIATE REPORTING OF INCIDENT</div>
                <div className="font-normal">(Type of Incident like Injury to serving soldier due to RTA etc)</div>
            </div>

            <div className="space-y-6">

                {/* 1. Particulars */}
                <div className="space-y-2">
                    <div className="font-bold">1. &nbsp;&nbsp; Particulars of Offender / Victim & Vehicle Details :</div>

                    <div className="border border-gray-300 rounded-sm overflow-hidden">
                        {/* 1.1 Vehicle */}
                        {(data.vehicleNumber || data.vehicleName) && (
                            <div className="flex border-b border-gray-300 bg-gray-50/50">
                                <div className="p-2 w-16 font-bold text-gray-700 border-r border-gray-300 shrink-0">(1.1)</div>
                                <div className="flex-1 p-2 grid grid-cols-2 gap-4">
                                    <div className="flex gap-2"><span className="font-bold">DD Veh. BA No.</span> <span>{data.vehicleNumber || "-"}</span></div>
                                    <div className="flex gap-2"><span className="font-bold">Make & Take</span> <span>{data.vehicleName || "-"}</span></div>
                                </div>
                            </div>
                        )}

                        {/* Individuals */}
                        {individuals.map((ind, idx) => {
                            const info = getIndividualInfo(ind);
                            const num = data.vehicleNumber ? idx + 2 : idx + 1; // 1.2 if vehicle exists, else 1.1? Usually logic follows fixed structure. Let's assume 1.1 is vehicle, 1.2+ are persons.

                            return (
                                <React.Fragment key={idx}>
                                    <div className="flex border-b border-gray-300 last:border-0 hover:bg-gray-50/30">
                                        <div className="p-2 w-16 font-bold text-gray-700 border-r border-gray-300 shrink-0">
                                            (1.{num})
                                        </div>
                                        <div className="flex-1 p-2">
                                            {/* Main Person Row */}
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                                                {/* Line 1 */}
                                                <div className="flex gap-2">
                                                    <span className="font-bold w-32 shrink-0">{info.fatherName ? "Father's Name" : "Army/Service No."}</span>
                                                    <span>{info.fatherName || info.armyNo || "-"}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="font-bold w-32 shrink-0">{info.fatherName ? "Relation" : "Rank"}</span>
                                                    <span>{info.relation ? `Relation: ${info.relation}` : (info.rank || "-")}</span>
                                                </div>

                                                {/* Line 2 */}
                                                <div className="flex gap-2">
                                                    <span className="font-bold w-32 shrink-0">Name</span>
                                                    <span>{info.name || "-"}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="font-bold w-32 shrink-0">{info.fatherName ? "" : "Unit"}</span>
                                                    <span>{info.fatherName ? "" : (info.unit || "-")}</span>
                                                </div>

                                                {/* Line 3 - Military specific */}
                                                {!info.fatherName && (
                                                    <>
                                                        <div className="flex gap-2">
                                                            <span className="font-bold w-32 shrink-0">FMN</span>
                                                            <span>{info.fmn || "-"}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="font-bold w-32 shrink-0">Command</span>
                                                            <span>{info.command || "-"}</span>
                                                        </div>
                                                        <div className="flex gap-2 col-span-2">
                                                            <span className="font-bold w-32 shrink-0">Address</span>
                                                            <span>{info.address || "-"}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Nested Relative (1.2.1) */}
                                            {info.relative && (
                                                <div className="mt-3 pt-3 border-t border-gray-200 border-dashed">
                                                    <div className="flex mb-2">
                                                        <span className="font-bold text-xs text-gray-500 mr-2">(1.{num}.1)</span>
                                                        <span className="font-bold underline text-sm">Relative Details</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 pl-6">
                                                        <div className="flex gap-2"><span className="font-bold w-24 shrink-0">Army No.</span> <span>{info.relative.armyNo || "-"}</span></div>
                                                        <div className="flex gap-2"><span className="font-bold w-24 shrink-0">Rank</span> <span>{info.relative.rank || "-"}</span></div>
                                                        <div className="flex gap-2"><span className="font-bold w-24 shrink-0">Name</span> <span>{info.relative.name || "-"}</span></div>
                                                        <div className="flex gap-2"><span className="font-bold w-24 shrink-0">Unit</span> <span>{info.relative.unit || "-"}</span></div>
                                                        <div className="flex gap-2"><span className="font-bold w-24 shrink-0">FMN</span> <span>{info.relative.fmn || "-"}</span></div>
                                                        <div className="flex gap-2"><span className="font-bold w-24 shrink-0">Command</span> <span>{info.relative.command || "-"}</span></div>
                                                        <div className="flex gap-2 col-span-2"><span className="font-bold w-24 shrink-0">Address</span> <span>{info.relative.address || "-"}</span></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Age / Service */}
                <div className="flex gap-4">
                    <div className="w-6 font-bold shrink-0">2.</div>
                    <div className="w-1/3 font-bold shrink-0">Age / Service</div>
                    <div className="flex-1">
                        {data.age || individuals[0]?.age || "-"} Yrs / {data.totalServiceDuration || individuals[0]?.totalServiceDuration || "-"} Yrs
                    </div>
                </div>

                {/* 3. Unit / Location */}
                <div className="flex gap-4">
                    <div className="w-6 font-bold shrink-0">3.</div>
                    <div className="w-1/3 font-bold shrink-0">Unit / Location Of Unit</div>
                    <div className="flex-1">
                        {individuals.map((ind, i) => {
                            const info = getIndividualInfo(ind);
                            const u = info.relative ? `${info.unit || "NA"} (Dep) / ${info.relative.unit || "-"}` : (info.unit || "-");
                            const loc = ind.unitLocation || "-";
                            return (
                                <div key={i}>
                                    {individuals.length > 1 && <span className="font-bold mr-2">({i + 1})</span>}
                                    {u}, {loc}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. FMN */}
                <div className="flex gap-4">
                    <div className="w-6 font-bold shrink-0">4.</div>
                    <div className="w-1/3 font-bold shrink-0">FMN</div>
                    <div className="flex-1">
                        {individuals.map((ind, i) => {
                            const info = getIndividualInfo(ind);
                            const f = info.relative ? `${info.fmn || "NA"} (Dep) / ${info.relative.fmn || "-"}` : (info.fmn || "-");
                            return (
                                <div key={i}>
                                    {individuals.length > 1 && <span className="font-bold mr-2">({i + 1})</span>}
                                    {f}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 5. Leave / Duty */}
                <div className="flex gap-4">
                    <div className="w-6 font-bold shrink-0">5.</div>
                    <div className="w-1/3 font-bold shrink-0">Whether Individual On Leave / Duty</div>
                    <div className="flex-1">
                        {data.individualWorkingStatus || individuals[0]?.individualWorkingStatus || "-"}
                    </div>
                </div>

                {/* 6. Place */}
                <div className="flex gap-4">
                    <div className="w-6 font-bold shrink-0">6.</div>
                    <div className="w-1/3 font-bold shrink-0">Place Of Incident</div>
                    <div className="flex-1">{data.placeOfOccurrence || "-"}</div>
                </div>

                {/* 7. Date & Time */}
                <div className="flex gap-4">
                    <div className="w-6 font-bold shrink-0">7.</div>
                    <div className="w-1/3 font-bold shrink-0">Date & Time Of Incident</div>
                    <div className="flex-1">
                        {data.dateOfOccurrence ? format(new Date(data.dateOfOccurrence), "dd/MM/yyyy") : "-"} & {data.timeOfOccurrence ? data.timeOfOccurrence : "-"}hrs
                    </div>
                </div>

                {/* 8. Brief */}
                <div className="flex gap-4">
                    <div className="w-6 font-bold shrink-0">8.</div>
                    <div className="w-1/3 font-bold shrink-0">Brief Of The Incident</div>
                    <div className="flex-1 text-justify leading-snug">
                        {data.description || "-"}
                    </div>
                </div>

                {/* 9. Coord */}
                <div className="flex gap-4">
                    <div className="w-6 font-bold shrink-0">9.</div>
                    <div className="w-1/3 font-bold shrink-0">
                        Coord With Police On Civil, Adm, <br /> FIR & Current Sit
                    </div>
                    <div className="flex-1 text-justify leading-snug">
                        {data.coordWith || "-"}
                    </div>
                </div>

                <div className="mt-16 text-center w-full flex justify-end">
                    <div className="w-1/2 border-t border-black pt-2 text-right">
                        (Incident being covered by __________________________ Pro Unit)
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ImmediateReportingIncidentReport;
