import React from "react";
import { format } from "date-fns";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";
import { cn } from "@/lib/utils";

interface ImmediateReportingIncidentReportProps {
    data: ImmediateReportingIncident;
}

const ImmediateReportingIncidentReport: React.FC<
    ImmediateReportingIncidentReportProps
> = ({ data }) => {
    const individuals = data.individuals || [];

    const getIndividualInfo = (ind: any) => {
        const details = {
            ...(ind.individualDetails || {}),
            ...(ind.offenderDetails || {}),
        };

        // Helper to pick first non-empty value
        const pick = (...args: any[]) =>
            args.find((a) => a !== undefined && a !== null && a !== "");

        // Common Fields map
        let info = {
            armyNo: pick(
                details.militaryPersonnelArmyNo,
                details.employeeServiceNumber,
                details.maidPassNumber,
                details.shopPassNo,
                details.tempWorkerPassNo,
                details.civilianAadharCardNumber,
                details.armyNo,
            ),
            rank: pick(
                details.militaryPersonnelRank,
                details.employeeRank,
                details.officersEnclaveRank,
                details.rank,
            ),
            name: pick(
                details.militaryPersonnelName,
                details.employeeName,
                details.maidName,
                details.officersEnclaveName,
                details.shopOwnerName,
                details.tempWorkerName,
                details.civilianName,
                details.name,
            ),
            unit: pick(
                details.militaryPersonnelUnit,
                details.employeeUnit,
                details.officersEnclaveUnit,
                details.shopUnit,
                details.unit,
            ),
            fmn: pick(
                details.militaryPersonnelFmn,
                details.employeeFmn,
                details.officersEnclaveFmn,
                details.fmn,
            ),
            command: pick(
                details.militaryPersonnelCommand,
                details.employeeCommand,
                details.officersEnclaveCommand,
                details.command,
            ),
            address: pick(
                details.militaryPersonnelAddress,
                details.employeeAddress,
                details.officersEnclaveAddress,
                details.shopAddress,
                details.tempWorkerPlaceOfStay,
                details.civilianAddress,
                details.address,
            ),
            iCard: pick(
                details.militaryPersonnelICardNumber,
                details.employeeICardNumber,
                details.officersEnclaveICardNumber,
                details.iCardNumber,
            ),

            // Special fields
            fatherName: pick(
                details.civilianFathersName,
                details.maidFathersName,
            ),
            relation: details.relationName,

            // Relative (Nested)
            relative: null as any,
        };

        if (
            details.relativeDetails &&
            Object.keys(details.relativeDetails).length > 0
        ) {
            const rel = details.relativeDetails;
            info.relative = {
                armyNo: pick(
                    rel.armyNo,
                    rel.employeeServiceNumber,
                    rel.maidPassNumber,
                ),
                rank: pick(rel.rank, rel.employeeRank, rel.officersEnclaveRank),
                name: pick(
                    rel.militaryPersonnelName,
                    rel.employeeName,
                    rel.maidName,
                    rel.officersEnclaveName,
                ),
                unit: pick(
                    rel.militaryPersonnelUnit,
                    rel.employeeUnit,
                    rel.officersEnclaveUnit,
                    rel.maidUnit,
                ),
                fmn: pick(
                    rel.militaryPersonnelFmn,
                    rel.employeeFmn,
                    rel.officersEnclaveFmn,
                    rel.maidFmn,
                ),
                command: pick(
                    rel.militaryPersonnelCommand,
                    rel.employeeCommand,
                    rel.officersEnclaveCommand,
                ),
                address: pick(
                    rel.militaryPersonnelAddress,
                    rel.employeeAddress,
                ),
                iCard: pick(
                    rel.militaryPersonnelICardNumber,
                    rel.employeeICardNumber,
                ),
            };
        }

        return info;
    };

    return (
        <div className="font-[Arial] text-[14px] w-[210mm] min-h-[297mm] mx-auto bg-white p-12 text-black leading-relaxed shadow-lg print:shadow-none print:w-full print:min-h-0 print:p-0">
            <div className="text-right mb-6 font-[Arial] font-bold">
                Appx 'A'
            </div>

            <div className="text-center mb-8">
                <div className="font-bold uppercase mb-1">
                    IMMEDIATE REPORTING OF INCIDENT
                </div>
                <div className="font-normal">
                    (Type of Incident like Injury to serving soldier due to RTA
                    etc)
                </div>
            </div>

            <div className="space-y-6">
                {/* 1. Particulars */}
                <div className="space-y-2">
                    <div className="font-bold">
                        1. &nbsp;&nbsp; Particulars of Offender / Victim &
                        Vehicle Details :
                    </div>

                    {/* 1.1 Vehicle */}
                    {(data.vehicleNumber || data.vehicleName) && (
                        <div className="flex border border-gray-300 mb-3">
                            <div className="p-2 w-16 font-normal text-gray-700  shrink-0 text-center flex items-center justify-center">
                                (1.1)
                            </div>
                            <div className="flex-1 p-2">
                                <div className="grid grid-cols-2 gap-x-4">
                                    <div className="flex gap-2">
                                        <span className="font-bold w-32 shrink-0">
                                            DD Veh. BA No.
                                        </span>
                                        <span>{data.vehicleNumber || "-"}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold w-32 shrink-0">
                                            Make & Take
                                        </span>
                                        <span>{data.vehicleName || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {individuals.map((ind, idx) => {
                        // Determine Type
                        const details = {
                            ...(ind.individualDetails || {}),
                            ...(ind.offenderDetails || {}),
                        };
                        let type = ind.individualType;
                        if (!type) {
                            if (details.employeeServiceNumber)
                                type = "employee";
                            else if (details.maidPassNumber)
                                type = "servantMaid";
                            else if (details.shopOwnerName) type = "shopKeeper";
                            else if (details.tempWorkerName)
                                type = "tempHiredWorker";
                            else if (
                                details.civilianName ||
                                details.civilianAadharCardNumber
                            )
                                type = "civilian";
                            else type = "militaryPersonnel";
                        }

                        const num = data.vehicleNumber ? idx + 2 : idx + 1;

                        const renderRow = (label: string, value: any) => (
                            <div className="flex gap-2">
                                <span className="font-bold w-32 shrink-0">
                                    {label}
                                </span>
                                <span>{value || "-"}</span>
                            </div>
                        );

                        return (
                            <React.Fragment key={idx}>
                                <div className="flex mb-3 border-gray-300 border ">
                                    <div className="p-2 w-16 font-normal text-gray-700  shrink-0 text-center flex items-start justify-center pt-3">
                                        (1.{num})
                                    </div>
                                    <div className="flex-1 p-2 space-y-2  border-gray-300">
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                            {/* Military Personnel */}
                                            {type === "militaryPersonnel" && (
                                                <>
                                                    {details.militaryPersonnelArmyNo && renderRow(
                                                        "Army No.",
                                                        details.militaryPersonnelArmyNo
                                                    )}
                                                    {details.militaryPersonnelRank && renderRow(
                                                        "Rank",
                                                        details.militaryPersonnelRank
                                                    )}
                                                    {details.militaryPersonnelName && renderRow(
                                                        "Name",
                                                        details.militaryPersonnelName
                                                    )}
                                                    {details.militaryPersonnelUnit && renderRow(
                                                        "Unit",
                                                        details.militaryPersonnelUnit
                                                    )}
                                                    {details.militaryPersonnelFmn && renderRow(
                                                        "FMN",
                                                        details.militaryPersonnelFmn
                                                    )}
                                                    {details.militaryPersonnelCommand && renderRow(
                                                        "Command",
                                                        details.militaryPersonnelCommand
                                                    )}
                                                    {details.militaryPersonnelAddress && renderRow(
                                                        "Address",
                                                        details.militaryPersonnelAddress
                                                    )}
                                                    {details.militaryPersonnelICardNumber && renderRow(
                                                        "I Card No.",
                                                        details.militaryPersonnelICardNumber
                                                    )}
                                                </>
                                            )}

                                            {/* Employee */}
                                            {type === "employee" && (
                                                <>
                                                    {details.employeeServiceNumber && renderRow(
                                                        "Service No.",
                                                        details.employeeServiceNumber,
                                                    )}
                                                    {details.employeeRank && renderRow(
                                                        "Rank",
                                                        details.employeeRank,
                                                    )}
                                                    {details.employeeName && renderRow(
                                                        "Name",
                                                        details.employeeName,
                                                    )}
                                                    {details.employeeUnit && renderRow(
                                                        "Unit",
                                                        details.employeeUnit,
                                                    )}
                                                    {details.employeeFmn && renderRow(
                                                        "FMN",
                                                        details.employeeFmn,
                                                    )}
                                                    {details.employeeCommand && renderRow(
                                                        "Command",
                                                        details.employeeCommand,
                                                    )}
                                                    {details.employeeICardNumber && renderRow(
                                                        "I Card No.",
                                                        details.employeeICardNumber,
                                                    )}
                                                </>
                                            )}

                                            {/* Servant / Maid */}
                                            {type === "servantMaid" && (
                                                <>
                                                    {details.maidPassNumber && renderRow(
                                                        "Pass No",
                                                        details.maidPassNumber,
                                                    )}
                                                    {details.maidName && renderRow(
                                                        "Name",
                                                        details.maidName,
                                                    )}
                                                    {details.maidFathersName && renderRow(
                                                        "S/O",
                                                        details.maidFathersName,
                                                    )}
                                                    {details.maidTrade && renderRow(
                                                        "Trade",
                                                        details.maidTrade,
                                                    )}
                                                    {details.maidQuarterNumber && renderRow(
                                                        "Quarter No",
                                                        details.maidQuarterNumber,
                                                    )}
                                                    {details.officersEnclaveRank && renderRow(
                                                        "C/O Rank",
                                                        details.officersEnclaveRank,
                                                    )}
                                                    {details.officersEnclaveName && renderRow(
                                                        "C/O Name",
                                                        details.officersEnclaveName,
                                                    )}
                                                    {details.officersEnclaveUnit && renderRow(
                                                        "C/O Unit",
                                                        details.officersEnclaveUnit,
                                                    )}
                                                </>
                                            )}

                                            {/* Shop Keeper */}
                                            {type === "shopKeeper" && (
                                                <>
                                                    {details.shopOwnerName && renderRow(
                                                        "Shop Owner",
                                                        details.shopOwnerName,
                                                    )}
                                                    {details.shopName && renderRow(
                                                        "Shop Name",
                                                        details.shopName,
                                                    )}
                                                    {details.shopAddress && renderRow(
                                                        "Address",
                                                        details.shopAddress,
                                                    )}
                                                    {details.shopUnit && renderRow(
                                                        "Unit",
                                                        details.shopUnit,
                                                    )}
                                                    {details.shopPassNo && renderRow(
                                                        "Pass No",
                                                        details.shopPassNo,
                                                    )}
                                                </>
                                            )}

                                            {/* Temp Hired Worker */}
                                            {type === "tempHiredWorker" && (
                                                <>
                                                    {details.tempWorkerName && renderRow(
                                                        "Name",
                                                        details.tempWorkerName,
                                                    )}
                                                    {details.tempWorkerPassNo && renderRow(
                                                        "Pass No",
                                                        details.tempWorkerPassNo,
                                                    )}
                                                    {details.tempWorkerPlaceOfStay && renderRow(
                                                        "Place of Stay",
                                                        details.tempWorkerPlaceOfStay,
                                                    )}
                                                    {details.tempWorkerPlaceOfWork && renderRow(
                                                        "Place of Work",
                                                        details.tempWorkerPlaceOfWork,
                                                    )}
                                                    {details.tempWorkerTypeOfWork && renderRow(
                                                        "Type of Work",
                                                        details.tempWorkerTypeOfWork,
                                                    )}
                                                </>
                                            )}

                                            {/* Civilian */}
                                            {type === "civilian" && (
                                                <>
                                                    {details.civilianName && renderRow(
                                                        "Name",
                                                        details.civilianName,
                                                    )}
                                                    {details.civilianAadharCardNumber && renderRow(
                                                        "Aadhar Card No.",
                                                        details.civilianAadharCardNumber,
                                                    )}
                                                    {details.civilianFathersName && renderRow(
                                                        "S/O",
                                                        details.civilianFathersName,
                                                    )}
                                                    {details.civilianAddress && renderRow(
                                                        "Address",
                                                        details.civilianAddress,
                                                    )}

                                                    {/* As per image context for civilian driver */}
                                                    {details.relationName &&
                                                        renderRow(
                                                            "Name the Relation",
                                                            details.relationName,
                                                        )}
                                                </>
                                            )}
                                        </div>

                                        {/* Nested Relative (Civilian Dependent) */}
                                        {type === "civilian" &&
                                            details.relativeDetails &&
                                            Object.keys(details.relativeDetails)
                                                .length > 0 && (
                                                <div className="relative border-t border-gray-300 flex-1">
                                                    <div className="font-normal  text-gray-700 absolute left-[-10%] top-[5%]">
                                                        (1.{num}.1)
                                                    </div>
                                                    <div className="w-16 shrink-0 text-center text-gray-500 text-xs font-bold pt-1"></div>

                                                    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1">
                                                        {details.relativeCategory ===
                                                            "militaryPersonnel" ? (
                                                            <>
                                                                {details.relativeDetails.militaryPersonnelArmyNo && renderRow(
                                                                    "Army No.",
                                                                    details
                                                                        .relativeDetails
                                                                        .militaryPersonnelArmyNo,
                                                                )}
                                                                {details.relativeDetails.militaryPersonnelRank && renderRow(
                                                                    "Rank",
                                                                    details
                                                                        .relativeDetails
                                                                        .militaryPersonnelRank,
                                                                )}
                                                                {details.relativeDetails.militaryPersonnelName && renderRow(
                                                                    "Name",
                                                                    details
                                                                        .relativeDetails
                                                                        .militaryPersonnelName,
                                                                )}
                                                                {details.relativeDetails.militaryPersonnelUnit && renderRow(
                                                                    "Unit",
                                                                    details
                                                                        .relativeDetails
                                                                        .militaryPersonnelUnit,
                                                                )}
                                                                {details.relativeDetails.militaryPersonnelFmn && renderRow(
                                                                    "FMN",
                                                                    details
                                                                        .relativeDetails
                                                                        .militaryPersonnelFmn,
                                                                )}
                                                                {details.relativeDetails.militaryPersonnelCommand && renderRow(
                                                                    "Command",
                                                                    details
                                                                        .relativeDetails
                                                                        .militaryPersonnelCommand,
                                                                )}
                                                                {details.relativeDetails.militaryPersonnelAddress && renderRow(
                                                                    "Address",
                                                                    details
                                                                        .relativeDetails
                                                                        .militaryPersonnelAddress,
                                                                )}
                                                                {details.relativeDetails.militaryPersonnelICardNumber && renderRow(
                                                                    "I Card No.",
                                                                    details
                                                                        .relativeDetails
                                                                        .militaryPersonnelICardNumber,
                                                                )}
                                                            </>
                                                        ) : details.relativeCategory ===
                                                            "employee" ? (
                                                            <>
                                                                {details.relativeDetails.employeeServiceNo && renderRow(
                                                                    "Service No.",
                                                                    details
                                                                        .relativeDetails
                                                                        .employeeServiceNo,
                                                                )}
                                                                {details.relativeDetails.employeeRank && renderRow(
                                                                    "Rank",
                                                                    details
                                                                        .relativeDetails
                                                                        .employeeRank,
                                                                )}
                                                                {details.relativeDetails.employeeName && renderRow(
                                                                    "Name",
                                                                    details
                                                                        .relativeDetails
                                                                        .employeeName,
                                                                )}
                                                                {details.relativeDetails.employeeUnit && renderRow(
                                                                    "Unit",
                                                                    details
                                                                        .relativeDetails
                                                                        .employeeUnit,
                                                                )}
                                                                {details.relativeDetails.employeeFmn && renderRow(
                                                                    "FMN",
                                                                    details
                                                                        .relativeDetails
                                                                        .employeeFmn,
                                                                )}
                                                                {details.relativeDetails.employeeCommand && renderRow(
                                                                    "Command",
                                                                    details
                                                                        .relativeDetails
                                                                        .employeeCommand,
                                                                )}
                                                                {details.relativeDetails.employeeAddress && renderRow(
                                                                    "Address",
                                                                    details
                                                                        .relativeDetails
                                                                        .employeeAddress,
                                                                )}
                                                                {details.relativeDetails.employeeICardNumber && renderRow(
                                                                    "I Card No.",
                                                                    details
                                                                        .relativeDetails
                                                                        .employeeICardNumber,
                                                                )}
                                                            </>
                                                        ) : details.relativeCategory === "servantMaid" ? (
                                                            <>
                                                                {details.relativeDetails.maidPassNumber && renderRow(
                                                                    "Pass No",
                                                                    details.relativeDetails.maidPassNumber,
                                                                )}
                                                                {details.relativeDetails.maidName && renderRow(
                                                                    "Name",
                                                                    details.relativeDetails.maidName,
                                                                )}
                                                                {details.relativeDetails.maidFathersName && renderRow(
                                                                    "S/O",
                                                                    details.relativeDetails.maidFathersName,
                                                                )}
                                                                {details.relativeDetails.maidTrade && renderRow(
                                                                    "Trade",
                                                                    details.relativeDetails.maidTrade,
                                                                )}
                                                                {details.relativeDetails.maidQuarterNumber && renderRow(
                                                                    "Quarter No",
                                                                    details.relativeDetails.maidQuarterNumber,
                                                                )}
                                                                {details.relativeDetails.officersEnclaveRank && renderRow(
                                                                    "C/O Rank",
                                                                    details.relativeDetails.officersEnclaveRank,
                                                                )}
                                                                {details.relativeDetails.officersEnclaveName && renderRow(
                                                                    "C/O Name",
                                                                    details.relativeDetails.officersEnclaveName,
                                                                )}
                                                                {details.relativeDetails.officersEnclaveUnit && renderRow(
                                                                    "C/O Unit",
                                                                    details.relativeDetails.officersEnclaveUnit,
                                                                )}
                                                            </>
                                                        ) : details.relativeCategory === "tempHiredWorker" ? (
                                                            <>
                                                                {details.relativeDetails.tempWorkerName && renderRow(
                                                                    "Name",
                                                                    details.relativeDetails.tempWorkerName,
                                                                )}
                                                                {details.relativeDetails.tempWorkerPassNo && renderRow(
                                                                    "Pass No",
                                                                    details.relativeDetails.tempWorkerPassNo,
                                                                )}
                                                                {details.relativeDetails.tempWorkerPlaceOfStay && renderRow(
                                                                    "Place of Stay",
                                                                    details.relativeDetails.tempWorkerPlaceOfStay,
                                                                )}
                                                                {details.relativeDetails.tempWorkerPlaceOfWork && renderRow(
                                                                    "Place of Work",
                                                                    details.relativeDetails.tempWorkerPlaceOfWork,
                                                                )}
                                                                {details.relativeDetails.tempWorkerTypeOfWork && renderRow(
                                                                    "Type of Work",
                                                                    details.tempWorkerTypeOfWork,
                                                                )}
                                                            </>

                                                        ) : details.relativeCategory === "shopKeeper" ? (
                                                            <>
                                                                {details.relativeDetails.shopOwnerName && renderRow(
                                                                    "Shop Owner",
                                                                    details.relativeDetails.shopOwnerName,
                                                                )}
                                                                {details.relativeDetails.shopName && renderRow(
                                                                    "Shop Name",
                                                                    details.relativeDetails.shopName,
                                                                )}
                                                                {details.relativeDetails.shopAddress && renderRow(
                                                                    "Address",
                                                                    details.relativeDetails.shopAddress,
                                                                )}
                                                                {details.relativeDetails.shopUnit && renderRow(
                                                                    "Unit",
                                                                    details.relativeDetails.shopUnit,
                                                                )}
                                                                {details.relativeDetails.shopPassNo && renderRow(
                                                                    "Pass No",
                                                                    details.relativeDetails.shopPassNo,
                                                                )}
                                                            </>
                                                        ) : ""}

                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* 2. Age / Service */}
                <div className="flex gap-4 items-baseline">
                    <div className="w-6 font-bold shrink-0">2.</div>
                    <div className="w-[40%] font-bold shrink-0 ">
                        Age / Service
                    </div>
                    <div className="flex-1 ">
                        {data.age || individuals[0]?.age || "-"} Yrs /{" "}
                        {data.totalServiceDuration ||
                            individuals[0]?.totalServiceDuration ||
                            "-"}{" "}
                        Yrs
                    </div>
                </div>

                {/* 3. Leave / Duty */}
                <div className="flex gap-4 items-baseline">
                    <div className="w-6 font-bold shrink-0">3.</div>
                    <div className="w-[40%] font-bold shrink-0">
                        Whether Individual On Leave / Duty
                    </div>
                    <div className="flex-1">
                        {data.individualWorkingStatus ||
                            individuals[0]?.individualWorkingStatus ||
                            "-"}
                    </div>
                </div>

                {/* 4. Place */}
                <div className="flex gap-4 items-baseline">
                    <div className="w-6 font-bold shrink-0">4.</div>
                    <div className="w-[40%] font-bold shrink-0">
                        Place Of Incident
                    </div>
                    <div className="flex-1">
                        {data.placeOfOccurrence || "-"}
                    </div>
                </div>

                {/* 5. Date & Time */}
                <div className="flex gap-4 items-baseline">
                    <div className="w-6 font-bold shrink-0">5.</div>
                    <div className="w-[40%] font-bold shrink-0">
                        Date & Time Of Incident
                    </div>
                    <div className="flex-1">
                        {data.dateOfOccurrence
                            ? format(
                                new Date(data.dateOfOccurrence),
                                "dd/MM/yyyy",
                            )
                            : "-"}{" "}
                        & {data.timeOfOccurrence ? data.timeOfOccurrence : "-"}
                        hrs
                    </div>
                </div>

                {/* 6. Brief */}
                <div className="flex gap-4 items-baseline">
                    <div className="w-6 font-bold shrink-0">6.</div>
                    <div className="w-[40%] font-bold shrink-0">
                        Brief Of The Incident
                    </div>
                    <div className="flex-1 text-justify leading-snug">
                        {data.description || "-"}
                    </div>
                </div>

                {/* 7. Coord */}
                <div className="flex gap-4 items-baseline">
                    <div className="w-6 font-bold shrink-0">7.</div>
                    <div className="w-[40%] font-bold shrink-0">
                        Coord With Police On Civil, Adm, <br /> FIR & Current
                        Sit
                    </div>
                    <div className="flex-1 text-justify leading-snug">
                        {data.coordWith || "-"}
                    </div>
                </div>

                <div className="mt-16 text-center w-full justify-center flex">
                    <div>
                        (Incident being covered by{" "}
                        <span className="inline-block border-b border-black min-w-[200px] text-center">
                            {data.incidentCoveredBy ||
                                "__________________________"}
                        </span>{" "}
                        Pro Unit)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImmediateReportingIncidentReport;
