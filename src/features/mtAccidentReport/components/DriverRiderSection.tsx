"use client";

import { useReducer } from "react";
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
  path: string;
  showCoDriver?: boolean;
}

interface DriverState {
  driverType: string | null;
}

type DriverAction = 
  | { type: "SET_DRIVER_TYPE"; payload: string }
  | { type: "RESET" };

/* ======================================
   REDUCER
====================================== */
const driverReducer = (state: DriverState, action: DriverAction): DriverState => {
  switch (action.type) {
    case "SET_DRIVER_TYPE":
      return { driverType: action.payload };
    case "RESET":
      return { driverType: null };
    default:
      return state;
  }
};

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
  path,
  showCoDriver = true,
}: DriverRiderSectionProps) {
  const [driverState, driverDispatch] = useReducer(driverReducer, { driverType: null });

  return (
    <div className="space-y-6">
      <p className="font-semibold">{title}</p>

      {/* ===== DRIVER TYPE SELECT ===== */}
      <div className="grid sm:grid-cols-2 gap-3">
        {DRIVER_TYPES.map((type) => {
          const active = driverState.driverType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => driverDispatch({ type: "SET_DRIVER_TYPE", payload: type })}
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
      {driverState.driverType && offenderFormsConfig[driverState.driverType] && (
        <OffenderDynamicForm
          title={offenderFormsConfig[driverState.driverType].title}
          helperText={offenderFormsConfig[driverState.driverType].helperText}
          fields={offenderFormsConfig[driverState.driverType].fields}
          scope={scope}
          path={path}
          showCoDriver={showCoDriver}
        />
      )}
    </div>
  );
}
