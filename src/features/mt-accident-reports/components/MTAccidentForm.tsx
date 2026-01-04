"use client";

import React, { useEffect } from "react";
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
import {
  useCreateMTAccidentReport,
  useUpdateMTAccidentReport,
} from "../hooks/useMTAccidentReport";
import { mapMTAccidentPayload } from "../utils/mapMTAccidentPayload";

/* ================= PROPS ================= */

interface MTAccidentReportFormProps {
  onSuccess?: () => void;
  initialData?: any; // ✅ FOR EDIT
}

/* ================= COMPONENT ================= */

export default function MTAccidentReportForm({
  onSuccess,
  initialData,
}: MTAccidentReportFormProps) {
  const { state, dispatch } = useForm();
  const report = state.formData.mtAccidentReport;

  const { mutateAsync: createReport, isPending: isCreating } =
    useCreateMTAccidentReport();

  const { mutateAsync: updateReport, isPending: isUpdating } =
    useUpdateMTAccidentReport();

  const isEditMode = Boolean(initialData?._id);

  /* ================= PREFILL FORM (EDIT MODE) ================= */

  useEffect(() => {
    if (!initialData) return;

    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        mtAccidentReport: {
          ...initialData,
          dateOfAccident: initialData.dateOfAccident || initialData.date,
        },
      },
    });
  }, [initialData, dispatch]);

  /* ================= SET FIELD ================= */

  const setField = (field: keyof typeof report, value: any) => {
    dispatch({
      type: "SET_PATH",
      path: `formData.mtAccidentReport.${field}`,
      value,
    });
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      const payload = mapMTAccidentPayload(state.formData);
      console.log("📤 FINAL PAYLOAD:", payload);

      if (isEditMode) {
        await updateReport({
          id: initialData._id,
          data: payload,
        });
      } else {
        await createReport(payload);
      }

      onSuccess?.();
    } catch (error) {
      console.error("❌ Failed to save MT Accident Report:", error);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col h-full">
      {/* ================= FORM BODY ================= */}
      <div className="flex-1 overflow-y-auto px-1 pr-2">
        <div className="space-y-8 pb-28">
          <IndividualVictimSection />

          <div className="border-t" />

          <AccidentDetailsSection
            date={
              report.dateOfAccident
                ? new Date(report.dateOfAccident)
                : undefined
            }
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

          <div className="border-t" />

          <VehicleDetailsSection
            vehicleNumber={report.vehicleNumber || ""}
            onVehicleNumberChange={(v) => setField("vehicleNumber", v)}
            makeModel={report.makeAndModel || ""}
            onMakeModelChange={(v) => setField("makeAndModel", v)}
          />

          <div className="border-t" />

          <CasualtyDetailsSection
            injuredCivil={report.injuredCivil || 0}
            injuredMilitary={report.injuredMilitary || 0}
            diedCivil={report.diedCivil || 0}
            diedMilitary={report.diedMilitary || 0}
            onChange={(field, value) => setField(field, value)}
          />

          <div className="border-t" />

          <FirDetailsSection
            firNumber={report.firMactNumber || ""}
            onFirNumberChange={(v) => setField("firMactNumber", v)}
            firDate={report.firDate ? new Date(report.firDate) : undefined}
            onFirDateChange={(d) =>
              setField("firDate", d ? d.toISOString() : null)
            }
            policeStation={report.firPoliceStation || ""}
            onPoliceStationChange={(v) =>
              setField("firPoliceStation", v)
            }
          />

          <div className="border-t" />

          <ActionSection
            status={report.actionStatus || false}
            onStatusChange={(v) => setField("actionStatus", v)}
            remark={report.remark || ""}
            onRemarkChange={(v) => setField("remark", v)}
          />
        </div>
      </div>

      {/* ================= STICKY FOOTER ================= */}
      <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
        <Button variant="outline" onClick={() => onSuccess?.()}>
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          disabled={isCreating || isUpdating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isEditMode
            ? isUpdating
              ? "Updating..."
              : "Update Accident Report"
            : isCreating
              ? "Saving..."
              : "Save Accident Report"}
        </Button>
      </div>
    </div>
  );
}
