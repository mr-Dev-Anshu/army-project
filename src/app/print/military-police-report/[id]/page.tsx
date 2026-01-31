"use client";

import React, { useEffect } from 'react';
import { Loader2 } from "lucide-react";
import { useGetTrafficOffenceById } from "@/features/generalTraficOffence/hooks";
import MilitaryPoliceReport, { MilitaryPoliceReportProps } from "@/components/reports/MilitaryPoliceReport";

function mapToReportProps(offence: any): MilitaryPoliceReportProps {
    const offender1 = offence.offenders?.[0] || {};
    const primaryDetails = offender1.offenderDetails || {};

    const offender2 = offence.offenders?.[1];
    const secondaryDetails = offender2?.offenderDetails;

    const val = (v: any) => v || "";
    const dateVal = (d: string) =>
        d ? new Date(d).toLocaleDateString("en-GB") : "";
    const timeVal = (d: string) =>
        d
            ? new Date(d).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            })
            : "";

    const mpDetails = offence.onDutyDetailsMPReporting || {};
    const witnesses = offence.onDutyWitnessingMps || [];
    const witness1 = witnesses[0] || {};

    const selectedWitness = offence.customFields?.selectedWitness || {};

    return {
        reportNo:
            offence.reportNo || offence.reportId || offence.reportNumber || "",
        reportDate: dateVal(offence.createdAt),
        particulars: {
            blocks: offence.particulars?.blocks || offence.blocks || [],
            primary: {
                aadharCardNo: val(primaryDetails.aadharCard || primaryDetails.aadharNumber),
                name: val(primaryDetails.name),
                so: val(primaryDetails.fatherName || primaryDetails.so),
                relation: val(primaryDetails.relation),
                armyNo: val(primaryDetails.armyNumber || primaryDetails.armyNo),
                rank: val(primaryDetails.rank || primaryDetails["Select Rank"]),
                unit: val(primaryDetails.unit),
                command: val(primaryDetails.command),
                fmn: val(primaryDetails.fmn),
                address: val(primaryDetails.address),
                iCardNo: val(
                    primaryDetails.identityCard ||
                    primaryDetails.iCardNumber ||
                    primaryDetails["I Card Number"]
                ),
                driverType: offender1.type || offender1.offenderType || primaryDetails.driverType,
            },
            secondary: secondaryDetails
                ? {
                    aadharCardNo: val(secondaryDetails.aadharCard || secondaryDetails.aadharNumber),
                    name: val(secondaryDetails.name),
                    so: val(secondaryDetails.fatherName || secondaryDetails.so),
                    relation: val(secondaryDetails.relation),
                    armyNo: val(secondaryDetails.armyNumber || secondaryDetails.armyNo),
                    rank: val(secondaryDetails.rank || secondaryDetails["Select Rank"]),
                    unit: val(secondaryDetails.unit),
                    command: val(secondaryDetails.command),
                    fmn: val(secondaryDetails.fmn),
                    address: val(secondaryDetails.address),
                    iCardNo: val(
                        secondaryDetails.identityCard ||
                        secondaryDetails.iCardNumber ||
                        secondaryDetails["I Card Number"]
                    ),
                    driverType: offender2.type || offender2.offenderType || secondaryDetails.driverType,
                }
                : undefined,
            vehicle: offence.isVehicleInvolved
                ? {
                    baNo: val(offence.vehicleNumber),
                    makeAndTake: val(offence.vehicleName) || val(offence.vehicleType),
                    vehicleNumber:
                        offence.vehicleType === "DD Vehicle"
                            ? "DD Veh. BA No."
                            : "Registration No.",
                }
                : undefined,
        },
        occurrence: {
            dateOfDuty: dateVal(offence.onDutyDetails?.dateOfDuty),
            dutyTime: (() => {
                const start = offence.onDutyDetails?.startTime;
                const end = offence.onDutyDetails?.endTime;
                const sVal = timeVal(start);
                const eVal = timeVal(end);
                if (sVal && eVal) return `${sVal} Hrs - ${eVal} Hrs`;
                if (sVal) return `${sVal} Hrs`;
                return "";
            })(),
            dutyLocation: val(offence.onDutyDetails?.dutyLocation),
            witnessingMps:
                witnesses.length > 0
                    ? witnesses.map((w: any) => ({
                        name: val(w.name),
                        rank: val(w.rank),
                    }))
                    : [],
            timeOfOffence: timeVal(offence.offenceOccurenceDetails?.timeOfOffence)
                ? timeVal(offence.offenceOccurenceDetails?.timeOfOffence) + " Hrs"
                : "",
            locationOfOffence: val(offence.offenceOccurenceDetails?.incidentLocation),
            statement: val(offence.offenceOccurenceDetails?.description),
        },
        offence: {
            types:
                (offence.offenceTypes?.length
                    ? offence.offenceTypes
                    : offence.offenceOccurenceDetails?.offenceTypes) ||
                (val(offence.currentOffenceType)
                    ? [val(offence.currentOffenceType)]
                    : []),
            refs:
                (offence.offenceTypeReference?.length
                    ? offence.offenceTypeReference
                    : offence.offenceOccurenceDetails?.offenceTypeReference) || [],
            description: val(offence.offenceOccurenceDetails?.description),
        },
        witnessSig: {
            armyNo: val(
                selectedWitness?.armyNumber || witness1.armyNumber || witness1.ArmyNo
            ),
            rank: val(selectedWitness?.rank || witness1.rank),
            name: val(selectedWitness?.nameReportingMP || witness1.name),
            unit: val(selectedWitness?.unit || witness1.unit),
        },
        mpSig: {
            armyNo: val(mpDetails.armyNumber),
            rank: val(mpDetails.rank),
            name: val(mpDetails.nameReportingMP),
            unit: val(mpDetails.unit),
        },
        remarks: {
            text: val(offence.customFields?.remarks || offence.remarks),
            station: val(offence.onDutyDetails?.dutyLocation),
            dated: new Date().toLocaleDateString("en-GB"),
        },
    };
}

export default function PrintReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading } = useGetTrafficOffenceById(id);

    useEffect(() => {
        if (data) {
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-red-500">
                Report not found
            </div>
        );
    }

    const reportProps = mapToReportProps(data);

    return (
        <div id="print-container" className="min-h-screen bg-white p-0">
            <div id="report-content">
                <MilitaryPoliceReport {...reportProps} />
            </div>
        </div>
    );
}
