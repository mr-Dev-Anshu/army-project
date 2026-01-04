"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "@/context/FormContext";

/* ===== SECTIONS ===== */
import IndividualVictimSection from "../components/IndividualVictimSection";
import { AccidentDetailsSection } from "./AccidentDetailsSection";
import { VehicleDetailsSection } from "./VehicleDetailsSection";
import { CasualtyDetailsSection } from "./CasualtyDetailsSection";
import { FirDetailsSection } from "./FirDetailsSection";
import { ActionSection } from "./ActionSection";

/* ===== API + UTILS ===== */
import { useCreateMTAccidentReport } from "../hooks/useMTAccidentReport";
import { mapMTAccidentPayload } from "../utils/mapMTAccidentPayload";

interface MTAccidentReportFormProps {
  onSuccess?: () => void;
}

export default function MTAccidentReportForm({
  onSuccess,
}: MTAccidentReportFormProps) {
  const { state, dispatch } = useForm();
  const report = state.formData.mtAccidentReport;

  const { mutateAsync: createReport, isPending } =
    useCreateMTAccidentReport();

  /* ===== SET FIELD ===== */
  const setField = (field: keyof typeof report, value: any) => {
    dispatch({
      type: "SET_PATH",
      path: `formData.mtAccidentReport.${field}`,
      value,
    });
  };

  /* ===== SAVE ===== */
  const handleSave = async () => {
    try {
      const payload = mapMTAccidentPayload(state.formData);

      console.log("📤 FINAL PAYLOAD (FRONTEND → API):", payload);

      await createReport(payload);

      onSuccess?.();
    } catch (error) {
      console.error("❌ Failed to save MT Accident Report:", error);
    }
  };

  return (
    <div className="space-y-12">
      {/* ===== INDIVIDUAL + CO-DRIVER ===== */}
      <IndividualVictimSection />

      <div className="border-t my-12" />

      {/* ===== ACCIDENT DETAILS ===== */}
      <AccidentDetailsSection
        date={report.dateOfAccident ? new Date(report.dateOfAccident) : undefined}
        onDateChange={(d) =>
          setField("dateOfAccident", d ? d.toISOString() : null)
        }
        time={report.timeOfAccident || ""}
        onTimeChange={(t) => setField("timeOfAccident", t)}
        place={report.placeOfAccident || ""}
        onPlaceChange={(p) => setField("placeOfAccident", p)}
        type={report.typeOfAccident || ""}
        onTypeChange={(t) => setField("typeOfAccident", t)}
        cause={report.probableCause || ""}
        onCauseChange={(c) => setField("probableCause", c)}
      />

      <div className="border-t my-12" />

      {/* ===== VEHICLE DETAILS ===== */}
      <VehicleDetailsSection
        vehicleNumber={report.vehicleNumber || ""}
        onVehicleNumberChange={(v) => setField("vehicleNumber", v)}
        makeModel={report.makeAndModel || ""}
        onMakeModelChange={(v) => setField("makeAndModel", v)}
      />

      <div className="border-t my-12" />

      {/* ===== CASUALTY DETAILS ===== */}
      <CasualtyDetailsSection
        injuredCivil={report.injuredCivil || 0}
        injuredMilitary={report.injuredMilitary || 0}
        diedCivil={report.diedCivil || 0}
        diedMilitary={report.diedMilitary || 0}
        onChange={(field, value) => setField(field, value)}
      />

      <div className="border-t my-12" />

      {/* ===== FIR DETAILS ===== */}
      <FirDetailsSection
        firNumber={report.firMactNumber || ""}
        onFirNumberChange={(v) => setField("firMactNumber", v)}
        firDate={report.firDate ? new Date(report.firDate) : undefined}
        onFirDateChange={(d) =>
          setField("firDate", d ? d.toISOString() : null)
        }
        policeStation={report.firPoliceStation || ""}
        onPoliceStationChange={(v) => setField("firPoliceStation", v)}
      />

      <div className="border-t my-12" />

      {/* ===== ACTION ===== */}
      <ActionSection
        status={report.actionStatus || false}
        onStatusChange={(v) => setField("actionStatus", v)}
        remark={report.remark || ""}
        onRemarkChange={(v) => setField("remark", v)}
      />

      {/* ===== FOOTER ===== */}
      <div className="flex justify-end gap-4 pt-8">
        <Button variant="outline" onClick={() => onSuccess?.()}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isPending ? "Saving..." : "Save Accident Report"}
        </Button>
      </div>
    </div>
  );
}
