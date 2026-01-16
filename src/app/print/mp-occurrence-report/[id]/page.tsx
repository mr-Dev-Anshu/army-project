import React from 'react';
import { notFound } from 'next/navigation';
import { connectDB } from "@/lib/db/mongodb";
import { MPReportRepository } from "@/reposetories/investigationReport.repo.js";
import MpOccurrenceReport, { MpOccurrenceReportProps } from "@/components/reports/MpOccurrenceReport";

// Copy of mapper from src/app/(report-view)/reports/mp-occurrence-reports/page.tsx
const mapToReportProps = (item: any): MpOccurrenceReportProps => {
    const raw = item.originalData || item || {};
    const reportDetails = raw.reportDetails || {};
    const invHead = raw.investigationHead || raw.mpParticulars || {}; // Check form state key variants
    const occurrence = raw.occurrenceDetails || {};

    // Dynamic Fields: People (Victims/Offenders/Individuals)
    const rawPeople =
        raw.individuals ||
        raw.offenders ||
        raw.individual ||
        raw.offenderList ||
        raw.customFields?.individuals ||
        raw.customFields?.offenderList ||
        [];

    const people = Array.isArray(rawPeople) ? rawPeople.map((p: any, index: number) => {
        const src = p.details || p;
        const custom = src.customFields || {};
        const merged = { ...custom, ...src }; // flatten for search

        return {
            sno: index + 1,
            armyNo: merged.armyNo || merged.armyNumber || merged.serviceNumber || merged.aadharNumber || "",
            rank: merged.rank || "",
            name: merged.name || merged.personName || merged.fullName || "",
            identityCard: merged.iCardNumber || merged.icard || merged.idCardNumber || merged.identityCard || merged.passNo || "",
            unitName: merged.unit || merged.unitName || "",
            fmn: merged.fmn || merged.fmnName || "",
            address: merged.address || "",
            remark: merged.remark || "",
            role: mappedRole(merged.role || merged.type || "Offender"),
            customFields: merged
        };
    }) : [];

    // Helper for role mapping if needed, otherwise string
    function mappedRole(r: string) {
        if (!r) return "";
        return r;
    }

    // Dynamic Fields: Witnesses
    const rawWitnesses =
        raw.witnesses ||
        raw.witness ||
        raw.witnessList ||
        raw.customFields?.witnesses ||
        [];

    const witnesses = Array.isArray(rawWitnesses) ? rawWitnesses.map((w: any, index: number) => {
        const src = w.details || w;
        const custom = src.customFields || {};
        const merged = { ...custom, ...src };

        return {
            sno: index + 1,
            armyNo: merged.armyNo || merged.armyNumber || merged.serviceNumber || "",
            rank: merged.rank || "",
            name: merged.name || merged.witnessName || merged.fullName || "",
            identityCard: merged.iCardNumber || merged.icard || merged.idCardNumber || merged.passNo || "",
            unitName: merged.unit || merged.unitName || "",
            fmn: merged.fmn || merged.fmnName || "",
            address: merged.address || "",
            remark: merged.remark || "",
            customFields: merged
        };
    }) : [];

    // Dynamic Fields: Documents
    const rawDocs = raw.documents || [];
    const docs = Array.isArray(rawDocs)
        ? rawDocs.map((d: any) => typeof d === 'string' ? d : (d.statement || d.name || "Attached Document"))
        : [];

    // Dynamic Fields: Brief
    const brief =
        occurrence.description ||
        occurrence.brief ||
        occurrence.statement ||
        raw.detailedOccurrenceReport ||
        "";

    // Dynamic Fields: Evidences
    const evidences = raw.evidences || [];
    const findEvidence = (type: string) => {
        const found = evidences.find((e: any) => e.type?.toLowerCase().includes(type));
        return found ? (found.description || found.url || "Attached") : null;
    };

    // Dynamic Fields: Detailed Report & Remarks
    const detailedStatement =
        raw.detailedOccurrenceReport ||
        raw.detailedStatement ||
        raw.detailedReport?.statement ||
        raw.customFields?.detailedStatement ||
        "";

    // Handle findings whether stored as string (schema) or array
    let findingsList: string[] = [];
    const rawFindings = raw.pointsFindOutDuringInvestigation || raw.investigationFindings || raw.detailedReport?.findings;

    if (typeof rawFindings === 'string') {
        findingsList = rawFindings.split('\n').filter((line: string) => line.trim() !== '');
    } else if (Array.isArray(rawFindings)) {
        findingsList = rawFindings;
    }

    const reportDate = raw.createdAt
        ? new Date(raw.createdAt).toLocaleDateString("en-GB")
        : new Date().toLocaleDateString("en-GB");

    // "Station" typically typically comes from unit address or similar
    const station = invHead.address || raw.customFields?.station || invHead.unit || "";

    return {
        reportNo: reportDetails.reportNumber || "",
        command: reportDetails.command || invHead.command || "",
        firNo: reportDetails.firNumber || "",
        mpDetails: {
            armyNumber: invHead.armyNumber || invHead.armyNo || "",
            rank: invHead.rank || "",
            name: invHead.name || "",
            unit: invHead.unit || "",
            fmn: invHead.fmn || "",
            command: invHead.command || ""
        },
        occurrence: {
            types: occurrence.offenceTypes && occurrence.offenceTypes.length > 0
                ? occurrence.offenceTypes
                : (occurrence.offenceType ? [occurrence.offenceType] : []),
            refs: occurrence.offenceTypeReference || [],
            place: occurrence.placeOfOccurrence || "",
            date: occurrence.dateOfOccurrence ? new Date(occurrence.dateOfOccurrence).toLocaleDateString("en-GB") : (raw.createdAt ? new Date(raw.createdAt).toLocaleDateString("en-GB") : ""),
            time: occurrence.timeOfOccurrence ? new Date(occurrence.timeOfOccurrence).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }) : ""
        },
        people: people,
        briefOfOccurrence: brief,
        witnesses: witnesses,
        evidence: {
            eyeSketch: findEvidence("sketch") || "",
            photos: findEvidence("photo") || "",
            videos: findEvidence("video") || ""
        },
        documents: docs,
        detailedReport: {
            statement: detailedStatement,
            findings: findingsList,
            opinion: raw.opinion || raw.detailedReport?.opinion || raw.customFields?.opinion || ""
        },
        remarks: {
            analysis: raw.remarks?.analysis || raw.analysis || raw.coRemarks?.analysis || raw.customFields?.analysis || "",
            recommendation: raw.remarks?.recommendation || raw.recommendation || raw.coRemarks?.recommendation || raw.customFields?.recommendation || ""
        },
        station: station,
        reportDate: reportDate
    };
};

export default async function PrintMPOccurrenceReportPage(props: { params: Promise<{ id: string }> }) {
    await connectDB();
    const params = await props.params;
    const { id } = params;

    let record;
    try {
        const repo = new MPReportRepository();
        record = await repo.findById(id);
    } catch (e) {
        console.error("Error fetching MP report:", e);
    }

    if (!record) {
        return notFound();
    }

    const reportProps = mapToReportProps(record);

    return (
        <div className="bg-white">
            <MpOccurrenceReport {...reportProps} />
        </div>
    );
}
