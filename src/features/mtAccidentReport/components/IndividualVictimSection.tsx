"use client";

import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";
import OffenderDynamicForm from "@/common/component/multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "@/common/component/multi-step-form/steps/Step1Particulars/config/OffenderConfig";

const INDIVIDUAL_TYPES = Object.keys(offenderFormsConfig);

export default function IndividualVictimSection() {
  const { state, dispatch } = useForm();

  const selected = state.formData.mtAccidentReport.individualType;
  const details = state.formData.mtAccidentReport.individualDetails;

  console.log("🟡 Individual section data:", selected, details);

  const selectType = (type: string) => {
    if (type === selected) return; // 🔒 DO NOT WIPE ON EDIT

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
  };

  const config = selected ? offenderFormsConfig[selected] : null;

  return (
    <section className="space-y-6">
      <h3 className="font-semibold text-gray-900">
        Individual / Victim Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {INDIVIDUAL_TYPES.map((type) => {
          const active = selected === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => selectType(type)}
              className={cn(
                "border rounded-lg px-4 py-2 flex items-center gap-2",
                active ? "border-gray-700" : "border-gray-300"
              )}
            >
              <span
                className={cn(
                  "h-3 w-3 rounded-full border",
                  active && "bg-gray-700"
                )}
              />
              {type}
            </button>
          );
        })}
      </div>

      {config && (
        <OffenderDynamicForm
          title={config.title}
          helperText={config.helperText}
          fields={config.fields}
          scope="mt-accident"
          path="formData.mtAccidentReport.individualDetails"
          showCoDriver
        />
      )}
    </section>
  );
}
