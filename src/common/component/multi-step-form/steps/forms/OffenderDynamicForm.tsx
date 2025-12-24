"use client";

import { useState } from "react";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";

export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  showCoDriver = false,
  scope = "traffic",
}) {
  const { state, dispatch } = useForm();

  const activeOffenderType =
    scope === "traffic"
      ? state.formData.traffic.vehicleInvolved === "yes"
        ? state.formData.traffic?.vehicleDetails?.driverType
        : state.formData.traffic?.offenderWithoutVehicle?.offenderType
      : state.formData.staticSpeed?.vehicleDetails?.driverType;

  const [isDependent, setIsDependent] = useState(false);
  const [dependents, setDependents] = useState([{ relation: "", whoIsIt: "" }]);

  /* ---------------- DRIVER + CODRIVER GETTER ---------------- */
  const people =
    scope === "static"
      ? state.formData.staticSpeed.offenderPeople || []
      : state.formData.traffic.offenderPeople || [];

  const driver = people.find((p: any) => p.type === "Driver")?.details || {};

  /* ---------------- SAVE DRIVER + CODRIVER ---------------- */
  const saveField = (label: string, value: string) => {
    const isCoDriverField = label.startsWith("CoDriver_");
    const personType = isCoDriverField ? "CoDriver" : "Driver";

    const pureLabel = isCoDriverField ? label.replace("CoDriver_", "") : label;

    const updatePeopleArray = (existing = []) => {
      const idx = existing.findIndex((p: any) => p.type === personType);

      if (idx >= 0) {
        return existing.map((p: any) =>
          p.type === personType
            ? {
                ...p,
                details: {
                  ...p.details,
                  [pureLabel]: value,
                },
              }
            : p
        );
      }

      return [
        ...existing,
        {
          type: personType,
          details: {
            [pureLabel]: value,
          },
        },
      ];
    };

    if (scope === "static") {
      dispatch({
        type: "SET_STATIC_SPEED_DATA",
        payload: {
          offenderPeople: updatePeopleArray(
            state.formData.staticSpeed.offenderPeople
          ),
        },
      });
    } else {
      dispatch({
        type: "SET_OFFENDER_PEOPLE",
        payload: updatePeopleArray(state.formData.traffic.offenderPeople),
      });
    }
  };

  return (
    <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {/* ================= MAIN DRIVER FORM ================= */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f, i) =>
          f.type === "input" ? (
            <FormInput
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              value={driver[f.label] || ""}
              onChange={(value) => saveField(f.label, value)}
              inputClassName={cn(
                "transition-all",
                driver[f.label]
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            />
          ) : (
            <FormSelect
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              value={driver[f.label] || ""}
              options={f.options || []}
              onChange={(value) => saveField(f.label, value)}
              triggerClassName={cn(
                "transition-all",
                driver[f.label]
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            />
          )
        )}
      </div>

      {/* ================= CO DRIVER DYNAMIC ================= */}
      {showCoDriver && (
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
            <div className="mt-6 border border-gray-300 rounded-xl bg-gray-50 p-6 space-y-5">
              <p className="font-semibold">Select Co-Driver Type</p>

              <RadioGroup
                className="grid grid-cols-2 gap-3"
                value={state.formData.coDriverType || ""}
                onValueChange={(v) =>
                  dispatch({
                    type: "SET_FORM_DATA",
                    payload: { coDriverType: v },
                  })
                }
              >
                {[
                  "Military Person",
                  "Civilian",
                  "Employee",
                  "Servant/Maid",
                  "Shop Keeper",
                  "Temporary Hired Worker",
                ].map((x) => (
                  <label
                    key={x}
                    className={cn(
                      "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all bg-white",
                      state.formData.coDriverType === x
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    )}
                  >
                    <RadioGroupItem value={x} />
                    {x}
                  </label>
                ))}
              </RadioGroup>

              {state.formData.coDriverType &&
                offenderFormsConfig[state.formData.coDriverType] && (
                  <div className="grid grid-cols-2 gap-4">
                    {offenderFormsConfig[
                      state.formData.coDriverType
                    ].fields.map((f, i) =>
                      f.type === "input" ? (
                        <FormInput
                          key={i}
                          label={`CoDriver_${f.label}`}
                          placeholder={f.placeholder}
                          onChange={(v) => saveField(`CoDriver_${f.label}`, v)}
                        />
                      ) : (
                        <FormSelect
                          key={i}
                          label={`CoDriver_${f.label}`}
                          placeholder={f.placeholder}
                          options={f.options || []}
                          onChange={(v) => saveField(`CoDriver_${f.label}`, v)}
                        />
                      )
                    )}
                  </div>
                )}
            </div>
          )}
        </>
      )}

      {/* ================= CIVILIAN DEPENDENT ================= */}
      {activeOffenderType?.toLowerCase() === "civilian" && (
        <div className="rounded-xl border border-gray-300 bg-gray-50 p-6 space-y-6 mt-6">
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
                    placeholder="e.g. Brother-in-law"
                    value={item.relation}
                    onChange={(value) => {
                      const copy = [...dependents];
                      copy[index].relation = value;
                      setDependents(copy);
                    }}
                  />
                </div>

                {/* WHO IS IT SECTION */}
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
                      "Servant / Maid",
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

                  {/* SHOW FORM OF SELECTED DEPENDENT TYPE */}
                  {item.whoIsIt && offenderFormsConfig[item.whoIsIt] && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {offenderFormsConfig[item.whoIsIt].fields.map((f, i) =>
                        f.type === "input" ? (
                          <FormInput
                            key={i}
                            label={f.label}
                            placeholder={f.placeholder}
                            onChange={(value) => {
                              const copy = [...dependents];

                              // store inside dependents[index].details
                              copy[index].details = {
                                ...(copy[index].details || {}),
                                [f.label]: value,
                              };

                              setDependents(copy);
                            }}
                          />
                        ) : (
                          <FormSelect
                            key={i}
                            label={f.label}
                            placeholder={f.placeholder}
                            options={f.options || []}
                            onChange={(value) => {
                              const copy = [...dependents];

                              copy[index].details = {
                                ...(copy[index].details || {}),
                                [f.label]: value,
                              };

                              setDependents(copy);
                            }}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
