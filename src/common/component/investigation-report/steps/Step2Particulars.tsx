"use client";
import { FormSection } from "@/common/component/FormSection";
import { FormInput } from "@/common/component/FormInput";
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

  return (
   <FormSection title="">
  <p className="font-semibold">Investigation Head Details</p>
  <p className="text-sm text-gray-500 mb-4">
    MP must caution witness and ensure presence of independent witness if possible
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

    <div className="flex flex-col gap-2">
      <FormInput
        label="Army Number"
        placeholder="Enter Army Number (e.g., 1234A/B/C)"
        value={mp.armyNo}
        onChange={(v) => set("armyNo", v)}
      />
    </div>

    <div className="flex flex-col gap-2">
      <SuggestionInput
        label="Rank"
        placeholder="Select Rank"
        value={mp.rank}
        onChange={(v) => set("rank", v)}
        fieldType="rank"
        defaultOptions={["Pvt", "L/Nk", "Nk", "Hav", "Subedar"]}
      />
    </div>

    <div className="flex flex-col gap-2">
      <FormInput
        label="Name"
        placeholder="Enter Full Name"
        value={mp.name}
        onChange={(v) => set("name", v)}
      />
    </div>

    <div className="flex flex-col gap-2">
      <SuggestionInput
        label="Unit"
        placeholder="Enter / Select Unit"
        value={mp.unit}
        onChange={(v) => set("unit", v)}
        fieldType="unit"
        defaultOptions={["11 Engr Regt", "HQ 21 Corps", "Signal Unit"]}
      />
    </div>

    <div className="flex flex-col gap-2">
      <SuggestionInput
        label="FMN"
        placeholder="Enter / Select FMN"
        value={mp.fmn}
        onChange={(v) => set("fmn", v)}
        fieldType="fmn"
      />
    </div>

    <div className="flex flex-col gap-2">
      <SuggestionInput
        label="Command"
        placeholder="Enter / Select Command"
        value={mp.command}
        onChange={(v) => set("command", v)}
        fieldType="command"
      />
    </div>

    <div className="flex flex-col gap-2">
      <SuggestionInput
        label="Address"
        placeholder="Enter Address / Place of Stay"
        value={mp.address}
        onChange={(v) => set("address", v)}
        fieldType="address"
      />
    </div>

    <div className="flex flex-col gap-2">
      <FormInput
        label="I Card Number"
        placeholder="Enter I-Card Number"
        value={mp.icard}
        onChange={(v) => set("icard", v)}
      />
    </div>

  </div>
</FormSection>

  );
}
