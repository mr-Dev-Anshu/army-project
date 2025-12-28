
"use client";

import { FormSection } from "@/common/component/FormSection";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";

export default function Step2MpParticulars() {
  const { state, dispatch } = useForm();
  const mp = state.formData.mpReport.mpParticulars;

  const set = (key: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.mpParticulars.${key}`,
      value,
    });

  const clearForm = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.mpParticulars",
      value: {
        armyNo: "",
        rank: "",
        name: "",
        unit: "",
        fmn: "",
        command: "",
        address: "",
        icard: "",
      },
    });

  return (
    <FormSection title="2. MP PARTICULARS:" onClear={clearForm}>
      <p className="font-semibold">Investigation Head Details</p>
      <p className="text-sm text-gray-500 mb-4">
        MP must caution witness and ensure presence of independent witness if possible
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="Army Number" value={mp.armyNo} onChange={(v) => set("armyNo", v)} />
        <SuggestionInput
          label="Rank"
          placeholder="Select Rank"
          value={mp.rank}
          onChange={(v) => set("rank", v)}
          fieldType="rank"
          defaultOptions={["Pvt", "L/Nk", "Nk", "Hav", "Subedar"]}
        />
        <FormInput label="Name" value={mp.name} onChange={(v) => set("name", v)} />
        <SuggestionInput
          label="Unit"
          placeholder="Select Unit"
          value={mp.unit}
          onChange={(v) => set("unit", v)}
          fieldType="unit"
          defaultOptions={["11 Engr Regt", "HQ 21 Corps", "Signal Unit"]}
        />

        <SuggestionInput
          label="FMN"
          placeholder="Select FMN"
          value={mp.fmn}
          onChange={(v) => set("fmn", v)}
          fieldType="fmn"
          defaultOptions={["Central Command", "Western Command", "Northern Command"]}
        />

        <SuggestionInput
          label="Command"
          placeholder="Select Command"
          value={mp.command}
          onChange={(v) => set("command", v)}
          fieldType="command"
          defaultOptions={["Command A", "Command B", "Command C"]}
        />

        <SuggestionInput label="Address" value={mp.address} onChange={(v) => set("address", v)} fieldType="address" />
        <FormInput label="I Card Number" value={mp.icard} onChange={(v) => set("icard", v)} />
      </div>
    </FormSection>
  );
}
