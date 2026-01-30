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

  // Transform data to match MpOccurrenceReportProps
  const transformedData = {
    reportNo: data.reportDetails.reportNumber || "",
    command: data.reportDetails.command || "",
    firNo: data.reportDetails.firNumber || "",
    mpDetails: {
      armyNumber: data.investigationHead.armyNumber || "",
      rank: data.investigationHead.rank || "",
      name: data.investigationHead.name || "",
      unit: data.investigationHead.unit || "",
      fmn: data.investigationHead.fmn || "",
      command: data.investigationHead.command || "",
    },
    occurrence: {
      types: data.occurrenceDetails.offenceType ? [data.occurrenceDetails.offenceType] : [],
      refs: [],
      place: data.occurrenceDetails.placeOfOccurrence || "",
      date: data.occurrenceDetails.dateOfOccurrence || "",
      time: data.occurrenceDetails.timeOfOccurrence || "",
    },
    people: data.individual?.map((person, index) => ({
      sno: index + 1,
      armyNo: person.armyNumber,
      rank: person.rank,
      name: person.name,
      identityCard: person.iCardNumber,
      unitName: person.unit,
      fmn: person.fmn,
      address: person.address,
      remark: person.remark,
      role: person.role || "Unknown",
      customFields: person,
    })) || [],
    briefOfOccurrence: data.occurrenceDetails.description || "",
    witnesses: data.witness?.map((witness, index) => ({
      sno: index + 1,
      armyNo: witness.armyNumber,
      rank: witness.rank,
      name: witness.name,
      identityCard: witness.iCardNumber,
      unitName: witness.unit,
      fmn: witness.fmn,
      address: witness.address,
      remark: witness.remark,
      customFields: witness,
    })) || [],
    evidence: {
      eyeSketch: "",
      photos: "",
      videos: "",
    },
    documents: data.documents?.map(doc => doc.statement || "").filter(Boolean) || [],
    detailedReport: {
      statement: data.detailedOccurrenceReport || "",
      findings: data.pointsFindOutDuringInvestigation ? [data.pointsFindOutDuringInvestigation] : [],
      opinion: data.opinion || "",
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

