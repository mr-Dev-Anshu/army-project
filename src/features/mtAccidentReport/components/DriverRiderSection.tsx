"use client";

import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";
import OffenderDynamicForm from "@/common/component/multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "@/common/component/multi-step-form/steps/Step1Particulars/config/OffenderConfig";

/* ======================================
   TYPES
====================================== */
type ScopeType =
  | "traffic"
  | "static"
  | "mp-main"
  | "mp-additional"
  | "mt-accident";

interface DriverRiderSectionProps {
  title?: string;
  scope: ScopeType;
  showCoDriver?: boolean;
}

/* ======================================
   DRIVER TYPES
====================================== */
const DRIVER_TYPES = Object.keys(offenderFormsConfig);

/* ======================================
   COMPONENT
====================================== */
export default function DriverRiderSection({
  title = "Select Who was the Driver / Rider?",
  scope,
  showCoDriver = true,
}: DriverRiderSectionProps) {
  const { state, dispatch } = useForm();

  const driverType = state.formData.mtAccidentReport?.driverType || null;
  const driverDetails = state.formData.mtAccidentReport?.driverDetails || {};

  const selectDriverType = (type: string) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.driverType",
      value: type,
    });

    // Reset driver details when type changes
    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.driverDetails",
      value: {},
    });
  };

  return (
    <div className="space-y-6">
      <p className="font-semibold">{title}</p>

      {/* ===== DRIVER TYPE SELECT ===== */}
      <div className="grid sm:grid-cols-2 gap-3">
        {DRIVER_TYPES.map((type) => {
          const active = driverType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => selectDriverType(type)}
              className={cn(
                "border rounded-lg px-4 py-3 flex items-center gap-3 text-left transition",
                active
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              )}
            >
              <span
                className={cn(
                  "h-4 w-4 rounded-full border flex items-center justify-center",
                  active ? "border-blue-500" : "border-gray-400"
                )}
              >
                {active && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </span>

              <span className="text-sm font-medium">{type}</span>
            </button>
          );
        })}
      </div>

      {/* ===== OFFENDER FORM ===== */}
      {driverType && offenderFormsConfig[driverType] && (
        <OffenderDynamicForm
          title={offenderFormsConfig[driverType].title}
          helperText={offenderFormsConfig[driverType].helperText}
          fields={offenderFormsConfig[driverType].fields}
          scope={scope}
          path="formData.mtAccidentReport.driverDetails"
          showCoDriver={showCoDriver}
        />
      )}
    </div>
  );
}
