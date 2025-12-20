
"use client";

import { useState } from "react";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";

export default function OffenderDynamicForm({
  title,
  helperText,
  fields
}: any) {
  const { state } = useForm();

  const activeOffenderType =
    state?.formData?.vehicleInvolved === "yes"
      ? state.formData.vehicleDetails.driverType
      : state.formData.offenderWithoutVehicle.offenderType;

  const [isDependent, setIsDependent] = useState(false);

  const [dependents, setDependents] = useState([
    { relation: "", whoIsIt: "" }
  ]);

  return (
    <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {/* MAIN FORM */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f: any, i: number) =>
          f.type === "input" ? (
            <FormInput key={i} label={f.label} placeholder={f.placeholder} />
          ) : (
            <FormSelect
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              options={f.options || []}
            />
          )
        )}
      </div>

      {/* CIVILIAN SPECIAL SECTION */}
      {activeOffenderType?.toLowerCase() === "civilian" && (
        <div className="rounded-xl border border-gray-300 bg-gray-50 p-6 space-y-5 mt-6">
          <label className="flex gap-2 items-start text-sm">
            <Checkbox
              checked={isDependent}
              onCheckedChange={(v) => setIsDependent(Boolean(v))}
            />
            <span>
              Is this person <b>Dependent / Relative</b> of Military Personnel?
            </span>
          </label>

          {isDependent &&
            dependents.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white space-y-4"
              >
                {/* RELATION INPUT */}
                <FormInput
                  label="Relation"
                  placeholder="e.g. Brother-in-law"
                />

                {/* WHO IS IT */}
                <p className="font-semibold mb-2">Who is it?</p>

                <RadioGroup
                  className="grid grid-cols-2 gap-3"
                  value={item.whoIsIt}
                  onValueChange={(v) => {
                    const copy = [...dependents];
                    copy[index].whoIsIt = v;
                    setDependents(copy);
                  }}
                >
                  {[
                    "Military Personnel",
                    "Servant / Maid",
                    "Shopkeeper & Worker",
                    "Temporary Hired Worker"
                  ].map((x) => (
                    <label
                      key={x}
                      className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer bg-white"
                    >
                      <RadioGroupItem value={x} />
                      {x}
                    </label>
                  ))}
                </RadioGroup>

                {/* ⬇️ SHOW THEIR DETAILS FORM */}
                {item.whoIsIt &&
                  offenderFormsConfig[item.whoIsIt] && (
                    <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                      <p className="font-semibold mb-2">
                        {offenderFormsConfig[item.whoIsIt].title}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        {offenderFormsConfig[item.whoIsIt].fields.map(
                          (f: any, i: number) =>
                            f.type === "input" ? (
                              <FormInput
                                key={i}
                                label={f.label}
                                placeholder={f.placeholder}
                              />
                            ) : (
                              <FormSelect
                                key={i}
                                label={f.label}
                                placeholder={f.placeholder}
                                options={f.options || []}
                              />
                            )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ))}

          {/* Add More Button */}
          {isDependent && (
            <button
              onClick={() =>
                setDependents([
                  ...dependents,
                  { relation: "", whoIsIt: "" }
                ])
              }
              className="text-blue-600 text-sm"
            >
              + Add More People
            </button>
          )}
        </div>
      )}
    </div>
  );
}
