"use client";

import { useForm } from "@/context/FormContext";
import { FormInput } from "@/common/component/FormInput";

export default function CasualtyDetailsSection() {
  const { state, dispatch } = useForm();
  const d = state.formData.mtAccidentReport;

  const set = (key: string, value: number) => {
    dispatch({
      type: "SET_PATH",
      path: `formData.mtAccidentReport.${key}`,
      value: value,
    });
  };

  return (
    <section className="border rounded-lg p-5 space-y-4 bg-white">
      <h3 className="font-semibold text-gray-800">Casualty Details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <FormInput
          label="Injured (Civil)"
          type="number"
          value={String(d.injuredCivil ?? "")}
          onChange={(v) => set("injuredCivil", Number(v))}
        />

        <FormInput
          label="Injured (Mil)"
          type="number"
          value={String(d.injuredMilitary ?? "")}
          onChange={(v) => set("injuredMilitary", Number(v))}
        />

        <FormInput
          label="Died (Civil)"
          type="number"
          value={String(d.diedCivil ?? "")}
          onChange={(v) => set("diedCivil", Number(v))}
        />

        <FormInput
          label="Died (Mil)"
          type="number"
          value={String(d.diedMilitary ?? "")}
          onChange={(v) => set("diedMilitary", Number(v))}
        />
      </div>
    </section>
  );
}
