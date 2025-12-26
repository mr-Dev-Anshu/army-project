"use client";

import { FormSection } from "@/common/component/FormSection";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { useForm } from "@/context/FormContext";

export default function Step2MpParticulars() {
  const { state, dispatch } = useForm();

  const mp = state.formData.mpReport.mpParticulars;

  const handleChange = (key: string, value: any) => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "mpParticulars",
      payload: { [key]: value },
    });
  };

  const clearForm = () => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "mpParticulars",
      payload: {
        armyNumber: "",
        rank: "",
        name: "",
        unit: "",
        fmn: "",
        command: "",
        address: "",
        iCardNumber: "",
      },
    });
  };

  return (
    <FormSection title="2. MP PARTICULARS:" onClear={clearForm}>
      <p className="font-semibold">Investigation Head Details</p>
      <p className="text-sm text-gray-500 mb-4">
        MP must caution witness and ensure presence of independent witness if possible
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Army No */}
        <FormInput
          label="Army Number"
          placeholder="e.g. 12345678A"
          value={mp.armyNo}
          onChange={(v) => handleChange("armyNo", v)}
        />

        {/* Rank Dropdown */}
        <FormSelect
          label="Rank"
          placeholder="Select rank"
          options={[
            { label: "Pvt", value: "pvt" },
            { label: "L/Nk", value: "lnk" },
            { label: "Nk", value: "nk" },
            { label: "Hav", value: "hav" },
            { label: "Subedar", value: "subedar" },
          ]}
          value={mp.rank}
          onChange={(v) => handleChange("rank", v)}
        />

        {/* Name */}
        <FormInput
          label="Name"
          placeholder="e.g. John Apradhi"
          value={mp.name}
          onChange={(v) => handleChange("name", v)}
        />

        {/* Unit Dropdown */}
        <FormSelect
          label="Unit"
          placeholder="Select unit"
          options={[
            { label: "11 Engr Regt", value: "11engr" },
            { label: "HQ 21 Corps", value: "21corps" },
            { label: "Signal Unit", value: "signal" },
          ]}
          value={mp.unit}
          onChange={(v) => handleChange("unit", v)}
        />

        {/* FMN Dropdown */}
        <FormSelect
          label="FMN"
          placeholder="Select FMN"
          options={[
            { label: "Central Command", value: "central" },
            { label: "Western Command", value: "western" },
            { label: "Northern Command", value: "northern" },
          ]}
          value={mp.fmn}
          onChange={(v) => handleChange("fmn", v)}
        />

        {/* Command Dropdown */}
        <FormSelect
          label="Command"
          placeholder="Select Command"
          options={[
            { label: "Command A", value: "a" },
            { label: "Command B", value: "b" },
            { label: "Command C", value: "c" },
          ]}
          value={mp.command}
          onChange={(v) => handleChange("command", v)}
        />

        {/* Address */}
        <FormInput
          label="Address"
          placeholder="e.g. C/O 56 APO"
          value={mp.address}
          onChange={(v) => handleChange("address", v)}
        />

        {/* ICard */}
        <FormInput
          label="I Card Number"
          placeholder="e.g. A-123456"
          value={mp.icard}
          onChange={(v) => handleChange("icard", v)}
        />
      </div>
    </FormSection>
  );
}
