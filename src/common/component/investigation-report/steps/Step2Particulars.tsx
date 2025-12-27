
"use client";

import { FormSection } from "@/common/component/FormSection";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { useForm } from "@/context/FormContext";

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
        <FormSelect
          label="Rank"
          options={[
            { label: "Pvt", value: "pvt" },
            { label: "L/Nk", value: "lnk" },
            { label: "Nk", value: "nk" },
            { label: "Hav", value: "hav" },
            { label: "Subedar", value: "subedar" },
          ]}
          value={mp.rank}
          onChange={(v) => set("rank", v)}
        />
        <FormInput label="Name" value={mp.name} onChange={(v) => set("name", v)} />
        <FormSelect
          label="Unit"
          options={[
            { label: "11 Engr Regt", value: "11engr" },
            { label: "HQ 21 Corps", value: "21corps" },
            { label: "Signal Unit", value: "signal" },
          ]}
          value={mp.unit}
          onChange={(v) => set("unit", v)}
        />

        <FormSelect
          label="FMN"
          options={[
            { label: "Central Command", value: "central" },
            { label: "Western Command", value: "western" },
            { label: "Northern Command", value: "northern" },
          ]}
          value={mp.fmn}
          onChange={(v) => set("fmn", v)}
        />

        <FormSelect
          label="Command"
          options={[
            { label: "Command A", value: "a" },
            { label: "Command B", value: "b" },
            { label: "Command C", value: "c" },
          ]}
          value={mp.command}
          onChange={(v) => set("command", v)}
        />

        <FormInput label="Address" value={mp.address} onChange={(v) => set("address", v)} />
        <FormInput label="I Card Number" value={mp.icard} onChange={(v) => set("icard", v)} />
      </div>
    </FormSection>
  );
}
