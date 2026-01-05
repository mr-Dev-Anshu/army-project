"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import FormationAnalysisTable from "@/features/mpOffenceAnalysisMonthlyReport/components/FormationAnalysisTable";
import DivisionTable from "@/features/mpOffenceAnalysisMonthlyReport/components/DivisionTable";
import { FORMATIONS_LIST, MAIN_FORMATION } from "@/features/mpOffenceAnalysisMonthlyReport/constants";

export default function FormationPage({ params }: { params: Promise<{ division: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);

  const decodedDivision = React.useMemo(() => {
    try {
      return decodeURIComponent(resolvedParams.division);
    } catch (e) {
      return resolvedParams.division;
    }
  }, [resolvedParams.division]);

  const formation = useMemo(() => {
    // Try matching by slug first (preferred)
    if (decodedDivision === MAIN_FORMATION.slug || decodedDivision === MAIN_FORMATION.groupKey) {
      return MAIN_FORMATION;
    }

    return FORMATIONS_LIST.find(f => f.slug === decodedDivision || f.groupKey === decodedDivision);
  }, [decodedDivision]);

  const handleBack = () => {
    router.back();
  };

  if (!formation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <h2 className="text-xl font-semibold mb-2">Formation Not Found</h2>
        <p>The requested formation "{decodedDivision}" could not be found.</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (formation.groupKey === MAIN_FORMATION.groupKey) {
    return (
      <FormationAnalysisTable
        formation={formation}
        onBack={handleBack}
      />
    );
  }

  return (
    <DivisionTable
      formation={formation}
      onBack={handleBack}
    />
  );
}
