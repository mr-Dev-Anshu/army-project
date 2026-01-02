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

  const selected = state.formData.mtAccidentReport?.driverType || null;

  const selectType = (type: string) => {
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

  const config = selected ? offenderFormsConfig[selected] : null;

  return (
    <section className="space-y-6">
      {/* ===== SINGLE OUTER CARD ===== */}
      <div className="bg-white rounded-xl border p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Driver / Co-Driver Details
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {title}
          </p>
        </div>

        {/* ===== RADIO OPTIONS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DRIVER_TYPES.map((type) => {
            const active = selected === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => selectType(type)}
                className={cn(
                  "flex items-center gap-4 h-14 px-5 w-full",
                  "rounded-lg border transition-all",
                  active
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-blue-400"
                )}
              >
                {/* Radio */}
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border",
                    active ? "border-blue-500" : "border-gray-400"
                  )}
                >
                  {active && (
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  )}
                </span>

                {/* Label */}
                <span
                  className={cn(
                    "text-sm font-medium",
                    active ? "text-blue-700" : "text-gray-800"
                  )}
                >
                  {type}
                </span>
              </button>
            );
          })}
        </div>

        {/* ===== DYNAMIC FORM (NO EXTRA BORDER) ===== */}
        {config && (
          <div className="pt-2">
            <OffenderDynamicForm
              title={config.title}
              helperText={config.helperText}
              fields={config.fields}
              scope={scope}
              path="formData.mtAccidentReport.driverDetails"
              showCoDriver={showCoDriver}
            />
          </div>
        )}
      </div>
    </section>
  );
}
