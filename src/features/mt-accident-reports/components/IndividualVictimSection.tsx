"use client";

import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";
import OffenderDynamicForm from "@/common/component/multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "@/common/component/multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useState } from "react";

export default function IndividualVictimSection() {
  const { state, dispatch } = useForm();

  const TYPES = Object.entries(offenderFormsConfig);

  const individualType = state.formData.mtAccidentReport.individualType;
  const coDriverType = state.formData.mtAccidentReport.coDriverType;

  const [hasCoDriver, setHasCoDriver] = useState(false);

  /* ---------- SELECT HANDLERS ---------- */
  const selectIndividualType = (type: string) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.individualType",
      value: type,
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.individualDetails",
      value: {},
    });

    // reset co-driver when individual changes
    setHasCoDriver(false);
    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.coDriverType",
      value: "",
    });
    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.coDriverDetails",
      value: {},
    });
  };

  const selectCoDriverType = (type: string) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.coDriverType",
      value: type,
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.coDriverDetails",
      value: {},
    });
  };

  return (
    <section className="space-y-10">
      {/* ================= INDIVIDUAL ================= */}
      <div className="bg-white border rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold">
          Individual / Victim Details
        </h3>

        {/* ---- Individual Options ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TYPES.map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              onClick={() => selectIndividualType(key)}
              className={cn(
                "flex items-center gap-4 h-14 px-5 rounded-lg border transition",
                individualType === key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            >
              <span className="h-4 w-4 rounded-full border flex items-center justify-center">
                {individualType === key && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </span>
              <span className="text-sm font-medium">
                {cfg.label}
              </span>
            </button>
          ))}
        </div>

        {/* ---- Individual Form ---- */}
        {individualType && (
          <OffenderDynamicForm
            title={offenderFormsConfig[individualType].title}
            helperText={offenderFormsConfig[individualType].helperText}
            fields={offenderFormsConfig[individualType].fields}
            path="formData.mtAccidentReport.individualDetails"
          />
        )}
      </div>

      {/* ================= CO-DRIVER (ONLY AFTER INDIVIDUAL FORM) ================= */}
      {individualType && (
        <div className="bg-white border rounded-xl p-6 space-y-6">
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={hasCoDriver}
              onChange={(e) => setHasCoDriver(e.target.checked)}
            />
            Was there a Co-Driver / Pillion Rider?
          </label>

          {hasCoDriver && (
            <>
              <h3 className="text-lg font-semibold">
                Co-Driver Details
              </h3>

              {/* ---- Co-Driver Options ---- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TYPES.map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectCoDriverType(key)}
                    className={cn(
                      "flex items-center gap-4 h-14 px-5 rounded-lg border",
                      coDriverType === key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    )}
                  >
                    <span className="h-4 w-4 rounded-full border flex items-center justify-center">
                      {coDriverType === key && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </span>
                    <span className="text-sm font-medium">
                      {cfg.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* ---- Co-Driver Form ---- */}
              {coDriverType && (
                <OffenderDynamicForm
                  title={`${offenderFormsConfig[coDriverType].title} (Co-Driver)`}
                  helperText={offenderFormsConfig[coDriverType].helperText}
                  fields={offenderFormsConfig[coDriverType].fields}
                  path="formData.mtAccidentReport.coDriverDetails"
                />
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
