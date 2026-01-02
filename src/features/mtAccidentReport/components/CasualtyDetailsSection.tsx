"use client";

import { useForm } from "@/context/FormContext";
import { FormInput } from "@/common/component/FormInput";

export default function CasualtyDetailsSection() {
  const { state, dispatch } = useForm();
  const d = state.formData.mtAccidentReport;

  const set = (key: string, value: any) => {
    // Convert to number, default to 0 if empty or NaN
    const numValue = value === "" || isNaN(Number(value)) ? 0 : Number(value);
    dispatch({
      type: "SET_PATH",
      path: `formData.mtAccidentReport.${key}`,
      value: Math.max(0, numValue), // Ensure non-negative
    });
  };

  return (
    <section className="border rounded-lg p-5 space-y-4 bg-white">
      <h3 className="font-semibold text-gray-800">Casualty Details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <FormInput
          label="Injured (Civil)"
          type="number"
          value={String(d.injuredCivil ?? 0)}
          onChange={(v) => set("injuredCivil", v)}
        />

        <FormInput
          label="Injured (Mil)"
          type="number"
          value={String(d.injuredMilitary ?? 0)}
          onChange={(v) => set("injuredMilitary", v)}
        />

        <FormInput
          label="Died (Civil)"
          type="number"
          value={String(d.diedCivil ?? 0)}
          onChange={(v) => set("diedCivil", v)}
        />

        <FormInput
          label="Died (Mil)"
          type="number"
          value={String(d.diedMilitary ?? 0)}
          onChange={(v) => set("diedMilitary", v)}
        />
      </div>
    </section>
  );
}
