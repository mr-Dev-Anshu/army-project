"use client";

import React, { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { useGetStaticSpeedRecordById } from "@/features/staticSpeed/hooks";
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
                armyNo: val(offender.armyNumber),
                name: val(offender.name),
                rank: val(offender.rank),
                unit: val(mp.unit || offender.unit),
                fmn: val(raw.fmn || offender.fmn),
                address: val(raw.address || offender.address),
                command: val(raw.command || offender.command),
                iCardNo: val(offender.iCardNumber),
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

export default function PrintStaticSpeedReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading } = useGetStaticSpeedRecordById(id);

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
                <StaticSpeedReport {...reportProps} />
            </div>
        </div>
    );
}
