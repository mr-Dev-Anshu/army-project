"use client";
import { useState } from "react";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";

interface OffenderDynamicFormProps {
  title: string;
  helperText?: string;
  fields: any[];
  showCoDriver?: boolean;
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
}

export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  showCoDriver = false,
  scope = "traffic",
}: OffenderDynamicFormProps) {
  const { state, dispatch } = useForm();

  /* ACTIVE TYPE */
  const activeOffenderType =
    scope === "traffic"
      ? state.formData.traffic.vehicleInvolved === "yes"
        ? state.formData.traffic?.vehicleDetails?.driverType
        : state.formData.traffic?.offenderWithoutVehicle?.offenderType
      : state.formData.staticSpeed?.vehicleDetails?.driverType;

  const [isDependent, setIsDependent] = useState(false);
  const [dependents, setDependents] = useState([{ relation: "", whoIsIt: "" }]);

  /* ============ PEOPLE SOURCE OLD ============ */
  const people =
    scope === "static"
      ? state.formData.staticSpeed.offenderPeople || []
      : state.formData.traffic.offenderPeople || [];

  /* ============ MP SOURCE ============ */
  const mpSection =
    scope === "mp-additional" ? "additionalIndividual" : "individualDetails";

  const mpTempDriver = state.formData.mpReport?.[mpSection]?.tempOffender || {};

  const normalDriver =
    people.find((p: any) => p.type === "Driver")?.details || {};

  const driver = scope.startsWith("mp") ? mpTempDriver : normalDriver;
  const coDriver =
    people.find((p: any) => p.type === "CoDriver")?.details || {};

  /* ========= UNIVERSAL MP SAVE ========= */
  const saveToMp = (label: string, value: string) => {
    const section =
      scope === "mp-additional" ? "additionalIndividual" : "individualDetails";

    const prev =
      state.formData.mpReport?.[section]?.tempOffender || {};

    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.${section}.tempOffender`,
      value: {
        ...prev,
        [label]: value,
      },
    });
  };

  /* ========= UNIVERSAL SAVE ========= */
  const saveField = (label: string, value: string) => {
    // ================= MP LOGIC =================
    if (scope.startsWith("mp")) {
      saveToMp(label, value);
      return;
    }

    // ================= TRAFFIC / STATIC =================
    const isCoDriverField = label.startsWith("CoDriver_");
    const personType = isCoDriverField ? "CoDriver" : "Driver";
    const pureLabel = isCoDriverField
      ? label.replace("CoDriver_", "")
      : label;

    const updatePeopleArray = (existing: any[] = []) => {
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
        type: "SET_PATH",
        path: "formData.staticSpeed.offenderPeople",
        value: updatePeopleArray(state.formData.staticSpeed.offenderPeople),
      });
    } else {
      dispatch({
        type: "SET_PATH",
        path: "formData.traffic.offenderPeople",
        value: updatePeopleArray(state.formData.traffic.offenderPeople),
      });
    }
  };

  return (
    <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* DRIVER FORM */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f: any, i: number) => {
          const isSuggestion = [
            "Unit", "FMN", "Command", "Select Rank", "Trade",
            "Place of QTR.", "Place of Work", "Place of Stay", "Address", "Department"
          ].includes(f.label);

          if (isSuggestion) {
            return (
              <SuggestionInput
                key={i}
                label={f.label}
                placeholder={f.placeholder}
                value={driver[f.key || f.label] || ""}
                onChange={(value) => saveField(f.key || f.label, value)}
                fieldType={
                  f.label === "Select Rank" ? "rank" :
                    f.label.toLowerCase()
                }
                defaultOptions={
                  f.label.includes("Rank")
                    ? ["Pvt", "L/Nk", "Nk", "Hav", "Subedar"]
                    : f.label === "Unit"
                      ? ["11 Engr Regt", "MP 12", "HQ Unit"]
                      : f.label === "FMN"
                        ? ["Central Command", "Western Command", "Northern Command"]
                        : f.label === "Command"
                          ? ["Command A", "Command B", "Command C"]
                          : []
                }
                className={cn(
                  "transition-all",
                  driver[f.key || f.label]
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                )}
              />
            );
          }

          return f.type === "input" ? (
            <FormInput
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              value={driver[f.key || f.label] || ""}
              onChange={(value) => saveField(f.key || f.label, value)}
            />
          ) : (
            <FormSelect
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              value={driver[f.key || f.label] || ""}
              options={f.options || []}
              onChange={(value) => saveField(f.key || f.label, value)}
            />
          );
        })}
      </div>


      {/* CO DRIVER */}
      {
        showCoDriver && (
          <>
            <div className="mt-6 flex items-start gap-2">
              <Checkbox
                checked={Boolean(state.formData.coDriverOrPillion)}
                onCheckedChange={(v) =>
                  dispatch({
                    type: "SET_PATH",
                    path: "formData.coDriverOrPillion",
                    value: Boolean(v),
                  })
                }
              />
              <p className="text-sm">
                Was there a <b>Co-Driver / Pillion Rider</b>?
              </p>
            </div>

            {state.formData.coDriverOrPillion && (
              <div className="mt-6 border rounded-xl bg-gray-50 p-6 space-y-5">
                <RadioGroup
                  className="grid grid-cols-2 gap-3"
                  value={state.formData.coDriverType || ""}
                  onValueChange={(v) =>
                    dispatch({
                      type: "SET_PATH",
                      path: "formData.coDriverType",
                      value: v,
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
                      className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer bg-white"
                    >
                      <RadioGroupItem value={x} />
                      {x}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* CO-DRIVER DYNAMIC FORM */}
            {state.formData.coDriverOrPillion &&
              state.formData.coDriverType &&
              offenderFormsConfig[state.formData.coDriverType] && (
                <div className="mt-4 border rounded-xl bg-gray-50 p-6 space-y-4">
                  <p className="font-semibold text-md">
                    Fill {state.formData.coDriverType} Details (Co-Driver)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {offenderFormsConfig[state.formData.coDriverType].fields.map(
                      (f: any, i: number) => {
                        const isSuggestion = [
                          "Unit",
                          "FMN",
                          "Command",
                          "Select Rank",
                          "Trade",
                          "Place of QTR.",
                          "Place of Work",
                          "Place of Stay",
                          "Address",
                          "Department",
                        ].includes(f.label);

                        if (isSuggestion) {
                          return (
                            <SuggestionInput
                              key={i}
                              label={f.label}
                              placeholder={f.placeholder}
                              value={coDriver[f.key || f.label] || ""}
                              onChange={(value) =>
                                saveField(`CoDriver_${f.key || f.label}`, value)
                              }
                              fieldType={
                                f.label === "Select Rank"
                                  ? "rank"
                                  : f.label.toLowerCase()
                              }
                              defaultOptions={
                                f.label.includes("Rank")
                                  ? ["Pvt", "L/Nk", "Nk", "Hav", "Subedar"]
                                  : f.label === "Unit"
                                    ? ["11 Engr Regt", "MP 12", "HQ Unit"]
                                    : f.label === "FMN"
                                      ? [
                                        "Central Command",
                                        "Western Command",
                                        "Northern Command",
                                      ]
                                      : f.label === "Command"
                                        ? ["Command A", "Command B", "Command C"]
                                        : []
                              }
                              className={cn(
                                "transition-all",
                                coDriver[f.key || f.label]
                                  ? "border-blue-500 bg-blue-50"
                                  : "bg-white border-gray-300"
                              )}
                            />
                          );
                        }

                        return f.type === "input" ? (
                          <FormInput
                            key={i}
                            label={f.label}
                            placeholder={f.placeholder}
                            value={coDriver[f.key || f.label] || ""}
                            onChange={(value) =>
                              saveField(`CoDriver_${f.key || f.label}`, value)
                            }
                            className="bg-white"
                          />
                        ) : (
                          <FormSelect
                            key={i}
                            label={f.label}
                            placeholder={f.placeholder}
                            value={coDriver[f.key || f.label] || ""}
                            options={f.options || []}
                            onChange={(value) =>
                              saveField(`CoDriver_${f.key || f.label}`, value)
                            }
                            className="bg-white"
                          />
                        );
                      }
                    )}
                  </div>
                </div>
              )}
          </>
        )
      }
    </div >
  );
}
