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
  fields,
  showCoDriver = false,
}: any) {
  const { state, dispatch } = useForm();

  const activeOffenderType =
    state?.formData?.vehicleInvolved === "yes"
      ? state.formData.vehicleDetails.driverType
      : state.formData.offenderWithoutVehicle.offenderType;

  const [isDependent, setIsDependent] = useState(false);
  const [dependents, setDependents] = useState([{ relation: "", whoIsIt: "" }]);

  const saveField = (label: string, value: string) => {
    dispatch({
      type: "SET_OFFENDER_DETAILS",
      payload: { [label]: value },
    });
  };

  return (
    <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {/* ---------- MAIN FORM ---------- */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f: any, i: number) =>
          f.type === "input" ? (
            <FormInput
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              onChange={(value: any) => saveField(f.label, value)}
            />
          ) : (
            <FormSelect
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              options={f.options || []}
              onChange={(value: any) => saveField(f.label, value)}
            />
          )
        )}
      </div>

      {/* ---------- ONLY FOR MILITARY PERSON ---------- */}
      {showCoDriver && activeOffenderType === "Military Person" && (
        <>
          <div className="mt-6 flex items-start gap-2">
            <Checkbox
              checked={Boolean(state.formData.coDriverOrPillion)}
              onCheckedChange={(v) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  payload: { coDriverOrPillion: Boolean(v) },
                })
              }
            />

            <p className="text-sm">
              Was there a <b>Co-Driver / Pillion Rider</b> ?
            </p>
          </div>

          {/* ⭐ If checked → Show SAME Military Form Again */}
          {state.formData.coDriverOrPillion && (
            <div className="mt-6 border border-gray-300 rounded-xl bg-gray-50 p-6">
              <p className="font-semibold mb-3">
                Co-Driver / Pillion — Military Person Details
              </p>

              <div className="grid grid-cols-2 gap-4">
                {offenderFormsConfig["Military Person"].fields.map(
                  (f: any, i: number) =>
                    f.type === "input" ? (
                      <FormInput
                        key={i}
                        label={`CoDriver_${f.label}`}
                        placeholder={f.placeholder}
                        onChange={(value: any) =>
                          saveField(`CoDriver_${f.label}`, value)
                        }
                      />
                    ) : (
                      <FormSelect
                        key={i}
                        label={`CoDriver_${f.label}`}
                        placeholder={f.placeholder}
                        options={f.options || []}
                        onChange={(value: any) =>
                          saveField(`CoDriver_${f.label}`, value)
                        }
                      />
                    )
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ---------- CIVILIAN LOGIC SAME ---------- */}
      {activeOffenderType?.toLowerCase() === "civilian" && (
        <div className="rounded-xl border border-gray-300 bg-gray-50 p-6 space-y-6 mt-6">
          {/* DEPENDENT CHECKBOX */}
          <label className="flex gap-2 items-start text-sm">
            <Checkbox
              checked={isDependent}
              onCheckedChange={(v) => setIsDependent(Boolean(v))}
            />
            <span>
              Is this person <b>Dependent / Relative</b> of Military Personnel
              or Other Registered?
            </span>
          </label>

          {/* IF YES */}
          {isDependent &&
            dependents.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-5 bg-white space-y-6"
              >
                {/* RELATION INPUT */}
                <div>
                  <p className="font-semibold text-sm mb-1">
                    Name the relation
                  </p>
                  <FormInput
                    label=""
                    placeholder="e.g. Brother-in-law"
                    onChange={(value: any) => {
                      const d = [...dependents];
                      d[index].relation = value;
                      setDependents(d);
                    }}
                  />
                </div>

                {/* WHO IS IT */}
                <div>
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
                      "Military Person",
                      "Servant/Maid",
                      "Shop Keeper",
                      "Temporary Hired Worker",
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
                </div>

                {item.whoIsIt && offenderFormsConfig[item.whoIsIt] && (
                  <div className="mt-4 border rounded-lg p-5 bg-gray-50">
                    <p className="font-semibold mb-2">Fill Details</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Select who the offender is and fill their details. The
                      form will update based on your selection.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        ...offenderFormsConfig[item.whoIsIt].fields,

                        ...(item.whoIsIt === "Military Person"
                          ? [
                              {
                                type: "input",
                                label: "Relative Name",
                                placeholder: "Enter Relative Name",
                              },
                              {
                                type: "input",
                                label: "Relative Address",
                                placeholder: "Enter Relative Address",
                              },
                            ]
                          : []),
                      ].map((f: any, i: number) =>
                        f.type === "input" ? (
                          <FormInput
                            key={i}
                            label={f.label}
                            placeholder={f.placeholder}
                            onChange={(value: any) => saveField(f.label, value)}
                          />
                        ) : (
                          <FormSelect
                            key={i}
                            label={f.label}
                            placeholder={f.placeholder}
                            options={f.options || []}
                            onChange={(value: any) => saveField(f.label, value)}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

          {/* ADD MORE BUTTON */}
          {isDependent && (
            <button
              onClick={() =>
                setDependents([...dependents, { relation: "", whoIsIt: "" }])
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
