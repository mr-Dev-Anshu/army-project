



"use client";

import { useState } from "react";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";

interface FieldConfig {
  type: "input" | "select";
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface OffenderDynamicFormProps {
  title: string;
  helperText?: string;
  fields: FieldConfig[];
  showCoDriver?: boolean;
  scope?: "traffic" | "static";
}

export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  showCoDriver = false,
  scope = "traffic",
}: OffenderDynamicFormProps) {

  const { state, dispatch } = useForm();

  // ---------- SAFE ACTIVE TYPE ----------
  const activeOffenderType =
    scope === "traffic"
      ? state.formData.traffic.vehicleDetails?.driverType
      : state.formData.staticSpeed?.vehicleDetails?.driverType;

  const [isDependent, setIsDependent] = useState(false);
  const [dependents, setDependents] = useState([
    { relation: "", whoIsIt: "" },
  ]);

const saveField = (label: string, value: string) => {
  if (scope === "static") {
    dispatch({
      type: "SET_STATIC_SPEED_DATA",
      payload: {
        offenderDetails: {
          ...(state.formData.staticSpeed.offenderDetails || {}),
          [label]: value,
        },
      },
    });
  } else {
    dispatch({
      type: "SET_OFFENDER_DETAILS",
      payload: { [label]: value },
    });
  }
};



  return (
    <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {/* ================= MAIN FORM ================= */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f, i) =>
          f.type === "input" ? (
            <FormInput
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              onChange={(value) => saveField(f.label, value)}
            />
          ) : (
            <FormSelect
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              options={f.options || []}
              onChange={(value) => saveField(f.label, value)}
            />
          )
        )}
      </div>

      {/* ================= MILITARY ONLY ================= */}
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
              Was there a <b>Co-Driver / Pillion Rider</b>?
            </p>
          </div>

          {state.formData.coDriverOrPillion && (
            <div className="mt-6 border border-gray-300 rounded-xl bg-gray-50 p-6">
              <p className="font-semibold mb-3">
                Co-Driver / Pillion — Military Person Details
              </p>

              <div className="grid grid-cols-2 gap-4">
                {offenderFormsConfig["Military Person"].fields.map((f, i) =>
                  f.type === "input" ? (
                    <FormInput
                      key={i}
                      label={`CoDriver_${f.label}`}
                      placeholder={f.placeholder}
                      onChange={(value) =>
                        saveField(`CoDriver_${f.label}`, value)
                      }
                    />
                  ) : (
                    <FormSelect
                      key={i}
                      label={`CoDriver_${f.label}`}
                      placeholder={f.placeholder}
                      options={f.options || []}
                      onChange={(value) =>
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

      {/* ================= CIVILIAN DEPENDENT LOGIC ================= */}
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
                <div>
                  <p className="font-semibold text-sm mb-1">
                    Name the relation
                  </p>
                  <FormInput
                    label=""
                    placeholder="e.g. Brother-in-law"
                    onChange={(value) => {
                      const copy = [...dependents];
                      copy[index].relation = value;
                      setDependents(copy);
                    }}
                  />
                </div>

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
              </div>
            ))}

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
