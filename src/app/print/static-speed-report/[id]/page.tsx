import React from 'react';
import { notFound } from 'next/navigation';
import { connectDB } from "@/lib/db/mongodb";
import { staticSpeedCheckRecordRepo } from "@/reposetories/staticSpeedCheckRecord";
import StaticSpeedReport, { StaticSpeedReportProps } from "@/components/reports/StaticSpeedReport";

function mapToReportProps(raw: any): StaticSpeedReportProps {
    const offence = raw.offenceOccurenceDetails || {};
    const offender = raw.offenders?.[0]?.offenderDetails || {};
    const mp = raw.onDutyDetailsMPReporting || {};

    // Witness details might be missing in schema, so we attempt to find them safely
    const witness1 = raw.onDutyWitnessingMps?.[0] || {};
    const witness2 = raw.onDutyWitnessingMps?.[1] || {};

    const val = (v: any) => v || "";

    return {
        reportNo: raw.reportId || raw.reportNo,
        reportDate: new Date(raw.createdAt).toLocaleDateString("en-GB"),
        unitName: "21 Corps Provost Unit", // Hardcoded as per original
        particulars: {
            rider: {
                offenderType: val(offender.offenderType || offender.individualType || raw.offenderType),
                armyNo: val(offender.armyNumber),
                name: val(offender.name),
                rank: val(offender.rank),
                unit: val(mp.unit || offender.unit),
                fmn: val(raw.fmn || offender.fmn),
                address: val(raw.address || offender.address),
                command: val(raw.command || offender.command),
                iCardNo: val(offender.iCardNumber),
                // Pass raw offender details for the get() helper in StaticSpeedReport
                offenderDetails: offender,
            },
            vehicle: {
                baNo: val(raw.vehicleNumber),
                makeAndTake: val(raw.vehicleName),
            },
        },
        occurrence: {
            dateOfDuty: val(offence.timeOfOffence ? new Date(offence.timeOfOffence).toLocaleDateString("en-GB") : raw.date), // Fallback logic
            dutyLocation: val(offence.incidentLocation || raw.placeOfOffence),
            dutyTime: offence.timeOfOffence
                ? new Date(offence.timeOfOffence).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) + " Hrs"
                : (raw.time ? `${raw.time} Hrs` : ""),
            nameOfWitnessingOfficial1: val(witness1.name),
            rankOfWitnessingOfficial1: val(witness1.rank),
            nameOfWitnessingOfficial2: val(witness2.name),
            rankOfWitnessingOfficial2: val(witness2.rank),
            statement: val(offence.description),
        },
        offence: {
            actualSpeed: val(offence.actualSpeedNoted),
            authSpeed: val(offence.authSpeed),
            overSpeed: val(offence.overSpeedCalculated),
        },
        witnessSig: {
            armyNo: val(witness1.armyNumber || witness1.ArmyNo),
            rank: val(witness1.rank),
            name: val(witness1.name),
            unit: val(witness1.unit),
        },
        mpSig: {
            armyNo: val(mp.armyNumber),
            name: val(mp.nameReportingMP),
            rank: val(mp.rank),
            unit: val(mp.unit),
        },
        remarks: {
            text: val(raw.remark || raw.remarks),
            station: "",
            dated: new Date().toLocaleDateString("en-GB"),
        },
    };
}

export default async function PrintStaticSpeedReportPage(props: { params: Promise<{ id: string }> }) {
    await connectDB();
    const params = await props.params;
    const { id } = params;

    let record;
    try {
        record = await staticSpeedCheckRecordRepo.getById(id);
    } catch (e) {
        console.error("Error fetching static speed report:", e);
    }

    if (!record) {
        return notFound();
    }

    const reportProps = mapToReportProps(record);

    return (
        <div className="bg-white">
            <StaticSpeedReport {...reportProps} />
        </div>
    );
}
