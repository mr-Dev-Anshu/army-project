"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "@/context/FormContext";

import IndividualVictimSection from "../components/IndividualVictimSection";
import { AccidentDetailsSection } from "./AccidentDetailsSection";
import { VehicleDetailsSection } from "./VehicleDetailsSection";
import { CasualtyDetailsSection } from "./CasualtyDetailsSection";
import { FirDetailsSection } from "./FirDetailsSection";
import { ActionSection } from "./ActionSection";

import {
  useCreateMTAccidentReport,
  useUpdateMTAccidentReport,
} from "../hooks/useMTAccidentReport";
import { mapMTAccidentPayload } from "../utils/mapMTAccidentPayload";

interface Props {
  initialData?: any;
  onSuccess?: () => void;
}

export default function MTAccidentForm({ initialData, onSuccess }: Props) {
  const { state, dispatch } = useForm();
  const report = state.formData.mtAccidentReport;

  const isEdit = Boolean(initialData?._id);

 const isEditMode = Boolean(initialData && initialData._id);



  const { mutateAsync: createReport } = useCreateMTAccidentReport();
  const { mutateAsync: updateReport } = useUpdateMTAccidentReport();

  /* ---------- PREFILL ON EDIT ---------- */
  useEffect(() => {
    if (!initialData){
       dispatch({ type: "RESET_MT_ACCIDENT_FORM" });
    return;
    }

dispatch({
  type: "SET_FORM_DATA",
  payload: {
    ...state.formData,
    mtAccidentReport: {
      ...state.formData.mtAccidentReport,
      ...initialData,
      dateOfAccident: initialData.date ?? null,
    },
  },
});

  }, [initialData]);

  const setField = (k: string, v: any) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mtAccidentReport.${k}`,
      value: v,
    });

const handleSave = async () => {
  try {
   const payload = mapMTAccidentPayload(
  state.formData,
  isEditMode ? "update" : "create",
  initialData // 🔥 PASS ORIGINAL DATA
);

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
    console.error("❌ Save failed:", error);
  }
};


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-8 pb-24">
        <IndividualVictimSection />

        <AccidentDetailsSection
          date={report.dateOfAccident ? new Date(report.dateOfAccident) : undefined}
          onDateChange={(d) =>
            setField("dateOfAccident", d ? d.toISOString() : null)
          }
          time={report.timeOfAccident}
          onTimeChange={(v) => setField("timeOfAccident", v)}
          place={report.placeOfAccident}
          onPlaceChange={(v) => setField("placeOfAccident", v)}
          type={report.typeOfAccident}
          onTypeChange={(v) => setField("typeOfAccident", v)}
          cause={report.probableCause}
          onCauseChange={(v) => setField("probableCause", v)}
        />

        <VehicleDetailsSection
          vehicleNumber={report.vehicleNumber}
          onVehicleNumberChange={(v) => setField("vehicleNumber", v)}
          makeModel={report.makeAndModel}
          onMakeModelChange={(v) => setField("makeAndModel", v)}
        />

        <CasualtyDetailsSection
          injuredCivil={report.injuredCivil}
          injuredMilitary={report.injuredMilitary}
          diedCivil={report.diedCivil}
          diedMilitary={report.diedMilitary}
          onChange={(f, v) => setField(f, v)}
        />

        <FirDetailsSection
          firNumber={report.firMactNumber}
          onFirNumberChange={(v) => setField("firMactNumber", v)}
          firDate={report.firDate ? new Date(report.firDate) : undefined}
          onFirDateChange={(d) =>
            setField("firDate", d ? d.toISOString() : null)
          }
          policeStation={report.firPoliceStation}
          onPoliceStationChange={(v) => setField("firPoliceStation", v)}
        />

        <ActionSection
          status={report.actionStatus}
          onStatusChange={(v) => setField("actionStatus", v)}
          remark={report.remark}
          onRemarkChange={(v) => setField("remark", v)}
        />
      </div>

      <div className="border-t p-4 flex justify-end gap-3">
        <Button variant="outline" onClick={onSuccess}>Cancel</Button>
        <Button onClick={handleSave}>
          {isEdit ? "Update Report" : "Save Report"}
        </Button>
      </div>
    </div>
  );
}
