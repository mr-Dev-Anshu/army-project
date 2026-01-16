import React from 'react';
import { notFound } from 'next/navigation';
import { connectDB } from "@/lib/db/mongodb";
import { generalTrafficOffenceRepo } from "@/reposetories/generalTrafficOffence.repo";
import MilitaryPoliceReport, { MilitaryPoliceReportProps } from "@/components/reports/MilitaryPoliceReport";

function mapToReportProps(offence: any): MilitaryPoliceReportProps {
    const primary = offence.offenders?.[0]?.offenderDetails || {};
    const secondary = offence.offenders?.[1]?.offenderDetails;

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
            primary: {
                aadharCardNo: val(primary.aadharCard || primary.aadharNumber),
                name: val(primary.name),
                so: val(primary.fatherName || primary.so),
                relation: val(primary.relation),
                armyNo: val(primary.armyNumber || primary.armyNo),
                rank: val(primary.rank || primary["Select Rank"]),
                unit: val(primary.unit),
                command: val(primary.command),
                fmn: val(primary.fmn),
                address: val(primary.address),
                iCardNo: val(
                    primary.identityCard ||
                    primary.iCardNumber ||
                    primary["I Card Number"]
                ),
            },
            secondary: secondary
                ? {
                    aadharCardNo: val(secondary.aadharCard || secondary.aadharNumber),
                    name: val(secondary.name),
                    so: val(secondary.fatherName || secondary.so),
                    relation: val(secondary.relation),
                    armyNo: val(secondary.armyNumber || secondary.armyNo),
                    rank: val(secondary.rank || secondary["Select Rank"]),
                    unit: val(secondary.unit),
                    command: val(secondary.command),
                    fmn: val(secondary.fmn),
                    address: val(secondary.address),
                    iCardNo: val(
                        secondary.identityCard ||
                        secondary.iCardNumber ||
                        secondary["I Card Number"]
                    ),
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

export default async function PrintReportPage(props: { params: Promise<{ id: string }> }) {
    await connectDB();
    const params = await props.params;
    const { id } = params;

    let offence;
    try {
        offence = await generalTrafficOffenceRepo.getById(id);
    } catch (e) {
        console.error("Error fetching report:", e);
    }

    if (!offence) {
        return notFound();
    }

    const reportProps = mapToReportProps(offence);

    return (
        <div className="bg-white">
            <MilitaryPoliceReport {...reportProps} />
        </div>
    );
}
