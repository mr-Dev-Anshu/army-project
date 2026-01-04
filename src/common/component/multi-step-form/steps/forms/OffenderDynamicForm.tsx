"use client";

import { useState, useEffect } from "react";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */
interface OffenderDynamicFormProps {
  title: string;
  helperText?: string;
  fields: any[];
  showCoDriver?: boolean;
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
  path?: string;
}

/* ================= HELPERS ================= */
const getByPath = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  return keys.reduce((o, k) => (o ? o[k] : undefined), obj);
};

/* ================= COMPONENT ================= */
export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  showCoDriver = false,
  scope = "traffic",
  path = "", // Default to empty string if undefined
}: OffenderDynamicFormProps) {
  const { state, dispatch } = useForm();

  // Get details from strict path
  const details = getByPath(state, path) || {};

  /* ========= SAVE FIELD ========= */
  const saveField = (label: string, value: string) => {
    // If no path is provided, we can't save. 
    // This handles the case where VehicleDetailsForm might pass bad props, avoiding crashes.
    if (!path) {
      console.warn("OffenderDynamicForm: No path provided for saving field:", label);
      return;
    }

    // Merge with existing details
    const newDetails = { ...details, [label]: value };

    dispatch({
      type: "SET_PATH",
      path: path,
      value: newDetails,
    });
  };

  /* ========= CO-DRIVER LOGIC ========= */
  const handleCoDriverTypeChange = (type: string) => {
    // 1. Update Global CoDriver Type State
    dispatch({
      type: "SET_PATH",
      path: "formData.coDriverType",
      value: type
    });

    // 2. Manage People Array
    const peoplePath = scope === "static"
      ? "formData.staticSpeed.offenderPeople"
      : "formData.traffic.offenderPeople";

    const people = getByPath(state, peoplePath) || [];

    // Check if CoDriver exists
    const coDriverIndex = people.findIndex((p: any) => p.role === "CoDriver");

    let newPeople = [...people];
    if (coDriverIndex >= 0) {
      // Update Type
      newPeople[coDriverIndex] = { ...newPeople[coDriverIndex], type };
    } else {
      // Add New
      newPeople.push({ role: "CoDriver", type, details: {} });
    }

    dispatch({
      type: "SET_PATH",
      path: peoplePath,
      value: newPeople
    });
  };

  return (
    <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* DRIVER FORM */}
      <div className="grid grid-cols-2 gap-4">
        {fields && fields.map((f: any, i: number) => {
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
                value={details[f.key || f.label] || ""}
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
                  details[f.key || f.label]
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
              value={details[f.key || f.label] || ""}
              onChange={(value) => saveField(f.key || f.label, value)}
            />
          ) : (
            <FormSelect
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              value={details[f.key || f.label] || ""}
              options={f.options || []}
              onChange={(value) => saveField(f.key || f.label, value)}
            />
          );
        })}
      </div>


      {/* CO DRIVER SELECTION (Only for Driver Form) */}
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
                  onValueChange={handleCoDriverTypeChange}
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

            {/* NO DUPLICATE FORM RENDERING HERE. VehicleDetailsForm handles it. */}
          </>
        )
      }
    </div >
  );
}
