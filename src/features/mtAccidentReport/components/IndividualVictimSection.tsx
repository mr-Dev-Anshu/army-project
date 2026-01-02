"use client";

import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";
import OffenderDynamicForm from "@/common/component/multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "@/common/component/multi-step-form/steps/Step1Particulars/config/OffenderConfig";

const INDIVIDUAL_TYPES = Object.keys(offenderFormsConfig);

export default function IndividualVictimSection() {
  const { state, dispatch } = useForm();

  const selected = state.formData.mtAccidentReport.individualType;

  const selectType = (type: string) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.individualDetails",
      value: {},
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.individualType",
      value: type,
    });
  };

  return (
    <section className="space-y-6">
      {/* ================= SELECT TYPE ================= */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-black">
            Individual / Victim Details
          </h3>
          <p className="text-sm font-semibold text-black">
            Select the type of individual involved in the accident
          </p>
        </div>

     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {INDIVIDUAL_TYPES.map((type) => {
    const active = selected === type;

    return (
      <button
        key={type}
        type="button"
        onClick={() => selectType(type)}
        className={cn(
          "flex items-center gap-4 w-full h-14 px-5",
          "rounded-xl border transition-all",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          active
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-blue-400"
        )}
      >
        {/* RADIO CIRCLE */}
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

        {/* LABEL */}
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

      </div>

      {/* ================= DYNAMIC FORM ================= */}
      {selected && offenderFormsConfig[selected] && (
        <div className="bg-white border rounded-xl p-6 space-y-3">
          <OffenderDynamicForm
            title={offenderFormsConfig[selected].title}
            helperText={offenderFormsConfig[selected].helperText}
            fields={offenderFormsConfig[selected].fields}
            scope="mt-accident"
            path="formData.mtAccidentReport.individualDetails"
            showCoDriver
          />
        </div>
      )}
    </section>
  );
}
