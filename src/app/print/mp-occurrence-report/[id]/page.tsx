"use client";

import React, { use, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useGetMPReportById } from "@/features/mpReports/hooks";
import MpOccurrenceReport from "@/components/reports/MpOccurrenceReport";

export default function PrintMpOccurrenceReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useGetMPReportById(id);

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

  // Transform data to match MpOccurrenceReportProps (individuals or offenders from lookup)
  const hasIndividuals = Array.isArray(data.individuals) && data.individuals.length > 0;
  const rawPeople = hasIndividuals ? data.individuals : (data.offenders || data.individual || []);
  const mapPerson = (p: any, index: number) => {
    const src = p?.offenderDetails || p?.details || p;
    const base = typeof src === "object" && src ? src : p;
    const merged = { ...(base?.customFields || {}), ...base };
    return {
      sno: index + 1,
      armyNo: merged.armyNo || merged.armyNumber || merged.serviceNumber || "",
      rank: merged.rank || "",
      name: merged.name || merged.personName || merged.fullName || "",
      identityCard: merged.iCardNumber || merged.icard || merged.passNo || "",
      unitName: merged.unit || merged.unitName || "",
      fmn: merged.fmn || merged.fmnName || "",
      address: merged.address || "",
      remark: merged.remark || "",
      role: merged.role || p?.offenderType || p?.category || "Unknown",
      customFields: merged,
    };
  };

  const occ = data.occurrenceDetails || {};
  const transformedData = {
    reportNo: (data.reportDetails?.reportNumber || "").toString(),
    command: (data.reportDetails?.command || "").toString(),
    firNo: (data.reportDetails?.firNumber || "").toString(),
    mpDetails: {
      armyNumber: (data.investigationHead?.armyNumber || data.investigationHead?.armyNo || "").toString(),
      rank: (data.investigationHead?.rank || "").toString(),
      name: (data.investigationHead?.name || "").toString(),
      unit: (data.investigationHead?.unit || "").toString(),
      fmn: (data.investigationHead?.fmn || "").toString(),
      command: (data.investigationHead?.command || "").toString(),
    },
    occurrence: {
      types: (Array.isArray(occ.offenceTypes) && occ.offenceTypes.length > 0)
        ? occ.offenceTypes
        : (occ.offenceType ? [occ.offenceType] : []),
      refs: occ.offenceTypeReference || [],
      place: (occ.placeOfOccurrence || "").toString(),
      date: occ.dateOfOccurrence
        ? new Date(occ.dateOfOccurrence).toLocaleDateString("en-GB")
        : "",
      time: occ.timeOfOccurrence
        ? new Date(occ.timeOfOccurrence).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
        : "",
    },
    people: Array.isArray(rawPeople) ? rawPeople.map(mapPerson) : [],
    briefOfOccurrence: (occ.description || "").toString(),
    witnesses: (Array.isArray(data.witnesses) ? data.witnesses : Array.isArray(data.witness) ? data.witness : []).map((w: any, index: number) => {
      const src = w?.details || w;
      return {
        sno: index + 1,
        armyNo: src.armyNo || src.armyNumber || "",
        rank: src.rank || "",
        name: src.name || "",
        identityCard: src.iCardNumber || src.icard || "",
        unitName: src.unit || src.unitName || "",
        fmn: src.fmn || src.fmnName || "",
        address: src.address || "",
        remark: src.remark || "",
        customFields: src,
      };
    }),
    evidence: {
      eyeSketch: "",
      photos: "",
      videos: "",
    },
    documents: data.documents?.map(doc => doc.statement || "").filter(Boolean) || [],
    detailedReport: {
      statement: (data.detailedOccurrenceReport || "").toString(),
      findings: Array.isArray(data.pointsFindOutDuringInvestigation)
        ? data.pointsFindOutDuringInvestigation
        : (typeof data.pointsFindOutDuringInvestigation === "string" && data.pointsFindOutDuringInvestigation.trim())
          ? data.pointsFindOutDuringInvestigation.split("\n").filter((l: string) => l.trim())
          : [],
      opinion: (data.opinion || "").toString(),
    },
    remarks: {
      analysis: data.remarks?.analysis || "",
      recommendation: data.remarks?.recommendation || "",
    },
    station: "",
    reportDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "",
  };

  return (
    <div id="print-container" className="min-h-screen bg-white p-0">
      <div id="report-content">
        <MpOccurrenceReport {...transformedData} />
      </div>
    </div>
  );
}

